import { useState, useEffect } from "react";
import "./BarberoForm.css";
import { subirFotoBarbero } from "../../../services/barberos";

const BarberoForm = ({ onSubmit, onClose, onCreated }) => {
  const [nombre, setNombre] = useState("");
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Limpiar preview para evitar fugas de memoria
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Crear el barbero (esperamos el objeto que contiene id_barbero)
      const barbero = await onSubmit({ nombre });

      // 2. Subir foto solo si existe el archivo y el barbero se creó con éxito
      if (foto && barbero?.id_barbero) {
        await subirFotoBarbero(barbero.id_barbero, foto);
      }

      // 3. Notificar éxito para refrescar y cerrar
      onClose();
      onCreated(); 
    } catch (err) {
      console.error(err);
      // El error de creación ya lo maneja el padre con alertError, 
      // aquí solo detenemos el loading.
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal">
        <h3>Nuevo barbero</h3>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            required
            onChange={(e) => setNombre(e.target.value)}
          />

          <label className="file-label">
            Seleccionar foto
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
          </label>

          {preview && (
            <img
              src={preview}
              alt="Preview"
              style={{
                width: 100,
                height: 100,
                objectFit: "cover",
                borderRadius: 12,
                marginTop: 8,
              }}
            />
          )}

          <div className="modal-actions">
            <button type="submit" disabled={loading}>
              {loading ? "Creando…" : "Crear"}
            </button>
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BarberoForm;