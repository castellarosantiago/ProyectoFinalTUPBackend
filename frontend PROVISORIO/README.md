# Frontend - Componente de Login

Este componente React está diseñado para funcionar en un proyecto React separado (Vite, Create React App, etc.).

## El componente `Login.tsx`

El archivo `src/components/Login.tsx` proporciona un componente de autenticación que:

1. **Pregunta el tipo de usuario** (empleado o admin)
2. **Ofrece login o registro** con validación de cliente
3. **Valida contraseñas** según reglas del backend:
   - Mínimo 8 caracteres
   - Al menos una mayúscula
   - Al menos un número
4. **Sanitiza entradas** básicamente (trim, toLowerCase para email)
5. **Se comunica con el backend** en `/api/auth/register` y `/api/auth/login`

## Uso

1. Copia `src/components/Login.tsx` a tu proyecto React
2. Asegúrate de tener `@types/react` instalado
3. Importa el componente:

```tsx
import Login from './components/Login';

function App() {
  return <Login />;
}
```

## Requisitos

- React 16.8+
- TypeScript (opcional, pero recomendado)

## API esperada del backend

El componente espera que el backend esté en la **misma máquina o configurado con CORS**.

- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión

Payloads esperados:

**Register:**
```json
{
  "nombre": "Juan",
  "email": "juan@example.com",
  "password": "Password123",
  "rol": "empleado"
}
```

**Login:**
```json
{
  "email": "juan@example.com",
  "password": "Password123"
}
```

Respuestas esperadas:

```json
{
  "message": "Usuario creado",
  "user": {
    "_id": "...",
    "nombre": "Juan",
    "email": "juan@example.com",
    "rol": "empleado"
  }
}
```
