import { useState } from "react";
import "./HorarioList.css";

const DIAS = [
  { id: 1, label: "Lunes" },
  { id: 2, label: "Martes" },
  { id: 3, label: "Miércoles" },
  { id: 4, label: "Jueves" },
  { id: 5, label: "Viernes" },
  { id: 6, label: "Sábado" },
];

const getDiaLabel = (id) =>
  DIAS.find((d) => d.id === id)?.label || "";

const HorarioList = ({ horarios, onDelete, onCopy }) => {
  const [copiandoId, setCopiandoId] = useState(null);
  const [diaDestino, setDiaDestino] = useState("");

  return (
    <div className="horarios-list">
      {horarios.map((h) => (
        <div key={h.id_horario} className="horario-card">
          <div className="horario-info">
            <div className="horario-dia">
              {getDiaLabel(h.dia_semana)}
            </div>

            <div className="horario-horas">
              {h.hora_desde} → {h.hora_hasta}
            </div>

            <div className="horario-vigencia">
              {h.fecha_desde} → {h.fecha_hasta}
            </div>

            {copiandoId === h.id_horario && (
              <div className="copy-panel">
                <select
                  value={diaDestino}
                  onChange={(e) =>
                    setDiaDestino(Number(e.target.value))
                  }
                >
                  <option value="">Elegir día</option>
                  {DIAS.filter((d) => d.id !== h.dia_semana).map(
                    (d) => (
                      <option key={d.id} value={d.id}>
                        {d.label}
                      </option>
                    )
                  )}
                </select>

                <button
                  className="btn-copy"
                  disabled={!diaDestino}
                  onClick={() => {
                    onCopy(h, diaDestino);
                    setCopiandoId(null);
                    setDiaDestino("");
                  }}
                >
                  Confirmar
                </button>
              </div>
            )}
          </div>

          <div className="horario-actions">
            <button
              className="btn-copy"
              onClick={() =>
                setCopiandoId(
                  copiandoId === h.id_horario
                    ? null
                    : h.id_horario
                )
              }
            >
              Copiar
            </button>

            <button
              className="btn-delete"
              onClick={() => onDelete(h.id_horario)}
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HorarioList;
