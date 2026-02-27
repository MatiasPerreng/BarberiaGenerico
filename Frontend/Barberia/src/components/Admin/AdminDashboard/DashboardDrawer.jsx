import TurnosList from "./TurnosList/TurnosList";
import BarberoAgendaView from "./BarberoAgendaView";

const DashboardDrawer = ({ open, type, onClose }) => {
  if (!open) return null;

  return (
    <div className="dashboard-drawer">
      <div className="drawer-panel">
        {/* =========================
           HEADER
        ========================= */}
        <div className="drawer-header">
          <h2>{type}</h2>
          <button onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>

        {/* =========================
           CONTENT
        ========================= */}
        <div className="drawer-content">
          {type === "pendientes" && (
            <TurnosList filtro="pendientes" />
          )}

          {type === "hoy" && (
            <TurnosList filtro="hoy" />
          )}

          {type === "barberos" && (
            <BarberoAgendaView />
          )}

          {type === "cancelados" && (
            <TurnosList filtro="cancelados" />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardDrawer;
