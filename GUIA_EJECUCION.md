# Guía de Ejecución - ProyectoFinalTUPBackend

## Estructura del Proyecto

```
ProyectoFinalTUPBackend/
├── src/                    # Backend (Node.js + Express + MongoDB)
│   ├── controllers/
│   │   └── auth.controller.ts      # Lógica de login/registro
│   ├── models/
│   │   └── User.ts                 # Modelo Mongoose
│   ├── routes/
│   │   └── auth.routes.ts          # Rutas /api/auth
│   ├── validators/
│   │   └── auth.validator.ts       # Validaciones con Zod
│   ├── middlewares/
│   │   └── validateRequest.ts      # Middleware de validación
│   ├── config/
│   │   └── db.ts                   # Conexión a MongoDB
│   └── server.ts                   # Entrada principal
├── frontend/               # React Component
│   └── src/components/
│       └── Login.jsx       # Componente React (sin errores TS)
├── .env                    # Variables de entorno (CREAR)
├── package.json
└── tsconfig.json
```

## Requisitos

- Node.js 16+
- MongoDB (local o Atlas)
- npm o yarn

## Pasos para ejecutar

### 1. Instalar dependencias

```powershell
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz con las variables de entorno correspondientes


### 3. Ejecutar en desarrollo

```powershell
npm run dev
```

El servidor estará en `http://localhost:5000`

### 4. Verificar que funciona

```powershell
curl http://localhost:5000
# Respuesta esperada: "API running successfully"
```

## Endpoints del Backend

### Registro
```
POST /api/auth/register
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "Password123",
  "rol": "empleado"
}
```

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "Password123",
  "rol": "empleado"
}
```

## Validaciones implementadas

✅ **Contraseña:**
- Mínimo 8 caracteres
- Al menos una mayúscula
- Al menos un número
- Hasheada con bcryptjs (salt 10)

✅ **Email:**
- Validación de formato
- Única en BD (no duplicados)

✅ **Sanitización:**
- HTML escape con validator.escape()
- Trim de espacios
- toLowerCase para emails

✅ **Bases de datos:**
- Mongoose con validación de tipos
- Modelo User con timestamps

## Componente React (`frontend/src/components/Login.jsx`)

Un componente React que:
1. Pregunta si es **empleado** o **admin**
2. Muestra formulario de **login/registro**
3. Valida en cliente antes de enviar
4. Se comunica con el backend

**Uso:**
```jsx
import Login from './components/Login';

function App() {
  return <Login />;
}
```

## Tests

```powershell
# Ejecutar tests
npm test

# Watch mode
npm test:watch

# Coverage
npm test:coverage
```

Los tests validan:
- Contraseñas con reglas correctas
- Sanitización de HTML
- Validación de email
- Roles válidos (empleado/admin)

## Estructura de Respuestas

**Éxito (200/201):**
```json
{
  "message": "Login exitoso",
  "user": {
    "_id": "ObjectId",
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "empleado",
    "createdAt": "2025-11-11T...",
    "updatedAt": "2025-11-11T..."
  }
}
```

**Error (400/401/409/500):**
```json
{
  "message": "Credenciales inválidas",
  "errors": [
    {
      "field": "password",
      "message": "La contraseña debe contener al menos una mayúscula"
    }
  ]
}
```

## Patrones y Arquitectura

- **Repository Pattern** - Acceso a datos (ver `repositories/`)
- **Middleware** - Validación de requests
- **Singleton** - Conexión DB (un único pool)
- **Strategy** - Validación con Zod

## Troubleshooting

**Error: "MONGO_URI environment variable is not set"**
→ Crea `.env` con `MONGO_URI=...`

**Error: "Cannot connect to MongoDB"**
→ Verifica que MongoDB esté corriendo y la URI sea correcta

**Error: "Port 5000 already in use"**
→ Cambia `PORT=3000` en `.env` o mata el proceso en el puerto 5000

**TypeScript errors en VS Code**
→ Cierra y reabre VS Code, o ejecuta `npm install` nuevamente

## Próximos pasos

- [ ] Agregar JWT tokens
- [ ] Proteger rutas con middleware de autenticación
- [ ] Agregar CORS dinámico
- [ ] Rate limiting
- [ ] Emails de confirmación
- [ ] Refresh tokens
