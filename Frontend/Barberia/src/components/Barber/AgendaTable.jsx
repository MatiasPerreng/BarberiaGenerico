import AgendaRow from "./AgendaRow";

const AgendaTable = ({ agenda, onCompletar, onCancelar }) => {
  if (!agenda || agenda.length === 0) {
    return <p className="mt-3">No hay turnos agendados.</p>;
  }

  return (
    <table className="table table-striped table-hover mt-3">
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Hora</th>
          <th>Cliente</th>
          <th>Servicio</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {agenda.map((turno, index) => (
          <AgendaRow
            key={index}
            turno={turno}
            onCompletar={onCompletar}
            onCancelar={onCancelar}
          />
        ))}
      </tbody>
    </table>
  );
};

export default AgendaTable;
