import { useState } from "react";

const BarberoTurnoModal = ({
  turno,
  onClose,
  onAtender,
  onCancelar,
}) => {
  const [modoCancelar, setModoCancelar] = useState(false);
  const [motivo, setMotivo] = useState("");

  return (
    <div className="modal-overlay">
      <div className="modal">

        {!modoCancelar ? (
          <>
            <h2>{turno.cliente}</h2>

            <p><strong>Hora:</strong> {turno.hora}</p>
            <p><strong>Servicio:</strong> {turno.servicio}</p>
            <p><strong>Estado:</strong> {turno.estado}</p>

            <div className="acciones">
              {turno.estado === "CONFIRMADO" && (
                <>
                  <button onClick={() => onAtender(turno.id)}>
                    Marcar atendido
                  </button>

                  <button
                    className="danger"
                    onClick={() => setModoCancelar(true)}
                  >
                    Cancelar turno
                  </button>
                </>
              )}

              <button onClick={onClose}>Cerrar</button>
            </div>
          </>
        ) : (
          <>
            <h3>Cancelar turno</h3>

            <textarea
              placeholder="Motivo (opcional)"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
            />

            <div className="acciones">
              <button
                className="danger"
                onClick={() => onCancelar(turno.id, motivo)}
              >
                Confirmar cancelación
              </button>

              <button onClick={() => setModoCancelar(false)}>
                Volver
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default BarberoTurnoModal;
