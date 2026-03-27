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
    L->>M: Consultar credenciales (username matching)
    alt Credenciales Correctas
        M-->>L: Retorna Usuario {rol, id, name, email}
        L->>S: Guardar 'isAuthenticated', 'userRole', 'userName', 'userIdNumber'
        L-->>U: Mostrar Toast Éxito ("Bienvenido")
        L->>R: Redirigir según Rol (Dashboard o Activos)
        R-->>U: Carga Vista Principal
    else Credenciales Incorrectas
        M-->>L: Usuario no encontrado / Clave errónea
        L-->>U: Mostrar Toast Error ("Credenciales Inválidas")
    end

    Note over U, R: HU-002: Recuperación de Contraseña
    U->>L: Clic en "¿Olvidaste tu contraseña?"
    L->>U: Abrir Diálogo de Recuperación (Dialog)
    U->>L: Ingresa Correo Electrónico
    L->>M: Verificar existencia de correo en DB
    M-->>L: Confirmación de envío simulado
    L-->>U: Toast: "Enlace enviado a su correo"
```

---

## 2. Inteligencia de Negocio en Dashboard (HU-003, HU-004)
Detalla la reactividad del sistema ante filtros y el cálculo dinámico de alertas de mantenimiento preventivo.

```mermaid
sequenceDiagram
    autonumber
    participant T as Admin / Técnico
    participant D as Dashboard Page
    participant S as Selector de Empresa (Select)
    participant LM as Lógica Mantenimiento (date-fns)
    participant C as Componente Gráfico (Recharts)

    T->>D: Accede al Dashboard
    D->>LM: fetch(assets) -> calcular estados
    Note right of LM: HU-004: Alertas de Mantenimiento
    LM-->>D: Retorna lista {isOverdue: boolean, daysUntil: number}
    D-->>T: Renderiza Lista (Rojo: Vencidos / Amarillo: Próximos)
    
    Note over T, C: HU-003: Filtrado Reactivo por Empresa
    T->>S: Selecciona Empresa "HYCO"
    S->>D: Disparar evento onValueChange
    D->>D: useMemo(recalcular activos filtrados)
    D->>C: Actualizar data del BarChart (Activos por Depto)
    D-->>T: Actualiza Tarjetas de Resumen y Listas
```

---

## 3. Gestión de Entidades: Empresas y Usuarios (HU-005 a HU-010)
Ciclo de vida de empresas y gestión de personal con validación de esquemas.

```mermaid
sequenceDiagram
    autonumber
    participant A as Administrador / Técnico
    participant P as Página Gestión (Empresas/Users)
    participant B as Barra de Búsqueda
    participant F as Formulario (Register/Company)
    participant DB as Mock DB Store

    Note over A, DB: HU-005: Búsqueda Rápida
    A->>B: Escribe caracteres de búsqueda
    B->>P: Actualizar estado 'searchTerm'
    P->>P: useMemo(filter items match term)
    P-->>A: Renderiza tabla filtrada instantáneamente

    Note over A, DB: HU-006 a HU-010: CRUD de Entidades
    A->>P: Clic en "Nuevo" o "Editar"
    P->>F: Abrir Modal con Formulario (Zod Resolver)
    A->>F: Completa/Modifica datos (ID, Nombre, Rol, etc.)
    F->>F: Validar con Schema (z.object)
    alt Datos Válidos
        A->>F: Clic en "Guardar / Registrar"
        F->>DB: Update/Create record en MockData
        DB-->>P: Notificar éxito
        P-->>A: Cerrar Modal y mostrar Toast de éxito
    else Datos Inválidos
        F-->>A: Resaltar campos con error (FormMessage)
    end
```

---

## 4. Gestión Integral de Activos (HU-011 a HU-017)
Detalla el proceso técnico, trazabilidad y control de inventario de equipos tecnológicos.

```mermaid
sequenceDiagram
    autonumber
    participant T as Técnico / Admin
    participant LA as Listado de Activos
    participant FD as Formulario Dinámico (AssetForm)
    participant VD as Vista Detalle (Hoja de Vida)
    participant PH as Proceso Historial
    participant PDF as Generador PDF
    participant PA as Papelera (Activos Eliminados)

    Note over T, FD: HU-011: Registro Técnico
    T->>LA: Clic en "Nuevo Activo"
    LA->>FD: Seleccionar Categoría (PC, UPS, Monitor)
    FD->>FD: Renderizar campos dinámicos (OS, RAM, Serial)
    T->>FD: Registra specs y asigna responsable
    FD->>LA: push(newAsset) + Toast Éxito

    Note over T, VD: HU-012 a HU-015: Gestión de Hoja de Vida
    T->>LA: Clic en icono "Ojo" (Detalle)
    LA->>VD: Cargar Specs + Timeline Historial
    T->>VD: Clic en "Añadir Historial" (HU-013)
    VD->>PH: Abrir modal de intervención
    T->>PH: Selecciona (Mantenimiento/Incidente) + Descripción
    PH-->>VD: Inserta en Timeline cronológico
    T->>VD: Clic en "Descargar PDF" (HU-015)
    VD->>PDF: Exportar Hoja de Vida Completa
    PDF-->>T: Descarga archivo .pdf (Specs + Historial)

    Note over T, PA: HU-016, HU-017: Baja y Restauración
    T->>LA: Clic en Papelera (Eliminar)
    LA->>LA: Mover a 'deletedAssets' con motivo de baja
    T->>PA: Clic en "Restaurar" (HU-017)
    PA-->>LA: Devolver activo a inventario operativo
```

---

## 5. Visualización Restringida: Rol Estándar (HU-018, HU-019)
Muestra cómo el sistema aplica la lógica de seguridad y privacidad para el usuario final.

```mermaid
sequenceDiagram
    autonumber
    participant U as Usuario Estándar
    participant S as LocalStorage
    participant P as Página Activos
    participant VD as Vista Detalle (Solo Lectura)

    U->>P: Accede a la sección
    P->>S: Obtener 'userIdNumber' y 'userName'
    P->>P: filter(assets => asset.responsable == userName)
    Note right of P: HU-018: Filtrado forzado de privacidad
    P-->>U: Renderiza tabla con equipos asignados únicamente
    U->>P: Clic en icono "Ojo" (HU-019)
    P->>VD: Abrir modal de detalles
    Note right of VD: Inhabilita botones de Editar, Borrar e Historial
    VD-->>U: Muestra información técnica protegida
```