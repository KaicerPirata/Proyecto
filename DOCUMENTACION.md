# Documentación Técnica del Sistema "Activos Pro"

## 1. Arquitectura de la Aplicación
El sistema está construido bajo una arquitectura de **Frontend-First** con **Next.js 15**, utilizando el patrón de diseño de **Componentes Atómicos**. La lógica se divide en cuatro capas fundamentales:

- **Capa de Presentación (UI)**: Desarrollada con React, Tailwind CSS y la librería ShadCN UI. Se implementó un diseño de formulario **estrictamente vertical** para mejorar la legibilidad técnica.
- **Capa de Negocio (Logic)**: Gestión de estado mediante hooks de React y validación estricta de esquemas de datos con Zod.
- **Capa de Datos (Mock DB)**: Implementación de una base de datos simulada centralizada (`mock-data.ts`).
- **Capa de AI (Genkit)**: Integración lista para análisis predictivo.

## 2. Lógica de Hardware Avanzada
El sistema implementa reglas de integridad física para el inventario:

### 2.1. Gestión de Memoria RAM (Integridad de Bus)
- **Multi-módulo**: Soporte para N cantidad de módulos.
- **Compatibilidad**: El sistema captura el tipo de RAM (DDR) del primer módulo y lo bloquea/aplica automáticamente a los módulos subsiguientes. Esto previene errores humanos al registrar memorias con buses incompatibles en un mismo equipo.

### 2.2. Gestión de Almacenamiento (Multi-Unidad)
- **Independencia de Tecnología**: Permite registrar múltiples discos (ej: un M.2 para sistema y un HDD para datos) permitiendo que cada unidad tenga su propio tipo y capacidad de forma independiente.

### 2.3. Hoja de Vida Técnica
- Los roles de **Administrador** y **Técnico** tienen acceso a una vista detallada que desglosa cada componente de hardware y licencias de software (Keys), permitiendo una trazabilidad completa del activo.

## 3. Control de Acceso (RBAC)
- **Admin**: Control total.
- **Técnico**: Gestión de activos y usuarios (sin gestión de empresas).
- **Estándar**: Consulta exclusiva de activos asignados.
