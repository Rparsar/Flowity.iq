"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { RecursoTipo, Recurso, Producto, Encargo, Suscripcion } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Tag,
  DollarSign,
  Package,
  AlertTriangle,
  Layers,
  Hash,
  Calendar,
  Truck,
} from "lucide-react";

interface DetailModalProps {
  open: boolean;
  onClose: () => void;
  tipo: RecursoTipo;
  itemId: number | null;
}

export function DetailModal({ open, onClose, tipo, itemId }: DetailModalProps) {
  const [item, setItem] = useState<Recurso | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && itemId) {
      loadDetail();
    }
  }, [open, itemId, tipo]);

  const loadDetail = async () => {
    setLoading(true);
    setError("");
    try {
      let response;
      switch (tipo) {
        case "servicio":
          response = await api.getServicio(itemId!);
          break;
        case "reserva":
          response = await api.getReserva(itemId!);
          break;
        case "encargo":
          response = await api.getEncargo(itemId!);
          break;
        case "suscripcion":
          response = await api.getSuscripcion(itemId!);
          break;
        case "producto":
        default:
          response = await api.getProducto(itemId!);
      }
      setItem(response as Recurso);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar detalles");
    } finally {
      setLoading(false);
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

  const renderProductoFields = (data: Producto) => {
    const dataWithRelation = data as Producto & { proveedor?: { id: number; nombre: string } };
    return (
      <>
        {renderField(<DollarSign className="h-4 w-4" />, "Precio", `${data.precio} €`)}
        {renderField(<Tag className="h-4 w-4" />, "Categoría", data.categoria)}
        {renderField(<Hash className="h-4 w-4" />, "SKU", data.sku)}
        {renderField(<Package className="h-4 w-4" />, "Stock", data.stock)}
        {renderField(<AlertTriangle className="h-4 w-4" />, "Stock Mínimo", data.stock_minimo)}
        {renderField(
          <Truck className="h-4 w-4" />,
          "Proveedor",
          dataWithRelation.proveedor?.nombre || (data.proveedor_id ? `ID: ${data.proveedor_id}` : undefined)
        )}
      </>
    );
  };

  const renderServicioFields = () => (
    <>
      {renderField(<DollarSign className="h-4 w-4" />, "Precio", item ? `${item.precio} €` : null)}
    </>
  );

  const renderReservaFields = () => (
    <>
      {renderField(<DollarSign className="h-4 w-4" />, "Precio", item ? `${item.precio} €` : null)}
    </>
  );

  const renderEncargoFields = (data: Encargo) => {
    const dataWithRelation = data as Encargo & { producto?: { id: number; nombre: string } };
    return (
      <>
        {renderField(<DollarSign className="h-4 w-4" />, "Precio", `${data.precio} €`)}
        {renderField(
          <Layers className="h-4 w-4" />,
          "Producto",
          dataWithRelation.producto?.nombre || (data.producto_id ? `ID: ${data.producto_id}` : undefined)
        )}
        {renderField(<Calendar className="h-4 w-4" />, "Día de Semana", data.dia_semana)}
      </>
    );
  };

  const renderSuscripcionFields = (data: Suscripcion) => {
    const dataWithRelation = data as Suscripcion & { producto?: { id: number; nombre: string } };
    return (
      <>
        {renderField(<DollarSign className="h-4 w-4" />, "Precio", `${data.precio} €`)}
        {renderField(<Calendar className="h-4 w-4" />, "Planes", data.planes?.join(', ') || '-')}
        {renderField(
          <Layers className="h-4 w-4" />,
          "Producto",
          dataWithRelation.producto?.nombre || (data.producto_id ? `ID: ${data.producto_id}` : undefined)
        )}
      </>
    );
  };

  const renderFields = () => {
    if (!item) return null;
    switch (tipo) {
      case "producto":
        return renderProductoFields(item as Producto);
      case "servicio":
        return renderServicioFields();
      case "reserva":
        return renderReservaFields();
      case "encargo":
        return renderEncargoFields(item as Encargo);
      case "suscripcion":
        return renderSuscripcionFields(item as Suscripcion);
      default:
        return renderServicioFields();
    }
  };

  const titulo = tipo.charAt(0).toUpperCase() + tipo.slice(1);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Detalles del {titulo}</DialogTitle>
          <DialogDescription>
            Información completa del registro
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
        ) : item ? (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 pb-4 border-b">
              <div>
                <h3 className="font-semibold text-lg">{item.nombre}</h3>
                {item.descripcion && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.descripcion}
                  </p>
                )}
              </div>
              <Badge
                variant={item.estado === "activo" ? "default" : "secondary"}
              >
                {item.estado === "activo" ? "Activo" : "Inactivo"}
              </Badge>
            </div>

            <div className="space-y-0">{renderFields()}</div>

            <div className="pt-2 border-t text-xs text-muted-foreground space-y-1">
              <p>Creado: {new Date(item.created_at).toLocaleString("es-ES")}</p>
              <p>Actualizado: {new Date(item.updated_at).toLocaleString("es-ES")}</p>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
