"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  DollarSign,
  Calendar,
  User,
  CreditCard,
  Hash,
  CheckCircle,
  XCircle,
  Package,
  Wrench,
  CalendarDays,
  ClipboardList,
} from "lucide-react";

interface VentaItem {
  id: number;
  precio: number;
  subtotal: number;
  cantidad?: number;
  producto_id?: number;
  servicio_id?: number;
  reserva_id?: number;
  encargo_id?: number;
  producto?: { id: number; nombre: string };
  servicio?: { id: number; nombre: string };
  reserva?: { id: number; nombre: string };
  encargo?: { id: number; nombre: string };
}

interface Venta {
  id: number;
  codigo: string;
  fecha: string;
  cliente: string;
  nombre?: string;
  apellidos?: string;
  email?: string;
  telefono?: string;
  total: number;
  estado: string;
  metodo_pago?: string;
  producto_ventas?: VentaItem[];
  servicio_ventas?: VentaItem[];
  reserva_ventas?: VentaItem[];
  encargo_ventas?: VentaItem[];
  created_at?: string;
  updated_at?: string;
}

interface VentaDetailModalProps {
  open: boolean;
  onClose: () => void;
  ventaId: number | null;
  onStatusChange?: () => void;
}

export function VentaDetailModal({
  open,
  onClose,
  ventaId,
  onStatusChange,
}: VentaDetailModalProps) {
  const [venta, setVenta] = useState<Venta | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && ventaId) {
      loadDetail();
    }
  }, [open, ventaId]);

  const loadDetail = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.getVenta(String(ventaId!));
      setVenta(response as Venta);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar detalles");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStatus = async (estado: "completada" | "cancelada") => {
    if (!venta) return;
    setActionLoading(true);
    try {
      await api.actualizarVenta(venta.id, { estado });
      onStatusChange?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar estado");
    } finally {
      setActionLoading(false);
    }
  };

  const renderField = (
    icon: React.ReactNode,
    label: string,
    value: string | number | undefined | null
  ) => {
    if (value === undefined || value === null || value === "") return null;
    return (
      <div className="flex items-start gap-3 py-3 border-b last:border-b-0">
        <div className="text-muted-foreground mt-0.5">{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            {label}
          </p>
          <p className="text-sm font-medium mt-1 break-words">
            {String(value)}
          </p>
        </div>
      </div>
    );
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "completada":
        return <Badge className="bg-success/10 text-success hover:bg-success/20">Completada</Badge>;
      case "pendiente":
        return <Badge className="bg-warning/10 text-warning hover:bg-warning/20">Pendiente</Badge>;
      case "cancelada":
        return <Badge variant="destructive">Cancelada</Badge>;
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  const getItemIcon = (tipo: string) => {
    switch (tipo) {
      case "producto":
        return <Package className="h-3.5 w-3.5 text-muted-foreground" />;
      case "servicio":
        return <Wrench className="h-3.5 w-3.5 text-muted-foreground" />;
      case "reserva":
        return <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />;
      case "encargo":
        return <ClipboardList className="h-3.5 w-3.5 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const renderItems = () => {
    if (!venta) return null;

    const items: { tipo: string; nombre: string; cantidad: number; subtotal: number }[] = [];

    venta.producto_ventas?.forEach((item) => {
      items.push({ tipo: "producto", nombre: item.producto?.nombre ?? "Producto", cantidad: item.cantidad ?? 1, subtotal: item.subtotal });
    });
    venta.servicio_ventas?.forEach((item) => {
      items.push({ tipo: "servicio", nombre: item.servicio?.nombre ?? "Servicio", cantidad: 1, subtotal: item.subtotal });
    });
    venta.reserva_ventas?.forEach((item) => {
      items.push({ tipo: "reserva", nombre: item.reserva?.nombre ?? "Reserva", cantidad: 1, subtotal: item.subtotal });
    });
    venta.encargo_ventas?.forEach((item) => {
      items.push({ tipo: "encargo", nombre: item.encargo?.nombre ?? "Encargo", cantidad: item.cantidad ?? 1, subtotal: item.subtotal });
    });

    if (items.length === 0) return null;

    return (
      <div className="pt-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
          Artículos ({items.length})
        </p>
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-2 py-2 px-3 bg-muted/50 rounded-md text-sm"
            >
              <div className="flex items-center gap-2">
                {getItemIcon(item.tipo)}
                <span>{item.nombre}</span>
                {item.cantidad > 1 && (
                  <span className="text-muted-foreground">x{item.cantidad}</span>
                )}
              </div>
              <span className="font-medium">€{Number(item.subtotal).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Detalles de Venta</DialogTitle>
          <DialogDescription>
            {venta ? venta.codigo : "Cargando..."}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : error ? (
          <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded">
            {error}
          </p>
        ) : venta ? (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 pb-4 border-b">
              <div>
                <h3 className="font-semibold text-lg">{venta.codigo}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {venta.cliente}
                </p>
              </div>
              {getEstadoBadge(venta.estado)}
            </div>

            <div className="space-y-0">
              {renderField(<Calendar className="h-4 w-4" />, "Fecha", new Date(venta.fecha).toLocaleString("es-ES"))}
              {renderField(<User className="h-4 w-4" />, "Cliente", venta.cliente)}
              {renderField(<DollarSign className="h-4 w-4" />, "Total", `€${Number(venta.total).toFixed(2)}`)}
              {renderField(<CreditCard className="h-4 w-4" />, "Método de Pago", venta.metodo_pago)}
              {renderField(<Hash className="h-4 w-4" />, "Email", venta.email)}
              {renderField(<Hash className="h-4 w-4" />, "Teléfono", venta.telefono)}
            </div>

            {renderItems()}

            <div className="pt-4 border-t flex gap-2">
              <Button
                className="flex-1 bg-success hover:bg-success/90 text-white"
                onClick={() => handleChangeStatus("completada")}
                disabled={actionLoading || venta.estado === "completada"}
              >
                {actionLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="mr-2 h-4 w-4" />
                )}
                Completar
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => handleChangeStatus("cancelada")}
                disabled={actionLoading || venta.estado === "cancelada"}
              >
                {actionLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <XCircle className="mr-2 h-4 w-4" />
                )}
                Cancelar
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
