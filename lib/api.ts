const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const TOKEN_KEY = "flowity_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=604800; SameSite=Lax`;
}

export function removeToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
}

interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
}

export async function apiFetch<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const url = `${API_BASE_URL}/api${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const token = getToken();

  const config: RequestInit = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Error ${response.status}: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

// Helpers específicos para Flowity.iq
export const api = {
  // Auth
  login: (email: string, password: string) =>
    apiFetch<{ user: Record<string, unknown>; token: string }>("/login", {
      method: "POST",
      body: { email, password },
    }),
  register: (data: Record<string, unknown>) =>
    apiFetch<{ user: Record<string, unknown>; token: string }>("/register", {
      method: "POST",
      body: data,
    }),
  logout: () => apiFetch("/logout", { method: "POST" }),
  me: () => apiFetch<{ id: number; name: string; email: string; rol: string }>("/me"),

  // Dashboard
  getDashboard: () => apiFetch("/dashboard"),
  getKpis: () => apiFetch("/dashboard/kpis"),
  getAlertas: () => apiFetch("/dashboard/alertas"),

  // Productos
  getProductos: (params?: string) => apiFetch(`/productos${params || ""}`),
  getProducto: (id: number) => apiFetch(`/productos/${id}`),
  crearProducto: (data: Record<string, unknown>) =>
    apiFetch("/productos", { method: "POST", body: data }),
  actualizarProducto: (id: number, data: Record<string, unknown>) =>
    apiFetch(`/productos/${id}`, { method: "PUT", body: data }),
  eliminarProducto: (id: number) =>
    apiFetch(`/productos/${id}`, { method: "DELETE" }),

  // Proveedores
  getProveedores: () => apiFetch("/proveedores"),
  getProveedor: (id: number) => apiFetch(`/proveedores/${id}`),

  // Proveedores (CRUD completo)
  crearProveedor: (data: Record<string, unknown>) =>
    apiFetch("/proveedores", { method: "POST", body: data }),
  actualizarProveedor: (id: number, data: Record<string, unknown>) =>
    apiFetch(`/proveedores/${id}`, { method: "PUT", body: data }),
  eliminarProveedor: (id: number) =>
    apiFetch(`/proveedores/${id}`, { method: "DELETE" }),

  // Ventas
  getVentas: (params?: string) => apiFetch(`/ventas${params || ""}`),
  getVenta: (id: string) => apiFetch(`/ventas/${id}`),
  crearVenta: (data: Record<string, unknown>) =>
    apiFetch("/ventas", { method: "POST", body: data }),
  actualizarVenta: (id: number, data: Record<string, unknown>) =>
    apiFetch(`/ventas/${id}`, { method: "PUT", body: data }),
  eliminarVenta: (id: number) =>
    apiFetch(`/ventas/${id}`, { method: "DELETE" }),
  getEstadisticasVentas: () => apiFetch("/ventas/estadisticas/resumen"),

  // Health check
  health: () => apiFetch("/health"),
};
