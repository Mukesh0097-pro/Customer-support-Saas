// Google OAuth only — the backend has no email/password or database layer.

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function loginWithGoogle() {
  // Full-page redirect into the backend's OAuth flow.
  // Backend redirects to Google, then back to `${CLIENT_URL}/dashboard` with the JWT set as a cookie.
  window.location.href = `${API_BASE}/auth/google`;
}

export async function getMe() {
  const res = await fetch(`${API_BASE}/auth/me`, { credentials: "include" });
  if (!res.ok) throw new Error("Not signed in");
  return res.json();
}

export async function logout() {
  const res = await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  return res.json();
}
