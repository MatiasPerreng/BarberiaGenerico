import { useEffect, useState } from "react";
import { getAdminDashboard } from "../../../services/dashboard";

import DashboardCards from "../../../components/Admin/AdminDashboard/DashboardCards";
import DashboardDrawer from "../../../components/Admin/AdminDashboard/DashboardDrawer";

import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState(null);

  useEffect(() => {
    getAdminDashboard()
      .then(setStats)
      .catch(() => setError("No se pudo cargar el dashboard"))
      .finally(() => setLoading(false));
  }, []);

  const openDrawer = (type) => {
    setDrawerType(type);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setDrawerType(null);
  };

  return (
    <>
      <h1>Dashboard</h1>

      {loading && <p>Cargando métricas…</p>}
      {error && <p className="error">{error}</p>}

      {stats && (
        <DashboardCards stats={stats} onOpen={openDrawer} />
      )}

      <DashboardDrawer
        open={drawerOpen}
        type={drawerType}
        onClose={closeDrawer}
      />
    </>
  );
};

export default AdminDashboard;
