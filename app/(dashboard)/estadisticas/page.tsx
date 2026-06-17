"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, ShoppingCart, Package, BarChart3 } from "lucide-react";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { MonthlySalesBarChart } from "@/components/charts/MonthlySalesBarChart";
import { SalesPieChart } from "@/components/charts/SalesPieChart";

type Periodo = "mensual" | "semanal" | "diario";

interface Kpis {
  ingresos_totales: number;
  ventas_totales: number;
  productos_stock: number;
  stock_bajo: number;
}

interface Estadisticas {
  total_ventas: number;
  total_ingresos: number;
  completadas: number;
  pendientes: number;
  ticket_medio: number;
}

interface VentaHistorica {
  fecha: string;
  ventas: number;
  pedidos: number;
}

interface GraficaData {
  mensual: VentaHistorica[];
  semanal: VentaHistorica[];
  diario: VentaHistorica[];
}

interface DashboardData {
  kpis: Kpis;
  ventas_historicas: VentaHistorica[];
}

const PERIODOS: { key: Periodo; label: string }[] = [
  { key: "mensual", label: "Mes" },
  { key: "semanal", label: "Semana" },
  { key: "diario",  label: "Día" },
];

const DESCRIPCIONES: Record<Periodo, string> = {
  mensual: "Últimos 12 meses",
  semanal: "Últimas 4 semanas",
  diario:  "Últimos 30 días",
};

export default function EstadisticasPage() {
  const [dashData, setDashData] = useState<DashboardData | null>(null);
  const [graficaData, setGraficaData] = useState<GraficaData | null>(null);
  const [stats, setStats] = useState<Estadisticas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [periodo, setPeriodo] = useState<Periodo>("mensual");

  useEffect(() => {
    Promise.all([api.getDashboard(), api.getEstadisticasVentas(), api.getGraficaEvolucion()])
      .then(([d, s, g]) => {
        setDashData(d as DashboardData);
        setStats(s as Estadisticas);
        setGraficaData(g as GraficaData);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Cargando estadísticas..." />;
  if (error)
    return (
      <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-md">
        Error: {error}
      </p>
    );

  const kpis = dashData?.kpis;
  const chartData = graficaData ? graficaData[periodo] : [];

  const pieData = stats
    ? [
        { name: "Completadas", value: stats.completadas },
        { name: "Pendientes", value: stats.pendientes },
        { name: "Canceladas", value: stats.total_ventas - stats.completadas - stats.pendientes },
      ].filter((d) => d.value > 0)
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Estadísticas</h1>
        <p className="text-muted-foreground mt-1">Análisis detallado del rendimiento de tu negocio</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Ingresos Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{Number(kpis?.ingresos_totales ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Ticket Medio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{Number(stats?.ticket_medio ?? 0).toFixed(2)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-success" />
              <span className="text-xs text-muted-foreground">sobre ventas completadas</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Ventas Completadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completadas ?? 0}</div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-muted-foreground">de {stats?.total_ventas ?? 0} totales</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Package className="h-4 w-4" />
              Productos en Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis?.productos_stock ?? 0}</div>
            {(kpis?.stock_bajo ?? 0) > 0 && (
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-destructive">{kpis?.stock_bajo} con stock bajo</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>Evolución de Ventas</CardTitle>
                <CardDescription>{DESCRIPCIONES[periodo]}</CardDescription>
              </div>
              <div className="flex rounded-md border overflow-hidden shrink-0">
                {PERIODOS.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => setPeriodo(p.key)}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                      periodo === p.key
                        ? "bg-primary text-primary-foreground"
                        : "bg-background text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <MonthlySalesBarChart data={chartData} />
            ) : (
              <p className="text-sm text-muted-foreground py-8 text-center">Sin datos históricos</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribución de Ventas</CardTitle>
            <CardDescription>Por estado de la transacción</CardDescription>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <SalesPieChart data={pieData} />
            ) : (
              <p className="text-sm text-muted-foreground py-8 text-center">Sin datos disponibles</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
