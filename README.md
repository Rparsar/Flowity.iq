# 🧠 Flowity.iq - Panel de Administración

Sistema integral de gestión empresarial con análisis de datos, control de inventario, gestión de ventas y asistente de inteligencia artificial.

## 📋 Propósito Funcional

Flowity.iq es el panel de administración centralizado que permite a los gestores de negocio supervisar todas las operaciones de la empresa desde una única interfaz intuitiva. El sistema proporciona:

- **📊 Dashboard Analítico**: Visualización en tiempo real de KPIs (ingresos totales, ventas, productos en stock, nuevos clientes) con gráficos interactivos de evolución semanal
- **🛍️ Gestión de Ventas**: Historial completo de transacciones, detalle de ventas individuales con desglose por productos/servicios/reservas/encargos, y sistema de cambio de estados (completar/cancelar)
- **📦 Control de Inventario**: Alertas de stock bajo y crítico, navegación directa a edición de productos, seguimiento de recursos
- **🤖 Asistente IA**: Chat integrado para consultas y análisis de datos
- **📑 Catálogo de Recursos**: Gestión de productos, servicios, reservas y encargos con CRUD completo
- **🚚 Proveedores**: Registro y seguimiento de proveedores
- **📤 Exportación**: Generación de reportes en PDF con formato A3

## 🔧 Requisitos Previos

- **Node.js** 20.x o superior
- **npm** 10.x o superior (o pnpm/yarn)
- **API Backend**: [flowity.iq_api](../flowity.iq_api) ejecutándose en `http://localhost:8000`
- **Navegador moderno**: Chrome, Edge, Firefox (últimas 2 versiones)

## 🚀 Instalación Paso a Paso

### 1. Clonar y navegar al proyecto
```powershell
cd c:\Users\rpard\FlowityIQ\flowity.iq
```

### 2. Instalar dependencias
```powershell
# Con npm
npm install

# O con pnpm (recomendado)
pnpm install
```

### 3. Configurar variables de entorno
Crear archivo `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 4. Iniciar servidor de desarrollo
```powershell
npm run dev
```

La aplicación estará disponible en: **http://localhost:3000**

## ⚡ Comandos Útiles

### Desarrollo
| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo con hot reload |
| `npm run build` | Construye la aplicación para producción |
| `npm run start` | Inicia servidor de producción (requiere build previo) |
| `npm run lint` | Ejecuta ESLint para análisis de código |

### Gestión de Dependencias
```powershell
# Actualizar dependencias
npm update

# Limpiar caché y reinstalar
npm cache clean --force
Remove-Item -Recurse -Force node_modules
npm install
```

### Construcción para Producción
```powershell
# Build optimizado
npm run build

# El output se genera en ./.next/
# Para desplegar, copiar el contenido de .next/ al servidor
```

## 📁 Estructura de Archivos

```
flowity.iq/
├── 📁 app/                          # Rutas y páginas de Next.js (App Router)
│   ├── 📁 (auth)/                   # Grupo de rutas de autenticación
│   │   └── 📁 login/                # Página de inicio de sesión
│   ├── 📁 (dashboard)/              # Grupo de rutas del panel principal
│   │   ├── 📄 page.tsx              # Dashboard principal (KPIs, gráficos)
│   │   ├── 📁 chat/                 # Asistente IA
│   │   ├── 📁 configuracion/        # Configuración del sistema
│   │   ├── 📁 estadisticas/         # Estadísticas avanzadas
│   │   ├── 📁 inventario/           # Gestión de inventario
│   │   ├── 📁 ia/                   # Módulo de inteligencia artificial
│   │   ├── 📁 proveedores/          # Gestión de proveedores
│   │   ├── 📁 recursos/             # Catálogo de recursos
│   │   │   └── 📁 [tipo]/           # Rutas dinámicas por tipo (producto, servicio, etc.)
│   │   └── 📁 ventas/               # Gestión de ventas con exportación PDF
│   ├── 📄 globals.css               # Estilos globales + CSS @media print
│   ├── 📄 layout.tsx                # Layout principal (sidebar, header, footer)
│   └── 📄 page.tsx                  # Redirección a /dashboard
│
├── 📁 components/                   # Componentes React reutilizables
│   ├── 📁 charts/                   # Gráficos (SalesLineChart, etc.)
│   ├── 📁 layout/                   # Componentes de layout (Header, Sidebar)
│   ├── 📁 modals/                   # Modales (VentaDetailModal, etc.)
│   ├── 📁 resources/                # Formularios de recursos (ResourceForm, ResourceTable)
│   ├── 📁 shared/                   # Componentes compartidos (LoadingSpinner)
│   └── 📁 ui/                       # Componentes shadcn/ui (Button, Card, etc.)
│
├── 📁 contexts/                     # Contextos de React
│   └── 📄 AuthContext.tsx           # Gestión de autenticación
│
├── 📁 lib/                          # Utilidades y configuración
│   ├── 📄 api.ts                    # Cliente API para comunicación con backend
│   ├── 📄 utils.ts                  # Funciones utilitarias
│   └── 📄 types.ts                  # Definiciones de tipos TypeScript
│
├── 📁 public/                       # Archivos estáticos
│   └── 📄 flowity.iq_icono.png     # Logo de la aplicación
│
├── 📄 next.config.ts                # Configuración de Next.js
├── 📄 package.json                  # Dependencias y scripts
├── 📄 tsconfig.json                 # Configuración de TypeScript
└── 📄 tailwind.config.ts            # Configuración de Tailwind CSS
```

## 🔌 Integración con Backend

Este frontend requiere que el backend [flowity.iq_api](../flowity.iq_api) esté ejecutándose:

```
Frontend (Next.js)  :3000  ←──HTTP──→  Backend (Laravel)  :8000
```

Asegúrate de iniciar el backend antes de usar el frontend:
```powershell
cd ..\flowity.iq_api
php artisan serve
```

## 🐛 Troubleshooting

### Error: "Cannot connect to API"
- Verificar que el backend esté corriendo en `localhost:8000`
- Comprobar archivo `.env.local` tenga `NEXT_PUBLIC_API_URL` correcto

### Error: "Module not found"
- Ejecutar `npm install` para reinstalar dependencias
- Verificar versiones de Node.js (20.x+)

### Problemas de caché
```powershell
Remove-Item -Recurse -Force .next
npm run dev
```

## 📝 Notas de Desarrollo

- Usa **pnpm** para mejor performance en la instalación de dependencias
- El proyecto usa **Tailwind CSS 4** con el nuevo sistema de configuración
- Los componentes UI provienen de **shadcn/ui** (sistema de componentes accesibles)
- La exportación a PDF usa `window.print()` con CSS @media print

## 📄 Licencia

Proyecto privado - Flowity.iq © 2026
