import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../../../../services/apiClient";
import TurnoActions from "../TurnoActions";
import "./TurnosList.css";

const dias = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

const meses = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const formatearFecha = (fechaHoraStr) => {
  const date = new Date(fechaHoraStr.replace(" ", "T"));
  const diaSemana = dias[date.getDay()];
  const mes = meses[date.getMonth()];
  const fechaTexto = `${diaSemana} ${date.getDate()} de ${mes}`;
  const hora = date.toLocaleTimeString("es-UY", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return { fechaTexto, hora };
};

const hoy = new Date().toISOString().split("T")[0];

const TurnosList = ({ filtro, onStatsNeedRefresh }) => {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fecha, setFecha] = useState(hoy);
  const [modoTodos, setModoTodos] = useState(true);

  const loadTurnos = useCallback(() => {
    if (!filtro) return;
    setLoading(true);
    let url = `/admin/turnos?filtro=${filtro}`;
    if (!modoTodos) {
      url += `&fecha=${fecha}`;
    }
    apiFetch(url, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setTurnos(data))
      .finally(() => setLoading(false));
  }, [filtro, fecha, modoTodos]);

  useEffect(() => {
    loadTurnos();
  }, [loadTurnos]);

  const handleCancelSuccess = () => {
    loadTurnos();
    onStatsNeedRefresh?.();
  };

  useEffect(() => {
    setModoTodos(true);
    setFecha(hoy);
  }, [filtro]);

  if (loading) {
    return (
      <p className="turnos-list-loading" role="status">
        Cargando turnos…
      </p>
    );
  }

  const showActions = filtro !== "cancelados";

  return (
    <div className="turnos-list">
      {filtro !== "hoy" && (
        <div className="turnos-filtro-fecha">
          <input
            type="date"
            className="turnos-date-filter"
            value={fecha}
            onChange={(e) => {
              setFecha(e.target.value);
              setModoTodos(false);
            }}
          />
          {!modoTodos && (
            <button
              type="button"
              className="turnos-btn-todos"
              onClick={() => {
                setModoTodos(true);
                setFecha(hoy);
              }}
            >
              Todos
            </button>
          )}
        </div>
      )}

      {!turnos.length && (
        <div className="turnos-list-empty">
          <strong>Sin resultados</strong>
          No hay turnos para mostrar con este criterio.
        </div>
      )}

      {turnos.map((t) => {
        const { fechaTexto, hora } = formatearFecha(t.fecha_hora);
        const nombreCliente = [t.cliente_nombre, t.cliente_apellido]
          .filter(Boolean)
          .join(" ");

        return (
          <div
            key={t.id_visita}
            className={`admin-turno-card turno-row ${showActions ? "" : "admin-turno-card--no-actions"}`}
          >
            <div className="admin-turno-head">
              <span className="admin-turno-date-pill">
                {fechaTexto} · {hora} hs
              </span>
            </div>
            <div className="admin-turno-body">
              <div className="admin-turno-col">
                <span className="admin-turno-kicker">Cliente</span>
                <p className="admin-turno-cliente">{nombreCliente || "—"}</p>
              </div>
              <div className="admin-turno-col">
                <span className="admin-turno-kicker">Servicio</span>
                <p className="admin-turno-servicio">{t.servicio || "—"}</p>
              </div>
              <div className="admin-turno-col admin-turno-col--full">
                <span className="admin-turno-kicker">Barbero</span>
                <p className="admin-turno-barbero">{t.barbero || "—"}</p>
              </div>
            </div>
            {showActions && (
              <TurnoActions turno={t} onCancelSuccess={handleCancelSuccess} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TurnosList;
