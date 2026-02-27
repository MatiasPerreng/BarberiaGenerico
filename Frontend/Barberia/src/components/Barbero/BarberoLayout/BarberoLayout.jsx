import "./BarberoLayout.css";
import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthContext } from "../../../auth/AuthContext";
import Footer from "../../Footer/Footer";

const MOBILE_BREAKPOINT = 768;

const BarberoLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthContext();
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
      <header className="barbero-mobile-header">
        <button
          className="barbero-hamburger"
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
          className="barbero-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =========================
         LAYOUT
      ========================= */}
      <div className="barbero-layout">
        {/* SIDEBAR */}
        <aside className={`barbero-sidebar ${sidebarOpen ? "open" : ""}`}>
          {/* LOGO */}
          <div className="barbero-logo">
            <img src="/logo.jpg" alt="King Barber" />
          </div>

          {/* NAV */}
          <nav className="barbero-nav">
            <NavLink
              to="/barbero"
              end
              onClick={handleNavClick}
            >
              Mi agenda
            </NavLink>

            <NavLink
              to="/barbero/historial"
              onClick={handleNavClick}
            >
              Historial
            </NavLink>

            <NavLink
              to="/barbero/perfil"
              onClick={handleNavClick}
            >
              Mi perfil
            </NavLink>
          </nav>

          {/* USER */}
          <div className="barbero-user">
            <div className="barbero-user-info">
              <span className="barbero-user-name">
                {user?.nombre} {user?.apellido}
              </span>
              <span className="barbero-user-role">
                {user?.rol || "Barbero"}
              </span>
            </div>

            <button
              className="barbero-logout"
              onClick={logout}
            >
              Cerrar sesión
            </button>
          </div>
        </aside>

        {/* =========================
           CONTENT + FOOTER
        ========================= */}
        <main className="barbero-content">
          <div className="barbero-content-inner">
            {children}
          </div>

          <Footer />
        </main>
      </div>
    </>
  );
};

export default BarberoLayout;
