import { useAuthStore } from "./store";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

export const api = {
  async fetch(endpoint: string, options: FetchOptions = {}) {
    const { requireAuth = true, headers: customHeaders, ...restOptions } = options;
    
    const headers = new Headers(customHeaders);
    headers.set("Content-Type", "application/json");

    if (requireAuth) {
      const token = useAuthStore.getState().token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      headers,
      ...restOptions,
    });

    if (response.status === 401 && requireAuth) {
      // Auto logout on unauthorized
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }

    return response;
  },

  async get(endpoint: string, options?: FetchOptions) {
    return this.fetch(endpoint, { method: "GET", ...options });
  },

  async post(endpoint: string, body: any, options?: FetchOptions) {
    return this.fetch(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
      ...options,
    });
  },

  async put(endpoint: string, body: any, options?: FetchOptions) {
    return this.fetch(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
      ...options,
    });
  },

  async delete(endpoint: string, options?: FetchOptions) {
    return this.fetch(endpoint, { method: "DELETE", ...options });
  },

  async patch(endpoint: string, body: any, options?: FetchOptions) {
    return this.fetch(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
      ...options,
    });
  },
};
