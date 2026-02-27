import API_URL from "./api";

export async function getAdminDashboard() {
  const res = await fetch(`${API_URL}/admin/dashboard`);

  if (!res.ok) {
    throw new Error("Error al cargar dashboard");
  }

  return await res.json();
}
