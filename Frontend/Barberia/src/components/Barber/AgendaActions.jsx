const AgendaActions = ({ estado, onCompletar, onCancelar }) => {
  if (estado !== "CONFIRMADO") return null;

  return (
    <div className="d-flex gap-2">
      <button
        className="btn btn-sm btn-success"
        onClick={onCompletar}
      >
        Completar
      </button>

      <button
        className="btn btn-sm btn-danger"
        onClick={onCancelar}
      >
        Cancelar
      </button>
    </div>
  );
};

export default AgendaActions;
