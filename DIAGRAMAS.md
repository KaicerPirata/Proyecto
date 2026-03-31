# Diagramas Técnicos de Análisis - Activos Pro (Proyecto de Grado)

Este documento contiene la representación técnica avanzada de la arquitectura de software y los procesos del sistema, vinculados a las Historias de Usuario (HU).

---

## 1. Diagrama de Clases (Estructura de Datos)
Este diagrama representa el modelo de datos robusto, definiendo atributos, tipos y relaciones de integridad referencial.

```mermaid
classDiagram
    class Empresa {
        +Int id [PK]
        +String companyId [Unique]
        +String name
        +String city
        +Enum status [Active, Inactive]
    }

    class Usuario {
        +Int id [PK]
        +String idNumber [Unique]
        +String firstName
        +String middleName
        +String lastName
        +String secondLastName
        +String email [Unique]
        +String password
        +Enum role [Admin, Tecnico, Estandar]
        +Enum status [Active, Inactive]
        +String companyName [FK]
        +String department
        +String city
        +String location
    }

    class Activo {
        +String id [PK]
        +String assetName
        +Enum category [Computador, Monitor, UPS]
        +Enum status [Asignado, En Almacen, Eliminado]
        +String companyName [FK]
        +String responsableName [FK]
        +String serialNumber [Unique]
        +Date purchaseDate
        +String invoiceNumber
        +String brand
        +String model
        +String city
        +String processor
        +String ram
        +String storage
        +String os
        +String osKey
        +String officeVersion
        +String officeKey
        +String description
    }

    class HistorialActivo {
        +Int id [PK]
        +String assetId [FK]
        +Date date
        +String author [FK]
        +Enum type [Mantenimiento, Incidente, Instalacion, Asignacion]
        +String description
    }

    Empresa "1" -- "0..*" Usuario : gestiona
    Empresa "1" -- "0..*" Activo : posee
    Usuario "1" -- "0..*" Activo : es responsable de
    Activo "1" -- "0..*" HistorialActivo : registra cambios
    Usuario "1" -- "0..*" HistorialActivo : realiza intervenciones
```

---

## 2. Proceso de Autenticación y Seguridad (HU-001, HU-002)
Detalla el flujo desde la interfaz hasta la validación de roles y persistencia de sesión.

```mermaid
sequenceDiagram
    autonumber
    participant U as Usuario
    participant L as Login UI (Next.js)
    participant V as Zod Validator
    participant DB as Mock DB (Auth)
    participant S as LocalStorage (Session)
    participant R as Router (Next.js)

    Note over U, R: HU-001: Inicio de Sesión
    U->>L: Ingresa ID y Contraseña
    L->>V: Validar formato (registerSchema)
    alt Formato Inválido
        V-->>L: Retorna errores de campo
        L-->>U: Resalta campos (Toast Error)
    else Formato Válido
        L->>DB: Consultar credenciales
        alt Credenciales Correctas
            DB-->>L: Retorna User {role, name, idNumber}
            L->>S: Guardar Token y Perfil (setItem)
            L-->>U: Toast: "Bienvenido [Nombre]"
            L->>R: Redirigir según Rol
            Note right of R: Admin/Tecnico -> /dashboard<br/>Estandar -> /assets
        else Credenciales Incorrectas
            DB-->>L: Error 401 (Unauthorized)
            L-->>U: Toast: "Usuario o clave incorrectos"
        end
    end

    Note over U, R: HU-002: Recuperación
    U->>L: Clic "¿Olvidaste contraseña?"
    L->>L: Abrir DialogRecuperacion
    U->>L: Ingresa Correo
    L->>DB: Validar existencia correo
    DB-->>L: Confirmación envío
    L-->>U: Toast: "Enlace enviado al correo"
```

---

## 3. Gestión Integral de Activos y Trazabilidad (HU-011 a HU-017)
Ciclo de vida técnico de un equipo, incluyendo mantenimiento y bajas lógicas.

```mermaid
sequenceDiagram
    autonumber
    participant T as Técnico / Admin
    participant LA as Pantalla Activos
    participant AF as Formulario Activo (Zod)
    participant VD as Vista Detalle (Hoja de Vida)
    participant PH as Proceso Historial
    participant DB as Mock Data Store

    Note over T, DB: HU-011: Registro de Activo
    T->>LA: Clic "Nuevo Activo"
    LA->>AF: Seleccionar Categoría
    Note right of AF: Carga campos específicos<br/>(RAM, OS para PC / VA para UPS)
    T->>AF: Completa Specs + Serial
    AF->>DB: Push nuevo registro
    DB-->>LA: Actualiza Tabla + Toast Éxito

    Note over T, DB: HU-012, HU-013: Gestión de Mantenimiento
    T->>LA: Clic icono "Ojo" (Detalle)
    LA->>VD: Cargar Specs + Timeline
    T->>VD: Clic "Añadir Historial"
    VD->>PH: Abrir Modal Intervención
    T->>PH: Selecciona Tipo (Mantenimiento) + Descrip.
    PH->>DB: Update assetHistory[assetId]
    DB-->>VD: Renderiza nueva entrada en Timeline

    Note over T, DB: HU-016, HU-017: Baja y Restauración
    T->>LA: Clic Papelera (HU-016)
    LA->>LA: Abrir AlertDialog
    T->>LA: Ingresa Motivo (Dañado) + Confirmar
    LA->>DB: Mover a deletedAssets[]
    DB-->>LA: Quitar de tabla activa
    
    T->>LA: Pestaña "Eliminados" (HU-017)
    T->>LA: Clic "Restaurar"
    LA->>DB: Mover a assets[]
    DB-->>LA: Regresa a tabla principal
```

---

## 4. Lógica de Privacidad: Rol Estándar (HU-018, HU-019)
Muestra cómo el sistema restringe datos basándose en la identidad del usuario logueado.

```mermaid
sequenceDiagram
    autonumber
    participant U as Usuario Estándar
    participant S as LocalStorage
    participant P as Página /assets
    participant DB as Data Store

    U->>P: Accede a la ruta
    P->>S: getItem('userIdNumber')
    P->>DB: fetch(allAssets)
    Note right of P: HU-018: Filtrado en Cliente
    P->>P: assets.filter(a => a.responsable == userName)
    P-->>U: Renderiza Tabla (Solo mis equipos)
    
    U->>P: Clic en Detalle (HU-019)
    P->>P: Disable Edit/Delete Buttons
    P-->>U: Muestra Hoja de Vida (Solo Lectura)
```
