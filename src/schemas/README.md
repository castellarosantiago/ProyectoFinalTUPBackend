# Validadores y Schemas

Esta carpeta contiene las definiciones de validacion de datos usando Zod.

## Archivos

- `auth.schemas.ts` - Define los schemas de Zod para registro y login
- `auth.validator.test.ts` - Tests unitarios para las validaciones

## Como funciona

1. Los **schemas** en `auth.schemas.ts` definen las reglas de validacion
2. El **middleware** `validateRequest` en `middlewares/validateRequest.ts` aplica los schemas
3. Las **rutas** en `routes/auth.routes.ts` usan el middleware con el schema correspondiente

Ejemplo:
```ts
// 1. Schema definido aqui
export const registerSchema = z.object({ ... });

// 2. Middleware que aplica el schema
router.post('/register', validateRequest(registerSchema), register);

// 3. Si la validacion falla, se retorna 400 con errores
// Si pasa, el body validado se envia al controller
```

## Schemas disponibles

### registerSchema
Valida datos para registrar un nuevo usuario:
- `nombre`: string minimo 1 caracter (sanitizado)
- `email`: email valido (sanitizado)
- `password`: minimo 8 caracteres, mayuscula y numero
- `rol`: 'empleado' o 'admin' (por defecto 'empleado')

### loginSchema
Valida datos para iniciar sesion:
- `email`: email valido (sanitizado)
- `password`: minimo 1 caracter
- `rol`: 'empleado' o 'admin' (por defecto 'empleado')

## Sanitizacion

Ambos schemas sanitizan strings usando `validator.escape()` para prevenir inyecciones XSS.
