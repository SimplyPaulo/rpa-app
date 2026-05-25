/* ═══════════════════════════════════════════════════════════
   API Service — Centralized fetch wrapper for the RPA backend.
   All requests go through this module for consistent
   error handling and JWT token management.
   ═══════════════════════════════════════════════════════════ */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5062/api';

/**
 * Retrieve the JWT token from localStorage.
 */
function getToken() {
  return localStorage.getItem('rpa_token');
}

/**
 * Core fetch wrapper with auth headers and error handling.
 */
async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    ...options.headers,
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401 — token expired or invalid
  if (response.status === 401) {
    localStorage.removeItem('rpa_token');
    localStorage.removeItem('rpa_user');
    window.location.href = '/';
    throw new Error('Sessão expirada. Faça login novamente.');
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.message || `Erro ${response.status}`;
    throw new Error(message);
  }

  return data;
}

// ── Auth endpoints ──────────────────────────────────────
export const authApi = {
  register: (body) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),

  login: (body) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
};

// ── Reports endpoints ───────────────────────────────────
export const reportsApi = {
  create: (formData) =>
    request('/reports', { method: 'POST', body: formData }),

  getById: (id) =>
    request(`/reports/${id}`),

  getMyReports: () =>
    request('/reports/my'),

  getAllReports: () =>
    request('/reports/all'),

  updateStatus: (id, body) =>
    request(`/reports/${id}/status`, { method: 'PATCH', body: JSON.stringify(body) }),
};
