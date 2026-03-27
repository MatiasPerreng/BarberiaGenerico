import API_URL from "./api";

export async function getGanancias(params = {}) {
  const { desde, hasta, agrupacion = "mes", id_barbero } = params;
  const sp = new URLSearchParams();
  if (desde) sp.set("desde", desde);
  if (hasta) sp.set("hasta", hasta);
  if (agrupacion) sp.set("agrupacion", agrupacion);
  if (id_barbero != null && id_barbero !== "") sp.set("id_barbero", id_barbero);

  const query = sp.toString();
  const url = `${API_URL}/estadisticas/ganancias${query ? `?${query}` : ""}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) throw new Error("Error al cargar estadisticas");
  return res.json();
}
