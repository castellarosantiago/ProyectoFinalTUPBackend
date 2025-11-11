# Middlewares

Esta carpeta contiene los middlewares de Express.

## Archivos

- `validateRequest.ts` - Middleware para validar requests con Zod schemas
- `auth.middleware.ts` - Middleware para proteger rutas (futuro)
- `role.middleware.ts` - Middleware para verificar roles (futuro)

## validateRequest

Middleware generico que aplica un schema Zod a `req.body`.

### Uso
```ts
import { validateRequest } from '../middlewares/validateRequest';
import { registerSchema } from '../validators/auth.schemas';

// Aplicar el middleware a una ruta
router.post('/register', validateRequest(registerSchema), controller);

// Si la validacion falla:
// - Retorna 400 con lista de errores
// - Incluye el campo y el mensaje de error

// Si pasa:
// - El body validado y transformado se asigna a req.body
// - Se ejecuta el siguiente middleware/controller
```

### Respuesta en caso de error
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
