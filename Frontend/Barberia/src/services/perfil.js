import { apiFetch } from "./apiClient";

export const getMiPerfil = async () => {
  const res = await apiFetch("/perfil/me");
  if (!res.ok) throw new Error("Error cargando perfil");
  return res.json();
};
