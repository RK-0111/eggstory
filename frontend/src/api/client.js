/**
 * Tiny fetch wrapper — every API call in the app goes through here.
 * In dev, Vite proxies /api -> http://localhost:5000 (see vite.config.js).
 * In production, set VITE_API_URL to your deployed backend URL.
 */
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
};
