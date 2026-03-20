# Diagramas de Análisis Detallado - Activos Pro (Proyecto de Grado)

Este documento contiene la representación técnica y lógica de los procesos fundamentales del sistema "Activos Pro". Estos diagramas están diseñados para sustentar la arquitectura de software y el flujo de datos del proyecto.

## 1. Diagrama de Secuencia: Autenticación y Control de Acceso
Este diagrama detalla el proceso desde el intento de acceso hasta la persistencia de la sesión y la protección de rutas basada en roles (RBAC).

```mermaid
sequenceDiagram
    autonumber
    participant U as Usuario
    participant L as Login Page (React)
    participant V as Validador (Zod Schema)
    participant M as Mock DB (users.ts)
    participant S as LocalStorage
    participant R as Router (Next.js)

    U->>L: Ingresa ID y Password
    L->>V: Validar formato de entrada
    alt Formato Inválido
        V-->>L: Retornar errores de validación
        L-->>U: Mostrar mensajes en campos (UI)
    else Formato Válido
        L->>M: Buscar usuario por ID
        alt Credenciales Incorrectas
            M-->>L: Usuario no encontrado / Clave errónea
            L-->>U: Mostrar Toast Error ("Credenciales Inválidas")
        else Credenciales Correctas
            M-->>L: Retornar Objeto Usuario {rol, nombre, id, email}
            L->>S: Guardar 'isAuthenticated': 'true'
            L->>S: Persistir 'userRole', 'userName', 'userIdNumber'
            L-->>U: Mostrar Toast Éxito ("Bienvenido...")
            L->>R: Redirigir a '/'
            R->>R: Evaluar Rol en HomePage
            alt Es Admin/Técnico
                R-->>U: Redirigir a '/dashboard'
            else Es Estándar
                R-->>U: Redirigir a '/assets' (Vista filtrada)
            end
        end
    end
```

---

## 2. Diagrama de Secuencia: Registro de Activo con Lógica Dinámica
Detalla el flujo de creación de activos, resaltando la selección de formularios específicos según la categoría técnica.

```mermaid
sequenceDiagram
    autonumber
    participant T as Técnico / Admin
    participant P as Página de Activos
    participant D as Diálogo (CreateAsset)
    participant S as Selector de Categoría
    participant F as Formulario Dinámico (React Hook Form)
    participant Z as Esquema Zod (Validation)
    participant ST as Estado Local (InitialAssets)

    T->>P: Clic en "Nuevo Activo"
    P->>D: Abrir Modal de Registro
    D->>S: Mostrar Opciones (PC, Monitor, UPS)
    T->>S: Selecciona "Equipo de cómputo"
    S->>F: Renderizar campos técnicos (CPU, RAM, OS, etc.)
    T->>F: Completa especificaciones y responsable
    T->>F: Clic en "Registrar Activo"
    F->>Z: Validar integridad de datos
    alt Datos Incompletos/Erróneos
        Z-->>F: Retornar errores de esquema
        F-->>T: Resaltar campos obligatorios en rojo
    else Datos Válidos
        F->>ST: push({id, ...data, status: 'Asignado'})
        ST-->>P: Actualizar tabla (re-render)
        P-->>T: Mostrar Toast ("Activo registrado con éxito")
        D->>D: Cerrar Modal
    end
```

---

## 3. Diagrama de Secuencia: Gestión de Hoja de Vida e Historial
Muestra cómo se mantiene la trazabilidad de un equipo a través de eventos de mantenimiento preventivo o correctivo.

```mermaid
sequenceDiagram
    autonumber
    participant A as Administrador
    participant DT as Detalle de Activo (View)
    participant H as Componente AssetHistory
    participant HF as Formulario de Historial
    participant DB as Mock History DB

    A->>DT: Clic en icono "Ojo" (Visualizar)
    DT->>DB: Consultar Historial por AssetID
    DB-->>H: Retornar Array de Eventos
    H-->>DT: Renderizar Timeline de eventos
    A->>DT: Clic en "Añadir Historial"
    DT->>HF: Abrir Formulario (Técnico, Tipo, Desc)
    A->>HF: Registra Mantenimiento Preventivo
    A->>HF: Clic en "Guardar Registro"
    HF->>DB: Actualizar registro (id_historial, fecha, desc)
    DB-->>H: Notificar cambio
    H-->>DT: Refrescar Timeline visualmente
    DT-->>A: Mostrar Toast ("Registro guardado")
```

---

## 4. Modelo Entidad-Relación Detallado (ERD)
Arquitectura de datos que soporta la integridad referencial y el seguimiento de activos.

```mermaid
erDiagram
    COMPANIA ||--o{ USUARIO : "emplea"
    COMPANIA ||--o{ ACTIVO : "es propietaria de"
    USUARIO ||--o{ ACTIVO : "es responsable de"
    ACTIVO ||--o{ HISTORIAL : "registra eventos en"
    USUARIO ||--o{ HISTORIAL : "realiza (Técnico)"

    COMPANIA {
        string id_empresa PK
        string nombre_social
        string ciudad
        string nit
    }

    USUARIO {
        string id_number PK
        string email
        string nombre_completo
        string rol "admin | tecnico | estandar"
        string departamento
        string ubicacion_fisica
    }

    ACTIVO {
        string id_activo PK "LAP-001, UPS-05..."
        string serial_number UK
        string nombre_equipo
        string categoria "PC | Monitor | UPS"
        date fecha_compra
        string factura_nro
        string marca
        string modelo
        string estado "Asignado | En Almacen | Baja"
        string especificaciones_json "CPU, RAM, OS, etc."
    }

    HISTORIAL {
        string id_evento PK
        string id_activo FK
        date fecha_evento
        string tipo_evento "Mantenimiento | Incidente | Baja"
        string descripcion_tecnica
        string tecnico_nombre FK
    }
```
