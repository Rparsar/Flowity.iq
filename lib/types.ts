export type RecursoTipo = 'producto' | 'servicio' | 'reserva' | 'encargo' | 'suscripcion';

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

export interface Suscripcion extends RecursoBase {
  planes: ('mensual' | 'trimestral' | 'semestral')[];
  producto_id?: number;
  producto?: {
    id: number;
    nombre: string;
  };
}

export type Recurso = Producto | Servicio | Reserva | Encargo | Suscripcion;
