"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface Proveedor {
  id?: number;
  nombre: string;
  contacto?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  estado?: string;
}

interface ProveedorModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  proveedor?: Proveedor | null;
}

const emptyForm: Proveedor = {
  nombre: "",
  contacto: "",
  email: "",
  telefono: "",
  direccion: "",
  estado: "activo",
};

export function ProveedorModal({ open, onClose, onSaved, proveedor }: ProveedorModalProps) {
  const [form, setForm] = useState<Proveedor>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm(proveedor ? { ...proveedor } : emptyForm);
      setError("");
    }
  }, [open, proveedor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (proveedor?.id) {
        await api.actualizarProveedor(proveedor.id, form as unknown as Record<string, unknown>);
      } else {
        await api.crearProveedor(form as unknown as Record<string, unknown>);
      }
      onSaved();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{proveedor?.id ? "Editar Proveedor" : "Nuevo Proveedor"}</DialogTitle>
          <DialogDescription>
            {proveedor?.id ? "Actualiza los datos del proveedor." : "Completa los datos del nuevo proveedor."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="nombre">Nombre de la empresa</Label>
            <Input id="nombre" name="nombre" value={form.nombre} onChange={handleChange} required />
          </div>
          <div className="space-y-1">
            <Label htmlFor="contacto">Persona de contacto</Label>
            <Input id="contacto" name="contacto" value={form.contacto ?? ""} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={form.email ?? ""} onChange={handleChange} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input id="telefono" name="telefono" value={form.telefono ?? ""} onChange={handleChange} />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="direccion">Dirección</Label>
            <Input id="direccion" name="direccion" value={form.direccion ?? ""} onChange={handleChange} />
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">{error}</p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Guardando...</> : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
