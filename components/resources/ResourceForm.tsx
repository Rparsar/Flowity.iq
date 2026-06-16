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
import { RecursoTipo, Recurso } from "@/lib/types";

interface Field {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[];
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

  useEffect(() => {
    if (open) {
      if (item) {
        // Filtrar campos de sistema antes de cargar el formulario
        const { id, created_at, updated_at, ...editable } = item as Record<string, unknown>;
        setForm(editable);
      } else {
        setForm({});
      }
      setError("");
    }
  }, [open, item]);

  const handleChange = (field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
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

      // Preparar datos con fechas formateadas (Reservas y Suscripciones)
      const preparedData: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(form)) {
        if (key === "fecha_inicio" || key === "fecha_fin" || key === "fecha_proximo_pago" || key === "fecha") {
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
        ];
      default:
        return baseFields;
    }
  };

  const fields: Field[] = getFields();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {item ? `Editar ${tipo}` : `Crear ${tipo}`}
          </DialogTitle>
          <DialogDescription>
            Completa los campos para {item ? "actualizar" : "crear"} un {tipo}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
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
                  value={(form[field.name] as string) || ""}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    handleChange(field.name, e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-md"
                  aria-label={field.label}
                >
                  <option value="">Seleccionar...</option>
                  {field.options?.map((opt: string) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : field.name === "precio" ? (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                  <Input
                    id={field.name}
                    type="text"
                    value={(form[field.name] as string | number) || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const valor = e.target.value.replace(/[^0-9.]/g, "");
                      const partes = valor.split(".");
                      const limpio = partes.length > 2 ? partes[0] + "." + partes.slice(1).join("") : valor;
                      handleChange(field.name, limpio === "" ? "" : Number(limpio));
                    }}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      const permitidos = /[0-9.]|Backspace|Delete|Tab/;
                      if (!permitidos.test(e.key)) e.preventDefault();
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

        <DialogFooter>
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
