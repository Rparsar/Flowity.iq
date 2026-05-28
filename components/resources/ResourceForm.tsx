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
        setForm({ ...item } as Record<string, unknown>);
      } else {
        setForm({});
      }
      setError("");
    }
  }, [open, item]);

  const handleChange = (field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");
      await onSave(form);
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
          { name: "cliente", label: "Cliente", type: "text", required: true },
          { name: "email", label: "Email", type: "email", required: true },
          { name: "telefono", label: "Teléfono", type: "text", required: true },
          { name: "precio", label: "Precio", type: "number" },
          { name: "fecha_inicio", label: "Fecha Inicio", type: "datetime-local" },
          { name: "fecha_fin", label: "Fecha Fin", type: "datetime-local" },
          { name: "estado", label: "Estado", type: "select", options: ["activo", "inactivo"] },
        ];
      case "encargo":
        return [
          { name: "nombre", label: "Nombre", type: "text", required: true },
          { name: "cliente", label: "Cliente", type: "text", required: true },
          { name: "email", label: "Email", type: "email", required: true },
          { name: "telefono", label: "Teléfono", type: "text", required: true },
          { name: "precio", label: "Precio", type: "number" },
          { name: "descripcion", label: "Descripción", type: "textarea" },
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
            <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded">
              {error}
            </p>
          )}

          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>{field.label}</Label>
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
