"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Package,
  Truck,
  ShoppingCart,
  BarChart3,
  Brain,
  MessageSquare,
  Settings,
  Menu,
  ChevronRight,
  Boxes,
  ChevronDown,
  Plus,
  Wrench,
  Calendar,
  ClipboardList,
  CreditCard,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  className?: string;
}

const mainNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Proveedores", href: "/proveedores", icon: Truck },
  { name: "Ventas", href: "/ventas", icon: ShoppingCart },
];

const resourceSubItems = [
  { name: "Todos los recursos", href: "/recursos", icon: Boxes },
  { name: "Productos", href: "/recursos/producto", icon: Package },
  { name: "Servicios", href: "/recursos/servicio", icon: Wrench },
  { name: "Reservas", href: "/recursos/reserva", icon: Calendar },
  { name: "Encargos", href: "/recursos/encargo", icon: ClipboardList },
  { name: "Suscripciones", href: "/recursos/suscripcion", icon: CreditCard },
  { name: "Nuevo recurso", href: "#", icon: Plus },
];

const otherNavigation = [
  { name: "Inteligencia IA", href: "/ia", icon: Brain },
  { name: "Asistente", href: "/chat", icon: MessageSquare },
];

const bottomNavigation = [
  { name: "Estadísticas", href: "/estadisticas", icon: BarChart3 },
  { name: "Configuración", href: "/configuracion", icon: Settings },
];

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [resourcesOpen, setResourcesOpen] = React.useState(
    pathname?.startsWith("/recursos") ?? false
  );

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <div className={cn("hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 no-print-sidebar", className)}>
      <div className="flex flex-col h-full bg-sidebar">
        <div className="flex items-center h-16 px-6 border-b border-sidebar-border">
          <Link href="/dashboard" className="flex items-center gap-2">
            <img src="/flowity.iq_icono.png" alt="Flowity.iq" className="w-20 h-15" />
            <span className="text-sidebar-foreground font-semibold text-lg">Flowity.iq</span>
          </Link>
        </div>

        <ScrollArea className="flex-1 py-4">
          <nav className="px-3 space-y-1">
            {/* Main navigation */}
            {mainNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 h-10 px-3 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{item.name}</span>
                    {isActive && <ChevronRight className="h-4 w-4" />}
                  </Button>
                </Link>
              );
            })}

            {/* Recursos expandable menu */}
            <div className="space-y-1">
              <Button
                variant="ghost"
                onClick={() => setResourcesOpen(!resourcesOpen)}
                className={cn(
                  "w-full justify-start gap-3 h-10 px-3 text-sm font-medium transition-colors",
                  pathname?.startsWith("/recursos")
                    ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Boxes className="h-4 w-4 shrink-0" />
                <span className="flex-1">Recursos</span>
                {resourcesOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
              
              {resourcesOpen && (
                <div className="ml-4 pl-3 border-l border-sidebar-border space-y-1">
                  {resourceSubItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    
                    return (
                      <Link key={item.name} href={item.href}>
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-start gap-3 h-9 px-3 text-sm font-medium transition-colors",
                            isActive
                              ? "bg-sidebar-primary/70 text-sidebar-primary-foreground hover:bg-sidebar-primary/80"
                              : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="flex-1">{item.name}</span>
                        </Button>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Other navigation */}
            {otherNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 h-10 px-3 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{item.name}</span>
                    {isActive && <ChevronRight className="h-4 w-4" />}
                  </Button>
                </Link>
              );
            })}
          </nav>

          <Separator className="my-4 bg-sidebar-border" />

          <nav className="px-3 space-y-1">
            {bottomNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 h-10 px-3 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{item.name}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center">
              <span className="text-sidebar-accent-foreground text-sm font-medium">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sidebar-foreground text-sm font-medium truncate">{user?.name ?? "..."}</p>
              <p className="text-sidebar-foreground/60 text-xs truncate capitalize">{user?.rol ?? ""}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MobileSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [resourcesOpen, setResourcesOpen] = React.useState(
    pathname?.startsWith("/recursos") ?? false
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="lg:hidden" />
        }
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Abrir menú</span>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0 bg-sidebar">
        <div className="flex flex-col h-full">
          <div className="flex items-center h-16 px-6 border-b border-sidebar-border">
            <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setOpen(false)}>
              <img src="/flowity.iq_icono.png" alt="Flowity.iq" className="w-20 h-15" />
              <span className="text-sidebar-foreground font-semibold text-lg">Flowity.iq</span>
            </Link>
          </div>

          <ScrollArea className="flex-1 py-4">
            <nav className="px-3 space-y-1">
              {/* Main navigation */}
              {mainNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                
                return (
                  <Link key={item.name} href={item.href} onClick={() => setOpen(false)}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-3 h-10 px-3 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1">{item.name}</span>
                    </Button>
                  </Link>
                );
              })}

              {/* Recursos expandable menu */}
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  onClick={() => setResourcesOpen(!resourcesOpen)}
                  className={cn(
                    "w-full justify-start gap-3 h-10 px-3 text-sm font-medium transition-colors",
                    pathname?.startsWith("/recursos")
                      ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <Boxes className="h-4 w-4 shrink-0" />
                  <span className="flex-1">Recursos</span>
                  {resourcesOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
                
                {resourcesOpen && (
                  <div className="ml-4 pl-3 border-l border-sidebar-border space-y-1">
                    {resourceSubItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      
                      return (
                        <Link key={item.name} href={item.href} onClick={() => setOpen(false)}>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-start gap-3 h-9 px-3 text-sm font-medium transition-colors",
                              isActive
                                ? "bg-sidebar-primary/70 text-sidebar-primary-foreground hover:bg-sidebar-primary/80"
                                : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            )}
                          >
                            <Icon className="h-4 w-4 shrink-0" />
                            <span className="flex-1">{item.name}</span>
                          </Button>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Other navigation */}
              {otherNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                
                return (
                  <Link key={item.name} href={item.href} onClick={() => setOpen(false)}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-3 h-10 px-3 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1">{item.name}</span>
                    </Button>
                  </Link>
                );
              })}
            </nav>

            <Separator className="my-4 bg-sidebar-border" />

            <nav className="px-3 space-y-1">
              {bottomNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link key={item.name} href={item.href} onClick={() => setOpen(false)}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-3 h-10 px-3 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1">{item.name}</span>
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
