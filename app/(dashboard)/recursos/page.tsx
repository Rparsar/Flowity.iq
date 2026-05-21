import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Wrench, Calendar, ClipboardList, ArrowRight } from "lucide-react";

const resourceTypes = [
  {
    id: "producto",
    name: "Productos",
    description: "Gestión de productos físicos para tiendas y comercios",
    icon: Package,
    count: 847,
    color: "bg-blue-500",
  },
  {
    id: "servicio",
    name: "Servicios",
    description: "Servicios ofrecidos: consultoría, reparaciones, etc.",
    icon: Wrench,
    count: 24,
    color: "bg-purple-500",
  },
  {
    id: "reserva",
    name: "Reservas",
    description: "Sistema de citas y reservas para clínicas, salones...",
    icon: Calendar,
    count: 156,
    color: "bg-emerald-500",
  },
  {
    id: "encargo",
    name: "Encargos",
    description: "Pedidos personalizados y trabajos por encargo",
    icon: ClipboardList,
    count: 42,
    color: "bg-amber-500",
  },
];

export default function RecursosPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recursos Empresariales</h1>
          <p className="text-muted-foreground mt-1">
            Gestión adaptable según el tipo de negocio
          </p>
        </div>
        <Button>Configurar Tipos</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {resourceTypes.map((type) => {
          const Icon = type.icon;
          return (
            <Card key={type.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg ${type.color} flex items-center justify-center`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{type.name}</CardTitle>
                      <CardDescription>{type.count} registrados</CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{type.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuración de Recursos</CardTitle>
          <CardDescription>
            Personaliza los tipos de recursos según las necesidades de tu negocio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-muted/50 p-8 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Arquitectura Adaptable</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              El sistema está diseñado para adaptarse a cualquier modelo de negocio. 
              Puedes configurar qué tipos de recursos gestionar y sus campos personalizados.
            </p>
            <Button className="mt-4">Ver Documentación</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
