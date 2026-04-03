import { useEffect, useState } from "react";
import ServicioCard from "../../../components/Admin/ServicioCard/ServicioCard";
import ServicioForm from "../../../components/Admin/ServicioForm/ServicioForm";
import AdminHeader from "../AdminHeader/AdminHeader";

import {
  getServicios,
  createServicio,
  updateServicio,
  deleteServicio,
  uploadServicioImagen, // 🔥 FALTABA ESTO
} from "../../../services/servicios";

import "./ServicioPage.css";

const ServicioPage = () => {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingServicio, setEditingServicio] = useState(null);

  const fetchServicios = async () => {
    try {
      const data = await getServicios();
      setServicios(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando servicios", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServicios();
  }, []);

  const handleCreate = () => {
    setEditingServicio(null);
    setShowForm(true);
  };

  const handleEdit = (servicio) => {
    setEditingServicio(servicio);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteServicio(id);
      alert("Servicio eliminado correctamente");
      fetchServicios();
    } catch (err) {
      alert(err.message);
    }
  };


  const handleSubmit = async (formData) => {
    try {
      let servicio;

      // 🔹 1. Crear o actualizar SOLO datos (JSON)
      if (editingServicio) {
        servicio = await updateServicio(
          editingServicio.id_servicio,
          {
            nombre: formData.nombre,
            precio: formData.precio,
            duracion_min: formData.duracion_min,
          }
        );
      } else {
        servicio = await createServicio({
          nombre: formData.nombre,
          precio: formData.precio,
          duracion_min: formData.duracion_min,
        });
      }

      // 🔹 2. Subir imagen SOLO si existe
      if (formData.imagen) {
        await uploadServicioImagen(
          servicio.id_servicio,
          formData.imagen
        );
      }

      setShowForm(false);
      setEditingServicio(null);
      fetchServicios();
    } catch (err) {
      console.error("Error guardando servicio", err);
    }
  };

  return (
    <div className="admin-kb-page servicios-page-root">
      <AdminHeader
        title="Servicios"
        actionLabel="Agregar servicio"
        onAction={handleCreate}
      />

      {loading && (
        <p className="servicios-page__loading" role="status">
          Cargando servicios…
        </p>
      )}

      {!loading && servicios.length === 0 && (
        <div className="servicios-page__empty">
          <p className="servicios-page__empty-title">No hay servicios</p>
          <p className="servicios-page__empty-subtitle">
            Agregá el primero con el botón de arriba
          </p>
        </div>
      )}

      {!loading && servicios.length > 0 && (
        <section className="servicios-page__section">
          <div className="servicios-page__grid">
            {servicios.map((servicio) => (
              <ServicioCard
                key={servicio.id_servicio}
                servicio={servicio}
                onEdit={() => handleEdit(servicio)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </section>
      )}

      {showForm && (
        <ServicioForm
          servicioInicial={editingServicio}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingServicio(null);
          }}
        />
      )}
    </div>
  );
};

export default ServicioPage;
