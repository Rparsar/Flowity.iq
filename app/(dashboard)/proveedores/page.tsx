"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Phone, Mail, Plus, Truck, Pencil, Trash2 } from "lucide-react";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ProveedorModal } from "@/components/modals/ProveedorModal";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";

interface Proveedor {
  id: number;
  nombre: string;
  contacto?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  estado: string;
}

interface ApiResponse {
  proveedores: Proveedor[];
}

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editProveedor, setEditProveedor] = useState<Proveedor | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Proveedor | null>(null);

  const fetchProveedores = () => {
    setLoading(true);
    api
      .getProveedores()
      .then((r) => setProveedores((r as ApiResponse).proveedores ?? []))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProveedores(); }, []);

  const activos = proveedores.filter((p) => p.estado === "activo").length;

  const handleEdit = (p: Proveedor) => {
    setEditProveedor(p);
    setModalOpen(true);
  };

  const handleNew = () => {
    setEditProveedor(null);
    setModalOpen(true);
  };

  const handleDelete = (supplier: Proveedor) => {
    setItemToDelete(supplier);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete?.id) return;

    setDeletingId(itemToDelete.id);
    try {
      await api.eliminarProveedor(itemToDelete.id);
      setDeleteModalOpen(false);
      setItemToDelete(null);
      fetchProveedores();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Error al eliminar");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <LoadingSpinner text="Cargando proveedores..." />;
  if (error)
    return (
      <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-md">
        Error: {error}
      </p>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Proveedores</h1>
          <p className="text-muted-foreground mt-1">Gestión de proveedores y asociación de productos</p>
        </div>
        <Button onClick={handleNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Proveedor
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Proveedores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{proveedores.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{activos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inactivos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">{proveedores.length - activos}</div>
          </CardContent>
        </Card>
      </div>

      {proveedores.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No hay proveedores registrados
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {proveedores.map((supplier) => (
            <Card key={supplier.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                        {supplier.nombre.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{supplier.nombre}</CardTitle>
                      {supplier.contacto && (
                        <CardDescription>{supplier.contacto}</CardDescription>
                      )}
                    </div>
                  </div>
                  <Badge variant={supplier.estado === "activo" ? "default" : "secondary"}>
                    {supplier.estado === "activo" ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {supplier.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{supplier.email}</span>
                    </div>
                  )}
                  {supplier.telefono && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{supplier.telefono}</span>
                    </div>
                  )}
                  {supplier.direccion && (
                    <div className="flex items-center gap-2 text-sm">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <span>{supplier.direccion}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(supplier)}>
                    <Pencil className="mr-1 h-3.5 w-3.5" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(supplier)}
                    disabled={deletingId === supplier.id}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ProveedorModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={fetchProveedores}
        proveedor={editProveedor}
      />

      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar proveedor?"
        description="Esta acción no se puede deshacer. El proveedor se eliminará permanentemente."
        itemName={itemToDelete?.nombre}
        loading={deletingId !== null}
      />
    </div>
  );
}
