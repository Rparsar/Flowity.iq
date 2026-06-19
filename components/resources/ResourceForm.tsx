"use client";

import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { RecursoTipo, Recurso, Producto } from "@/lib/types";
import { api } from "@/lib/api";

interface Field {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[] | { id: number; nombre: string }[];
}

interface ResourceFormProps {
  tipo: RecursoTipo;
  open: boolean;
  onClose: () => void;
  onSave: (data: Record<string, unknown>) => Promise<void>;
  item?: Recurso | null;
}

export function ResourceForm({
  tipo,
  open,
  onClose,
  onSave,
  item,
}: ResourceFormProps) {
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [productos, setProductos] = useState<Producto[]>([]);
  const [proveedores, setProveedores] = useState<{ id: number; nombre: string }[]>([]);

  useEffect(() => {
    if (open) {
      if (item) {
        // Filtrar campos de sistema antes de cargar el formulario
        const { id, created_at, updated_at, ...editable } = item as unknown as Record<string, unknown>;
        setForm(editable);
      } else {
        setForm({});
      }
      setError("");

      // Cargar productos si es un encargo o suscripcion
      if (tipo === "encargo" || tipo === "suscripcion") {
        loadProductos();
      }

      // Cargar proveedores si es un producto
      if (tipo === "producto") {
        loadProveedores();
      }
    }
  }, [open, item, tipo]);

  const loadProductos = async () => {
    try {
      const response = await api.getProductos() as { productos: Producto[] };
      setProductos(response.productos || []);
    } catch (err) {
      console.error("Error cargando productos:", err);
    }
  };

  const loadProveedores = async () => {
    try {
      const response = await api.getProveedores() as { proveedores: { id: number; nombre: string }[] };
      setProveedores(response.proveedores || []);
    } catch (err) {
      console.error("Error cargando proveedores:", err);
    }
  };

  const handleChange = (field: string, value: unknown) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };

      // Al seleccionar un producto en encargo, rellenar el precio automáticamente
      if (field === "producto_id" && value) {
        const productoSeleccionado = productos.find((p) => p.id === Number(value));
        if (productoSeleccionado) {
          updated.precio = String(productoSeleccionado.precio);
        }
      }

      return updated;
    });
  };

  // Convertir datetime-local (2024-01-15T14:30) a formato MySQL (2024-01-15 14:30:00)
  const formatDateTimeForAPI = (value: unknown): string | null => {
    if (!value || typeof value !== "string") return null;
    // Si ya tiene espacio en lugar de T, asumir que está formateado
    if (value.includes(" ")) return value;
    // Reemplazar T por espacio y añadir segundos si no los tiene
    const formatted = value.replace("T", " ");
    // Si no tiene segundos, añadir :00
    return formatted.length <= 16 ? `${formatted}:00` : formatted;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      // Preparar datos con fechas formateadas (Suscripciones)
      const preparedData: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(form)) {
        if (key === "fecha_proximo_pago" || key === "fecha") {
          const formatted = formatDateTimeForAPI(value);
          if (formatted) preparedData[key] = formatted;
        } else {
          preparedData[key] = value;
        }
      }

      await onSave(preparedData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  const getFields = (): Field[] => {
    const baseFields: Field[] = [
      { name: "nombre", label: "Nombre", type: "text", required: true },
      { name: "precio", label: "Precio", type: "number", required: true },
      { name: "estado", label: "Estado", type: "select", options: ["activo", "inactivo"] },
    ];

    switch (tipo) {
      case "producto":
        return [
          ...baseFields,
          { name: "sku", label: "SKU", type: "text", required: true },
          { name: "categoria", label: "Categoría", type: "text" },
          { name: "stock", label: "Stock", type: "number" },
          { name: "stock_minimo", label: "Stock Mínimo", type: "number" },
          { name: "proveedor_id", label: "Proveedor", type: "select", options: proveedores },
          { name: "descripcion", label: "Descripción", type: "textarea" },
        ];
      case "servicio":
        return [
          ...baseFields,
          { name: "descripcion", label: "Descripción", type: "textarea" },
        ];
      case "reserva":
        return [
          { name: "nombre", label: "Nombre", type: "text", required: true },
          { name: "descripcion", label: "Descripción", type: "textarea" },
          { name: "precio", label: "Precio", type: "number" },
          { name: "estado", label: "Estado", type: "select", options: ["activo", "inactivo"] },
        ];
      case "encargo":
        return [
          { name: "nombre", label: "Nombre", type: "text", required: true },
          { name: "descripcion", label: "Descripción", type: "textarea" },
          { name: "precio", label: "Precio", type: "number" },
          { name: "estado", label: "Estado", type: "select", options: ["activo", "inactivo"] },
          { name: "producto_id", label: "Producto", type: "select", options: productos },
          { name: "dia_semana", label: "Día de la Semana", type: "select", options: ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"] },
        ];
      case "suscripcion":
        return [
          { name: "nombre", label: "Nombre", type: "text", required: true },
          { name: "descripcion", label: "Descripción", type: "textarea" },
          { name: "precio", label: "Precio", type: "number", required: true },
          { name: "planes", label: "Planes", type: "checkboxes", options: ["mensual", "trimestral", "semestral"], required: true },
          { name: "estado", label: "Estado", type: "select", options: ["activo", "inactivo"] },
          { name: "producto_id", label: "Producto", type: "select", options: productos },
        ];
      default:
        return baseFields;
    }
  };

  const fields: Field[] = getFields();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[calc(100vh-4rem)] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>
            {item ? `Editar ${tipo}` : `Crear ${tipo}`}
          </DialogTitle>
          <DialogDescription>
            Completa los campos para {item ? "actualizar" : "crear"} un {tipo}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 overflow-y-auto max-h-[calc(100vh-16rem)] space-y-4 scrollbar-hide">
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded space-y-1">
              {error.split("\n").map((msg, i) => (
                <p key={i}>• {msg}</p>
              ))}
            </div>
          )}

          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </Label>
              {field.type === "textarea" ? (
                <Textarea
                  id={field.name}
                  value={(form[field.name] as string) || ""}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    handleChange(field.name, e.target.value)
                  }
                  placeholder={field.label}
                />
              ) : field.type === "select" ? (
                <select
                  id={field.name}
                  value={(form[field.name] as string | number) || ""}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    handleChange(field.name, (field.name === "producto_id" || field.name === "proveedor_id") ? (e.target.value ? Number(e.target.value) : null) : e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-md"
                  aria-label={field.label}
                >
                  <option value="">Seleccionar...</option>
                  {field.options?.map((opt) => {
                    if (typeof opt === "string") {
                      return (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      );
                    } else {
                      return (
                        <option key={opt.id} value={opt.id}>
                          {opt.nombre}
                        </option>
                      );
                    }
                  })}
                </select>
              ) : field.type === "checkboxes" ? (
                <div className="space-y-2">
                  {field.options?.map((opt) => {
                    if (typeof opt === "string") {
                      const isChecked = Array.isArray(form[field.name]) && (form[field.name] as string[]).includes(opt);
                      return (
                        <label key={opt} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const currentArray = (form[field.name] as string[]) || [];
                              if (e.target.checked) {
                                handleChange(field.name, [...currentArray, opt]);
                              } else {
                                handleChange(field.name, currentArray.filter((item) => item !== opt));
                              }
                            }}
                            className="w-4 h-4"
                          />
                          <span className="capitalize">{opt}</span>
                        </label>
                      );
                    }
                    return null;
                  })}
                </div>
              ) : field.name === "precio" ? (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                  <Input
                    id={field.name}
                    type="text"
                    value={(form[field.name] as string | number) || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      let valor = e.target.value.replace(/[^0-9.]/g, "");
                      const partes = valor.split(".");
                      
                      // Permitir solo un punto decimal
                      if (partes.length > 2) {
                        valor = partes[0] + "." + partes.slice(1).join("");
                      }
                      
                      // Limitar a 2 decimales
                      if (partes.length === 2 && partes[1].length > 2) {
                        valor = partes[0] + "." + partes[1].substring(0, 2);
                      }
                      
                      // Guardar como string para no perder el punto decimal mientras se escribe
                      handleChange(field.name, valor);
                    }}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      // Permitir: números, punto, Backspace, Delete, Tab, flechas, Ctrl+C, Ctrl+V, Ctrl+X
                      const permitidos = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', 'Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
                      if (!permitidos.includes(e.key) && !(e.ctrlKey && ['c', 'v', 'x'].includes(e.key.toLowerCase()))) {
                        e.preventDefault();
                      }
                    }}
                    placeholder="0.00"
                    required={field.required}
                    className="pl-7"
                  />
                </div>
              ) : field.name === "telefono" ? (
                <Input
                  id={field.name}
                  type="tel"
                  value={(form[field.name] as string | number) || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const valor = e.target.value.replace(/[^0-9+\-() ]/g, "");
                    handleChange(field.name, valor);
                  }}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    const permitidos = /[0-9+\-() ]|Backspace|Delete|Tab/;
                    if (!permitidos.test(e.key)) e.preventDefault();
                  }}
                  placeholder={field.label}
                  required={field.required}
                />
              ) : field.name === "stock" || field.name === "stock_minimo" ? (
                <Input
                  id={field.name}
                  type="text"
                  value={(form[field.name] as string | number) || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const valor = e.target.value.replace(/[^0-9]/g, "");
                    handleChange(field.name, valor ? Number(valor) : "");
                  }}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    const permitidos = /[0-9]|Backspace|Delete|Tab|ArrowLeft|ArrowRight|ArrowUp|ArrowDown/;
                    if (!permitidos.test(e.key) && !(e.ctrlKey && ['c', 'v', 'x'].includes(e.key.toLowerCase()))) {
                      e.preventDefault();
                    }
                  }}
                  placeholder={field.label}
                  required={field.required}
                />
              ) : (
                <Input
                  id={field.name}
                  type={field.type}
                  value={(form[field.name] as string | number) || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange(
                      field.name,
                      field.type === "number" ? Number(e.target.value) : e.target.value
                    )
                  }
                  placeholder={field.label}
                  required={field.required}
                />
              )}
            </div>
          ))}
        </div>

        <DialogFooter className="px-6 pb-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {item ? "Actualizar" : "Crear"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
