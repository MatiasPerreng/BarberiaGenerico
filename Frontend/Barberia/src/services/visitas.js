export async function actualizarEstadoVisita(visitaId, estado) {
  const res = await fetch(
    `http://localhost:8000/visitas/${visitaId}/estado`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ estado }),
    }
  );

  if (!res.ok) {
    throw new Error("Error al actualizar estado de la visita");
  }

  return await res.json();
}
