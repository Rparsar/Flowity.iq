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

interface Producto {
  id?: number;
  nombre: string;
  sku: string;
  categoria: string;
  precio: number | string;
  stock: number | string;
  stock_minimo: number | string;
  proveedor_id?: number | string | null;
  descripcion?: string;
}

interface Proveedor {
  id: number;
  nombre: string;
}

interface ProductoModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  producto?: Producto | null;
}

const emptyForm: Producto = {
  nombre: "",
  sku: "",
  categoria: "",
  precio: "",
  stock: "",
  stock_minimo: "",
  proveedor_id: "",
  descripcion: "",
};

export function ProductoModal({ open, onClose, onSaved, producto }: ProductoModalProps) {
  const [form, setForm] = useState<Producto>(emptyForm);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm(producto ? { ...producto } : emptyForm);
      setError("");
      api
        .getProveedores()
        .then((r) => setProveedores((r as { proveedores: Proveedor[] }).proveedores ?? []))
        .catch(() => setProveedores([]));
    }
  }, [open, producto]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        ...form,
        precio: Number(form.precio),
        stock: Number(form.stock),
        stock_minimo: Number(form.stock_minimo),
        proveedor_id: form.proveedor_id ? Number(form.proveedor_id) : null,
      };
      if (producto?.id) {
        await api.actualizarProducto(producto.id, payload);
      } else {
        await api.crearProducto(payload);
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{producto?.id ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
          <DialogDescription>
            {producto?.id ? "Actualiza los datos del producto." : "Completa los datos del nuevo producto."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1">
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" name="nombre" value={form.nombre} onChange={handleChange} required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" name="sku" value={form.sku} onChange={handleChange} required placeholder="Ej: PROD-001" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="categoria">Categoría</Label>
              <Input id="categoria" name="categoria" value={form.categoria} onChange={handleChange} required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="precio">Precio (€)</Label>
              <Input id="precio" name="precio" type="number" step="0.01" min="0" value={form.precio} onChange={handleChange} required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="stock_minimo">Stock mínimo</Label>
              <Input id="stock_minimo" name="stock_minimo" type="number" min="0" value={form.stock_minimo} onChange={handleChange} required />
            </div>
            <div className="col-span-2 space-y-1">
              <Label htmlFor="proveedor_id">Proveedor</Label>
              <select
                id="proveedor_id"
                name="proveedor_id"
                aria-label="Proveedor"
                value={form.proveedor_id ?? ""}
                onChange={handleChange}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">Sin proveedor</option>
                {proveedores.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </div>
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
