import { apiFetch } from "./apiClient";

export async function getHorariosBarbero(idBarbero) {
  const res = await apiFetch(`/horarios/barbero/${idBarbero}`, {
    requireAuth: false,
  });
  if (!res.ok) throw new Error("Error al cargar horarios");
  return await res.json();
}

export async function crearHorario(data) {
  const res = await apiFetch("/horarios/", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Error al crear horario");
  }

  return await res.json();
}

export async function eliminarHorario(idHorario) {
  const res = await apiFetch(`/horarios/${idHorario}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Error al eliminar horario");
  }
}
