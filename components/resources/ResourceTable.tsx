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
  onDetail: (item: Recurso) => void;
  onEdit: (item: Recurso) => void;
  onDelete: (item: Recurso) => void;
  onNew: () => void;
}

export function ResourceTable({
  tipo,
  datos,
  loading,
  onDetail,
  onEdit,
  onDelete,
  onNew,
}: ResourceTableProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filtrados = datos.filter((item) =>
    item.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtrados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDatos = filtrados.slice(startIndex, endIndex);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

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
          { key: "producto", label: "Producto" },
          { key: "dia_semana", label: "Día Semana" },
        ];
      case "suscripcion":
        return [
          { key: "nombre", label: "Nombre" },
          { key: "descripcion", label: "Descripción" },
          { key: "precio", label: "Precio" },
          { key: "planes", label: "Planes" },
          { key: "producto", label: "Producto" },
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
          onChange={(e) => handleSearchChange(e.target.value)}
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
              paginatedDatos.map((item) => (
                <TableRow
                  key={item.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => onDetail(item)}
                >
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
                    } else if (col.key === "planes") {
                      const planesArray = value as string[] | undefined;
                      displayValue = planesArray?.join(', ') || '-';
                    } else if (col.key === "producto") {
                      const rel = (item as unknown as Record<string, unknown>)["producto"] as { nombre?: string } | null;
                      displayValue = rel?.nombre ?? "-";
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
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(item);
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item);
                      }}
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
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-6 border-t">
          <div className="text-sm text-muted-foreground">
            Mostrando {startIndex + 1} a {Math.min(endIndex, filtrados.length)} de {filtrados.length} registros
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-10 h-10 p-0"
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
