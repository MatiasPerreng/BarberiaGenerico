import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { apiFetch } from "../../../services/apiClient";
import "./TurnoActions.css";

const parseFechaHora = (fechaHora) => {
  if (!fechaHora) return new Date(NaN);
  const s = String(fechaHora).trim();
  const isoLike = s.includes("T") ? s : s.replace(" ", "T");
  return new Date(isoLike);
};

const TurnoActions = ({ turno, onCancelSuccess }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const cerrarModal = useCallback(() => {
    if (!loading) setShowModal(false);
  }, [loading]);

  useEffect(() => {
    if (!showModal) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        cerrarModal();
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [showModal, cerrarModal]);

  const cancelarTurno = async () => {
    try {
      setLoading(true);
      await apiFetch(`/visitas/${turno.id_visita}/cancelar`, {
        method: "POST",
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

  const dt = parseFechaHora(turno.fecha_hora);

  const modal =
    showModal &&
    createPortal(
      <div
        className="cancel-modal-overlay-unique"
        role="presentation"
        onClick={cerrarModal}
      >
        <div
          className="cancel-modal-card-unique"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-modal-title"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 id="cancel-modal-title">Cancelar turno</h2>

          <p>
            ¿Estás seguro de cancelar el turno de{" "}
            <strong>{turno.cliente_nombre}</strong>?
          </p>

          <p className="cancel-modal-sub-unique">
            {Number.isNaN(dt.getTime())
              ? "—"
              : `${dt.toLocaleDateString("es-UY")} · ${dt.toLocaleTimeString("es-UY", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}`}
          </p>

          <div className="cancel-modal-actions-unique">
            <button
              type="button"
              className="cancel-modal-btn-cancel-unique"
              disabled={loading}
              onClick={cerrarModal}
            >
              No, volver
            </button>

            <button
              type="button"
              className="cancel-modal-btn-confirm-unique"
              disabled={loading}
              onClick={cancelarTurno}
            >
              {loading ? "Cancelando..." : "Sí, cancelar"}
            </button>
          </div>
        </div>
      </div>,
      document.body
    );

  return (
    <>
      <button
        type="button"
        className="turno-btn-cancel-unique"
        title="Cancelar turno"
        onClick={(e) => {
          e.stopPropagation();
          setShowModal(true);
        }}
      >
        ✕
      </button>

      {modal}
    </>
  );
};

export default TurnoActions;
