"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { RecursoTipo, Recurso } from "@/lib/types";
import { ResourceTable } from "@/components/resources/ResourceTable";
import { ResourceForm } from "@/components/resources/ResourceForm";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function RecursoPage() {
  const params = useParams();
  const tipo = (params?.tipo as RecursoTipo) || "producto";

  const [datos, setDatos] = useState<Recurso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Recurso | null>(null);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError("");
      let response;

      switch (tipo) {
        case "servicio":
          response = await api.getServicios();
          break;
        case "reserva":
          response = await api.getReservas();
          break;
        case "encargo":
          response = await api.getEncargos();
          break;
        case "producto":
        default:
          response = await api.getProductos();
      }

      const key = `${tipo}s`;
      setDatos((response as Record<string, Recurso[]>)[key] || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [tipo]);

  const handleEdit = (item: Recurso) => {
    setSelectedItem(item);
    setFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este registro?")) return;

    try {
      switch (tipo) {
        case "servicio":
          await api.eliminarServicio(id);
          break;
        case "reserva":
          await api.eliminarReserva(id);
          break;
        case "encargo":
          await api.eliminarEncargo(id);
          break;
        case "producto":
        default:
          await api.eliminarProducto(id);
      }
      cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar");
    }
  };

  const handleNew = () => {
    setSelectedItem(null);
    setFormOpen(true);
  };

  const handleSave = async (data: Record<string, unknown>) => {
    try {
      if (selectedItem?.id) {
        switch (tipo) {
          case "servicio":
            await api.actualizarServicio(selectedItem.id, data);
            break;
          case "reserva":
            await api.actualizarReserva(selectedItem.id, data);
            break;
          case "encargo":
            await api.actualizarEncargo(selectedItem.id, data);
            break;
          case "producto":
          default:
            await api.actualizarProducto(selectedItem.id, data);
        }
      } else {
        switch (tipo) {
          case "servicio":
            await api.crearServicio(data);
            break;
          case "reserva":
            await api.crearReserva(data);
            break;
          case "encargo":
            await api.crearEncargo(data);
            break;
          case "producto":
          default:
            await api.crearProducto(data);
        }
      }
      cargarDatos();
    } catch (err) {
      throw err instanceof Error ? err : new Error("Error al guardar");
    }
  };

  const titulo = tipo.charAt(0).toUpperCase() + tipo.slice(1);

  if (loading) return <LoadingSpinner text={`Cargando ${titulo}s...`} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{titulo}s</h1>
        <p className="text-muted-foreground mt-1">
          Gestiona todos tus {titulo}s
        </p>
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-md">
          {error}
        </p>
      )}

      <ResourceTable
        tipo={tipo}
        datos={datos}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onNew={handleNew}
      />

      <ResourceForm
        tipo={tipo}
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelectedItem(null);
        }}
        onSave={handleSave}
        item={selectedItem}
      />
    </div>
  );
}
