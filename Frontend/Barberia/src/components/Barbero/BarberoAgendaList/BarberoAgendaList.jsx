import BarberoAgendaItem from "../BarberoAgendaItem/BarberoAgendaItem";
import "./BarberoAgendaList.css";

const BarberoAgendaList = ({ turnos, onSelectTurno }) => {
  if (!turnos.length) {
    return <p>No tenés turnos para hoy</p>;
  }

  return (
    <div className="barbero-agenda-list">
      {turnos.map((turno) => (
        <BarberoAgendaItem
          key={turno.id}
          turno={turno}
          onClick={() => onSelectTurno(turno)}
        />
      ))}
    </div>
  );
};

export default BarberoAgendaList;
