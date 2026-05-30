
# Documentación Técnica del Sistema "Activos Pro"

## 1. Arquitectura de la Aplicación
El sistema está construido bajo una arquitectura de **Frontend-First** con **Next.js 15**, utilizando el patrón de diseño de **Componentes Atómicos**. La lógica se divide en cuatro capas fundamentales:

- **Capa de Presentación (UI)**: Desarrollada con React, Tailwind CSS y la librería ShadCN UI para una interfaz profesional y accesible.
- **Capa de Negocio (Logic)**: Gestión de estado mediante hooks de React y validación estricta de esquemas de datos con Zod.
- **Capa de Datos (Mock DB)**: Implementación de una base de datos simulada centralizada (`mock-data.ts`) que gestiona la persistencia en memoria durante la sesión.
- **Capa de AI (Genkit)**: Integración con Genkit para análisis predictivo de mantenimientos y asistencia inteligente (opcional).

## 2. Modelo Relacional de Datos (Entidad-Relación)
El sistema gestiona la integridad referencial a través de las siguientes entidades lógicas:

- **Empresa (PK: id)**: Entidad maestra que agrupa usuarios y activos por cliente corporativo.
- **Usuario (PK: idNumber, FK: companyName)**: Entidades con roles (Admin, Técnico, Estándar) que definen el acceso mediante RBAC (Role-Based Access Control).
- **Activo (PK: id, FK: responsableName)**: Entidad central que registra hardware (CPU, RAM, Discos) y software (Licencias, Hostname).
- **HistorialActivo (PK: id, FK: assetId)**: Trazabilidad cronológica de intervenciones técnicas e incidentes.
- **Catálogo Técnico**: Motor de estandarización que provee los valores válidos para el registro de hardware, evitando la fragmentación de datos.

## 3. Lógica de Negocio Específica
### 3.1. Gestión Multi-Hardware
El sistema permite el registro de múltiples unidades de RAM y Disco para un solo activo. Implementa una regla de validación de negocio donde la RAM secundaria debe ser obligatoriamente del mismo tipo (DDR) que el módulo primario para garantizar la compatibilidad física.

### 3.2. Gestión de Ciclo de Vida
Los activos no se eliminan físicamente del sistema, sino que se marcan como "Bajas" en un histórico, conservando toda su hoja de vida técnica para auditorías futuras.
