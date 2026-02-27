const hoy = new Date().toISOString().split("T")[0];

const BarberoDaySummary = ({ turnos, fecha, onChangeFecha }) => {
  const turnosValidos = turnos.filter(
    (t) => t.estado !== "cancelado"
  );

  const total = turnosValidos.reduce(
    (acc, t) => acc + (t.precio || 0),
    0
  );

  // 🔥 si viene vacío, mostramos hoy (pero el padre decide si filtra o no)
  const fechaInput = fecha || hoy;

  return (
    <div className="barbero-summary">
      {/* =========================
         INFO
      ========================= */}
      <div className="barbero-summary-info">
        <div className="summary-item">
          <span className="summary-label">Turnos</span>
          <span className="summary-value">
            {turnosValidos.length}
          </span>
        </div>

        <div className="summary-item">
          <span className="summary-label">
            Total estimado
          </span>
          <span className="summary-value highlight">
            ${total}
          </span>
        </div>
      </div>

      {/* =========================
         FECHA + TODOS (FIX iOS)
      ========================= */}
      <div className="summary-date-wrapper">
        <label>Fecha</label>

        <div className="summary-date-actions">
          <input
            type="date"
            className="barbero-summary-date"
            value={fechaInput}
            onChange={(e) => onChangeFecha(e.target.value)}
          />

          {fecha && (
            <button
              type="button"
              className="summary-btn-todos"
              onClick={() => onChangeFecha(null)} // 👈 NO ""
            >
              Todos
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BarberoDaySummary;
