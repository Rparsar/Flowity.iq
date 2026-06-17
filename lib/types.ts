export type RecursoTipo = 'producto' | 'servicio' | 'reserva' | 'encargo';

export interface RecursoBase {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  estado: 'activo' | 'inactivo';
  created_at: string;
  updated_at: string;
}

export interface Producto extends RecursoBase {
  sku: string;
  categoria: string;
  stock: number;
  stock_minimo: number;
  costo: number;
  proveedor_id?: number;
}

export interface Servicio extends RecursoBase {}

export interface Reserva extends RecursoBase {}

export interface Encargo extends RecursoBase {
  producto_id?: number;
  dia_semana?: 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo';
}

export interface Suscripcion {
  id: number;
  suscriptible_id: number;
  suscriptible_type: string;
  tipo_periodo: 'dia' | 'semana' | 'mes' | 'año';
  cantidad_periodos: number;
  fecha_inicio: string;
  fecha_proximo_pago: string;
  estado: 'activa' | 'pausada' | 'cancelada';
  created_at: string;
  updated_at: string;
}

export type Recurso = Producto | Servicio | Reserva | Encargo;
