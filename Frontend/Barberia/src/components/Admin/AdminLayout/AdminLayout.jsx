import "./AdminLayout.css";
import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthContext } from "../../../auth/AuthContext";
import Footer from "../../Footer/Footer";

const MOBILE_BREAKPOINT = 768;

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, user } = useAuthContext();
  const location = useLocation();

  /* =========================
      CERRAR SIDEBAR AL CAMBIAR RUTA (MOBILE)
  ========================= */
  useEffect(() => {
    if (window.innerWidth <= MOBILE_BREAKPOINT) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  /* =========================
      HANDLER MENU ITEM
  ========================= */
  const handleNavClick = () => {
    if (window.innerWidth <= MOBILE_BREAKPOINT) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* =========================
          HEADER MOBILE
      ========================= */}
      <header className="admin-mobile-header">
        <button
          className="admin-hamburger"
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menú"
        >
          ☰
        </button>

        <img src="/logo.jpg" alt="King Barber" />
      </header>

      {/* =========================
          OVERLAY (MOBILE)
      ========================= */}
      {sidebarOpen && (
        <div
          className="admin-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =========================
          LAYOUT
      ========================= */}
      <div className="admin-layout">
        {/* SIDEBAR */}
        <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
          {/* LOGO */}
          <div className="admin-logo">
            <img src="/logo.jpg" alt="King Barber" />
          </div>

          {/* NAV */}
          <nav className="admin-nav">
            {/* Resumen + día a día */}
            <NavLink to="/admin" end onClick={handleNavClick}>
              Dashboard
            </NavLink>
            <NavLink to="/admin/mi-agenda" onClick={handleNavClick}>
              Mi agenda
            </NavLink>
            <NavLink to="/admin/historial" onClick={handleNavClick}>
              Historial
            </NavLink>

            {/* Equipo, turnos y catálogo */}
            <NavLink to="/admin/barberos" onClick={handleNavClick}>
              Barberos
            </NavLink>
            <NavLink to="/admin/horarios" onClick={handleNavClick}>
              Horarios
            </NavLink>
            <NavLink to="/admin/servicios" onClick={handleNavClick}>
              Servicios
            </NavLink>

            {/* Negocio y web pública */}
            <NavLink to="/admin/estadisticas" onClick={handleNavClick}>
              Estadísticas
            </NavLink>
            <NavLink to="/admin/carrusel" onClick={handleNavClick}>
              Carrusel
            </NavLink>

            {/* Política */}
            <NavLink to="/admin/blacklist" onClick={handleNavClick}>
              Lista Negra
            </NavLink>

            {/* Cuenta */}
            <NavLink to="/admin/perfil" onClick={handleNavClick}>
              Mi perfil
            </NavLink>
          </nav>

          {/* USER */}
          <div className="admin-user">
            <div className="admin-user-info">
              <span className="admin-user-name">
                {user?.nombre || "Usuario"}
              </span>
              <span className="admin-user-role">
                {user?.role || "—"}
              </span>
            </div>

            <button
              className="admin-logout"
              onClick={logout}
            >
              Cerrar sesión
            </button>
          </div>
        </aside>

        {/* =========================
            CONTENT + FOOTER
        ========================= */}
        <main className="admin-content">
          <div className="admin-content-inner">
            {children}
          </div>

          <Footer />
        </main>
      </div>
    </>
  );
};

export default AdminLayout;