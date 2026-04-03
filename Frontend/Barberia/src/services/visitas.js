import { apiFetch } from "./apiClient";

export async function actualizarEstadoVisita(visitaId, estado) {
  const res = await apiFetch(`/visitas/${visitaId}/estado`, {
    method: "PATCH",
    body: JSON.stringify({ estado }),
  });

  if (!res.ok) {
    throw new Error("Error al actualizar estado de la visita");
  }

  return await res.json();
}
