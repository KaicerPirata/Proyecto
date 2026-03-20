# Diagramas de Análisis - Activos Pro

Este documento contiene diagramas que refuerzan el análisis funcional y técnico de la aplicación, permitiendo visualizar la interacción entre los componentes del sistema.

## 1. Diagrama de Secuencia: Autenticación (Login)

Este diagrama describe el flujo desde que el usuario ingresa sus credenciales hasta que es redirigido al panel correspondiente según su rol.

```mermaid
sequenceDiagram
    participant Usuario
    participant PantallaLogin as Login Page
    participant Almacenamiento as LocalStorage
    participant Navegador as Router

    Usuario->>PantallaLogin: Ingresa ID y Contraseña
    PantallaLogin->>PantallaLogin: Validar credenciales (Mock Data)
    
    alt Credenciales Válidas
        PantallaLogin->>Almacenamiento: Guardar userRole, userName, userId
        PantallaLogin->>Almacenamiento: Set isAuthenticated = 'true'
        PantallaLogin->>Navegador: Redirigir a '/'
        Navegador->>Navegador: Evaluar Rol (Admin/Tech vs Estandar)
        Navegador-->>Usuario: Muestra Dashboard o Lista de Activos
    else Credenciales Inválidas
        PantallaLogin-->>Usuario: Mostrar mensaje de error (Toast)
    end
```

---

## 2. Diagrama de Secuencia: Registro de Nuevo Activo

Muestra la interacción necesaria para ingresar un nuevo equipo al inventario, incluyendo la selección dinámica de formularios.

```mermaid
sequenceDiagram
    participant Admin as Administrador / Técnico
    participant VistaActivos as Página de Activos
    participant Selector as Selector de Tipo
    participant Formulario as Formulario Dinámico
    participant Estado as Estado Local (Mock)

    Admin->>VistaActivos: Click en "Nuevo Activo"
    VistaActivos->>Selector: Mostrar opciones (PC, Monitor, UPS)
    Admin->>Selector: Selecciona un tipo (Ej: UPS)
    Selector->>Formulario: Renderizar campos para UPS
    Admin->>Formulario: Completa datos técnicos
    Admin->>Formulario: Click en "Registrar Activo"
    Formulario->>Formulario: Validar esquema (Zod)
    Formulario->>Estado: Agregar activo a la lista
    Estado-->>VistaActivos: Refrescar Tabla de Activos
    VistaActivos-->>Admin: Mostrar Notificación de Éxito
```

---

## 3. Diagrama de Secuencia: Gestión de Historial (Hoja de Vida)

Ilustra cómo se registra un evento de mantenimiento o incidente en la hoja de vida de un activo existente.

```mermaid
sequenceDiagram
    participant Admin as Administrador / Técnico
    participant Detalle as Diálogo de Detalles
    participant HistorialForm as Formulario de Historial
    participant MockData as Mock History DB

    Admin->>Detalle: Click en "Ver Equipo" (Ojo)
    Detalle->>MockData: Consultar historial por ID
    MockData-->>Detalle: Retornar lista de eventos
    Admin->>Detalle: Click en "Añadir Historial"
    Detalle->>HistorialForm: Mostrar formulario de registro
    Admin->>HistorialForm: Ingresa Técnico, Tipo y Descripción
    Admin->>HistorialForm: Click en "Guardar Registro"
    HistorialForm->>MockData: Insertar nuevo evento
    MockData-->>Detalle: Historial actualizado
    Detalle-->>Admin: Mostrar nueva entrada en la lista
```

---

## 4. Diagrama de Arquitectura de Datos (Simplificado)

Relación entre las entidades principales del sistema.

```mermaid
erDiagram
    EMPRESA ||--o{ USUARIO : "pertenece"
    EMPRESA ||--o{ ACTIVO : "posee"
    USUARIO ||--o{ ACTIVO : "es responsable de"
    ACTIVO ||--o{ HISTORIAL : "tiene"
    USUARIO ||--o{ HISTORIAL : "registra (técnico)"

    EMPRESA {
        string id_empresa
        string nombre
        string ciudad
    }

    USUARIO {
        string id_number
        string nombre
        string rol
        string email
    }

    ACTIVO {
        string serial
        string nombre
        string categoria
        date fecha_compra
    }

    HISTORIAL {
        date fecha
        string tipo
        string descripcion
        string autor
    }
```