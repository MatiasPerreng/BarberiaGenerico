import API_URL from "./api";

export async function loginBarbero(email, password) {
  const response = await fetch(`${API_URL}/auth/login-barbero`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Error al iniciar sesión");
  }

  return await response.json();
}
