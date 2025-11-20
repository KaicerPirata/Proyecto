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

El Administrador tiene acceso completo a todas las funcionalidades del sistema.

### 3.1. Inicio (Dashboard)

Al iniciar sesión, verá el panel principal con un resumen de la información clave:
*   **Tarjetas de Resumen:** Activos totales, usuarios totales y tareas de mantenimiento pendientes.
*   **Filtro por Empresa:** Puede filtrar los datos del dashboard seleccionando una empresa específica.
*   **Gráfico de Activos:** Una visualización de cómo se distribuyen los activos por departamento.
*   **Próximos Mantenimientos:** Una lista de los equipos que requieren mantenimiento preventivo próximamente o que ya están vencidos.

### 3.2. Gestión de Empresas

1.  **Ver Empresas:** En el menú lateral, haga clic en **Empresas**. Verá una tabla con todas las empresas registradas.
2.  **Crear Nueva Empresa:**
    *   Haga clic en el botón **"Nueva Empresa"**.
    *   Complete el formulario con el ID, Razón Social y Ciudad.
    *   Haga clic en **"Registrar Empresa"**.
3.  **Editar Empresa:**
    *   En la tabla, haga clic en el icono del lápiz (✏️) en la fila de la empresa que desea modificar.
    *   Actualice los datos en el formulario y haga clic en **"Guardar Cambios"**.
4.  **Eliminar Empresa:**
    *   Haga clic en el icono de la papelera (🗑️) en la fila correspondiente.
    *   Confirme la eliminación en el cuadro de diálogo.

### 3.3. Gestión de Usuarios

1.  **Ver Usuarios:** En el menú lateral, haga clic en **Usuarios**. Verá una lista de todos los usuarios del sistema.
2.  **Crear Nuevo Usuario:**
    *   Haga clic en el botón **"Nuevo Usuario"**.
    *   Complete todos los campos del formulario, incluyendo la asignación de una **empresa** y un **rol** (Admin, Tecnico, Estandar).
    *   Haga clic en **"Registrar"**.
3.  **Editar Usuario:**
    *   Haga clic en el icono del lápiz (✏️) en la fila del usuario.
    *   Modifique la información necesaria y haga clic en **"Guardar Cambios"**.
4.  **Eliminar Usuario:**
    *   Haga clic en el icono de la papelera (🗑️) en la fila del usuario.
    *   Confirme la acción.

### 3.4. Gestión de Activos

El Administrador puede realizar todas las acciones sobre los activos:
*   **Crear, editar y dar de baja** cualquier tipo de activo (Equipo de cómputo, Monitor, UPS).
*   **Ver el detalle completo** y el historial de cualquier activo.
*   **Añadir registros al historial** (mantenimientos, incidentes).
*   **Cambiar el responsable** de un activo.
*   **Restaurar activos** desde la papelera.

El funcionamiento es idéntico al del perfil Técnico (ver sección 4.3).

---

## 4. Perfil: Técnico

El Técnico tiene permisos para gestionar usuarios y activos, pero no puede gestionar empresas.

### 4.1. Inicio (Dashboard)

El Técnico tiene acceso al mismo panel de control que el Administrador, con resúmenes visuales de activos y mantenimientos.

### 4.2. Gestión de Usuarios

El Técnico tiene los mismos permisos que el Administrador para **crear, editar y eliminar usuarios**, como se describe en la sección 3.3.

### 4.3. Gestión de Activos

1.  **Ver Activos:** En el menú lateral, haga clic en **Activos**. Verá dos pestañas: "Listado de Activos" y "Activos Eliminados".
2.  **Crear Nuevo Activo:**
    *   Haga clic en **"Nuevo Activo"**.
    *   Seleccione el tipo de activo (Equipo de cómputo, Monitor o UPS).
    *   Complete el formulario detallado con toda la información del equipo.
    *   Haga clic en **"Registrar Activo"**.
3.  **Ver Detalles de un Activo:**
    *   En la tabla, haga clic en el icono del ojo (👁️) de un activo.
    *   Se abrirá una ventana con las especificaciones técnicas completas y el **historial de mantenimientos e incidentes**.
4.  **Añadir Historial a un Activo:**
    *   Desde la vista de detalles del activo, haga clic en **"Añadir Historial"**.
    *   Complete el formulario indicando el técnico, el tipo de registro (Mantenimiento o Incidente) y la descripción del trabajo.
    *   Haga clic en **"Guardar Registro"**.
5.  **Editar un Activo:**
    *   Desde la vista de detalles, haga clic en **"Editar"**.
    *   Modifique los campos necesarios y guarde los cambios.
6.  **Dar de Baja un Activo:**
    *   En la tabla principal, haga clic en el icono de la papelera (🗑️).
    *   Introduzca el motivo de la baja y confirme. El activo se moverá a la pestaña "Activos Eliminados".

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
