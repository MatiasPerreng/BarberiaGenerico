import { apiFetch } from "./apiClient";

export async function getAdminDashboard() {
  const res = await apiFetch("/admin/dashboard", { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Error al cargar dashboard");
  }

  return await res.json();
}
