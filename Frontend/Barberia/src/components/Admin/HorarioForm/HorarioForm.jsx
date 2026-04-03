import { useState } from "react";
import "./HorarioForm.css";

const DIAS_SEMANA = [
  { id: 1, label: "Lunes" },
  { id: 2, label: "Martes" },
  { id: 3, label: "Miércoles" },
  { id: 4, label: "Jueves" },
  { id: 5, label: "Viernes" },
  { id: 6, label: "Sábado" },
];

const HorarioForm = ({
  idBarbero,
  horariosExistentes = [],
  onSubmit,
  onBulkSubmit,
  onClose,
}) => {
  const [modoMasivo, setModoMasivo] = useState(false);
  const [diasSeleccionados, setDiasSeleccionados] = useState([]);
  const [form, setForm] = useState({
    dia_semana: "",
    hora_desde: "",
    hora_hasta: "",
    fecha_desde: "",
    fecha_hasta: "",
  });

  const [copiarDesde, setCopiarDesde] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleDia = (id) => {
    setDiasSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id].sort((a, b) => a - b)
    );
  };

  const seleccionarLunASab = () => setDiasSeleccionados([1, 2, 3, 4, 5, 6]);
  const seleccionarLunAVie = () => setDiasSeleccionados([1, 2, 3, 4, 5]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const copiarHorario = () => {
    if (!copiarDesde) return;

    const horario = horariosExistentes.find(
      (h) => h.dia_semana === Number(copiarDesde)
    );

    if (!horario) {
      setError("No hay horario para ese día");
      return;
    }

    setForm((prev) => ({
      ...prev,
      hora_desde: horario.hora_desde,
      hora_hasta: horario.hora_hasta,
      fecha_desde: horario.fecha_desde?.slice(0, 10),
      fecha_hasta: horario.fecha_hasta?.slice(0, 10),
    }));

    setError(null);
  };

  const validate = () => {
    if (!modoMasivo && !form.dia_semana) {
      return "Seleccioná un día";
    }
    if (modoMasivo && diasSeleccionados.length === 0) {
      return "Seleccioná al menos un día";
    }
    if (!form.hora_desde || !form.hora_hasta || !form.fecha_desde || !form.fecha_hasta) {
      return "Todos los campos son obligatorios";
    }
    if (form.hora_desde >= form.hora_hasta) {
      return "La hora desde debe ser menor que la hora hasta";
    }
    if (form.fecha_desde > form.fecha_hasta) {
      return "La fecha desde no puede ser mayor que la fecha hasta";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (modoMasivo && onBulkSubmit) {
        const items = diasSeleccionados.map((dia_semana) => ({
          id_barbero: idBarbero,
          dia_semana,
          hora_desde: form.hora_desde,
          hora_hasta: form.hora_hasta,
          fecha_desde: form.fecha_desde,
          fecha_hasta: form.fecha_hasta,
        }));
        await onBulkSubmit(items);
      } else {
        await onSubmit({
          id_barbero: idBarbero,
          dia_semana: Number(form.dia_semana),
          hora_desde: form.hora_desde,
          hora_hasta: form.hora_hasta,
          fecha_desde: form.fecha_desde,
          fecha_hasta: form.fecha_hasta,
        });
      }
      onClose();
    } catch (err) {
      setError(err.message || "Horario solapado o inválido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3>Nuevo horario</h3>

        {error && <div className="error">{error}</div>}

        {/* Toggle modo masivo */}
        <div className="horario-form-mode">
          <button
            type="button"
            className={`mode-btn ${!modoMasivo ? "active" : ""}`}
            onClick={() => setModoMasivo(false)}
          >
            Un día
          </button>
          <button
            type="button"
            className={`mode-btn ${modoMasivo ? "active" : ""}`}
            onClick={() => setModoMasivo(true)}
          >
            Varios días
          </button>
        </div>

        {horariosExistentes.length > 0 && (
          <div className="copiar-horario">
            <select
              value={copiarDesde}
              onChange={(e) => setCopiarDesde(e.target.value)}
            >
              <option value="">Copiar horario de…</option>
              {DIAS_SEMANA.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </select>

            <button type="button" onClick={copiarHorario}>
              Copiar
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-grid">
          {modoMasivo ? (
            <div className="horario-form-dias-bulk">
              <label>Días a aplicar</label>
              <div className="dias-quick">
                <button type="button" onClick={seleccionarLunAVie}>
                  Lun a Vie
                </button>
                <button type="button" onClick={seleccionarLunASab}>
                  Lun a Sáb
                </button>
              </div>
              <div className="dias-checkboxes">
                {DIAS_SEMANA.map((d) => (
                  <label key={d.id} className="dia-checkbox">
                    <input
                      type="checkbox"
                      checked={diasSeleccionados.includes(d.id)}
                      onChange={() => toggleDia(d.id)}
                    />
                    <span>{d.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <label>
              Día
              <select
                name="dia_semana"
                value={form.dia_semana}
                onChange={handleChange}
              >
                <option value="">Seleccionar día</option>
                {DIAS_SEMANA.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.label}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label>
            Hora desde
            <input
              type="time"
              name="hora_desde"
              value={form.hora_desde}
              onChange={handleChange}
            />
          </label>

          <label>
            Hora hasta
            <input
              type="time"
              name="hora_hasta"
              value={form.hora_hasta}
              onChange={handleChange}
            />
          </label>

          <label>
            Vigente desde
            <input
              type="date"
              name="fecha_desde"
              value={form.fecha_desde}
              onChange={handleChange}
            />
          </label>

          <label>
            Vigente hasta
            <input
              type="date"
              name="fecha_hasta"
              value={form.fecha_hasta}
              onChange={handleChange}
            />
          </label>

          <div className="form-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading
                ? "Guardando…"
                : modoMasivo && diasSeleccionados.length > 0
                  ? `Guardar ${diasSeleccionados.length} horarios`
                  : "Guardar"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancelar
            </button>


          </div>
        </form>
      </div>
    </div>
  );
};

export default HorarioForm;
