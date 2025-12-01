# Criterios de Aprobación – Sistema Integral de Gestión de Negocio

## Manejo de repositorios (Frontend y Backend)
Se utilizaron repositorios separados en GitHub para el frontend y backend, cada uno con su respectivo README y estructura estandarizada.  
**Repositorio frontend:** https://github.com/castellarosantiago/ProyectoFinalTUPFrontend.git  
**Repositorio backend:** https://github.com/castellarosantiago/ProyectoFinalTUPBackend.git
 
## Configuración de servicios de deploy
El frontend y backend fueron desplegados en plataformas públicas permitiendo acceso mediante URL.  
**URL deploy:** 

## Manejo de tableros en Jira
Se trabajó con tableros Jira para división de tareas, asignaciones y seguimiento del sprint.  
**Enlace:** https://castellarosantiago.atlassian.net/jira/software/projects/OPS/boards/1?atlOrigin=eyJpIjoiOTlhZmY0YWQ4OWI3NGNmYWI0NmI5M2FjNGEzYzVkNTYiLCJwIjoiaiJ9 

## Documentación técnica
Ambos repositorios contienen un README.md con una descripción del flujo general, estructura de carpetas, tecnologías utilizadas, manual de instalación y ejecución, y consideraciones finales. Además, de ser necesario, los archivos incluyen documentación interna mediante comentarios en el código para mayor comprensión y legibilidad.

## Estandarización del código, buenas practicas y testing
Se aplicaron reglas de estilo en ambos repositorios usando herramientas como **ESLint** y **Prettier**, se aplicaron patrones como Respository, Model View Controller (MVC) y Singleton, se siguieron convenciones de nombres, formato de variables y funciones.  
Realizamos pruebas unitarias y de integración en el backend para garantizar la fiabilidad del software y prevenir regresiones. Tecnologías de testing utilizadas: **Supertest** y **Jest**

## Backend: API con seguridad y CRUD completo
Todas las rutas están protegidas con JWT y middlewares de validación de datos de entrada y restricciones de rol (admin/empleado).

La API implementa operaciones CRUD completas para:  
- Usuarios  
- Productos  
- Categorías  
- Ventas  

![Diagrama UML](<WhatsApp Image 2025-11-30 at 10.13.15.jpeg>)

Se creó una colección Postman documentada con los endpoints y ejemplos de uso.  
**Ubicación en repositorio backend:** docs/coleccion_postman.md  
**Enlace a Postman:** https://crimson-astronaut-727087.postman.co/workspace/New-Team-Workspace~1e1e2ae6-4982-4ebe-a999-dedd3da3b3fb/collection/40783075-de6176d3-933a-42cf-bd05-982ff8a850b2?action=share&creator=40783075

## Base de datos MongoDB
Creamos una base de datos **MongoDB** y la gestionamos mediante su ORM **Mongoose**.  
Es consumida por el backend mediante la constante DB_URL en el archivo .env, y por el frontend mediante servicios organizados (AuthService, ProductService, etc.) con manejo de tokens y validación.
![diagrama generado en MongoDB Compass](<Proyecto diagrama.png>)

## Reportes
**a completar**

---

# Entregables del Sistema

## Login / Recupero de contraseña
- El sistema incluye **LoginPage** con autenticación JWT mediante el backend (`POST /api/auth/login`).
- Persistencia de sesión mediante `localStorage` y `AuthContext`.  

## Registro 
- Implementado mediante la página **RegisterPage**.  
- Permite creación de usuarios con selección de rol (admin/empleado).  
- Validado en backend con Zod y manejado en `auth.controller.ts`.

## Home + Estadísticas principales del sistema
- Página **Home.tsx** como layout general que integra Sidebar, Header y contenido.
- Página **Dashboard.tsx** con:
  - Gráficos y métricas de ventas.
  - Productos vendidos.
  - Reportes de la última semana.
  - Utiliza funciones `analytics.ts` y `salesCountLastWeek.ts`.

## Header, Menú/Sidebar y Footer
- Implementación completa en **Home.tsx**.
- Sidebar con navegación principal.
- Header con información del usuario.
- Layout general estilizado con Tailwind + DaisyUI.

## Perfil del usuario 
- **a completar**.

## Tabla + ABM de Usuarios
- Página **UsersManager.tsx**:
  - Listado de todos los usuarios.
  - Edición y eliminación de usuarios.
  - Acceso restringido mediante `AdminRoute.tsx`.
- Backend con endpoints protegidos (`/api/users`) y validación de roles.

## Estructuración de directorios + Estandarización
- Frontend organizado en **pages**, **components**, **services**, **context**, **types**, **utils**.
- Backend organizado en **routes**, **controllers**, **repositories**, **models**, **schemas**, **middlewares**.
- Uso de TypeScript para tipado fuerte.

---

# Entregables del Sistema por Alumno  

## Listado de registros + Búsqueda + Paginado + Filtro
Implementado en:
- **Products**: búsqueda por nombre y filtros por categoría y rango de precio.
- **SalesHistory**: lista paginada de ventas con filtros por rango de fechas.
- **UsersManager** y **CategoriesManager**: tablas administrables.

El backend provee endpoints dedicados para búsquedas y filtros:
- `/api/products/search/name`
- `/api/products/filter/category`
- `/api/products/filter/price`
- `/api/sales?startDate&endDate&page&limit`

## Visualización de un registro individual
Incluido mediante:
- Detalles de venta: `GET /api/sales/:id`.
- Detalles de producto: `GET /api/products/:id`.
- Detalles de categoría: `GET /api/categories/:id`.
- Informacion del usuario: **a implementar**

## Operaciones de actualización o eliminación
Implementadas en:
- Productos (editar / eliminar)
- Categorías (editar / eliminar)
- Usuarios (editar / eliminar)

El backend utiliza rutas `PUT` y `DELETE` con validaciones Zod y middlewares.

## Consultas por pantalla (con opción a reporte)
- Historial completo de ventas filtrado por fechas.
- Búsqueda avanzada de productos.
- Consultas administrativas mediante listados y filtros.

## Generación de reportes completos o filtrados
- Reportes **a completar**
- El sistema muestra métricas y estadísticas visuales en pantalla (Dashboard).

---


