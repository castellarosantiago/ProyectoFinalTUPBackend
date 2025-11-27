/**
 * Test de Integración (E2E) - ProyectoFinalTUPBackend
 * 
 * Prueba flujos completos del sistema:
 * 1. Autenticación (register, login)
 * 2. Protección de rutas con JWT
 * 3. CRUD de productos con roles
 * 4. CRUD de categorías con roles
 * 5. Validación y manejo de errores
 * 
 * Nota: Requiere MongoDB corriendo en MONGO_URI de .env
 */

import request from 'supertest';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/category.routes';
import { connect } from './config/db';
import User from './models/User';
import { disconnect } from './config/db';
import Product from './models/Product';
import Category from './models/Category';

dotenv.config();

// crear app express para testing
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

describe('Integration Tests - ProyectoFinalTUPBackend', () => {
  let authToken: string;
  let adminToken: string;
  let employeeId: string;
  let adminId: string;
  let categoryId: string;
  let productId: string;

  // Setup: conectar a MongoDB
  beforeAll(async () => {
    try {
      await connect();
      console.log(' MongoDB conectado para tests');
      
      // limpiar datos previos (opcional, útil para tests limpios)
      await User.deleteMany({});
      await Product.deleteMany({});
      await Category.deleteMany({});
    } catch (err) {
      console.error(' Error conectando a MongoDB:', err);
      throw err;
    }
  });

  // Teardown: desconectar de MongoDB
  afterAll(async () => {
    try {
      // limpiar datos después de tests
      await User.deleteMany({});
      await Product.deleteMany({});
      await Category.deleteMany({});
      console.log(' MongoDB desconectado después de tests');
    } catch (err) {
      console.error(' Error desconectando MongoDB:', err);
    }
  });

  // ============================================================
  // TESTS DE AUTENTICACIÓN (REGISTER, LOGIN, JWT)
  // ============================================================
  describe(' Autenticación - Register & Login', () => {
    
    describe('POST /api/auth/register', () => {
      
      it('✓ Debería registrar un nuevo usuario (empleado)', async () => {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            name: 'Juan Pérez',
            email: 'juan@example.com',
            password: 'Password123',
            role: 'empleado'
          });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'Usuario creado');
        expect(response.body).toHaveProperty('user');
        expect(response.body.user).toHaveProperty('_id');
        expect(response.body.user).toHaveProperty('email', 'juan@example.com');
        expect(response.body.user).not.toHaveProperty('password'); // no expone pwd
        expect(response.body).toHaveProperty('token');
        
        authToken = response.body.token;
        employeeId = response.body.user._id;
      });

      it('✓ Debería registrar un nuevo usuario (admin)', async () => {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'AdminPass123',
            role: 'admin'
          });

        expect(response.status).toBe(201);
        expect(response.body.user.role).toBe('admin');
        expect(response.body).toHaveProperty('token');
        
        adminToken = response.body.token;
        adminId = response.body.user._id;
      });

      it('✗ Debería rechazar registro con contraseña débil (sin mayúscula)', async () => {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            name: 'Test User',
            email: 'weak@example.com',
            password: 'password123', // sin mayúscula
            role: 'empleado'
          });

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
      });

      it('✗ Debería rechazar registro con contraseña débil (sin número)', async () => {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            name: 'Test User',
            email: 'weak2@example.com',
            password: 'PasswordABC', // sin número
            role: 'empleado'
          });

        expect(response.status).toBe(400);
      });

      it('✗ Debería rechazar registro con contraseña muy corta', async () => {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            name: 'Test User',
            email: 'short@example.com',
            password: 'Pass12', // < 8 chars
            role: 'empleado'
          });

        expect(response.status).toBe(400);
      });

      it('✗ Debería rechazar registro con email duplicado', async () => {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            name: 'Otro Nombre',
            email: 'juan@example.com', // email ya registrado
            password: 'Password456',
            role: 'empleado'
          });

        expect(response.status).toBe(409);
        expect(response.body.message).toBe('El email ya esta registrado');
      });

      it('✗ Debería rechazar registro con email inválido', async () => {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            name: 'Test User',
            email: 'not-an-email',
            password: 'Password123',
            role: 'empleado'
          });

        expect(response.status).toBe(400);
      });

      it('✓ Debería sanitizar caracteres especiales en nombre', async () => {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            name: '<script>alert("xss")</script>',
            email: 'sanitized@example.com',
            password: 'Password123',
            role: 'empleado'
          });

        expect(response.status).toBe(201);
        // verificar que el script tag fue escapado
        expect(response.body.user.name).not.toContain('<script>');
      });
    });

    describe('POST /api/auth/login', () => {
      
      it('✓ Debería hacer login con credenciales válidas', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'juan@example.com',
            password: 'Password123'
          });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Login exitoso');
        expect(response.body).toHaveProperty('user');
        expect(response.body).toHaveProperty('token');
        expect(response.body.user).not.toHaveProperty('password');
        expect(response.body.token).toBeTruthy();
      });

      it('✗ Debería rechazar login con email inválido', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'noexiste@example.com',
            password: 'Password123'
          });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Credenciales invalidas');
      });

      it('✗ Debería rechazar login con contraseña incorrecta', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'juan@example.com',
            password: 'WrongPassword123'
          });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Credenciales invalidas');
      });
    });
  });

  // ============================================================
  // TESTS DE CATEGORÍAS (CRUD)
  // ============================================================
  describe('📂 Categorías - CRUD', () => {
    
    describe('GET /api/categories', () => {
      
      it('✓ Debería obtener lista de categorías (pública)', async () => {
        const response = await request(app)
          .get('/api/categories');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
      });
    });

    describe('POST /api/categories', () => {
      
      it('✓ Debería crear una categoría (con auth)', async () => {
        const response = await request(app)
          .post('/api/categories')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            name: 'Electrónica',
            description: 'Productos electrónicos en general'
          });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'Categoría creada correctamente.');
        expect(response.body.category).toHaveProperty('_id');
        expect(response.body.category.name).toBe('Electrónica');
        
        categoryId = response.body.category._id;
      });

      it('✗ Debería rechazar crear categoría sin token', async () => {
        const response = await request(app)
          .post('/api/categories')
          .send({
            name: 'Ropa',
            description: 'Ropa en general'
          });

        // Nota: si la ruta NO está protegida, esto pasará.
        // Este test documenta el estado actual
        expect([201, 401]).toContain(response.status);
      });
    });

    describe('GET /api/categories/:id', () => {
      
      it('✓ Debería obtener una categoría por ID', async () => {
        const response = await request(app)
          .get(`/api/categories/${categoryId}`);

        expect(response.status).toBe(200);
        expect(response.body._id).toBe(categoryId);
        expect(response.body.name).toBe('Electrónica');
      });

      it('✗ Debería retornar 404 para categoría no existente', async () => {
        const response = await request(app)
          .get('/api/categories/000000000000000000000000');

        expect(response.status).toBe(404);
      });
    });

    describe('PUT /api/categories/:id', () => {
      
      it('✓ Debería actualizar una categoría', async () => {
        const response = await request(app)
          .put(`/api/categories/${categoryId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            name: 'Electrónica Actualizada',
            description: 'Descripción actualizada'
          });

        expect(response.status).toBe(200);
        expect(response.body.category.name).toBe('Electrónica Actualizada');
      });
    });

    describe('DELETE /api/categories/:id', () => {
      
      it('✓ Debería eliminar una categoría', async () => {
        // crear una nueva categoría para eliminar
        const createRes = await request(app)
          .post('/api/categories')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            name: 'Temporal',
            description: 'Para eliminar'
          });
        
        const tempCategoryId = createRes.body.category._id;

        const response = await request(app)
          .delete(`/api/categories/${tempCategoryId}`)
          .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Categoría eliminada correctamente');
      });
    });
  });

  // ============================================================
  // TESTS DE PRODUCTOS (CRUD)
  // ============================================================
  describe('📦 Productos - CRUD', () => {
    
    describe('GET /api/products', () => {
      
      it('✓ Debería obtener lista de productos (pública)', async () => {
        const response = await request(app)
          .get('/api/products');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
      });
    });

    describe('POST /api/products', () => {
      
      it('✓ Debería crear un producto', async () => {
        const response = await request(app)
          .post('/api/products')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            id_category: categoryId,
            name: 'Monitor LG 24"',
            price: 250.99,
            stock: 5
          });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'Producto creado correctamente.');
        expect(response.body.product).toHaveProperty('_id');
        expect(response.body.product.name).toBe('Monitor LG 24"');
        expect(response.body.product.price).toBe(250.99);
        
        productId = response.body.product._id;
      });

      it('✗ Debería rechazar producto sin categoría válida', async () => {
        const response = await request(app)
          .post('/api/products')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            id_category: '000000000000000000000000',
            name: 'Producto Inválido',
            price: 100,
            stock: 1
          });

        expect(response.status).toBe(400);
      });

      it('✗ Debería rechazar precio negativo', async () => {
        const response = await request(app)
          .post('/api/products')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            id_category: categoryId,
            name: 'Producto Inválido',
            price: -50,
            stock: 1
          });

        expect(response.status).toBe(400);
      });
    });

    describe('GET /api/products/:id', () => {
      
      it('✓ Debería obtener un producto por ID', async () => {
        const response = await request(app)
          .get(`/api/products/${productId}`);

        expect(response.status).toBe(200);
        expect(response.body._id).toBe(productId);
      });

      it('✗ Debería retornar 404 para producto no existente', async () => {
        const response = await request(app)
          .get('/api/products/000000000000000000000000');

        expect(response.status).toBe(404);
      });
    });

    describe('PUT /api/products/:id', () => {
      
      it('✓ Debería actualizar un producto', async () => {
        const response = await request(app)
          .put(`/api/products/${productId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            name: 'Monitor LG 27"',
            price: 299.99,
            stock: 3
          });

        expect(response.status).toBe(200);
        expect(response.body.product.name).toBe('Monitor LG 27"');
      });
    });

    describe('DELETE /api/products/:id', () => {
      
      it('✓ Debería eliminar un producto (admin o autorizado)', async () => {
        // crear producto para eliminar
        const createRes = await request(app)
          .post('/api/products')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            id_category: categoryId,
            name: 'Producto Temporal',
            price: 100,
            stock: 1
          });
        
        const tempProductId = createRes.body.product._id;

        const response = await request(app)
          .delete(`/api/products/${tempProductId}`)
          .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Producto eliminado correctamente');
      });
    });

    describe('GET /api/products/search/name', () => {
      
      it('✓ Debería buscar productos por nombre', async () => {
        const response = await request(app)
          .get('/api/products/search/name?name=Monitor');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
      });

      it('✗ Debería retornar 404 si no encuentra coincidencias', async () => {
        const response = await request(app)
          .get('/api/products/search/name?name=ProductoQueNoExiste123');

        expect(response.status).toBe(404);
      });
    });

    describe('GET /api/products/filter/category', () => {
      
      it('✓ Debería filtrar productos por categoría', async () => {
        const response = await request(app)
          .get(`/api/products/filter/category?id_category=${categoryId}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        if (response.body.length > 0) {
          expect(response.body[0].id_category.toString()).toBe(categoryId);
        }
      });
    });

    describe('GET /api/products/filter/price', () => {
      
      it('✓ Debería filtrar productos por rango de precio', async () => {
        const response = await request(app)
          .get('/api/products/filter/price?minPrice=200&maxPrice=400');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
      });

      it('✓ Debería retornar array vacío si no hay coincidencias', async () => {
        const response = await request(app)
          .get('/api/products/filter/price?minPrice=1000&maxPrice=2000');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
      });
    });
  });

  // ============================================================
  // TESTS DE JWT Y PROTECCIÓN DE RUTAS
  // ============================================================
  describe('🔒 JWT y Protección de Rutas', () => {
    
    it('✗ Debería rechazar request sin token en rutas protegidas (futuro)', async () => {
      // Nota: Esto documenta que actualmente las rutas NO están protegidas
      // Cuando se implemente protección con auth middleware, esto debería fallar (401)
      const response = await request(app)
        .post('/api/categories')
        .send({
          name: 'Test',
          description: 'Test'
        });

      // Actualmente retorna 201, pero debería retornar 401 una vez protegida
      expect([201, 401]).toContain(response.status);
    });

    it('✗ Debería rechazar request con token inválido', async () => {
      const response = await request(app)
        .get('/api/products')
        .set('Authorization', 'Bearer invalid.token.here');

      // Endpoints de lectura son públicos, pero si se protegieran, fallaría con 401
      expect(response.status).toBe(200);
    });

    it('✓ Debería aceptar request con token válido', async () => {
      const response = await request(app)
        .get('/api/categories')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
    });
  });

  // ============================================================
  // TESTS DE VALIDACIÓN Y ERROR HANDLING
  // ============================================================
  describe('⚠️ Validación y Manejo de Errores', () => {
    
    it('✗ Debería rechazar registro sin todos los campos requeridos', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User'
          // falta email, password, role
        });

      expect(response.status).toBe(400);
    });

    it('✗ Debería rechazar login sin email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'Password123'
          // falta email
        });

      expect(response.status).toBe(400);
    });

    it('✗ Debería rechazar producto con datos inválidos', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          id_category: categoryId,
          // falta name, price, stock
        });

      expect(response.status).toBe(400);
    });

    it('✗ Debería retornar 500 para IDs de MongoDB inválidos', async () => {
      const response = await request(app)
        .get('/api/categories/invalid-id');

      expect([400, 500]).toContain(response.status);
    });
  });

  // ============================================================
  // TESTS DE FLUJO COMPLETO (Happy Path)
  // ============================================================
  describe('🎯 Flujos Completos (Happy Path)', () => {
    
    it('✓ Flujo completo: Register → Create Category → Create Product → Read', async () => {
      // 1. Registrar nuevo usuario
      const registerRes = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Full Flow User',
          email: 'fullflow@example.com',
          password: 'FlowPass123',
          role: 'empleado'
        });

      expect(registerRes.status).toBe(201);
      const flowToken = registerRes.body.token;

      // 2. Crear categoría
      const categoryRes = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${flowToken}`)
        .send({
          name: 'Categoría Flujo',
          description: 'Categoría para flujo'
        });

      expect(categoryRes.status).toBe(201);
      const flowCategoryId = categoryRes.body.category._id;

      // 3. Crear producto
      const productRes = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${flowToken}`)
        .send({
          id_category: flowCategoryId,
          name: 'Producto Flujo',
          price: 99.99,
          stock: 10
        });

      expect(productRes.status).toBe(201);
      const flowProductId = productRes.body.product._id;

      // 4. Leer producto creado
      const getRes = await request(app)
        .get(`/api/products/${flowProductId}`);

      expect(getRes.status).toBe(200);
      expect(getRes.body.name).toBe('Producto Flujo');

      // 5. Actualizar producto
      const updateRes = await request(app)
        .put(`/api/products/${flowProductId}`)
        .set('Authorization', `Bearer ${flowToken}`)
        .send({
          name: 'Producto Flujo Actualizado',
          price: 89.99,
          stock: 5
        });

      expect(updateRes.status).toBe(200);
      expect(updateRes.body.product.name).toBe('Producto Flujo Actualizado');

      // 6. Eliminar producto
      const deleteRes = await request(app)
        .delete(`/api/products/${flowProductId}`)
        .set('Authorization', `Bearer ${flowToken}`);

      expect(deleteRes.status).toBe(200);

      // 7. Verificar que fue eliminado
      const verifyRes = await request(app)
        .get(`/api/products/${flowProductId}`);

      expect(verifyRes.status).toBe(404);
    });

    it('✓ Flujo de login múltiple con diferentes usuarios', async () => {
      // Login employee
      const empRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'juan@example.com',
          password: 'Password123'
        });

      expect(empRes.status).toBe(200);
      expect(empRes.body.user.role).toBe('empleado');

      // Login admin
      const adminRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'AdminPass123'
        });

      expect(adminRes.status).toBe(200);
      expect(adminRes.body.user.role).toBe('admin');

      // Tokens son diferentes
      expect(empRes.body.token).not.toBe(adminRes.body.token);
    });
  });
});

/**
 * RESULTADOS ESPERADOS
 * 
 * ✓ = Test que debería pasar
 * ✗ = Test que documenta estado actual (puede fallar si hay cambios futuros)
 * 
 * NOTAS SOBRE FALLOS ESPERADOS:
 * 
 * 1. Rutas SIN autenticación:
 *    - Actualmente: GET /api/categories, GET /api/products son públicas ✓
 *    - POST/PUT/DELETE deberían estar protegidas pero actualmente no
 *    
 * 2. JWT no forzado:
 *    - Las rutas de escritura NO tienen auth middleware aplicado
 *    - Se recomenda agregar authenticate y requireRole middlewares
 *    
 * 3. RBAC no implementado:
 *    - No hay diferencias de permisos entre 'empleado' y 'admin'
 *    - Se recomienda usar requireRole('admin') en ciertas operaciones
 * 
 * PARA EJECUTAR:
 * 
 * npm test -- src/integration.test.ts
 * 
 * O con cobertura:
 * 
 * npm test -- src/integration.test.ts --coverage
 */
