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

El perfil de **Administrador** es el más completo y tiene acceso total a todas las funcionalidades del sistema. Esta guía detalla cada módulo disponible para este perfil.

### 3.1. Módulo: Inicio (Dashboard)

El Dashboard es la pantalla principal que aparece al iniciar sesión. Ofrece un resumen visual y rápido del estado general del sistema.

**¿Qué encontrará en el Dashboard?**

1.  **Filtro por Empresa:**
    *   En la parte superior derecha, verá un menú desplegable que por defecto dice "Todas las Empresas".
    *   **Acción:** Haga clic en él para seleccionar una empresa específica. Todos los datos del Dashboard (tarjetas, gráficos y listas) se actualizarán automáticamente para mostrar únicamente la información de esa empresa.

2.  **Tarjetas de Resumen:**
    *   **Activos Totales:** Muestra el número total de activos registrados en la empresa seleccionada.
    *   **Total de Usuarios:** Indica la cantidad de usuarios pertenecientes a esa empresa.
    *   **Tareas Abiertas:** Contabiliza los mantenimientos que están próximos a vencer o ya vencidos.

3.  **Gráfico de Activos por Departamento:**
    *   Este gráfico de barras muestra visualmente cómo se distribuyen los activos entre los diferentes departamentos de la empresa (Ej: Tecnología, Ventas, Operaciones).
    *   **Utilidad:** Permite identificar rápidamente qué áreas concentran más equipos.

4.  **Próximos Mantenimientos:**
    *   Es una lista de los equipos (computadores y UPS) que requieren mantenimiento preventivo.
    *   **Estado "Vencido":** Marcado en rojo, indica que la fecha de mantenimiento ya pasó.
    *   **Estado "Próximo":** Marcado en amarillo, indica que el mantenimiento debe realizarse pronto.
    *   **Acción:** Puede hacer clic en cualquier equipo de la lista para ser redirigido automáticamente a la página de **Activos**, donde se abrirán los detalles completos de ese equipo.

### 3.2. Módulo: Empresas

Esta sección le permite gestionar las diferentes empresas o clientes cuyos activos se administran en la plataforma.

1.  **Ver y Buscar Empresas:**
    *   Al acceder, verá una tabla con todas las empresas registradas.
    *   **Búsqueda Rápida:** Use la barra "Buscar empresa..." para encontrar una empresa por su nombre, ID o ciudad. La tabla se filtrará a medida que escribe.
    *   **Búsqueda Avanzada:** Haga clic en "Búsqueda Avanzada" para desplegar filtros por "Ciudad" y "Estado".

2.  **Crear Nueva Empresa:**
    *   Haga clic en el botón **"Nueva Empresa"**.
    *   Se abrirá un formulario donde deberá completar: ID Empresa, Nombre / Razón Social y Ciudad.
    *   Haga clic en **"Registrar Empresa"** para guardarla.

3.  **Editar una Empresa:**
    *   En la tabla, busque la empresa que desea modificar.
    *   En la columna "Acciones", haga clic en el icono del **lápiz (✏️)**.
    *   Se abrirá el mismo formulario, pero con los datos de la empresa ya cargados.
    *   Modifique la información necesaria y haga clic en **"Guardar Cambios"**.

4.  **Eliminar una Empresa:**
    *   En la tabla, haga clic en el icono de la **papelera (🗑️)** en la fila de la empresa que desea eliminar.
    *   Aparecerá un cuadro de diálogo pidiendo confirmación.
    *   Haga clic en **"Confirmar"** para eliminar la empresa permanentemente. Esta acción no se puede deshacer.

### 3.3. Módulo: Usuarios

Aquí puede administrar todas las cuentas de usuario que tienen acceso al sistema.

1.  **Ver y Buscar Usuarios:**
    *   La tabla principal muestra a todos los usuarios.
    *   **Búsqueda Rápida:** Utilice la barra de búsqueda para filtrar por nombre, email o empresa.
    *   **Búsqueda Avanzada:** Permite filtrar por Empresa, Rol (Admin, Técnico, Estándar) y Estado (Activo, Inactivo).

2.  **Crear Nuevo Usuario:**
    *   Haga clic en el botón **"Nuevo Usuario"**.
    *   Complete el formulario de registro con los datos personales, de contacto y de ubicación del usuario.
    *   Asigne una **Empresa** y un **Rol**. El rol determinará los permisos del usuario en el sistema.
    *   Haga clic en **"Registrar"**.

3.  **Editar un Usuario:**
    *   Haga clic en el icono del **lápiz (✏️)** en la fila del usuario.
    *   Se abrirá el formulario con sus datos. Podrá modificar toda su información excepto la contraseña.
    *   Haga clic en **"Guardar Cambios"**.

4.  **Eliminar un Usuario:**
    *   Haga clic en el icono de la **papelera (🗑️)**.
    *   Confirme la acción en el cuadro de diálogo. Esto eliminará al usuario del sistema.

### 3.4. Módulo: Activos

Este es el módulo central para la gestión del ciclo de vida de todos los activos tecnológicos.

1.  **Ver y Buscar Activos:**
    *   La pestaña **"Listado de Activos"** muestra todos los equipos activos.
    *   Use la **búsqueda rápida** para encontrar un activo por cualquier dato (ID, nombre, responsable, etc.).
    *   La **búsqueda avanzada** permite filtros por Responsable, Empresa, Categoría y Estado.

2.  **Crear Nuevo Activo:**
    *   Haga clic en **"Nuevo Activo"**.
    *   **Paso 1: Selección de Tipo.** Elija si va a registrar un "Equipo de Cómputo", "Monitor" o "UPS".
    *   **Paso 2: Completar Formulario.** Dependiendo de su elección, aparecerá un formulario con los campos específicos para ese tipo de activo. Complete toda la información técnica y de compra.
    *   Haga clic en **"Registrar Activo"**.

3.  **Gestionar un Activo Específico:**
    *   En la tabla, haga clic en el icono del **ojo (👁️)** para abrir la **Vista de Detalles** de un activo.
    *   Dentro de esta vista, podrá ver:
        *   **Especificaciones Técnicas:** Toda la información del equipo.
        *   **Historial del Activo:** Todos los mantenimientos, incidentes o cambios registrados cronológicamente.
    *   **Acciones desde la Vista de Detalles:**
        *   **Añadir Historial:** Registra un nuevo mantenimiento o incidente.
        *   **Cambiar Responsable:** Transfiere el activo a otro usuario.
        *   **Editar:** Modifica las características técnicas del activo.
        *   **Descargar PDF:** Genera un informe completo del activo.

4.  **Dar de Baja un Activo:**
    *   En la tabla principal, haga clic en el icono de la **papelera (🗑️)**.
    *   Deberá escribir un motivo para la baja (ej: dañado, obsoleto).
    *   El activo se moverá a la pestaña **"Activos Eliminados"**.

5.  **Restaurar un Activo:**
    *   Vaya a la pestaña **"Activos Eliminados"**.
    *   Encuentre el activo y haga clic en el botón **"Restaurar"**.
    *   El activo volverá al listado principal.

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
