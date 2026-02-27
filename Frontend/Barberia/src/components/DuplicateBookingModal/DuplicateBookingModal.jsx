export default function DuplicateBookingModal({ show, onClose, message }) {
  if (!show) return null;


  const esBloqueo = message?.toLowerCase().includes("número");

  return (
    <div className="success-modal-overlay">
      <div className="success-modal-card">
        <h2 className="success-modal-title">
          {esBloqueo ? "Acceso Restringido" : "No se puede agendar"}
        </h2>

        <p className="success-modal-text">
          {message ? message : "Ya tenés un turno registrado para este día."}

          {!esBloqueo && (
            <>
              <br />
              <br />
              Si necesitás cambiar tus turnos, primero solicitá la cancelación de uno de ellos.
            </>
          )}
        </p>

        <div className="success-modal-actions">
          <button
            className="success-modal-btn-confirm"
            onClick={onClose}
           
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}