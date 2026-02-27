import "./ServicioCard.css";
import API_URL from "../../../services/api";

const ServicioCard = ({ servicio, onEdit, onDelete }) => {
  const imageUrl = servicio.imagen
    ? `${API_URL}/${servicio.imagen}`
    : "/placeholder.jpg";

  return (
    <div className="servicio-card">
      <div className="servicio-image">
        <img
          src={`${API_URL}/media/servicios/${servicio.imagen}`}
          alt={servicio.nombre}
          loading="lazy"
        />
      </div>

      <h4>{servicio.nombre}</h4>

      <p>${servicio.precio}</p>
      <small>{servicio.duracion_min} min</small>

      <div className="servicio-actions">
        <button className="btn-edit" onClick={onEdit}>
          Editar
        </button>

        <button
          className="btn-delete"
          onClick={() => {
            if (
              window.confirm(
                `¿Eliminar el servicio "${servicio.nombre}"?`
              )
            ) {
              onDelete(servicio.id_servicio);
            }
          }}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default ServicioCard;
