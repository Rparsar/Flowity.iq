import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, AlertTriangle, Lightbulb, BarChart3, Sparkles } from "lucide-react";

const insights = [
  {
    id: 1,
    type: "opportunity",
    title: "Producto más rentable",
    description: "Laptop HP ProBook genera un 35% más de margen que el promedio. Considera aumentar stock.",
    impact: "high",
  },
  {
    id: 2,
    type: "alert",
    title: "Stock crítico detectado",
    description: "Webcam HD tiene solo 2 unidades. Se proyecta agotamiento en 3 días basado en ventas históricas.",
    impact: "critical",
  },
  {
    id: 3,
    type: "trend",
    title: "Tendencia de ventas",
    description: "Las ventas de accesorios han aumentado un 28% en las últimas 2 semanas.",
    impact: "medium",
  },
  {
    id: 4,
    type: "forecast",
    title: "Predicción mensual",
    description: "Se proyectan €32,450 en ventas para febrero, un 15% más que enero.",
    impact: "medium",
  },
];

export default function IAPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            Inteligencia Artificial
          </h1>
          <p className="text-muted-foreground mt-1">
            Análisis predictivo y recomendaciones inteligentes
          </p>
        </div>
        <Badge variant="outline" className="text-primary">
          <Sparkles className="mr-1 h-3 w-3" />
          Beta
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Precisión Predicciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.3%</div>
            <p className="text-xs text-muted-foreground">Basado en últimos 30 días</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Alertas Activas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">5</div>
            <p className="text-xs text-muted-foreground">Requieren atención</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Insights Generados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">12</div>
            <p className="text-xs text-muted-foreground">Esta semana</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Insights y Recomendaciones
          </CardTitle>
          <CardDescription>
            Análisis automático de tus datos empresariales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  insight.type === "opportunity" ? "bg-success/10 text-success" :
                  insight.type === "alert" ? "bg-destructive/10 text-destructive" :
                  insight.type === "trend" ? "bg-primary/10 text-primary" :
                  "bg-warning/10 text-warning"
                }`}>
                  {insight.type === "opportunity" && <TrendingUp className="h-5 w-5" />}
                  {insight.type === "alert" && <AlertTriangle className="h-5 w-5" />}
                  {insight.type === "trend" && <BarChart3 className="h-5 w-5" />}
                  {insight.type === "forecast" && <Brain className="h-5 w-5" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{insight.title}</h4>
                    <Badge variant={
                      insight.impact === "critical" ? "destructive" :
                      insight.impact === "high" ? "default" :
                      "secondary"
                    }>
                      {insight.impact === "critical" ? "Crítico" :
                       insight.impact === "high" ? "Alto" : "Medio"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Predicción de Ventas
            </CardTitle>
            <CardDescription>Forecasting basado en datos históricos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center bg-muted/50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Gráfica de predicciones</p>
                <p className="text-xs text-muted-foreground">Se implementará en Fase 7</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertas Predictivas
            </CardTitle>
            <CardDescription>Detección temprana de problemas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                <span className="text-sm font-medium text-destructive">Webcam HD - Stock crítico</span>
                <Badge variant="destructive">2 días</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                <span className="text-sm font-medium text-warning">Monitor 4K - Stock bajo</span>
                <Badge variant="secondary">5 días</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                <span className="text-sm font-medium text-primary">Demanda alta esperada</span>
                <Badge>Semana próxima</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
