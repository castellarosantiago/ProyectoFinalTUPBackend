# Como acceder a la aplicacion

## Estado actual

✅ **Backend**: Corriendo en `http://localhost:5000`
✅ **Frontend**: Corriendo en `http://localhost:5173`
✅ **MongoDB**: Conectado

## URLs

- **Frontend (React)**: http://localhost:5173
- **Backend (API)**: http://localhost:5000
- **Ruta de prueba**: http://localhost:5000 (debe mostrar "API running successfully")
- **API Endpoints**:
  - POST http://localhost:5000/api/auth/register
  - POST http://localhost:5000/api/auth/login

## Como probar

### 1. Abre el navegador
```
http://localhost:5173
```

### 2. En el componente de login:
- Elige si eres "Empleado" o "Admin"
- Cambia entre "Ir a login" y "Ir a registro"
- Rellena los campos (en registro necesitas nombre, en login solo email y contrasena)

### 3. Reglas de validacion (cliente y servidor):
- **Contrasena**: Minimo 8 caracteres, 1 mayuscula, 1 numero
- **Email**: Formato valido
- **Nombre**: Minimo 1 caracter

### 4. Ejemplos para probar:

#### Registro exitoso
```
Nombre: Juan Perez
Email: juan@example.com
Contrasena: Password123
Rol: Empleado
```

#### Login (despues de registrar)
```
Email: juan@example.com
Contrasena: Password123
Rol: Empleado
```

#### Error de validacion (contrasena sin mayuscula)
```
Email: test@example.com
Contrasena: password123
```

#### Error de validacion (email duplicado en registro)
```
Nombre: Juan Perez
Email: juan@example.com (ya registrado)
Contrasena: Password456
```

## Donde ver los datos

- En el navegador: Respuestas en el componente (mensaje de exito o error)
- En MongoDB: Coleccion "users" con los datos guardados
- En la consola del backend: Logs de errores

## Solucionar problemas

### El frontend no carga
- Verifica que `http://localhost:5173` este disponible
- Revisa la consola del navegador (F12)
- Asegurate que npm install en frontend termino correctamente

### El login no funciona
- Verifica que el backend este corriendo: `http://localhost:5000`
- Revisa que MongoDB este conectado (deberia decir "MongoDB connected" en logs)
- Abre la consola del navegador (F12) para ver errores de red

### Errores de contrasena
- Debe tener MAYUSCULA (por ej: P)
- Debe tener numero (por ej: 1)
- Debe tener minimo 8 caracteres

### Email duplicado
- Si usaste el mismo email antes, usa uno nuevo
- El email es unico en la BD

## Proximos pasos

- [ ] Agregar JWT tokens
- [ ] Proteger rutas del backend
- [ ] Agregar mas campos al usuario (foto, telefono, etc)
- [ ] Agregar dashboard para usuarios logueados
- [ ] Agregar recuperacion de contrasena
