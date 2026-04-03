import { apiFetch } from "./apiClient";
import API_URL from "./api";

/** Público: lista imágenes del carrusel */
export async function getCarouselImages() {
  const res = await fetch(`${API_URL}/carousel`);
  if (!res.ok) throw new Error("Error al cargar imágenes");
  return res.json();
}

/** Admin: subir imagen */
export async function uploadCarouselImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/carousel/upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Error al subir imagen");
  }
  return res.json();
}

/** Admin: eliminar imagen */
export async function deleteCarouselImage(filename) {
  const res = await apiFetch(`/carousel/${encodeURIComponent(filename)}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Error al eliminar");
  }
}
