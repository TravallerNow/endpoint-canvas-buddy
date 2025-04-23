
const API_BASE = "http://localhost:8084";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem("authToken");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const resp = await fetch(API_BASE + path, {
    ...options,
    headers,
  });

  if (resp.status === 401) {
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }
  if (!resp.ok) throw new Error(await resp.text());
  return resp.json();
}
