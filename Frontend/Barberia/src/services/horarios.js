import API_URL from "./api";

export async function getHorariosBarbero(idBarbero) {
  const res = await fetch(`${API_URL}/horarios/barbero/${idBarbero}`);
  if (!res.ok) throw new Error("Error al cargar horarios");
  return await res.json();
}

export async function crearHorario(data) {
  const res = await fetch(`${API_URL}/horarios/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Error al crear horario");
  }

  return await res.json();
}

export async function eliminarHorario(idHorario) {
  const res = await fetch(`${API_URL}/horarios/${idHorario}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Error al eliminar horario");
  }
}
