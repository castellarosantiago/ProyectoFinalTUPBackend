# Documentación Backend 🛠️ - Sistema de Gestión de Ventas

API RESTful desarrollada con Node.js, Express y MongoDB para la gestión de productos, ventas y autenticación de usuarios.

**Deploy en Render:** https://proyectofinaltupbackend.onrender.com

## Estructura del Proyecto

```
src/
├── server.ts              
├── config/               
│   └── db.ts             
├── models/               
│   ├── User.ts           
│   ├── Product.ts        
│   ├── Category.ts       
│   └── Sale.ts           
├── repositories/        
│   ├── User.repository.ts
│   ├── Product.repository.ts
│   ├── Category.repository.ts
│   └── Sale.repository.ts
├── controllers/         
│   ├── auth.controller.ts
│   ├── product.controller.ts
│   ├── category.controller.ts
│   ├── user.controller.ts
│   └── sale.controller.ts
├── routes/               
│   ├── auth.routes.ts
│   ├── product.routes.ts
│   ├── user.routes.ts
│   ├── category.routes.ts
│   └── sale.routes.ts
├── middlewares/          
│   ├── auth.middleware.ts          
│   ├── role.middleware.ts          
│   ├── validator.middleware.ts     
│   ├── rateLimit.middleware.ts     
│   └── rateLimitLogin.middleware.ts
├── schemas/              
│   ├── auth.schemas.ts  
│   ├── auth.validator.ts          
│   ├── product.schema.ts        
│   ├── category.schema.ts       
│   ├── sale.schema.ts  
│   ├── user.schema.ts           
│   └── id.schema.ts             
├── types/                
│   ├── category.interface.ts     
│   ├── product.interface.ts   
│   ├── user.interface.ts      
│   └── sales.interface.ts       
└── utils/                
    └── jwt.ts
```

## Documentación adicional

Dentro de la carpeta `docs/` se encuentra el archivo **metodologia_sistemas_ll.md**, correspondiente a la entrega de la materia *Metodología de Sistemas II*.

Dentro de la carpeta `docs/` se encuentra el archivo **instalacion_backend.md**, con una guia para levantar el backend.

Dentro de la carpeta `docs/` se encuentra el archivo **coleccion_postman.md**, con una guia para configurar el entorno en Postman y realizar peticiones a los endpoints.


## Descripción de Carpetas

### `config/`
Contiene la configuración de la aplicación y conexión a la base de datos MongoDB usando Mongoose.

### `models/`
Define los esquemas de Mongoose que representan las entidades del sistema:
- **User**: Usuarios del sistema con roles (empleado/admin), incluye autenticación
- **Product**: Productos con precio, stock y categoría asociada
- **Category**: Categorías para organizar productos
- **Sale**: Ventas con detalles de productos, cantidades, subtotales y total

### `repositories/`
Implementa el patrón Repository para abstraer la lógica de acceso a datos:
- **User.repository**: Gestión de usuarios (creación, búsqueda por email/id, excluye password en respuestas)
- **Product.repository**: CRUD de productos, filtrado por categoría/precio/nombre, manejo de stock con decrementación segura
- **Category.repository**: CRUD completo de categorías
- **Sale.repository**: Creación y consulta de ventas con soporte para transacciones (sessions) y populate de relaciones

### `controllers/`
Contiene la lógica de negocio de la aplicación. Los principales controladores son:
- **auth.controller**: Registro, login y gestión de autenticación
- **product.controller**: CRUD de productos con filtros avanzados
- **category.controller**: CRUD de categorías
- **sale.controller**: Gestión de ventas con validación de stock y cálculo de totales
- **user.controller**: Gestión de usuarios (CRUD completo, gestión de perfil de usuario autenticado)

### `routes/`
Define los endpoints de la API REST y aplica middlewares de autenticación, autorización y validación:

#### **auth.routes**
- `POST /api/auth/register` - Registro de usuarios (con validación de esquema)
- `POST /api/auth/login` - Login (con rate limiting específico)

#### **product.routes** (requiere autenticación)
- `GET /api/products` - Listar todos los productos
- `GET /api/products/:id` - Obtener un producto por ID
- `POST /api/products` - Crear producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto 
- `GET /api/products/search/name?name=...` - Buscar productos por nombre
- `GET /api/products/filter/category?id_category=...` - Filtrar por categoría
- `GET /api/products/filter/price?minPrice=...&maxPrice=...` - Filtrar por rango de precio

