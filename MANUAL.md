# Manual de Usuario - Sistema de Gestión de Activos "Activos Pro"

## 1. Introducción

Bienvenido a **Activos Pro**, el sistema diseñado para facilitar la gestión, seguimiento y mantenimiento de los activos tecnológicos de su organización.

Este manual proporciona una guía detallada sobre cómo utilizar la plataforma según los tres perfiles de usuario disponibles: **Administrador**, **Técnico** y **Estándar**.

## 2. Inicio de Sesión

Para acceder a la plataforma, siga estos pasos:

1.  Abra la aplicación en su navegador.
2.  Introduzca su **ID de usuario** (número de identificación) en el campo "Usuario".
3.  Introduzca su **contraseña**.
4.  Haga clic en el botón **"Iniciar Sesión"**.

Si olvida su contraseña, utilice el enlace "¿Olvidaste tu contraseña?" y siga las instrucciones.

---

## 3. Perfil: Administrador

El perfil de **Administrador** tiene acceso total a todas las funcionalidades del sistema. A continuación se detalla cada módulo y las acciones que puede realizar.

### 3.1. Módulo: Inicio (Dashboard)

- **Función Principal:** Visualizar un resumen ejecutivo y en tiempo real del estado de todos los activos y tareas del sistema.

- **Sub-acciones y Funcionalidades:**
    - **Filtrar por Empresa:**
        - **Acción:** Usar el menú desplegable en la esquina superior derecha para seleccionar una empresa específica o ver "Todas las Empresas".
        - **Resultado:** Todos los componentes del dashboard (tarjetas, gráficos, lista de mantenimientos) se actualizan instantáneamente para reflejar solo la información de la entidad seleccionada.
    - **Consultar Tarjetas de Resumen:**
        - **Acción:** Observar las tres tarjetas principales: "Activos Totales", "Total de Usuarios" y "Tareas Abiertas".
        - **Resultado:** Obtener una cifra clara y rápida de los indicadores más importantes, como la cantidad de equipos gestionados o el número de mantenimientos pendientes.
    - **Analizar Gráfico de Activos por Departamento:**
        - **Acción:** Ver el gráfico de barras que desglosa la cantidad de activos por cada departamento de la empresa.
        - **Resultado:** Entender visualmente qué áreas concentran la mayor cantidad de recursos tecnológicos, facilitando la toma de decisiones.
    - **Revisar Próximos Mantenimientos:**
        - **Acción:** Examinar la lista de equipos que requieren mantenimiento. Los equipos con mantenimiento **vencido** se marcan en rojo y los **próximos** en amarillo.
        - **Resultado:** Identificar proactivamente los equipos que necesitan atención para planificar el trabajo del equipo técnico.
    - **Navegar a Detalles del Activo:**
        - **Acción:** Hacer clic sobre cualquier equipo en la lista de "Próximos Mantenimientos".
        - **Resultado:** El sistema lo redirigirá a la página de "Activos" y abrirá automáticamente la ventana de detalles para ese equipo específico, permitiendo una consulta rápida y directa.

### 3.2. Módulo: Empresas

- **Función Principal:** Administrar el catálogo de empresas o clientes cuyos activos se gestionan en la plataforma.

- **Sub-acciones y Funcionalidades:**
    - **Listar y Ver Empresas:**
        - **Acción:** Acceder a la sección "Empresas" desde el menú lateral.
        - **Resultado:** Visualizar una tabla centralizada con todas las empresas registradas, mostrando su ID, Nombre/Razón Social y Ciudad.
    - **Buscar Empresas (Búsqueda Rápida):**
        - **Acción:** Escribir en la barra "Buscar empresa..." en la parte superior de la tabla.
        - **Resultado:** La tabla se filtra en tiempo real a medida que escribe, mostrando únicamente las empresas que coinciden con su búsqueda.
    - **Filtrar Empresas (Búsqueda Avanzada):**
        - **Acción:** Hacer clic en "Búsqueda Avanzada" para desplegar los filtros. Puede seleccionar una "Ciudad" o un "Estado" (Activo/Inactivo).
        - **Resultado:** La tabla acota los resultados para mostrar solo las empresas que cumplen con los criterios de filtro seleccionados.
    - **Crear Nueva Empresa:**
        - **Acción:** Pulsar el botón **"Nueva Empresa"**, rellenar el formulario emergente con el ID, Nombre y Ciudad, y finalmente pulsar "Registrar Empresa".
        - **Resultado:** La nueva empresa se añade al listado general y queda disponible para asociar usuarios y activos.
    - **Editar Empresa:**
        - **Acción:** Localizar la empresa en la tabla y hacer clic en el icono del lápiz (✏️). Se abrirá el formulario con los datos actuales. Modifique la información necesaria y guarde los cambios.
        - **Resultado:** Los datos de la empresa (como su nombre o ciudad) se actualizan en todo el sistema.
    - **Eliminar Empresa:**
        - **Acción:** Hacer clic en el icono de la papelera (🗑️) de la empresa que desea borrar y confirmar la acción en el cuadro de diálogo.
        - **Resultado:** La empresa se elimina permanentemente del sistema. Esta acción es irreversible.

### 3.3. Módulo: Usuarios

- **Función Principal:** Gestionar todas las cuentas de usuario, sus roles y permisos de acceso a la plataforma.

