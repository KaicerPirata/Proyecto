# Documentación Técnica del Sistema "Activos Pro"

Este documento proporciona una explicación detallada sobre la arquitectura y el funcionamiento de cada módulo principal de la aplicación, describiendo qué hace y cómo está implementado.

## 1. Tecnologías y Estructura del Proyecto

- **Framework Principal:** [Next.js](https://nextjs.org/) (usando el App Router).
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/).
- **Componentes de UI:** [ShadCN/UI](https://ui.shadcn.com/) sobre Radix UI.
- **Estilos CSS:** [Tailwind CSS](https://tailwindcss.com/).
- **Gestión de Formularios:** [React Hook Form](https://react-hook-form.com/) con [Zod](https://zod.dev/) para validación de esquemas.
- **Visualización de Datos:** [Recharts](https://recharts.org/) para gráficos.
- **Fuente de Datos (Mock DB):** Explicado en la sección 1.1.

### 1.1 El Concepto de Mock DB (Base de Datos Simulada)
Para las fases iniciales y de prueba de este proyecto de grado, se utiliza una **Mock DB**. Esto significa que los datos de empresas, usuarios y activos no residen en un servidor externo, sino que están centralizados en el archivo `src/lib/mock-data.ts`.

**Ventajas para el Proyecto de Grado:**
1. **Velocidad de Demostración:** No hay latencia de red, la aplicación responde instantáneamente durante la sustentación.
2. **Independencia de Conexión:** El sistema funciona perfectamente sin internet.
3. **Seguridad del Prototipo:** Permite probar flujos de usuario (como el cambio de roles) sin riesgo de corromper una base de datos de producción.

---

## 2. Módulo de Autenticación (Login)

- **Archivo Clave:** `src/app/login/page.tsx`

**¿Qué hace?**
Este módulo presenta una pantalla de inicio de sesión donde el usuario introduce su ID y contraseña. Al autenticarse, el sistema guarda su información (rol, nombre, etc.) en el `localStorage` del navegador y lo redirige a la página principal.

**¿Cómo funciona?**
1.  **Formulario:** La página renderiza un componente `<Card>` de ShadCN con dos `<Input>` para el usuario y la contraseña.
2.  **Estado:** `useState` se utiliza para almacenar los valores del usuario y la contraseña a medida que se escriben.
3.  **Lógica de Login (`handleLogin`):**
    - Al enviar el formulario, se simula una llamada asíncrona con `setTimeout`.
    - Busca el usuario en el objeto `users` (hardcodeado en el mismo archivo).
    - Si las credenciales son correctas, guarda los datos del usuario en `localStorage` usando `localStorage.setItem('userRole', user.role)`.
    - Redirige al usuario al dashboard (`/`) o a la página de activos si su rol es 'estandar' usando el `useRouter` de Next.js.
    - Si falla, muestra una notificación de error (`toast`).
4.  **Recuperar Contraseña:** Un `<Dialog>` se abre para que el usuario pueda solicitar un enlace de recuperación (actualmente solo simula el envío).

---

## 3. Módulo de Layout y Navegación (DashboardLayout)

- **Archivo Clave:** `src/components/dashboard-layout.tsx`

**¿Qué hace?**
Es la estructura principal que envuelve todas las páginas protegidas. Proporciona una barra de navegación lateral (Sidebar) consistente y un encabezado (Header). Controla qué elementos del menú son visibles según el rol del usuario.

**¿Cómo funciona?**
1.  **Estado y Contexto:** Utiliza el `SidebarProvider` para gestionar el estado de la barra lateral (abierta/cerrada).
2.  **Obtención de Rol:** En `useEffect`, lee el rol y nombre del usuario desde `localStorage`.
3.  **Renderizado Condicional:** Basado en el `userRole` obtenido, decide si renderizar los enlaces del menú para "Empresas" y "Usuarios". Por ejemplo: ` {canViewEmpresas && (<SidebarMenuItem>...)}`.
4.  **Componentes Hijos:**
    - **`<Sidebar>`:** La barra lateral izquierda, que contiene los enlaces de navegación (`SidebarMenuButton`).
    - **`<Header>`:** El encabezado superior, que contiene el menú de perfil del usuario (cambiar clave, cerrar sesión).
    - **`{children}`:** Renderiza el contenido específico de la página actual (ej. el Dashboard, la tabla de usuarios, etc.).

---

## 4. Módulo de Inicio (Dashboard)

- **Archivo Clave:** `src/app/dashboard/page.tsx`

**¿Qué hace?**
Es la página principal que ven los administradores y técnicos. Muestra un resumen visual del estado del sistema: tarjetas con totales, un gráfico de distribución de activos y una lista de mantenimientos próximos.

**¿Cómo funciona?**
1.  **Filtrado de Datos:** Usa un `Select` para filtrar los datos por empresa. El estado `selectedCompany` controla qué datos se muestran.
2.  **Cálculos con `useMemo`:** Para optimizar el rendimiento, los activos y usuarios filtrados se calculan con `useMemo`. Esto evita recalcular los datos en cada renderizado si la empresa seleccionada no ha cambiado.
3.  **Lógica de Mantenimiento (`useEffect`):**
    - Calcula las fechas de los próximos mantenimientos para los equipos de cómputo y UPS.
    - Se basa en la fecha del último mantenimiento registrado en `assetHistory` o en la fecha de compra si no hay historial.
    - Ordena la lista para mostrar primero los mantenimientos más urgentes o vencidos.
4.  **Componentes de UI:**
    - **`SummaryCards`:** Muestra los totales de activos, usuarios y tareas.
    - **`AssetsChart`:** Recibe los activos filtrados y los agrupa por departamento para renderizar un gráfico de barras con `Recharts`.
    - **`UpcomingMaintenance`:** Muestra la lista de equipos que necesitan mantenimiento.

---

## 5. Módulos de Gestión (CRUD - Empresas, Usuarios, Activos)

Estos tres módulos (Empresas, Usuarios y Activos) comparten una estructura y lógica muy similar.

- **Archivos Clave:**
  - `src/app/empresas/page.tsx`
  - `src/app/users/page.tsx`
  - `src/app/assets/page.tsx`

**¿Qué hacen?**
Permiten realizar las operaciones básicas de **C**rear, **L**eer, **A**ctualizar y **E**liminar (CRUD) registros sobre la **Mock DB**.

**¿Cómo funcionan (patrón común)?**
1.  **Listado y Estado:**
    - Los datos se cargan desde `src/lib/mock-data.ts` y se guardan en un estado local con `useState`.
    - Se usa `useMemo` para recalcular la lista filtrada cada vez que el término de búsqueda (`searchTerm`) o los filtros avanzados cambian.
2.  **Tabla de Datos:**
    - Se utiliza el componente `<Table>` de ShadCN para mostrar los datos de forma elegante.
3.  **Búsqueda y Filtros:**
    - Un `<Input>` actualiza el estado de búsqueda en tiempo real.
4.  **Creación y Edición (Formularios en Diálogo):**
    - La creación y edición se manejan a través de un componente `<Dialog>` que contiene un formulario validado por **Zod**.
5.  **Eliminación:**
    - Se utiliza un `<AlertDialog>` para confirmar antes de borrar datos de la Mock DB.

**Particularidades del Módulo de Activos:**
- Es el más complejo, ya que maneja múltiples tipos de activos.
- La vista de detalles (`Asset Details Dialog`) muestra información completa del activo y su historial a través del componente `AssetHistory`.
- Incluye la funcionalidad de **Baja Lógica**, moviendo activos a la papelera en lugar de borrarlos físicamente de inmediato.