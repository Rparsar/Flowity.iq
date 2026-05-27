"use client";

import { useEffect, useState, useMemo } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ProductoModal } from "@/components/modals/ProductoModal";

interface Producto {
  id: number;
  nombre: string;
  sku: string;
  categoria: string;
  precio: number;
  stock: number;
  stock_minimo: number;
  estado: string;
  proveedor_id?: number | null;
  descripcion?: string;
}

interface ApiResponse {
  productos: Producto[];
}

function stockStatus(p: Producto) {
  if (p.stock === 0) return "critical";
  if (p.stock < p.stock_minimo) return "low";
  return "normal";
}

export default function InventarioPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editProducto, setEditProducto] = useState<Producto | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchProductos = () => {
    setLoading(true);
    api
      .getProductos()
      .then((r) => setProductos((r as ApiResponse).productos ?? []))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProductos(); }, []);

  const filtered = useMemo(
    () =>
      productos.filter(
        (p) =>
          p.nombre.toLowerCase().includes(search.toLowerCase()) ||
          p.categoria.toLowerCase().includes(search.toLowerCase())
      ),
    [productos, search]
  );

  const totalValor = productos.reduce((acc, p) => acc + Number(p.precio) * Number(p.stock), 0);
  const stockBajo = productos.filter((p) => stockStatus(p) !== "normal").length;
  const categorias = new Set(productos.map((p) => p.categoria)).size;

  const handleEdit = (p: Producto) => {
    setEditProducto(p);
    setModalOpen(true);
  };

  const handleNew = () => {
    setEditProducto(null);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este producto?")) return;
    setDeletingId(id);
    try {
      await api.eliminarProducto(id);
      fetchProductos();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Error al eliminar");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <LoadingSpinner text="Cargando inventario..." />;
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
          <h1 className="text-3xl font-bold tracking-tight">Inventario</h1>
          <p className="text-muted-foreground mt-1">Gestión de productos y control de stock</p>
        </div>
        <Button onClick={handleNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productos.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Valor en Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{totalValor.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Stock Bajo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stockBajo > 0 ? "text-destructive" : ""}`}>
              {stockBajo}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Categorías</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categorias}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Productos</CardTitle>
              <CardDescription>Listado de todos los productos en inventario</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar producto..."
                className="pl-8 w-[280px]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No se encontraron productos
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((product) => {
                  const status = stockStatus(product);
                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                            <Package className="h-4 w-4" />
                          </div>
                          {product.nombre}
                        </div>
                      </TableCell>
                      <TableCell>{product.categoria}</TableCell>
                      <TableCell>
                        <span className={product.stock < product.stock_minimo ? "text-destructive font-medium" : ""}>
                          {product.stock}
                        </span>
                        <span className="text-xs text-muted-foreground ml-1">/ mín {product.stock_minimo}</span>
                      </TableCell>
                      <TableCell>€{Number(product.precio).toFixed(2)}</TableCell>
                      <TableCell>
                        {status === "normal" && (
                          <Badge variant="secondary" className="bg-success/10 text-success">Normal</Badge>
                        )}
                        {status === "low" && (
                          <Badge variant="secondary" className="bg-warning/10 text-warning">Bajo</Badge>
                        )}
                        {status === "critical" && (
                          <Badge variant="destructive">Crítico</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(product)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(product.id)}
                            disabled={deletingId === product.id}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ProductoModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={fetchProductos}
        producto={editProducto}
      />
    </div>
  );
}
