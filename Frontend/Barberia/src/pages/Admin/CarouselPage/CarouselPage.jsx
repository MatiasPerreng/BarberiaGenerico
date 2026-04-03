import { useEffect, useState, useRef } from "react";
import AdminHeader from "../AdminHeader/AdminHeader";
import { getCarouselImages, uploadCarouselImage, deleteCarouselImage } from "../../../services/carousel";
import API_URL from "../../../services/api";
import "./CarouselPage.css";

const CarouselPage = () => {
  const [imagenes, setImagenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const cargarImagenes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCarouselImages();
      setImagenes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("No se pudieron cargar las imágenes");
      setImagenes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarImagenes();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Solo se permiten imágenes (JPG, PNG, WebP)");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("La imagen no puede superar 8 MB");
      return;
    }

    setUploading(true);
    setError(null);
    try {
      await uploadCarouselImage(file);
      await cargarImagenes();
    } catch (err) {
      setError(err.message || "Error al subir");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (filename) => {
    if (!confirm("¿Eliminar esta imagen del carrusel?")) return;
    try {
      await deleteCarouselImage(filename);
      await cargarImagenes();
    } catch (err) {
      setError(err.message || "Error al eliminar");
    }
  };

  return (
    <>
      <AdminHeader
        title="Fotos del carrusel"
        actionLabel="Subir imagen"
        onAction={() => fileInputRef.current?.click()}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleUpload}
        style={{ display: "none" }}
      />

      {uploading && <p className="carousel-page-loading">Subiendo imagen…</p>}
      {error && <p className="carousel-page-error">{error}</p>}

      {loading && !uploading && (
        <p className="carousel-page-loading">Cargando imágenes…</p>
      )}

      {!loading && imagenes.length === 0 && (
        <div className="carousel-page-empty">
          <p>No hay fotos en el carrusel</p>
          <p className="carousel-page-empty-hint">
            Las fotos que subas se mostrarán en la galería de la página principal.
          </p>
          <button
            className="carousel-page-upload-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            + Subir primera imagen
          </button>
        </div>
      )}

      {!loading && imagenes.length > 0 && (
        <div className="carousel-page-grid">
          {imagenes.map((img) => (
            <div key={img.filename} className="carousel-page-card">
              <img
                src={`${API_URL}${img.url}`}
                alt="Carrusel"
                className="carousel-page-preview"
              />
              <button
                className="carousel-page-delete"
                onClick={() => handleDelete(img.filename)}
                title="Eliminar"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}

      {!loading && imagenes.length > 0 && (
        <p className="carousel-page-hint">
          El orden de las fotos es el de la lista. Sube nuevas imágenes para agregarlas al final.
        </p>
      )}
    </>
  );
};

export default CarouselPage;
