
const getDiaTexto = (fechaHora) => {
  if (!fechaHora) return "";

  const fecha = new Date(fechaHora);
  const hoy = new Date();

  const mismoDia =
    fecha.getDate() === hoy.getDate() &&
    fecha.getMonth() === hoy.getMonth() &&
    fecha.getFullYear() === hoy.getFullYear();

  if (mismoDia) return "Hoy";

  return fecha.toLocaleDateString("es-UY", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
};

export default getDiaTexto;
