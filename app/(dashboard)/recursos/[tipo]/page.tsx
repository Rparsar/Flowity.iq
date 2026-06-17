"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { RecursoTipo, Recurso } from "@/lib/types";
import { ResourceTable } from "@/components/resources/ResourceTable";
import { ResourceForm } from "@/components/resources/ResourceForm";
import { DetailModal } from "@/components/modals/DetailModal";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

// Mapeo explícito de tipos a keys de respuesta API
const RESPONSE_KEY: Record<RecursoTipo, string> = {
  producto: "productos",
  servicio: "servicios",
  reserva: "reservas",
  encargo: "encargos",
};

export default function RecursoPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const tipo = (params?.tipo as RecursoTipo) || "producto";
  const editId = searchParams?.get("edit");

  const [datos, setDatos] = useState<Recurso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Recurso | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedDetailId, setSelectedDetailId] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Recurso | null>(null);
  const [deleting, setDeleting] = useState(false);

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

      const key = RESPONSE_KEY[tipo];
      const loadedData = (response as Record<string, Recurso[]>)[key] || [];
      setDatos(loadedData);

      // Si hay un parámetro edit, buscar el producto y abrir la modal
      if (editId) {
        const itemToEdit = loadedData.find((item) => item.id === parseInt(editId));
        if (itemToEdit) {
          setSelectedItem(itemToEdit);
          setFormOpen(true);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [tipo, editId]);

  const handleDetail = (item: Recurso) => {
    setSelectedDetailId(item.id);
    setDetailModalOpen(true);
  };

  const handleEdit = (item: Recurso) => {
    setSelectedItem(item);
    setFormOpen(true);
  };

  const handleDelete = (item: Recurso) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete?.id) return;

    setDeleting(true);
    try {
      switch (tipo) {
        case "servicio":
          await api.eliminarServicio(itemToDelete.id);
          break;
        case "reserva":
          await api.eliminarReserva(itemToDelete.id);
          break;
        case "encargo":
          await api.eliminarEncargo(itemToDelete.id);
          break;
        case "producto":
        default:
          await api.eliminarProducto(itemToDelete.id);
      }
      setDeleteModalOpen(false);
      setItemToDelete(null);
      cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar");
    } finally {
      setDeleting(false);
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
        onDetail={handleDetail}
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

      <DetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        tipo={tipo}
        itemId={selectedDetailId}
      />

      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title={`¿Eliminar ${tipo}?`}
        description={`Esta acción no se puede deshacer. El ${tipo} se eliminará permanentemente.`}
        itemName={itemToDelete?.nombre}
        loading={deleting}
      />
    </div>
  );
}
