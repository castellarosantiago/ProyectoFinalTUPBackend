# 🗺️ Flujo de Interacción del Patrón Repositorio (Backend Quiosco)

Este documento describe el flujo de datos entre las capas de la API, aplicando el Patrón Repositorio para garantizar el **desacoplamiento** entre la lógica de negocio y Mongoose/MongoDB.

---

## 1. 🧑‍💻 Niveles de la Aplicación y Responsabilidades

| Nivel | Componente | Responsabilidad Principal |
| :--- | :--- | :--- |
| **I. HTTP** | `routes/` | Define el *path* y el método HTTP. |
| **II. Lógica** | `controllers/` | Maneja la solicitud (`req`/`res`). **Llama a la interfaz del Repositorio.** |
| **III. Abstracción**| `repositories/` | Implementa la lógica de CRUD. **ÚNICA capa que utiliza Mongoose.** |
| **IV. Datos** | `models/` | Define el **Schema de Mongoose** y las Interfaces de TypeScript. |

---

## 2. ➡️ Flujo de Solicitud (Ejemplo: Buscar un Producto por ID)

El flujo muestra cómo una solicitud viaja desde el cliente, a través de las capas de Express, hasta la base de datos, y regresa.

### A. Entrada y Lógica

1.  **Rutas (`routes/`)**: Recibe la petición `GET /api/products/:id` y la dirige al **Controlador**.
2.  **Controlador (`controllers/`)**:
    * Valida el ID de la petición.
    * **Llama al Repositorio** usando el método abstracto: `const product = await productRepository.findById(id);`
    * *El controlador no tiene conocimiento de MongoDB.*

### B. Capa de Abstracción

3.  **Repositorio (`repositories/`)**:
    * Recibe la llamada.
    * **Ejecuta la consulta** específica de Mongoose: `ProductModel.findById(id).exec();`
    * Convierte el resultado (Documento Mongoose) a un **Objeto TypeScript simple**.
    * Retorna el objeto limpio al Controlador.

### C. Respuesta Final

4.  **Controlador (`controllers/`)**:
    * Recibe el objeto de producto.
    * Construye la respuesta HTTP (ej. status 200).
    * **Ej:** `res.status(200).json({ data: product });`

---

## 3. ✨ Beneficios Clave

* **Testabilidad:** Se pueden **simular (mockear)** los Repositorios para probar Controladores y Servicios sin conexión a la DB real.
* **Mantenibilidad:** Si cambias la base de datos (ej., de MongoDB a MySQL), solo modificas el código dentro de la carpeta **`repositories/`**.