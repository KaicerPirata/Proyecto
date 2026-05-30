# Activos Pro - Sistema de Gestión de Inventario Tecnológico

Este es un sistema profesional diseñado para la gestión, seguimiento y mantenimiento de activos tecnológicos (Computadores, Monitores, UPS), desarrollado como proyecto de grado.

## 🚀 Características Principales

- **Dashboard Administrativo**: Resumen en tiempo real de activos, usuarios y mantenimientos próximos.
- **Gestión de Inventario Dinámico**: Registro detallado de hardware con soporte para múltiples módulos de RAM (con bloqueo de compatibilidad) y múltiples unidades de disco.
- **Catálogo Técnico Gestionable**: Módulo para que el administrador defina marcas, modelos, procesadores y componentes disponibles en el sistema.
- **Hoja de Vida Técnica**: Trazabilidad completa de mantenimientos, incidentes e instalaciones por equipo.
- **Control de Acceso (RBAC)**: Roles de Administrador, Técnico y Estándar con permisos específicos y vistas personalizadas.
- **Validación Robusta**: Implementación de esquemas de validación con Zod para asegurar la integridad de los datos técnicos.

## 🛠️ Tecnologías Utilizadas

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS + ShadCN UI
- **Validación**: Zod
- **Iconos**: Lucide React
- **Gráficos**: Recharts
- **Gestión de Formularios**: React Hook Form

## 📦 Estructura del Proyecto

- `src/app`: Rutas y páginas principales del sistema.
- `src/components`: Componentes atómicos y de interfaz de usuario.
- `src/lib`: Lógica de negocio, esquemas de validación y base de datos simulada (Mock DB).
- `docs/`: Archivos de documentación técnica para la tesis.

## 📄 Documentación Técnica

Para la revisión de la tesis, consulte los siguientes archivos en la raíz:
- `DOCUMENTACION.md`: Arquitectura, capas del sistema y modelo relacional de datos.
- `DIAGRAMAS.md`: Diagramas UML de clases y diagramas de secuencia de procesos.
- `MANUAL.md`: Guía de usuario detallada por perfiles.

---
**Desarrollado con fines académicos para el Proyecto de Grado.**
