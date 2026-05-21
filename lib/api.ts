const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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

  const config: RequestInit = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
    credentials: "include",
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

  // Ventas
  getVentas: () => apiFetch("/ventas"),
  getVenta: (id: string) => apiFetch(`/ventas/${id}`),

  // Recursos genéricos
  getTiposRecursos: () => apiFetch("/recursos/tipos"),
  getRecursos: (tipo: string) => apiFetch(`/recursos/${tipo}`),

  // Health check
  health: () => apiFetch("/health"),
};
