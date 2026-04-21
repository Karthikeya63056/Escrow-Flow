/**
 * API Service Layer — ready for backend integration.
 * Replace mock implementations with real HTTP calls when API is ready.
 */

const API_BASE = import.meta.env.VITE_API_URL || "/api";

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "ApiError";
  }
}

async function request(url, options = {}) {
  const config = {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  };

  // Add auth token if available
  const stored = localStorage.getItem("escrowflow-auth");
  if (stored) {
    try {
      const { state } = JSON.parse(stored);
      if (state?.user?.token) {
        config.headers.Authorization = `Bearer ${state.user.token}`;
      }
    } catch {}
  }

  try {
    const response = await fetch(`${API_BASE}${url}`, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(errorData.message || `Request failed (${response.status})`, response.status, errorData);
    }
    return response.json();
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError("Network error — please check your connection", 0, null);
  }
}

// Retry wrapper with exponential backoff
async function withRetry(fn, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxRetries - 1) throw err;
      if (err.status >= 400 && err.status < 500) throw err; // Don't retry client errors
      await new Promise((r) => setTimeout(r, Math.pow(2, attempt) * 1000));
    }
  }
}

// Offline action queue
const offlineQueue = [];

export function queueAction(action) {
  offlineQueue.push({ ...action, timestamp: Date.now() });
  localStorage.setItem("escrowflow-offline-queue", JSON.stringify(offlineQueue));
}

export async function flushQueue() {
  const queue = [...offlineQueue];
  offlineQueue.length = 0;
  localStorage.removeItem("escrowflow-offline-queue");

  for (const action of queue) {
    try {
      await request(action.url, action.options);
    } catch {
      offlineQueue.push(action);
    }
  }

  if (offlineQueue.length > 0) {
    localStorage.setItem("escrowflow-offline-queue", JSON.stringify(offlineQueue));
  }
}

// Auto-flush when coming back online
if (typeof window !== "undefined") {
  window.addEventListener("online", flushQueue);
}

// --- API Methods ---

export const api = {
  auth: {
    login: (credentials) => request("/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
    register: (data) => request("/auth/register", { method: "POST", body: JSON.stringify(data) }),
    me: () => request("/auth/me"),
  },

  escrows: {
    list: (params) => withRetry(() => request(`/escrows?${new URLSearchParams(params)}`)),
    get: (id) => withRetry(() => request(`/escrows/${id}`)),
    create: (data) => request("/escrows", { method: "POST", body: JSON.stringify(data) }),
    update: (id, data) => request(`/escrows/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    fund: (id) => request(`/escrows/${id}/fund`, { method: "POST" }),
    release: (id) => request(`/escrows/${id}/release`, { method: "POST" }),
  },

  milestones: {
    submit: (escrowId, milestoneId) => request(`/escrows/${escrowId}/milestones/${milestoneId}/submit`, { method: "POST" }),
    approve: (escrowId, milestoneId) => request(`/escrows/${escrowId}/milestones/${milestoneId}/approve`, { method: "POST" }),
    reject: (escrowId, milestoneId, reason) => request(`/escrows/${escrowId}/milestones/${milestoneId}/reject`, { method: "POST", body: JSON.stringify({ reason }) }),
  },

  disputes: {
    list: () => withRetry(() => request("/disputes")),
    get: (id) => withRetry(() => request(`/disputes/${id}`)),
    create: (escrowId, data) => request(`/escrows/${escrowId}/disputes`, { method: "POST", body: JSON.stringify(data) }),
    addMessage: (disputeId, content) => request(`/disputes/${disputeId}/messages`, { method: "POST", body: JSON.stringify({ content }) }),
    resolve: (disputeId, resolution) => request(`/disputes/${disputeId}/resolve`, { method: "POST", body: JSON.stringify(resolution) }),
  },

  analytics: {
    dashboard: () => withRetry(() => request("/analytics/dashboard")),
    escrowVolume: (period) => withRetry(() => request(`/analytics/volume?period=${period}`)),
  },

  notifications: {
    list: () => withRetry(() => request("/notifications")),
    markRead: (id) => request(`/notifications/${id}/read`, { method: "POST" }),
    markAllRead: () => request("/notifications/read-all", { method: "POST" }),
  },
};

export default api;
