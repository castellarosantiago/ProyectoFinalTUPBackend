# Logica del Login - Backend

Este documento explica como funciona el flujo de autenticacion (login y registro) en el backend.

## Flujo general

```
Cliente (React)
    |
    | POST /api/auth/register o /api/auth/login
    | { email, password, ... }
    |
    v
Servidor Express
    |
    | 1. validateRequest (middleware)
    |    - Aplica schema Zod
    |    - Valida y sanitiza datos
    |    - Si falla, retorna 400
    |
    | 2. Controller (register o login)
    |    - Consulta BD
    |    - Hashea/compara contrasena
    |    - Retorna usuario o error
    |
    v
Cliente
```

## Detalles de cada paso

### 1. Request llega a validateRequest (middleware)

**Archivo:** `src/middlewares/validateRequest.ts`

```ts
// Middleware generico que recibe un schema Zod
export const validateRequest = (schema) => async (req, res, next) => {
  try {
    // Parsear y validar el body contra el schema
    const result = await schema.parseAsync(req.body);
    // Si pasa, asignar el body validado (y sanitizado) al request
    req.body = result;
    return next(); // Continuar al siguiente middleware/controller
  } catch (err) {
    // Si falla, retornar 400 con errores
    return res.status(400).json({ message: 'Validation failed', errors });
  }
};
```

### 2. Schema Zod valida y sanitiza

**Archivo:** `src/validators/auth.schemas.ts`

Hay dos schemas:

#### registerSchema
```ts
{
  nombre: string          // Sanitizado con validator.escape()
  email: string           // Validado como email, sanitizado
  password: string        // Validaciones: 8+, mayuscula, numero
  rol: 'empleado'|'admin' // Por defecto 'empleado'
}
```

Ejemplo de fallo de validacion:
```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "password",
      "message": "La contrasena debe contener al menos una mayuscula"
    }
  ]
}
```

#### loginSchema
```ts
{
  email: string           // Validado como email, sanitizado
  password: string        // Solo debe existir (no se valida la contrasena aqui)
  rol: 'empleado'|'admin' // Por defecto 'empleado'
}
```

### 3. Controller ejecuta la logica

**Archivo:** `src/controllers/auth.controller.ts`

#### Flujo de REGISTRO (register)

```
1. Extraer { nombre, email, password, rol } del body validado
   
2. Verificar si el email ya existe
   - User.findOne({ email })
   - Si existe, retornar 409 (Conflict)
   
3. Hashear la contrasena
   - bcrypt.genSalt(10)      // Salt de 10 rondas
   - bcrypt.hash(password, salt)
   
4. Crear documento en BD
   - new User({ nombre, email, password: hashed, rol })
   - user.save()
   
5. Retornar usuario sin contrasena
   - 201 (Created)
   - { message: 'Usuario creado', user: { _id, nombre, email, rol, ... } }
```

Ejemplo de registro exitoso:
```json
{
  "message": "Usuario creado",
  "user": {
    "_id": "672a1b2c3d4e5f6g7h8i9j0k",
    "nombre": "Juan Perez",
    "email": "juan@example.com",
    "rol": "empleado",
    "createdAt": "2025-11-11T20:30:00.000Z",
    "updatedAt": "2025-11-11T20:30:00.000Z"
  }
}
```

#### Flujo de LOGIN (login)

```
1. Extraer { email, password } del body validado
   
2. Buscar usuario por email
   - User.findOne({ email })
   - Si no existe, retornar 401 (Unauthorized)
   
3. Validar contrasena
   - bcrypt.compare(password, user.password)
   - Compara el password en texto plano con el hash almacenado
   - Si no coincide, retornar 401
   
4. Retornar usuario sin contrasena
   - 200 (OK)
   - { message: 'Login exitoso', user: { _id, nombre, email, rol, ... } }
```

