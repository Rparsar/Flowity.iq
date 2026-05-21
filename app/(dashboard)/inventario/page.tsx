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
import { Package, Search, Plus, ArrowUpDown } from "lucide-react";

const products = [
  { id: 1, name: "Laptop HP ProBook", category: "Electrónica", stock: 12, minStock: 5, price: 899.99, status: "normal" },
  { id: 2, name: "Monitor 27\" 4K", category: "Electrónica", stock: 3, minStock: 10, price: 349.99, status: "low" },
  { id: 3, name: "Teclado Mecánico RGB", category: "Accesorios", stock: 25, minStock: 10, price: 89.99, status: "normal" },
  { id: 4, name: "Mouse Inalámbrico", category: "Accesorios", stock: 45, minStock: 20, price: 29.99, status: "normal" },
  { id: 5, name: "Webcam HD", category: "Electrónica", stock: 2, minStock: 8, price: 59.99, status: "critical" },
  { id: 6, name: "Auriculares Bluetooth", category: "Audio", stock: 18, minStock: 10, price: 79.99, status: "normal" },
];

export default function InventarioPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventario</h1>
          <p className="text-muted-foreground mt-1">
            Gestión de productos y control de stock
          </p>
        </div>
        <Button>
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
            <div className="text-2xl font-bold">847</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Valor en Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€156,420</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Stock Bajo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Categorías</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
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
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar producto..." className="pl-8 w-[300px]" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead className="cursor-pointer">
                  <div className="flex items-center gap-1">
                    Stock
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                        <Package className="h-4 w-4" />
                      </div>
                      {product.name}
                    </div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>€{product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    {product.status === "normal" && (
                      <Badge variant="secondary" className="bg-success/10 text-success">Normal</Badge>
                    )}
                    {product.status === "low" && (
                      <Badge variant="secondary" className="bg-warning/10 text-warning">Bajo</Badge>
                    )}
                    {product.status === "critical" && (
                      <Badge variant="destructive">Crítico</Badge>
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
