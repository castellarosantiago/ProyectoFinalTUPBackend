# ProyectoFinalTUPBackend
Repositorio para alojar el backend del proyecto final de la Tecnicatura Universitaria en Programación - UTN FRBB

## Requisitos de entorno

- Crear un archivo `.env` en la raíz con al menos la variable `MONGO_URI`.

Ejemplo `.env`:

```
MONGO_URI=mongodb://usuario:pass@localhost:27017/mi_basedatos
PORT=5000
```

## Instalación

Instala dependencias antes de ejecutar el servidor:

```powershell
npm install
```

## Ejecutar en modo desarrollo

```powershell
npm run dev
```

## Notas

- Se añadieron validaciones en `src/validators/auth.validator.ts` usando `zod` y sanitización básica con `validator`.
- Rutas de autenticación: `POST /api/auth/register` y `POST /api/auth/login`.
- Agregué un componente React de ejemplo en `frontend/src/components/Login.tsx` (no es una app completa, es un componente reutilizable).
