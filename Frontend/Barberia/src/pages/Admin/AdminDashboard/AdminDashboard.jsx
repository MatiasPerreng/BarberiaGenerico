import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { getAdminDashboard } from "../../../services/dashboard";

import DashboardCards from "../../../components/Admin/AdminDashboard/DashboardCards";
import DashboardDrawer from "../../../components/Admin/AdminDashboard/DashboardDrawer";

import "./AdminDashboard.css";

const DASHBOARD_POLL_MS = 45_000;

const AdminDashboard = () => {
  const location = useLocation();
  const mountedRef = useRef(true);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const refreshStats = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    try {
      const data = await getAdminDashboard();
      if (!mountedRef.current) return;
      setStats(data);
      setError(null);
    } catch {
      if (mountedRef.current) {
        setError("No se pudo cargar el dashboard");
      }
    } finally {
      if (mountedRef.current && !quiet) setLoading(false);
    }
  }, []);

  /* Cada vez que entrás al dashboard (incluye volver desde Historial u otras rutas admin) */
  useEffect(() => {
    if (location.pathname !== "/admin") return;
    refreshStats(false);
  }, [location.pathname, refreshStats]);

  /* Mientras estás en esta pantalla, refresco periódico silencioso */
  useEffect(() => {
    if (location.pathname !== "/admin") return;
    const id = setInterval(() => {
      refreshStats(true);
    }, DASHBOARD_POLL_MS);
    return () => clearInterval(id);
  }, [location.pathname, refreshStats]);

  /* Al volver a la pestaña */
  useEffect(() => {
    if (location.pathname !== "/admin") return;
    const onVis = () => {
      if (document.visibilityState === "visible") {
        refreshStats(true);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [location.pathname, refreshStats]);

  const openDrawer = (type) => {
    setDrawerType(type);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setDrawerType(null);
    refreshStats(true);
  };

  return (
    <>
      <header className="admin-dashboard-hero">
        <h1>Dashboard</h1>
        <p className="admin-dashboard-subtitle">
          Métricas en vivo y accesos rápidos a tu operación diaria.
        </p>
      </header>

      {loading && <p className="admin-dashboard-loading">Cargando métricas…</p>}
      {error && <p className="error">{error}</p>}

      {stats && (
        <DashboardCards stats={stats} onOpen={openDrawer} />
      )}

      <DashboardDrawer
        open={drawerOpen}
        type={drawerType}
        onClose={closeDrawer}
        onStatsNeedRefresh={() => refreshStats(true)}
      />
    </>
  );
};

export default AdminDashboard;
