import { apiFetch } from "./apiClient";

/**
 * Obtiene estadísticas de ganancias.
 * - Barbero: solo sus ganancias.
 * - Admin: total general o filtrado por id_barbero.
 */
export async function getGanancias(params = {}) {
  const { desde, hasta, agrupacion = "mes", id_barbero } = params;
  const sp = new URLSearchParams();
  if (desde) sp.set("desde", desde);
  if (hasta) sp.set("hasta", hasta);
  if (agrupacion) sp.set("agrupacion", agrupacion);
  if (id_barbero != null && id_barbero !== "") sp.set("id_barbero", id_barbero);

  const query = sp.toString();
  const url = `/estadisticas/ganancias${query ? `?${query}` : ""}`;
  const res = await apiFetch(url);
  if (!res.ok) throw new Error("Error al cargar estadísticas");
  return res.json();
}
