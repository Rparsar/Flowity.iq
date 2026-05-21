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
import { Plus, ShoppingCart, TrendingUp, Calendar, Download } from "lucide-react";

const sales = [
  { id: "V-2024-001", date: "2024-01-15", customer: "Cliente A", items: 3, total: 245.99, status: "completed" },
  { id: "V-2024-002", date: "2024-01-14", customer: "Cliente B", items: 1, total: 89.99, status: "completed" },
  { id: "V-2024-003", date: "2024-01-14", customer: "Cliente C", items: 5, total: 567.50, status: "pending" },
  { id: "V-2024-004", date: "2024-01-13", customer: "Cliente D", items: 2, total: 178.00, status: "completed" },
  { id: "V-2024-005", date: "2024-01-12", customer: "Cliente E", items: 4, total: 432.25, status: "cancelled" },
];

export default function VentasPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ventas</h1>
          <p className="text-muted-foreground mt-1">
            Registro y seguimiento de ventas
          </p>
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Ventas Hoy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,429</div>
            <p className="text-xs text-muted-foreground">+8.2% vs ayer</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ingresos Hoy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€3,456.80</div>
            <p className="text-xs text-muted-foreground">+12.5% vs ayer</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ticket Medio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€87.50</div>
            <p className="text-xs text-muted-foreground">+3.2% vs mes anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ventas Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">8</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Ventas</CardTitle>
          <CardDescription>Últimas transacciones registradas</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Venta</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Productos</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">{sale.id}</TableCell>
                  <TableCell>{sale.date}</TableCell>
                  <TableCell>{sale.customer}</TableCell>
                  <TableCell>{sale.items} items</TableCell>
                  <TableCell>€{sale.total.toFixed(2)}</TableCell>
                  <TableCell>
                    {sale.status === "completed" && (
                      <Badge className="bg-success/10 text-success hover:bg-success/20">Completada</Badge>
                    )}
                    {sale.status === "pending" && (
                      <Badge className="bg-warning/10 text-warning hover:bg-warning/20">Pendiente</Badge>
                    )}
                    {sale.status === "cancelled" && (
                      <Badge variant="destructive">Cancelada</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
