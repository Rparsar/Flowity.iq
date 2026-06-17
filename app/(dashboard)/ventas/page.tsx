"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Download } from "lucide-react";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

interface Venta {
  id: number;
  codigo: string;
  fecha: string;
  cliente: string;
  total: number;
  estado: string;
  detalles?: { id: number }[];
}

interface VentasResponse {
  total: number;
  ventas: Venta[];
}

interface Estadisticas {
  total_ventas: number;
  total_ingresos: number;
  completadas: number;
  pendientes: number;
  ticket_medio: number;
}

export default function VentasPage() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [stats, setStats] = useState<Estadisticas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchData = () => {
    setLoading(true);
    Promise.all([api.getVentas(), api.getEstadisticasVentas()])
      .then(([v, s]) => {
        setVentas((v as VentasResponse).ventas ?? []);
        setStats(s as Estadisticas);
        setCurrentPage(1);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const totalPages = Math.ceil(ventas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedVentas = ventas.slice(startIndex, endIndex);

  if (loading) return <LoadingSpinner text="Cargando ventas..." />;
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
          <h1 className="text-3xl font-bold tracking-tight">Ventas</h1>
          <p className="text-muted-foreground mt-1">Registro y seguimiento de ventas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Venta
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Ventas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_ventas ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ingresos Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{Number(stats?.total_ingresos ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ticket Medio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{Number(stats?.ticket_medio ?? 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${(stats?.pendientes ?? 0) > 0 ? "text-warning" : ""}`}>
              {stats?.pendientes ?? 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Ventas</CardTitle>
          <CardDescription>{ventas.length} transacciones registradas</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Venta</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ventas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No hay ventas registradas
                  </TableCell>
                </TableRow>
              ) : (
                paginatedVentas.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.codigo}</TableCell>
                    <TableCell>{new Date(sale.fecha).toLocaleDateString("es-ES")}</TableCell>
                    <TableCell>{sale.cliente}</TableCell>
                    <TableCell>€{Number(sale.total).toFixed(2)}</TableCell>
                    <TableCell>
                      {sale.estado === "completada" && (
                        <Badge className="bg-success/10 text-success hover:bg-success/20">Completada</Badge>
                      )}
                      {sale.estado === "pendiente" && (
                        <Badge className="bg-warning/10 text-warning hover:bg-warning/20">Pendiente</Badge>
                      )}
                      {sale.estado === "cancelada" && (
                        <Badge variant="destructive">Cancelada</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t">
              <div className="text-sm text-muted-foreground">
                Mostrando {startIndex + 1} a {Math.min(endIndex, ventas.length)} de {ventas.length} ventas
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
        </CardContent>
      </Card>
    </div>
  );
}
