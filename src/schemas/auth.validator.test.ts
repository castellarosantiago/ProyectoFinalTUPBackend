import { registerSchema, loginSchema } from '../schemas/auth.schemas';

// tests de validacion
describe('Auth Validation Schemas', () => {
  // pruebas de registro
  describe('registerSchema', () => {
    // debe aceptar datos validos
    test('debería aceptar datos de registro válidos', async () => {
      const validData = {
        name: 'Juan Perez',
        email: 'juan@example.com',
        password: 'Password123',
        role: 'empleado',
      };
      const result = await registerSchema.parseAsync(validData);
      expect(result.name).toBeDefined();
      expect(result.email).toBeDefined();
    });

    // debe rechazar si no tiene mayuscula
    test('debería rechazar contraseña sin mayúscula', async () => {
      const invalidData = {
        name: 'Juan',
        email: 'juan@example.com',
        password: 'password123',
        role: 'empleado',
      };
      try {
        await registerSchema.parseAsync(invalidData);
        fail('debería haber lanzado un error de validación');
      } catch (err: any) {
        expect(err.issues[0].message).toContain('mayuscula');
      }
    });

    // debe rechazar si no tiene numero
    test('debería rechazar contraseña sin número', async () => {
      const invalidData = {
        name: 'Juan',
        email: 'juan@example.com',
        password: 'PasswordABC',
        role: 'empleado',
      };
      try {
        await registerSchema.parseAsync(invalidData);
        fail('debería haber lanzado un error de validación');
      } catch (err: any) {
        expect(err.issues[0].message).toContain('numero');
      }
    });

    // debe rechazar contrasena muy corta
    test('debería rechazar contraseña menor a 8 caracteres', async () => {
      const invalidData = {
        name: 'Juan',
        email: 'juan@example.com',
        password: 'Pass12',
        role: 'empleado',
      };
      try {
        await registerSchema.parseAsync(invalidData);
        fail('debería haber lanzado un error de validación');
      } catch (err: any) {
        expect(err.issues[0].message).toContain('8 caracteres');
      }
    });

    // debe rechazar email invalido
    test('debería rechazar email inválido', async () => {
      const invalidData = {
        name: 'Juan',
        email: 'not-an-email',
        password: 'Password123',
        role: 'empleado',
      };
      try {
        await registerSchema.parseAsync(invalidData);
        fail('debería haber lanzado un error de validación');
      } catch (err: any) {
        expect(err.issues).toBeDefined();
      }
    });

    // debe sanitizar caracteres especiales
    test('debería sanear caracteres HTML especiales', async () => {
      const dataWithHTML = {
        name: '<script>alert("xss")</script>',
        email: 'juan@example.com',
        password: 'Password123',
        role: 'empleado',
      };
      const result = await registerSchema.parseAsync(dataWithHTML);
      expect(result.name).not.toContain('<script>');
      expect(result.name).toContain('&lt;');
    });
  });

  // pruebas de login
  describe('loginSchema', () => {
    // debe aceptar datos validos
    test('debería aceptar datos de login válidos', async () => {
      const validData = {
        email: 'juan@example.com',
        password: 'Password123',
      };
      const result = await loginSchema.parseAsync(validData);
      expect(result.email).toBeDefined();
      expect(result.password).toBeDefined();
    });

    // rol por defecto es empleado
    test('debería tener rol por defecto como empleado', async () => {
      const validData = {
        email: 'juan@example.com',
        password: 'Password123',
      };
      const result = await loginSchema.parseAsync(validData);
  expect(result.role).toBe('empleado');
    });

    // debe rechazar email invalido
    test('debería rechazar email inválido', async () => {
      const invalidData = {
        email: 'not-an-email',
        password: 'Password123',
      };
      try {
        await loginSchema.parseAsync(invalidData);
        fail('debería haber lanzado un error de validación');
      } catch (err: any) {
        expect(err.issues).toBeDefined();
      }
    });
  });
});
