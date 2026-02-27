import AgendaActions from "./AgendaActions";

const AgendaRow = ({ turno, onCompletar, onCancelar }) => {
  const fecha = new Date(turno.fecha_hora);

  const fechaStr = fecha.toLocaleDateString("es-UY");
  const horaStr = fecha.toLocaleTimeString("es-UY", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const estadoColor = {
    reservado: "warning",
    cancelado: "danger",
    completado: "success",
  }[turno.estado] || "secondary";

  return (
    <tr>
      <td>{fechaStr}</td>
      <td>{horaStr}</td>
      <td>{turno.cliente_nombre}</td>
      <td>
        {turno.servicio_nombre} ({turno.servicio_duracion} min)
      </td>
      <td>
        <span className={`badge bg-${estadoColor}`}>
          {turno.estado}
        </span>
      </td>
      <td>
        <AgendaActions
          estado={turno.estado}
          onCompletar={() => onCompletar(turno)}
          onCancelar={() => onCancelar(turno)}
        />
      </td>
    </tr>
  );
};

export default AgendaRow;
