import React, { useEffect, useState } from "react";
import "./ServicesList.css";
import API_URL from "../../services/api";


const ServiciosList = ({ onSelectServicio }) => {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/servicios/`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setServicios(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="loading">Cargando servicios...</p>;

  return (
    <div className="servicios-grid">
      {servicios.map((servicio) => (
        <div className="servicio-card" key={servicio.id_servicio}>
          <div className="servicio-img-wrapper">
            <img
              src={`${API_URL}/media/servicios/${servicio.imagen}`}
              alt={servicio.nombre}
              className="servicio-img"
            />
          </div>

          <div className="servicio-body">
            <h3 className="servicio-title">
              {servicio.nombre.toUpperCase()}
            </h3>

            <span className="servicio-duracion">
              {servicio.duracion_min} MIN.
            </span>

            <p className="servicio-desc">
              {servicio.descripcion || "Servicio profesional de barbería"}
            </p>

            <div className="servicio-footer">
              <span className="servicio-precio">
                <small>$</small>{servicio.precio}
              </span>

              <button
                className="btn-reservar"
                onClick={() => onSelectServicio(servicio)}
              >
                <span>RESERVAR AHORA</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiciosList;
