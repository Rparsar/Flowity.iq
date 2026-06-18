"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart, Users, Download } from "lucide-react";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { SalesLineChart } from "@/components/charts/SalesLineChart";

interface Kpis {
  ingresos_totales: number;
  ingresos_cambio: number;
  ventas_totales: number;
  ventas_cambio: number;
  productos_stock: number;
  stock_bajo: number;
  clientes_nuevos: number;
  clientes_cambio: number;
}

interface VentaHistorica {
  fecha: string;
  ventas: number;
  pedidos: number;
}

interface AlertaStock {
  id: number;
  nombre: string;
  stock: number;
  stock_minimo: number;
  estado_alerta: 'critico' | 'bajo';
}

interface UltimaVenta {
  id: number;
  codigo: string;
  cliente: string;
  total: number;
  fecha: string;
}

interface DashboardData {
  kpis: Kpis;
  ventas_historicas: VentaHistorica[];
  ventas_semanales: VentaHistorica[];
  alertas_stock: AlertaStock[];
  ultimas_ventas: UltimaVenta[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [printMode, setPrintMode] = useState(false);

  useEffect(() => {
    api
      .getDashboard()
      .then((d) => setData(d as DashboardData))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handlePrint = () => {
    setPrintMode(true);
    setTimeout(() => {
      window.print();
      setTimeout(() => setPrintMode(false), 100);
    }, 100);
  };

  if (loading) return <LoadingSpinner text="Cargando dashboard..." />;
  if (error)
    return (
      <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-md">
        Error: {error}
      </p>
    );
  if (!data) return null;

  const { kpis, ventas_semanales, alertas_stock, ultimas_ventas } = data;

  const stats = [
    {
      title: "Ingresos Totales",
      value: `€${Number(kpis.ingresos_totales).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: `${kpis.ingresos_cambio >= 0 ? "+" : ""}${kpis.ingresos_cambio}%`,
      trend: kpis.ingresos_cambio >= 0 ? "up" : "down",
      icon: DollarSign,
      description: "vs mes anterior",
    },
    {
      title: "Ventas",
      value: kpis.ventas_totales.toLocaleString(),
      change: `${kpis.ventas_cambio >= 0 ? "+" : ""}${kpis.ventas_cambio}%`,
      trend: kpis.ventas_cambio >= 0 ? "up" : "down",
      icon: ShoppingCart,
      description: "vs mes anterior",
    },
    {
      title: "Productos en Stock",
      value: kpis.productos_stock.toLocaleString(),
      change: `${kpis.stock_bajo} bajos`,
      trend: kpis.stock_bajo > 0 ? "down" : "up",
      icon: Package,
      description: "productos con stock bajo",
    },
    {
      title: "Nuevos Clientes",
      value: kpis.clientes_nuevos.toLocaleString(),
      change: `${kpis.clientes_cambio >= 0 ? "+" : ""}${kpis.clientes_cambio}%`,
      trend: kpis.clientes_cambio >= 0 ? "up" : "down",
      icon: Users,
      description: "vs mes anterior",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Resumen general de tu negocio
          </p>
        </div>
        <Button variant="outline" onClick={handlePrint} className="no-print">
          <Download className="mr-2 h-4 w-4" />
          Exportar Reporte
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 print-break-avoid">
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 print-break-avoid">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Evolución de Ventas</CardTitle>
            <CardDescription>Últimas 4 semanas</CardDescription>
          </CardHeader>
          <CardContent>
            {ventas_semanales.length > 0 ? (
              <SalesLineChart data={ventas_semanales} />
            ) : (
              <p className="text-sm text-muted-foreground py-8 text-center">Sin datos históricos</p>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Alertas de Inventario</CardTitle>
            <CardDescription>{alertas_stock.length} productos con alertas</CardDescription>
          </CardHeader>
          <CardContent>
            {alertas_stock.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">Sin alertas de stock</p>
            ) : (
              <div className="space-y-3">
                {alertas_stock.slice(0, 5).map((item) => {
                  const isCritico = item.estado_alerta === 'critico';
                  const bgColor = isCritico ? 'bg-red-50 hover:bg-red-100' : 'bg-yellow-50 hover:bg-yellow-100';
                  const badgeBg = isCritico ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700';
                  const badgeText = isCritico ? 'Crítico' : 'Bajo';
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => router.push(`/recursos/producto?edit=${item.id}`)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${bgColor} cursor-pointer`}
                    >
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900">{item.nombre}</p>
                        <p className="text-xs text-gray-600">Mínimo: {item.stock_minimo} unidades</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${badgeBg}`}>
                          {item.stock} restantes
                        </span>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${badgeBg}`}>
                          {badgeText}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="print-break-avoid">
        <CardHeader>
          <CardTitle>Ventas Recientes</CardTitle>
          <CardDescription>Últimas transacciones realizadas</CardDescription>
        </CardHeader>
        <CardContent>
          {ultimas_ventas.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No hay ventas registradas</p>
          ) : (
            <div className="space-y-4">
              {ultimas_ventas.map((venta) => (
                <div key={venta.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                      <ShoppingCart className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{venta.codigo}</p>
                      <p className="text-xs text-muted-foreground">{venta.cliente}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">€{Number(venta.total).toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(venta.fecha).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
