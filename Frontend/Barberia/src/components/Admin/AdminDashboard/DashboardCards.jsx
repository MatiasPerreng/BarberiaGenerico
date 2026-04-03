const IconBarberos = () => (
  <svg
    className="admin-card-icon-svg"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-3.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V20h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
      fill="currentColor"
    />
  </svg>
);

const IconHoy = () => (
  <svg
    className="admin-card-icon-svg"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"
      fill="currentColor"
    />
  </svg>
);

const IconPendientes = () => (
  <svg
    className="admin-card-icon-svg"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"
      fill="currentColor"
    />
  </svg>
);

const IconCancelados = () => (
  <svg
    className="admin-card-icon-svg"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"
      fill="currentColor"
    />
  </svg>
);

const CARDS = [
  {
    key: "barberos",
    title: "Barberos activos",
    hint: "Equipo disponible en sala",
    open: "barberos",
    variant: "barberos",
    Icon: IconBarberos,
  },
  {
    key: "hoy",
    title: "Turnos hoy",
    hint: "Reservas confirmadas para hoy",
    open: "hoy",
    variant: "hoy",
    Icon: IconHoy,
  },
  {
    key: "pendientes",
    title: "Pendientes",
    hint: "Requieren confirmación o acción",
    open: "pendientes",
    variant: "pendientes",
    Icon: IconPendientes,
  },
  {
    key: "cancelados",
    title: "Cancelados",
    hint: "Turnos cancelados recientes",
    open: "cancelados",
    variant: "cancelados",
    Icon: IconCancelados,
  },
];

const DashboardCards = ({ stats, onOpen }) => {
  const valueFor = (key) => {
    switch (key) {
      case "barberos":
        return stats.barberos_activos;
      case "hoy":
        return stats.turnos_hoy;
      case "pendientes":
        return stats.turnos_pendientes;
      case "cancelados":
        return stats.turnos_cancelados;
      default:
        return "—";
    }
  };

  return (
    <div className="admin-cards">
      {CARDS.map(({ key, title, hint, open, variant, Icon }) => (
        <button
          key={key}
          type="button"
          className={`admin-card admin-card--${variant}`}
          onClick={() => onOpen(open)}
        >
          <span className="admin-card-shine" aria-hidden />
          <div className="admin-card-top">
            <span className="admin-card-icon-wrap">
              <Icon />
            </span>
            <span className="admin-card-arrow" aria-hidden>
              →
            </span>
          </div>
          <h3>{title}</h3>
          <p className="admin-card-value">{valueFor(key)}</p>
          <p className="admin-card-hint">{hint}</p>
        </button>
      ))}
    </div>
  );
};

export default DashboardCards;
