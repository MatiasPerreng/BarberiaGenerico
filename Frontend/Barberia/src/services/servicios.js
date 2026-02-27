import API_URL from "./api";

/* =========================
   GET
========================= */
export async function getServicios() {
  const res = await fetch(`${API_URL}/servicios/`);
  if (!res.ok) throw new Error("Error cargando servicios");
  return res.json();
}

/* =========================
   CREATE (JSON)
========================= */
export async function createServicio(data) {
  const res = await fetch(`${API_URL}/servicios/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nombre: data.nombre,
      duracion_min: data.duracion_min,
      precio: data.precio,
      activo: true,
    }),
  });

  if (!res.ok) throw new Error("Error creando servicio");
  return res.json();
}

/* =========================
   UPDATE (JSON)
========================= */
export async function updateServicio(id, data) {
  const res = await fetch(`${API_URL}/servicios/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nombre: data.nombre,
      duracion_min: data.duracion_min,
      precio: data.precio,
      activo: data.activo ?? true,
    }),
  });

  if (!res.ok) throw new Error("Error actualizando servicio");
  return res.json();
}

/* =========================
   UPLOAD IMAGE
========================= */
export async function uploadServicioImagen(id, file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/servicios/${id}/imagen`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Error subiendo imagen");
  return res.json();
}

/* =========================
   DELETE
========================= */
export async function deleteServicio(id) {
  const res = await fetch(`${API_URL}/servicios/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    let mensaje = "Error eliminando servicio";

    try {
      const data = await res.json();
      if (data?.detail) {
        mensaje = data.detail;
      }
    } catch (e) {
      // puede no venir body (204 / html / etc)
    }

    throw new Error(mensaje);
  }

  return true;
}
