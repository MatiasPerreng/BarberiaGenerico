import "./ServicioCard.css";
import API_URL from "../../../services/api";

const ServicioCard = ({ servicio, onEdit, onDelete }) => {
  const imgSrc = servicio.imagen
    ? `${API_URL}/media/servicios/${servicio.imagen}`
    : "/placeholder.jpg";

  return (
    <div className="servicio-card">
      <div className="servicio-image">
        <img
          src={imgSrc}
          alt={servicio.nombre || "Servicio"}
          loading="lazy"
        />
      </div>

      <h4>{servicio.nombre}</h4>

      <p className="servicio-meta-price">${servicio.precio}</p>
      <span className="servicio-meta-duration">{servicio.duracion_min} min</span>

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
