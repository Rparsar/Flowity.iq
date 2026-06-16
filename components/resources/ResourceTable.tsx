"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit2, Trash2, Plus } from "lucide-react";
import { RecursoTipo, Recurso } from "@/lib/types";

interface Column {
  key: string;
  label: string;
}

interface ResourceTableProps {
  tipo: RecursoTipo;
  datos: Recurso[];
  loading: boolean;
  onEdit: (item: Recurso) => void;
  onDelete: (id: number) => void;
  onNew: () => void;
}

export function ResourceTable({
  tipo,
  datos,
  loading,
  onEdit,
  onDelete,
  onNew,
}: ResourceTableProps) {
  const [search, setSearch] = useState("");

  const filtrados = datos.filter((item) =>
    item.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const getColumns = (): Column[] => {
    switch (tipo) {
      case "producto":
        return [
          { key: "nombre", label: "Nombre" },
          { key: "sku", label: "SKU" },
          { key: "categoria", label: "Categoría" },
          { key: "precio", label: "Precio" },
          { key: "stock", label: "Stock" },
        ];
      case "servicio":
        return [
          { key: "nombre", label: "Nombre" },
          { key: "descripcion", label: "Descripción" },
          { key: "precio", label: "Precio" },
        ];
      case "reserva":
        return [
          { key: "nombre", label: "Nombre" },
          { key: "descripcion", label: "Descripción" },
          { key: "precio", label: "Precio" },
        ];
      case "encargo":
        return [
          { key: "nombre", label: "Nombre" },
          { key: "descripcion", label: "Descripción" },
          { key: "precio", label: "Precio" },
        ];
      default:
        return [
          { key: "nombre", label: "Nombre" },
          { key: "precio", label: "Precio" },
        ];
    }
  };

  const columns = getColumns();

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={onNew} className="ml-auto">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key}>
                  {col.label}
                </TableHead>
              ))}
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtrados.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="text-center py-8 text-muted-foreground"
                >
                  No hay registros
                </TableCell>
              </TableRow>
            ) : (
              filtrados.map((item) => (
                <TableRow key={item.id}>
                  {columns.map((col) => {
                    const value = item[col.key as keyof Recurso];
                    let displayValue: string;
                    if (col.key === "precio") {
                      const numValue = typeof value === "number" ? value : Number(value);
                      if (!isNaN(numValue)) {
                        displayValue = numValue.toLocaleString("es-ES", {
                          style: "currency",
                          currency: "EUR",
                        });
                      } else {
                        displayValue = String(value ?? "-");
                      }
                    } else {
                      displayValue = String(value ?? "-").substring(0, 50);
                    }
                    return (
                      <TableCell key={col.key}>
                        {displayValue}
                      </TableCell>
                    );
                  })}
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(item)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
