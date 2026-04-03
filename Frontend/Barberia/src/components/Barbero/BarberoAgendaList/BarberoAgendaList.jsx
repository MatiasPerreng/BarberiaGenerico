import BarberoAgendaItem from "../BarberoAgendaItem/BarberoAgendaItem";
import "./BarberoAgendaList.css";

const formatoHora24 = (fh) => {
  if (!fh) return "";
  const d = new Date(fh);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("es-UY", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const normalizarTurno = (t) => {
  const fh = t.fecha_hora || t.fechaHora;
  const hora = t.hora && String(t.hora).trim() ? t.hora : formatoHora24(fh);
  return {
    ...t,
    id_visita: t.id_visita || t.id,
    fechaHora: fh,
    servicio: t.servicio || t.servicio_nombre,
    duracion: t.duracion ?? t.servicio_duracion ?? 0,
    telefono: t.telefono || t.cliente_telefono,
    hora,
  };
};

const BarberoAgendaList = ({ turnos }) => {
  if (!turnos.length) {
    return <p>No tenés turnos para hoy</p>;
  }

  return (
    <div className="barbero-agenda-list">
      {turnos.map((turno) => {
        const t = normalizarTurno(turno);
        return (
          <BarberoAgendaItem key={t.id_visita} turno={t} />
        );
      })}
    </div>
  );
};

export default BarberoAgendaList;