Ejemplo de login exitoso:
```json
{
  "message": "Login exitoso",
  "user": {
    "_id": "672a1b2c3d4e5f6g7h8i9j0k",
    "nombre": "Juan Perez",
    "email": "juan@example.com",
    "rol": "empleado",
    "createdAt": "2025-11-11T20:30:00.000Z",
    "updatedAt": "2025-11-11T20:30:00.000Z"
  }
}
```

### 4. Modelo de datos

**Archivo:** `src/models/User.ts`

```ts
{
  _id: ObjectId        // Generado automticamente por MongoDB
  nombre: String       // Requerido
  email: String        // Requerido, unico, minusculas, sin espacios
  password: String     // Requerido, hasheado
  rol: String          // 'empleado' o 'admin', por defecto 'empleado'
  createdAt: Date      // Automatico
  updatedAt: Date      // Automatico
}
```

### 5. Rutas y middlewares

**Archivo:** `src/routes/auth.routes.ts`

```ts
// POST /api/auth/register
// Middleware: validateRequest(registerSchema)
// Controller: register
router.post('/register', validateRequest(registerSchema), register);

// POST /api/auth/login
// Middleware: validateRequest(loginSchema)
// Controller: login
router.post('/login', validateRequest(loginSchema), login);
```

## Seguridad implementada

### Contrasenas
- **Hasheada** con bcryptjs (salt 10)
- **Nunca** se retorna en respuestas
- **Validacion fuerte**: 8+ caracteres, mayuscula y numero
- Se compara con `bcrypt.compare()` sin mostrar el hash

### Emails
- **Sanitizados** con `validator.escape()`
- **Validados** como formato email
- **Unicos** en la BD (no duplicados)
- **Minusculas** automaticamente (caso insensible)

### Inputs
- **Escapados** para prevenir XSS
- **Trimmed** (sin espacios extra)
- **Validados** contra un schema Zod

### Errores
- No revelan informacion sensible
- "Credenciales invalidas" para login fallido (no dice si email existe)
- Errores de validacion describen el problema

## Flujo completo: ejemplo

### Cliente envia
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "nombre": "Juan Perez",
  "email": "juan@example.com",
  "password": "Password123",
  "rol": "empleado"
}
```

### 1. validateRequest recibe
```
body = {
  nombre: "Juan Perez",
  email: "juan@example.com",
  password: "Password123",
  rol: "empleado"
}
```

### 2. Schema Zod valida
```
✓ nombre: string > 0
✓ email: formato valido
✓ password: 8+ caracteres, mayuscula, numero
✓ rol: 'empleado' o 'admin'

// Todos los datos sanitizados
// Si algo falla, retorna 400
```

### 3. Controller recibe body validado
```ts
const { nombre, email, password, rol } = req.body;
// Datos ya estan validados y sanitizados
```

### 4. Verificar email existente
```
User.findOne({ email: "juan@example.com" })
// No existe? Continuar
```

### 5. Hashear contrasena
```
password_hash = bcrypt.hash("Password123", salt10)
// Resultado: $2a$10$... (irreversible)
```

### 6. Guardar en BD
```
new User({
  nombre: "Juan Perez",
  email: "juan@example.com",
  password: password_hash,
  rol: "empleado"
}).save()
```

### 7. Retornar respuesta (SIN contrasena)
```json
{
  "message": "Usuario creado",
  "user": {
    "_id": "672a1b...",
    "nombre": "Juan Perez",
    "email": "juan@example.com",
    "rol": "empleado",
    "createdAt": "2025-11-11T20:30:00.000Z",
    "updatedAt": "2025-11-11T20:30:00.000Z"
  }
}
```

## Proximos pasos

- [ ] Agregar JWT tokens (en lugar de solo retornar usuario)
- [ ] Middleware para proteger rutas (verificar token)
- [ ] Refresh tokens
- [ ] Rate limiting
- [ ] Emails de confirmacion
- [ ] Recuperacion de contrasena
