import { Routes, Route } from "react-router-dom";


/* =====================
       TELEVISION
===================== */

import TvTurnoPage from "../pages/tv/TvTurnoPage";

/* =====================
    PUBLIC
===================== */
import HomePage from "../pages/Public/Homepage/Homepage";
import AgendaPage from "../pages/Public/AgendaPage";
import LoginBarbero from "../pages/Public/Homepage/LoginBarbero/LoginBarbero";

/* =====================
    SHARED (ADMIN + BARBERO)
===================== */
import BarberoPerfil from "../pages/Shared/Perfil/PerfilPage";
import HistorialAgenda from "../pages/Shared/Historial/HistorialAgenda";

/* =====================
    BARBERO
===================== */
import BarberAgenda from "../pages/Barber/BarberAgenda";
import BarberoDashboard from "../pages/Barbero/BarberoDashboard";
import BarberoLayout from "../components/Barbero/BarberoLayout/BarberoLayout";

/* =====================
    ADMIN
===================== */
import AdminDashboard from "../pages/Admin/AdminDashboard/AdminDashboard";
import BarberosPage from "../pages/Admin/BarberoPage/BarberosPage";
import HorariosPage from "../pages/Admin/HorarioPage/HorariosPage";
import ServicioPage from "../pages/Admin/ServicioPage/ServicioPage";
import BlacklistPage from "../pages/Admin/BlacklistPage/BlacklistPage"; // IMPORTACIÓN NUEVA
import AdminLayout from "../components/Admin/AdminLayout/AdminLayout";

/* =====================
    AUTH
===================== */
import ProtectedRoute from "../router/ProtectedRoute";

export default function AppRouter() {
  return (
    <Routes>
      {/* =====================
          PUBLIC
      ===================== */}
      <Route path="/" element={<HomePage />} />
      <Route path="/agenda" element={<AgendaPage />} />
      <Route path="/login-barbero" element={<LoginBarbero />} />

      {/* =====================
          BARBERO
      ===================== */}
      <Route
        path="/barbero"
        element={
          <ProtectedRoute role="barbero">
            <BarberoLayout>
              <BarberoDashboard />
            </BarberoLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/barbero/agenda"
        element={
          <ProtectedRoute role="barbero">
            <BarberoLayout>
              <BarberAgenda />
            </BarberoLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/barbero/perfil"
        element={
          <ProtectedRoute role="barbero">
            <BarberoLayout>
              <BarberoPerfil />
            </BarberoLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/barbero/historial"
        element={
          <ProtectedRoute role="barbero">
            <BarberoLayout>
              <HistorialAgenda />
            </BarberoLayout>
          </ProtectedRoute>
        }
      />

      {/* =====================
          ADMIN
      ===================== */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/mi-agenda"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout>
              <BarberoDashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/perfil"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout>
              <BarberoPerfil />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Nota: Corregido el path duplicado de barbero que estaba aquí, se mantiene coherencia con el layout de admin */}
      <Route
        path="/admin/historial"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout>
              <HistorialAgenda />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/barberos"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout>
              <BarberosPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/horarios"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout>
              <HorariosPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/servicios"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout>
              <ServicioPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* NUEVA RUTA LISTA NEGRA */}
      <Route
        path="/admin/blacklist"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout>
              <BlacklistPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route path="/tv" element={<TvTurnoPage />} />
    </Routes>
  );
}