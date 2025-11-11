# APLICACION CORRIENDO

## Estado: ✅ EN VIVO

### Backend
- **URL**: http://localhost:5000
- **Estado**: CORRIENDO
- **Base de datos**: MongoDB conectada
- **Ruta de prueba**: http://localhost:5000 → "API running successfully"

### Frontend
- **URL**: http://localhost:5173
- **Estado**: CORRIENDO
- **Framework**: React + Vite + TypeScript

### Conexion
- El frontend proxy envia `/api/*` al backend en http://localhost:5000
- Ambos pueden comunicarse entre si

---

## Para acceder

Abre en tu navegador:
```
http://localhost:5173
```

---

## Flujo a probar

1. **Selecciona tipo de usuario**: Empleado o Admin
2. **Elige una accion**:
   - **REGISTRO**: Nombre, Email, Contrasena
   - **LOGIN**: Email, Contrasena
3. **Valida los datos**:
   - Contrasena: 8+, mayuscula, numero
   - Email: formato valido
4. **Mira el resultado**: Exito o error

---

## Ejemplo rapido

### 1. Registro
```
Nombre: Test User
Email: test@example.com
Contrasena: TestPass123
Rol: Empleado
```
→ Deberia decir "Usuario creado"

### 2. Login con el mismo email
```
Email: test@example.com
Contrasena: TestPass123
```
→ Deberia decir "Login exitoso"

### 3. Login incorrecto
```
Email: test@example.com
Contrasena: WrongPass123
```
→ Deberia decir "Credenciales invalidas"

---

## Terminales activas

- Terminal 1: Backend (`npm run dev`)
- Terminal 2: Frontend (`npm run dev`)

Para detener:
- Backend: Ctrl+C en terminal 1
- Frontend: Ctrl+C en terminal 2

---

## Para ver logs

**Backend**: Mira los console.error() en la terminal del backend
**Frontend**: Abre F12 en el navegador y ve la consola

---

## Si hay problemas

1. Verifica que MongoDB este conectada (backend deberia decir "MongoDB connected")
2. Abre la consola del navegador (F12) para ver errores
3. Revisa que los puertos 5000 y 5173 esten disponibles
4. Reinicia ambos servidores

---

**Listo para probar! 🚀**
