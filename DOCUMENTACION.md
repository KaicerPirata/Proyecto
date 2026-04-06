# Documentación Técnica del Sistema "Activos Pro"

Este documento proporciona una explicación detallada sobre la arquitectura y el funcionamiento de cada módulo principal de la aplicación, describiendo qué hace y cómo está implementado. Es el pilar documental para la sustentación del proyecto de grado.

---

## 1. Arquitectura de la Aplicación (Detalle Técnico)

La aplicación sigue una arquitectura moderna basada en el **Frontend-First**, utilizando el framework **Next.js 15** con el **App Router**. Se ha diseñado bajo un modelo de capas lógicas para garantizar la escalabilidad y el mantenimiento.

### 1.1 Capas del Sistema
1.  **Capa de Presentación (UI):** Construida con **React** y componentes de **ShadCN UI**. Se utiliza **Tailwind CSS** para un diseño responsivo y profesional. La interfaz es atómica, lo que significa que cada botón, tabla y formulario es un componente independiente y reutilizable.
2.  **Capa de Lógica de Negocio (Hooks y Estado):** Gestión de estados complejos mediante React Hooks (`useState`, `useMemo`, `useEffect`). Se implementó **Zod** como motor de validación para asegurar que ningún dato erróneo entre al sistema.
3.  **Capa de Servicios y Persistencia:** Actualmente utiliza un **Mock DB** centralizado (`src/lib/mock-data.ts`) y **LocalStorage** para la persistencia de la sesión del usuario. Esta arquitectura permite una transición fluida hacia una base de datos real (como PostgreSQL o Firebase) simplemente cambiando la capa de servicios.

### 1.2 Flujo de Datos
- El usuario interactúa con la UI.
- Los formularios validan los datos en tiempo real con esquemas de **Zod**.
- Los cambios se reflejan instantáneamente en el estado global de la página.
- Los datos se persisten localmente para permitir que la aplicación funcione sin conexión (Offline-first approach).

---

## 2. Modelo Relacional de Datos

Aunque el sistema utiliza objetos de TypeScript para el prototipo, el diseño lógico sigue un **Modelo Relacional** estricto para garantizar la integridad referencial. A continuación se detallan las entidades y sus relaciones:

### 2.1 Entidades Principales

#### **A. Empresa (Master)**
Representa a los clientes o entidades dueñas de los activos.
- `id` (PK - Int): Identificador único interno.
- `companyId` (Unique - String): Código legal o NIT de la empresa.
- `name` (String): Razón social.
- `city` (String): Ciudad de operación.
- `status` (Enum): Estado de la empresa (Activa/Inactiva).

#### **B. Usuario (Entidad)**
Personas que acceden al sistema o son responsables de equipos.
- `id` (PK - Int): Identificador interno.
- `idNumber` (Unique - String - FK): Número de cédula/identificación.
- `firstName`, `lastName` (String): Nombres y apellidos.
- `email` (Unique - String): Correo de contacto.
- `role` (Enum): Permisos (Admin, Tecnico, Estandar).
- `companyName` (FK): Relación con la empresa a la que pertenece.

#### **C. Activo (Entidad Central)**
Cualquier equipo tecnológico registrado.
- `id` (PK - String): ID único del activo (ej: LAP-001).
- `assetName` (String): Nombre descriptivo.
- `category` (Enum): Tipo (Computador, Monitor, UPS).
- `responsableName` (FK): Relación con el Usuario que tiene el equipo a cargo.
- `serialNumber` (Unique - String): Serial físico del fabricante.
- `brand`, `model` (String): Marca y modelo.
- `specs` (JSON/Fields): Procesador, RAM, Almacenamiento, etc.

#### **D. HistorialActivo (Transaccional)**
Bitácora de mantenimientos e incidentes.
- `id` (PK - Int): Identificador del registro.
- `assetId` (FK): Referencia al activo intervenido.
- `date` (Date): Fecha del evento.
- `author` (FK): Usuario (Técnico/Admin) que realizó la acción.
- `type` (Enum): Categoría (Mantenimiento, Incidente, Instalación).
- `description` (Text): Detalle técnico de la intervención.

### 2.2 Relaciones de Cardinalidad
- **Empresa (1) -> Usuarios (N):** Una empresa tiene muchos empleados, pero un empleado pertenece a una sola empresa.
- **Usuario (1) -> Activos (N):** Un usuario puede ser responsable de varios equipos (laptop, monitor, celular).
- **Activo (1) -> Historial (N):** Un equipo tiene una "hoja de vida" con múltiples registros de mantenimiento a lo largo del tiempo.

---

## 3. El Concepto de Mock DB (Base de Datos Simulada)
Para las fases iniciales y de prueba de este proyecto de grado, se utiliza una **Mock DB**. Esto significa que los datos no residen en un servidor externo, sino que están centralizados en el archivo `src/lib/mock-data.ts`.

**Ventajas para la Sustentación:**
1. **Velocidad de Demostración:** No hay latencia de red, la aplicación responde instantáneamente.
2. **Independencia de Conexión:** El sistema funciona perfectamente sin internet.
3. **Seguridad del Prototipo:** Permite probar flujos (como el cambio de roles) sin riesgo de corromper una base de datos real.

---

## 4. Módulos de la Aplicación

### 4.1 Autenticación
Controla el acceso según el rol guardado en `localStorage`. Redirige automáticamente al usuario según sus permisos (HU-001).

### 4.2 Gestión de Activos y Hoja de Vida
Es el núcleo técnico. Permite ver las especificaciones de hardware (RAM, Procesador, SO) y el historial de intervenciones. Incluye la lógica de **Baja Lógica** para mover equipos a la papelera sin borrarlos definitivamente.

### 4.3 Visualización de Indicadores (Dashboard)
Usa **Recharts** para transformar los datos en gráficos de barras. Filtra automáticamente los resultados por empresa, permitiendo un análisis gerencial rápido.
