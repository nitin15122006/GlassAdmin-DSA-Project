const API_BASE = "/api";
export function getToken() { return localStorage.getItem("glassadmin_token"); }
export function saveSession(data) {
  localStorage.setItem("glassadmin_token", data.token);
  localStorage.setItem("glassadmin_user", JSON.stringify(data.user));
}
export function clearSession() {
  localStorage.removeItem("glassadmin_token");
  localStorage.removeItem("glassadmin_user");
}
export function getUser() {
  try { return JSON.parse(localStorage.getItem("glassadmin_user") || "null"); }
  catch { return null; }
}
export async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || "Request failed");
  return body;
}
