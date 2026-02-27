import './DashboardsCards.css'

const DashboardCards = ({ stats, onOpen }) => {
  return (
    <div className="admin-cards">
      <div className="admin-card" onClick={() => onOpen("barberos")}>
        <h3>Barberos activos</h3>
        <p>{stats.barberos_activos}</p>
      </div>

      <div className="admin-card" onClick={() => onOpen("hoy")}>
        <h3>Turnos hoy</h3>
        <p>{stats.turnos_hoy}</p>
      </div>

      <div className="admin-card" onClick={() => onOpen("pendientes")}>
        <h3>Pendientes</h3>
        <p>{stats.turnos_pendientes}</p>
      </div>

      <div className="admin-card" onClick={() => onOpen("cancelados")}>
        <h3>Cancelados</h3>
        <p>{stats.turnos_cancelados}</p>
      </div>
    </div>
  );
};

export default DashboardCards;
