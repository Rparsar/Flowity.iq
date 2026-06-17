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
    let value = e.target.value;
    
    // Validar teléfono: solo números, +, -, (), espacios
    if (e.target.name === "telefono") {
      value = value.replace(/[^0-9+\-() ]/g, "");
    }
    
    setForm((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const isValidEmail = (email: string): boolean => {
    if (!email) return true; // Email es opcional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidTelefono = (telefono: string): boolean => {
    if (!telefono) return true; // Teléfono es opcional
    return telefono.replace(/[^0-9]/g, "").length >= 9;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validar email
    if (!isValidEmail(form.email ?? "")) {
      setError("El email no es válido");
      return;
    }

    // Validar teléfono
    if (!isValidTelefono(form.telefono ?? "")) {
      setError("El teléfono debe tener al menos 9 dígitos");
      return;
    }

    setLoading(true);
    try {
      if (form.id) {
        await api.actualizarProveedor(form.id, form as unknown as Record<string, unknown>);
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
      <DialogContent className="sm:max-w-[480px] max-h-[calc(100vh-4rem)] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>{proveedor?.id ? "Editar Proveedor" : "Nuevo Proveedor"}</DialogTitle>
          <DialogDescription>
            {proveedor?.id ? "Actualiza los datos del proveedor." : "Completa los datos del nuevo proveedor."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="px-6 overflow-y-auto max-h-[calc(100vh-16rem)] space-y-4 scrollbar-hide">
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
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email ?? ""}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                name="telefono"
                type="tel"
                value={form.telefono ?? ""}
                onChange={handleChange}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  const permitidos = /[0-9+\-() ]|Backspace|Delete|Tab/;
                  if (!permitidos.test(e.key)) e.preventDefault();
                }}
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="direccion">Dirección</Label>
            <Input id="direccion" name="direccion" value={form.direccion ?? ""} onChange={handleChange} />
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">{error}</p>
          )}

          <DialogFooter className="px-6 pb-6 pt-4 border-t">
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
