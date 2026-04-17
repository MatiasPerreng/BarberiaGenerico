import { Navigate } from "react-router-dom";
import { useAuthContext } from "../auth/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "200px",
        color: "#555",
      }}>
        Verificando sesión…
      </div>
    );
  }

  if (!user) {
    const token = localStorage.getItem("token");
    if (token) {
      return (
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "200px",
          color: "#555",
        }}>
          Verificando sesión…
        </div>
      );
    }
    return <Navigate to="/login-barbero" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/login-barbero" replace />;
  }


  return children;
}
