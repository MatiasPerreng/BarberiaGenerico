import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import API_URL from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // =========================
  // INIT – recuperar sesión
  // =========================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    const loadUser = async () => {
      try {
        // Validamos token (exp, firma, etc.)
        const payload = jwtDecode(token);

        // Traemos datos reales del usuario
        const res = await fetch(`${API_URL}/perfil/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("No autorizado");

        const perfil = await res.json();

        setUser({
          token,
          id: perfil.id_barbero,
          nombre: perfil.nombre,
          email: perfil.email,
          role: payload.role,
        });
      } catch (err) {
        console.error("❌ Sesión inválida", err);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // =========================
  // LOGIN
  // =========================
  const login = async ({ token }) => {
    localStorage.setItem("token", token);

    try {
      const payload = jwtDecode(token);

      const res = await fetch(`${API_URL}/perfil/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const perfil = await res.json();

      setUser({
        token,
        id: perfil.id_barbero,
        nombre: perfil.nombre,
        email: perfil.email,
        role: payload.role,
      });
    } catch (err) {
      console.error("❌ Error al cargar perfil", err);
      logout();
    }
  };

  // =========================
  // UPDATE USER (se mantiene)
  // =========================
  const updateUser = (data) => {
    setUser((prev) =>
      prev
        ? {
            ...prev,
            ...data,
          }
        : prev
    );
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login-barbero");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUser,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
