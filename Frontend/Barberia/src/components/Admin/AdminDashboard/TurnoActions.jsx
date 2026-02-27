import { useState } from "react";
import API_URL from "../../../services/api";
import "./TurnoActions.css";

const TurnoActions = ({ turno, onCancelSuccess }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const cancelarTurno = async () => {
    try {
      setLoading(true);
      await fetch(`${API_URL}/visitas/${turno.id_visita}/cancelar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setShowModal(false);

      if (onCancelSuccess) {
        onCancelSuccess();
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error("Error cancelando turno:", err);
      alert("No se pudo cancelar el turno");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* BOTÓN: Posicionado absolutamente para no mover el texto */}
      <button
        className="turno-btn-cancel-unique"
        title="Cancelar turno"
        onClick={() => setShowModal(true)}
      >
        ✕
      </button>

      {/* MODAL: Estilo Oscuro y Dorado solicitado */}
      {showModal && (
        <div className="cancel-modal-overlay-unique">
          <div className="cancel-modal-card-unique">
            <h2>Cancelar turno</h2>

            <p>
              ¿Estás seguro de cancelar el turno de{" "}
              <strong>{turno.cliente_nombre}</strong>?
            </p>

            <p className="cancel-modal-sub-unique">
              {new Date(turno.fecha_hora).toLocaleDateString("es-UY")} ·{" "}
              {new Date(turno.fecha_hora).toLocaleTimeString("es-UY", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>

            <div className="cancel-modal-actions-unique">
              <button
                className="cancel-modal-btn-cancel-unique"
                disabled={loading}
                onClick={() => setShowModal(false)}
              >
                No, volver
              </button>

              <button
                className="cancel-modal-btn-confirm-unique"
                disabled={loading}
                onClick={cancelarTurno}
              >
                {loading ? "Cancelando..." : "Sí, cancelar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TurnoActions;