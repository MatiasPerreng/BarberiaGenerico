import API_URL from "./api";

export const getMiPerfil = async () => {
  const res = await fetch(`${API_URL}/perfil/me`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) throw new Error("Error cargando perfil");
  return res.json();
};
