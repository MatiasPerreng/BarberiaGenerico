import API_URL from "./api";

const parseError = async (res, fallback) => {
  try {
    const data = await res.json();
    return data?.detail || fallback;
  } catch {
    return fallback;
  }
};

export async function getCarouselImages() {
  const res = await fetch(`${API_URL}/carousel`);
  if (!res.ok) throw new Error(await parseError(res, "Error al cargar imagenes"));
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function uploadCarouselImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/carousel/upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!res.ok) throw new Error(await parseError(res, "Error al subir imagen"));
  return res.json();
}

export async function deleteCarouselImage(filename) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/carousel/${encodeURIComponent(filename)}`, {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) throw new Error(await parseError(res, "Error al eliminar imagen"));
  return res.json();
}