#### **category.routes** (requiere autenticación)
- `GET /api/categories` - Listar todas las categorías
- `GET /api/categories/:id` - Obtener una categoría por ID
- `POST /api/categories` - Crear categoría (requiere rol admin)
- `PUT /api/categories/:id` - Actualizar categoría (requiere rol admin)
- `DELETE /api/categories/:id` - Eliminar categoría (requiere rol admin)

#### **sale.routes** (requiere autenticación)
- `POST /api/sales` - Registrar una nueva venta
- `GET /api/sales` - Listar ventas con filtros opcionales (startDate, endDate, userId)
- `GET /api/sales/:id` - Obtener detalle de una venta específica

#### **user.routes** (requiere autenticación)
- `GET /api/users` - Listar todos los usarios (requiere verificación de rol Admin)
- `GET /api/users/profile` - Obtener perfil del usuario autenticado 
- `PUT /api/users/:id` - Modificar datos de un usuario (requiere verificación de rol Admin)
- `PUT /api/users/profile` - Actualizar credenciales del usuario autenticado (nombre, email, contraseña)
- `DELETE /api/users/:id` - Eliminar un usuario (requiere verificación de rol Admin)

### `middlewares/`
Middlewares de la aplicación que se ejecutan antes de llegar a los controladores:
- **auth.middleware**: Verifica tokens JWT para proteger rutas
- **role.middleware**: Valida permisos según el rol del usuario (admin/empleado)
- **validator.middleware**: Valida el body, params y query de las peticiones usando Zod
- **rateLimit.middleware**: Limita el número de peticiones por IP (protección contra spam)
- **rateLimitLogin.middleware**: Rate limiting específico para intentos de login

### `schemas/`
Esquemas de validación usando Zod que garantizan la integridad de los datos de entrada:
- **auth.schemas**: Validación de registro (name, email, password con reglas de seguridad) y login con sanitización de strings
- **product.schema**: Validación para crear/actualizar productos, búsqueda por nombre y filtros por precio/categoría
- **category.schema**: Validación de nombre y descripción de categorías
- **sale.schema**: Validación de ventas con detalles de productos (product ID, amountSold, subtotal)
- **id.schema**: Validación reutilizable para ObjectId de MongoDB (24 caracteres hexadecimales)
- **user.schema**: Validación para actualizar usuarios

### `types/`
Definiciones de tipos e interfaces TypeScript utilizadas en toda la aplicación:
- **category.interface**: Define `CategoryInterface` (documento) y `CategoryInputInterface` (DTO)
- **product.interface**: Define interfaces para Product con variantes POST (crear) y PUT (actualizar)
- **sales.interface**: Define `ISale` e `ISaleDetail` para representar ventas y su detalle de productos vendidos
- **user.interface**: Define interfaces para User con variantes POST (crear) y PUT (actualizar)

Estas interfaces aseguran type safety y consistencia en todo el código.

### `utils/`
Funciones auxiliares reutilizables:
- **jwt.ts**: Utilidades para firmar y verificar tokens JWT
  - `signJwt(payload, expiresIn?)`: Genera tokens para autenticación
  - `verifyJwt(token)`: Valida tokens y retorna el payload decodificado
  - Lee configuración desde variables de entorno (`JWT_SECRET`, `JWT_EXPIRES_IN`)

## Tecnologías Principales

- **Node.js** + **Express**: Framework del servidor
- **TypeScript**: Lenguaje de programación
- **MongoDB** + **Mongoose**: Base de datos y ODM
- **Zod**: Validación de datos
- **JWT**: Autenticación y autorización
- **validator**: Sanitización de inputs

## Características

- Autenticación con JWT
- Autorización basada en roles (admin/empleado)
- Gestión de perfil de usuario (consulta y actualización de credenciales)
- Validación de datos con Zod en todas las rutas
- Sanitización de inputs para prevenir inyecciones
- Rate limiting para protección contra spam y fuerza bruta
- Arquitectura en capas (Routes → Controllers → Repositories → Models)
- Manejo de transacciones para operaciones críticas (ventas)
- Control de stock con decrementación segura
- Filtros avanzados para búsqueda de productos
- TypeScript para type safety

### `server.ts`
Archivo principal que inicializa y configura la aplicación:
- Carga variables de entorno con dotenv
- Conecta a MongoDB usando la configuración en `config/db`
- Configura middlewares globales (cors, express.json, rate limiting)
- Registra todas las rutas de la API (`/api/auth`, `/api/sales`, `/api/categories`, `/api/products`, `/api/users`)
- Levanta el servidor Express en el puerto especificado
