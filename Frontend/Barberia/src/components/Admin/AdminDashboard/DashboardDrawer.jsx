import TurnosList from "./TurnosList/TurnosList";
import BarberoAgendaView from "./BarberoAgendaView";
import "./DashboardDrawer.css";

const DRAWER_COPY = {
  barberos: {
    title: "Barberos activos",
    subtitle: "Equipo disponible en sala",
    panelClass: "drawer-panel--barberos",
  },
  hoy: {
    title: "Turnos de hoy",
    subtitle: "Reservas confirmadas para la jornada",
    panelClass: "drawer-panel--hoy",
  },
  pendientes: {
    title: "Turnos pendientes",
    subtitle: "Requieren confirmación o acción",
    panelClass: "drawer-panel--pendientes",
  },
  cancelados: {
    title: "Turnos cancelados",
    subtitle: "Historial reciente de cancelaciones",
    panelClass: "drawer-panel--cancelados",
  },
};

const DashboardDrawer = ({ open, type, onClose, onStatsNeedRefresh }) => {
  if (!open || !type) return null;

  const meta = DRAWER_COPY[type] || {
    title: type,
    subtitle: "",
    panelClass: "",
  };

  return (
    <div
      className="dashboard-drawer"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dashboard-drawer-title"
      onClick={onClose}
    >
      <div
        className={`drawer-panel ${meta.panelClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-header">
          <div className="drawer-header-text">
            <h2 id="dashboard-drawer-title">{meta.title}</h2>
            {meta.subtitle && (
              <p className="drawer-header-sub">{meta.subtitle}</p>
            )}
          </div>
          <button
            type="button"
            className="drawer-header-close"
            onClick={onClose}
            aria-label="Cerrar panel"
          >
            ✕
          </button>
        </div>

        <div className="drawer-content">
          {type === "pendientes" && (
            <TurnosList
              filtro="pendientes"
              onStatsNeedRefresh={onStatsNeedRefresh}
            />
          )}
          {type === "hoy" && (
            <TurnosList filtro="hoy" onStatsNeedRefresh={onStatsNeedRefresh} />
          )}
          {type === "barberos" && <BarberoAgendaView />}
          {type === "cancelados" && (
            <TurnosList
              filtro="cancelados"
              onStatsNeedRefresh={onStatsNeedRefresh}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardDrawer;
