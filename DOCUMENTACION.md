
# Documentación Técnica del Sistema "Activos Pro"

## 1. Arquitectura de la Aplicación
El sistema está construido bajo una arquitectura de **Frontend-First** con **Next.js 15**, utilizando el patrón de diseño de **Componentes Atómicos**. La lógica se divide en:
- **Capa de Presentación**: React + Tailwind CSS + ShadCN UI.
- **Capa de Negocio**: Hooks personalizados y validación con Zod.
- **Capa de Datos**: Mock DB centralizada preparada para migración a SQL/NoSQL.

## 2. Modelo Relacional de Datos
El sistema gestiona la integridad referencial a través de las siguientes entidades:
- **Empresa (PK: id)**: Entidad maestra de clientes.
- **Usuario (PK: idNumber, FK: companyName)**: Responsables y operadores.
- **Activo (PK: id, FK: responsableName)**: Entidad central con especificaciones de hardware dinámicas.
- **HistorialActivo (PK: id, FK: assetId)**: Trazabilidad completa de mantenimientos.

## 3. Catálogo Técnico Dinámico
Se implementó un motor de catálogo que permite al personal de tecnología estandarizar los componentes, evitando errores de digitación en RAM, Discos y Procesadores.