- **Sub-acciones y Funcionalidades:**
    - **Listar y Ver Usuarios:**
        - **Acción:** Acceder a la sección "Usuarios".
        - **Resultado:** Ver una tabla con todos los usuarios, incluyendo su nombre, email, empresa a la que pertenecen y el rol asignado.
    - **Buscar y Filtrar Usuarios:**
        - **Acción:** Utilizar la barra de búsqueda rápida para encontrar a alguien por nombre o email, o usar la "Búsqueda Avanzada" para filtrar por Empresa, Rol y Estado.
        - **Resultado:** Localizar rápidamente a un usuario específico o a un grupo de usuarios que compartan características.
    - **Crear Nuevo Usuario:**
        - **Acción:** Pulsar "Nuevo Usuario", completar el formulario de registro con los datos personales, de contacto, y asignar una Empresa y un Rol (Admin, Técnico, Estándar).
        - **Resultado:** Se crea una nueva cuenta de usuario con los permisos definidos por su rol.
    - **Editar Usuario:**
        - **Acción:** Hacer clic en el icono de lápiz (✏️) del usuario deseado. Se podrá modificar toda su información, excepto la contraseña.
        - **Resultado:** La información del perfil del usuario se actualiza.
    - **Eliminar Usuario:**
        - **Acción:** Hacer clic en el icono de papelera (🗑️) del usuario y confirmar.
        - **Resultado:** El usuario es eliminado permanentemente y pierde el acceso al sistema.

### 3.4. Módulo: Activos

- **Función Principal:** Realizar la gestión completa del ciclo de vida de todos los activos tecnológicos, desde su registro hasta su baja.

- **Sub-acciones y Funcionalidades:**
    - **Listar y Filtrar Activos:**
        - **Acción:** En la pestaña "Listado de Activos", usar la búsqueda rápida o la "Búsqueda Avanzada" (filtrando por Responsable, Empresa, Categoría o Estado).
        - **Resultado:** Encontrar rápidamente cualquier equipo registrado en el sistema.
    - **Crear Nuevo Activo:**
        - **Acción:** Pulsar "Nuevo Activo", seleccionar el tipo de activo (Equipo de Cómputo, Monitor, UPS), y completar el formulario correspondiente con todas sus especificaciones técnicas y de compra.
        - **Resultado:** Un nuevo activo es ingresado al inventario digital, listo para ser asignado y gestionado.
    - **Ver Detalles de un Activo:**
        - **Acción:** Hacer clic en el icono del ojo (👁️) en la fila de cualquier activo.
        - **Resultado:** Abrir una ventana con la "hoja de vida" completa del activo: todas sus especificaciones técnicas y un historial cronológico de cada mantenimiento, incidente o cambio.
    - **Añadir Registro al Historial:**
        - **Acción:** Desde la vista de detalles, pulsar "Añadir Historial", seleccionar si es un Mantenimiento o Incidente, describir el trabajo realizado y guardar.
        - **Resultado:** Se añade una nueva entrada al historial del activo, creando una trazabilidad completa de su mantenimiento.
    - **Editar Características de un Activo:**
        - **Acción:** Desde la vista de detalles, pulsar "Editar", modificar la información técnica (como procesador, RAM, etc.) y guardar.
        - **Resultado:** La información del activo se actualiza para reflejar cualquier cambio de hardware.
    - **Cambiar Responsable de un Activo:**
        - **Acción:** Desde la vista de detalles, pulsar "Cambiar Responsable" y seleccionar un nuevo usuario de la lista.
        - **Resultado:** El activo se reasigna a otro usuario, transfiriendo la responsabilidad del equipo.
    - **Descargar Hoja de Vida (PDF):**
        - **Acción:** Desde la vista de detalles del activo, pulsar el botón "Descargar PDF".
        - **Resultado:** Generar y descargar un documento PDF con toda la información y el historial completo del activo, ideal para informes y auditorías.
    - **Dar de Baja un Activo:**
        - **Acción:** En la tabla principal, pulsar el icono de papelera (🗑️), escribir un motivo para la baja (ej: dañado, obsoleto) y confirmar.
        - **Resultado:** El activo se mueve a la pestaña "Activos Eliminados", liberándolo del inventario activo pero conservando su registro histórico.
    - **Consultar y Restaurar Activos Eliminados:**
        - **Acción:** Navegar a la pestaña "Activos Eliminados" y pulsar el botón "Restaurar" en un activo.
        - **Resultado:** El activo vuelve al listado principal y queda operativo de nuevo, en caso de que la baja fuera un error.

---

## 4. Perfil: Técnico

El Técnico tiene permisos para gestionar usuarios y activos, pero no puede gestionar empresas.

### 4.1. Inicio (Dashboard)

El Técnico tiene acceso al mismo panel de control que el Administrador, con resúmenes visuales de activos y mantenimientos.

### 4.2. Gestión de Usuarios

El Técnico tiene los mismos permisos que el Administrador para **crear, editar y eliminar usuarios**, como se describe en la sección 3.3.

### 4.3. Gestión de Activos

El técnico tiene los mismos permisos y funcionalidades que el Administrador en el módulo de activos, descritos en la sección 3.4.

---

## 5. Perfil: Estándar

El usuario Estándar tiene un perfil de solo consulta, limitado a los activos que tiene asignados.

### 5.1. Vista Principal (Mis Activos)

Al iniciar sesión, el usuario Estándar es dirigido directamente a la vista de **Activos**. No tiene acceso al Dashboard, Empresas ni Usuarios.

1.  **Ver sus Activos Asignados:**
    *   La tabla principal mostrará **únicamente** los equipos que están bajo su responsabilidad.
2.  **Ver Detalles e Historial:**
    *   Haga clic en el icono del ojo (👁️) en la fila de uno de sus activos.
    *   Se abrirá una ventana donde podrá ver todas las **especificaciones técnicas** del equipo y su **historial completo** de mantenimientos e incidentes.
    *   **No puede** editar, eliminar, ni añadir registros al historial.
