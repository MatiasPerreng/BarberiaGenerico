import { useEffect, useState } from "react";
import API_URL from "../../../services/api";

const iniciales = (nombre) => {
  if (!nombre || typeof nombre !== "string") return "?";
  const p = nombre.trim().split(/\s+/);
  if (p.length >= 2) {
    return (p[0][0] + p[1][0]).toUpperCase();
  }
  return nombre.slice(0, 2).toUpperCase();
};

const BarberoAgendaView = () => {
  const [barberos, setBarberos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`${API_URL}/barberos/`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setBarberos(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setBarberos([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <p className="turnos-list-loading" role="status">
        Cargando barberos…
      </p>
    );
  }

  if (!barberos.length) {
    return (
      <div className="turnos-list-empty">
        <strong>No hay barberos</strong>
        Agregá barberos desde la sección correspondiente.
      </div>
    );
  }

  return (
    <div className="admin-barberos-list">
      {barberos.map((b) => (
        <div key={b.id_barbero} className="admin-barbero-card">
          <div className="admin-barbero-avatar" aria-hidden>
            {iniciales(b.nombre)}
          </div>
          <div className="admin-barbero-info">
            <h4>{b.nombre}</h4>
            <span
              className={`admin-barbero-badge ${b.activo ? "is-on" : "is-off"}`}
            >
              {b.activo ? "Activo" : "Inactivo"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BarberoAgendaView;
