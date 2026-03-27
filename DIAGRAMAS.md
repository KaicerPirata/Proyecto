# Diagramas Técnicos de Análisis - Activos Pro (Proyecto de Grado)

Este documento contiene la representación técnica de los procesos fundamentales del sistema "Activos Pro", vinculados directamente a las Historias de Usuario (HU) definidas en el análisis de requerimientos.

---

## 1. Proceso de Autenticación y Recuperación (HU-001, HU-002)
Este diagrama detalla el acceso seguro al sistema y la lógica de protección de rutas basada en roles.

```mermaid
sequenceDiagram
    autonumber
    participant U as Usuario (Todos)
    participant L as Interfaz Login (React)
    participant V as Validador Zod (RegisterSchema)
    participant M as Mock DB (users.ts)
    participant S as LocalStorage (Session)
    participant R as Router (Next.js)

    Note over U, R: HU-001: Iniciar Sesión
    U->>L: Ingresa ID y Contraseña
    L->>V: Validar formato de entrada
    V-->>L: Formato Válido
    L->>M: Consultar credenciales
    alt Credenciales Correctas
        M-->>L: Retorna Usuario {rol, id, name}
        L->>S: Guardar 'isAuthenticated', 'userRole', 'userName'
        L-->>U: Mostrar Toast Éxito ("Bienvenido")
        L->>R: Redirigir según Rol
        R-->>U: Carga Dashboard (Admin/Tec) o Activos (Estandar)
    else Credenciales Incorrectas
        M-->>L: Usuario no encontrado / Clave errónea
        L-->>U: Mostrar Toast Error ("Credenciales Inválidas")
    end

    Note over U, R: HU-002: Recuperación de Contraseña
    U->>L: Clic en "¿Olvidaste tu contraseña?"
    L->>U: Abrir Diálogo de Recuperación
    U->>L: Ingresa Correo Electrónico
    L->>M: Verificar existencia de correo
    M-->>L: Confirmación de envío
    L-->>U: Toast: "Enlace enviado a su correo"
```

---

## 2. Inteligencia de Negocio en Dashboard (HU-003, HU-004)
Detalla la reactividad del sistema ante filtros y el cálculo dinámico de alertas de mantenimiento.

```mermaid
sequenceDiagram
    autonumber
    participant T as Admin / Técnico
    participant D as Dashboard Page
    participant S as Selector de Empresa
    participant LM as Lógica Mantenimiento (date-fns)
    participant C as Componente Gráfico (Recharts)

    T->>D: Accede al Dashboard
    D->>LM: Calcular estados de activos
    LM-->>D: Retorna lista de alertas (HU-004)
    D-->>T: Resalta en ROJO (Vencidos) y AMARILLO (Próximos)
    
    Note over T, C: HU-003: Filtrado Reactivo
    T->>S: Selecciona Empresa "HYCO"
    S->>D: Disparar evento de cambio de estado
    D->>D: useMemo(recalcular activos filtrados)
    D->>C: Actualizar datos de gráfico
    D-->>T: Actualiza tarjetas y listas en tiempo real
```

---

## 3. Gestión de Entidades: Empresas y Usuarios (HU-005 a HU-010)
Ciclo de vida de empresas y gestión de personal.

```mermaid
sequenceDiagram
    autonumber
    participant A as Administrador
    participant P as Página Gestión (Empresas/Users)
    participant B as Barra de Búsqueda
    participant F as Formulario (Register/Company)
    participant DB as Mock DB Store

    Note over A, DB: HU-005: Búsqueda Rápida
    A->>B: Escribe caracteres de búsqueda
    B->>P: Actualizar 'searchTerm'
    P->>P: filter(items => items.match(term))
    P-->>A: Renderiza tabla filtrada dinámicamente

    Note over A, DB: HU-006 a HU-010: CRUD de Entidades
    A->>P: Clic en "Nuevo" o "Editar"
    P->>F: Abrir Modal con Formulario
    A->>F: Completa/Modifica datos
    F->>F: Validar con Zod Schema
    A->>F: Clic en "Guardar"
    F->>DB: Update/Create record
    DB-->>P: Notificar actualización
    P-->>A: Cerrar Modal y mostrar Toast de éxito
```

---

## 4. Gestión Integral de Activos (HU-011 a HU-017)
Detalla el proceso técnico, trazabilidad y control de inventario de equipos.

```mermaid
sequenceDiagram
    autonumber
    participant T as Técnico / Admin
    participant LA as Listado de Activos
    participant FD as Formulario Dinámico
    participant VD as Vista Detalle (Hoja de Vida)
    participant PH as Proceso Historial
    participant PDF as Generador PDF
    participant PA as Papelera (Activos Eliminados)

    Note over T, FD: HU-011: Registro Técnico
    T->>LA: Clic en "Nuevo Activo"
    LA->>FD: Seleccionar Categoría (PC, UPS, Monitor)
    FD->>FD: Renderizar campos técnicos específicos
    T->>FD: Registra specs y responsable
    FD->>LA: push(newAsset)
    LA-->>T: Toast: "Activo registrado"

    Note over T, VD: HU-012, HU-013, HU-014: Gestión de Hoja de Vida
    T->>LA: Clic en icono "Ojo"
    LA->>VD: Cargar specs e historial
    T->>VD: Clic en "Añadir Historial"
    VD->>PH: Abrir modal de intervención
    T->>PH: Describe mantenimiento/incidente
    PH-->>VD: Actualiza línea de tiempo (Timeline)
    T->>VD: Clic en "Cambiar Responsable"
    VD-->>LA: Actualizar campo 'responsable'

    Note over T, PA: HU-015, HU-016, HU-017: Reportes y Ciclo Final
    T->>VD: Clic en "Descargar PDF"
    VD->>PDF: Exportar specs + historial
    PDF-->>T: Descarga archivo .pdf
    T->>LA: Clic en Papelera (HU-016)
    LA->>LA: Mover a 'deletedAssets' con motivo
    T->>PA: Clic en "Restaurar" (HU-017)
    PA-->>LA: Devolver activo a inventario operativo
```

---

## 5. Visualización Restringida: Rol Estándar (HU-018, HU-019)
Muestra cómo el sistema filtra la información para garantizar la privacidad y seguridad.

```mermaid
sequenceDiagram
    autonumber
    participant U as Usuario Estándar
    participant S as LocalStorage
    participant P as Página Activos
    participant VD as Vista Detalle (Solo Lectura)

    U->>P: Accede a la sección
    P->>S: Obtener 'userIdNumber' de la sesión
    P->>P: filter(assets => asset.responsableId == currentUserId)
    Note right of P: HU-018: Solo muestra sus equipos
    P-->>U: Renderiza tabla filtrada
    U->>P: Clic en icono "Ojo" (HU-019)
    P->>VD: Abrir modal
    Note right of VD: Inhabilita botones de Editar, Borrar e Historial
    VD-->>U: Muestra información técnica protegida
```
