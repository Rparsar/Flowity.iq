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
import { Loader2, Mail, Phone, MapPin, User } from "lucide-react";

interface Proveedor {
  id: number;
  nombre: string;
  contacto?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  estado: string;
}

interface ProveedorDetailModalProps {
  open: boolean;
  onClose: () => void;
  proveedorId: number | null;
}

export function ProveedorDetailModal({
  open,
  onClose,
  proveedorId,
}: ProveedorDetailModalProps) {
  const [proveedor, setProveedor] = useState<Proveedor | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && proveedorId) {
      loadDetail();
    }
  }, [open, proveedorId]);

  const loadDetail = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.getProveedor(proveedorId!);
      setProveedor(response as Proveedor);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar detalles");
    } finally {
      setLoading(false);
    }
  };

  const renderField = (icon: React.ReactNode, label: string, value?: string) => {
    if (!value) return null;
    return (
      <div className="flex items-start gap-3 py-3 border-b last:border-b-0">
        <div className="text-muted-foreground mt-0.5">{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            {label}
          </p>
          <p className="text-sm font-medium mt-1 break-words">{value}</p>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Detalles del Proveedor</DialogTitle>
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
        ) : proveedor ? (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 pb-4 border-b">
              <div>
                <h3 className="font-semibold text-lg">{proveedor.nombre}</h3>
                {proveedor.contacto && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {proveedor.contacto}
                  </p>
                )}
              </div>
              <Badge
                variant={
                  proveedor.estado === "activo" ? "default" : "secondary"
                }
              >
                {proveedor.estado === "activo" ? "Activo" : "Inactivo"}
              </Badge>
            </div>

            <div className="space-y-0">
              {renderField(
                <Mail className="h-4 w-4" />,
                "Email",
                proveedor.email
              )}
              {renderField(
                <Phone className="h-4 w-4" />,
                "Teléfono",
                proveedor.telefono
              )}
              {renderField(
                <MapPin className="h-4 w-4" />,
                "Dirección",
                proveedor.direccion
              )}
              {renderField(
                <User className="h-4 w-4" />,
                "Contacto",
                proveedor.contacto
              )}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
