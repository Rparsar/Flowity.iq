import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart, Users } from "lucide-react";

const stats = [
  {
    title: "Ingresos Totales",
    value: "€24,580",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    description: "vs mes anterior",
  },
  {
    title: "Ventas",
    value: "1,429",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingCart,
    description: "vs mes anterior",
  },
  {
    title: "Productos en Stock",
    value: "847",
    change: "-3.1%",
    trend: "down",
    icon: Package,
    description: "12 productos bajos",
  },
  {
    title: "Nuevos Clientes",
    value: "156",
    change: "+24.3%",
    trend: "up",
    icon: Users,
    description: "vs mes anterior",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Resumen general de tu negocio
          </p>
        </div>
        <Button>Exportar Reporte</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;
          
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendIcon className={`h-3 w-3 ${stat.trend === "up" ? "text-success" : "text-destructive"}`} />
                  <span className={`text-xs ${stat.trend === "up" ? "text-success" : "text-destructive"}`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-muted-foreground">{stat.description}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Ventas Recientes</CardTitle>
            <CardDescription>Últimas transacciones realizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                      <ShoppingCart className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Venta #{1000 + i}</p>
                      <p className="text-xs text-muted-foreground">Producto {i} x {i + 1}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">€{(i * 45.99).toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Hace {i}h</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Alertas de Inventario</CardTitle>
            <CardDescription>Productos con stock bajo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Laptop HP ProBook", stock: 3, min: 10 },
                { name: "Monitor 27\" 4K", stock: 5, min: 15 },
                { name: "Teclado Mecánico", stock: 2, min: 8 },
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Mínimo: {item.min} unidades
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center rounded-full bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive">
                      {item.stock} restantes
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
