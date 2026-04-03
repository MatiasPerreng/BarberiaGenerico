import API_URL from "./api";

/**
 * Cliente HTTP centralizado.
 * - Añade Authorization cuando hay token (excepto si requireAuth: false)
 * - Redirige a login en 401
 */
export async function apiFetch(path, options = {}) {
  const { requireAuth = true, ...fetchOptions } = options;
  const token = localStorage.getItem("token");
  const isFormData = fetchOptions.body instanceof FormData;
  const headers = {
    ...(!isFormData && { "Content-Type": "application/json" }),
    ...(requireAuth && token && { Authorization: `Bearer ${token}` }),
    ...fetchOptions.headers,
  };
  const url = path.startsWith("http") ? path : `${API_URL}${path}`;
  const res = await fetch(url, { ...fetchOptions, headers });
  if (res.status === 401 && requireAuth) {
    localStorage.removeItem("token");
    window.location.href = "/login-barbero";
  }
  return res;
}
