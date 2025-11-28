# Guía de instalación - Backend

**Prerequisitos**
- Node.js (>=16)
- npm (v8+)
- MongoDB accesible (local o Atlas)
- Git

---

## 1) Clonar el repositorio

En PowerShell (Windows):

```powershell
git clone https://github.com/castellarosantiago/ProyectoFinalTUPBackend.git
cd ProyectoFinalTUPBackend
```

---

## 2) Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con al menos las siguientes variables:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/mi_base_de_datos
```

- `PORT`: puerto donde correrá el servidor (por defecto `5000`).
- `MONGO_URI`: cadena de conexión a MongoDB (local o Atlas).

---

## 3) Instalar dependencias

```powershell
npm install
```

---

## 4) Ejecutar en modo desarrollo

El proyecto tiene script `dev` que usa `ts-node-dev`:

```powershell
npm run dev
```

Esto reiniciará automáticamente el servidor al guardar cambios.

Si quieres ejecutar el servidor directamente con `ts-node`:

```powershell
npm start
```

Y para compilar TypeScript a JS:

```powershell
npm run build
node dist/server.js  
```

---

## 5) Endpoints y colección Postman

Hay una colección de Postman en `docs/Coleccion_Postman.md` que documenta los endpoints y ejemplos de requests.

---

