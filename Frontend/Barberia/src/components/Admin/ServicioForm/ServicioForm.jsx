import { useEffect, useRef, useState } from "react";
import API_URL from "../../../services/api";
import "./ServicioForm.css";

const ServicioForm = ({ servicioInicial, onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    duracion_min: "",
    imagen: null,
  });

  const [preview, setPreview] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (!servicioInicial) {
      setPreview(null);
      return;
    }

    setForm({
      nombre: servicioInicial.nombre ?? "",
      precio: servicioInicial.precio ?? "",
      duracion_min: servicioInicial.duracion_min ?? "",
      imagen: null,
    });

    if (servicioInicial.imagen) {
      const img = servicioInicial.imagen;

      if (img.startsWith("http")) {
        setPreview(img);
      } else if (img.startsWith("/")) {
        setPreview(`${API_URL}${img}`);
      } else {
        setPreview(`${API_URL}/media/servicios/${img}`);
      }
    } else {
      setPreview(null);
    }
  }, [servicioInicial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm((p) => ({ ...p, imagen: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      nombre: form.nombre.trim(),
      precio: Number(form.precio),
      duracion_min: Number(form.duracion_min),
      imagen: form.imagen,
    });
  };

  return (
    <div className="servicio-modal">
      <form className="servicio-form" onSubmit={handleSubmit}>
        <h3>
          {servicioInicial ? "Editar servicio" : "Nuevo servicio"}
        </h3>

        {/* =========================
            NOMBRE
        ========================= */}
        <div className="form-group">
          <label>Nombre del servicio</label>
          <input
            name="nombre"
            placeholder="Ej: Corte + Barba"
            value={form.nombre}
            onChange={handleChange}
            required
          />
        </div>

        {/* =========================
            PRECIO
        ========================= */}
        <div className="form-group">
          <label>Precio</label>
          <input
            name="precio"
            type="number"
            step="0.01"
            placeholder="Ej: 1200"
            value={form.precio}
            onChange={handleChange}
            required
          />
        </div>

        {/* =========================
            DURACIÓN
        ========================= */}
        <div className="form-group">
          <label>Duración (minutos)</label>
          <input
            name="duracion_min"
            type="number"
            placeholder="Ej: 45"
            value={form.duracion_min}
            onChange={handleChange}
            required
          />
        </div>

        {/* =========================
            IMAGEN
        ========================= */}
        <div className="servicio-file">


          <button
            type="button"
            className="servicio-file-btn"
            onClick={() => fileRef.current.click()}
          >
            Seleccionar imagen
          </button>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            hidden
          />
        </div>

        {preview && (
          <img
            src={preview}
            alt="Preview servicio"
            className="servicio-preview"
          />
        )}

        {/* =========================
            ACTIONS
        ========================= */}


        <div className="form-actions">

          <button
            type="submit"
            className="btn-primary"
          >
            Guardar
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={onCancel}
          >
            Cancelar
          </button>


        </div>
      </form>
    </div>
  );
};

export default ServicioForm;
