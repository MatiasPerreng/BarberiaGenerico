import "../../pages/Barbero/BarberoDashboard.css";

const formatMoney = (n) => {
  const num = Number(n) || 0;
  try {
    return new Intl.NumberFormat("es-UY", {
      style: "currency",
      currency: "UYU",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  } catch {
    return `$ ${num.toFixed(0)}`;
  }
};

const precioTurno = (t) =>
  Number(t.servicio_precio ?? t.precio_al_reservar ?? t.precio ?? 0) || 0;

const BarberoDaySummary = ({ turnos, fecha, onChangeFecha }) => {
  const turnosValidos = turnos.filter(
    (t) => String(t.estado || "").toUpperCase() !== "CANCELADO"
  );

  const total = turnosValidos.reduce((acc, t) => acc + precioTurno(t), 0);

  /* Sin fecha: vacío para no mostrar un día falso mientras la API trae "todos" los turnos */
  const fechaInput = fecha ?? "";

  return (
    <section className="mi-agenda-resumen" aria-label="Resumen del día">
      <div className="mi-agenda-resumen-decor" aria-hidden>
        <div className="mi-agenda-resumen-shine" />
      </div>

      <div className="mi-agenda-resumen-metrics">
        <div className="mi-agenda-resumen-metric">
          <span className="mi-agenda-resumen-kicker">Turnos</span>
          <span className="mi-agenda-resumen-number">{turnosValidos.length}</span>
          <span className="mi-agenda-resumen-hint">Confirmados del día</span>
        </div>

        <div className="mi-agenda-resumen-metric mi-agenda-resumen-metric--total">
          <span className="mi-agenda-resumen-kicker">Total estimado</span>
          <span className="mi-agenda-resumen-number mi-agenda-resumen-number--gold">
            {formatMoney(total)}
          </span>
          <span className="mi-agenda-resumen-hint">Según servicios del día</span>
        </div>
      </div>

      <div className="mi-agenda-resumen-date">
        <div className="mi-agenda-resumen-date-panel">
          <div className="mi-agenda-resumen-date-head">
            <span className="mi-agenda-resumen-kicker">Fecha</span>
            {fecha && (
              <button
                type="button"
                className="mi-agenda-resumen-btn-todos"
                onClick={() => onChangeFecha(null)}
              >
                Todos
              </button>
            )}
          </div>
          <input
            type="date"
            className="mi-agenda-resumen-date-input"
            value={fechaInput}
            onChange={(e) => onChangeFecha(e.target.value)}
          />
        </div>
      </div>
    </section>
  );
};

export default BarberoDaySummary;
