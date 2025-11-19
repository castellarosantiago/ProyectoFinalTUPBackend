import { registerSchema, loginSchema } from '../validators/auth.schemas';

// tests de validacion
describe('Auth Validation Schemas', () => {
  // pruebas de registro
  describe('registerSchema', () => {
    // debe aceptar datos validos
    test('should accept valid register data', async () => {
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
    test('should reject password without uppercase', async () => {
      const invalidData = {
        name: 'Juan',
        email: 'juan@example.com',
        password: 'password123',
        role: 'empleado',
      };
      try {
        await registerSchema.parseAsync(invalidData);
        fail('Should have thrown validation error');
      } catch (err: any) {
        expect(err.issues[0].message).toContain('mayuscula');
      }
    });

    // debe rechazar si no tiene numero
    test('should reject password without number', async () => {
      const invalidData = {
        name: 'Juan',
        email: 'juan@example.com',
        password: 'PasswordABC',
        role: 'empleado',
      };
      try {
        await registerSchema.parseAsync(invalidData);
        fail('Should have thrown validation error');
      } catch (err: any) {
        expect(err.issues[0].message).toContain('numero');
      }
    });

    // debe rechazar contrasena muy corta
    test('should reject password shorter than 8 characters', async () => {
      const invalidData = {
        name: 'Juan',
        email: 'juan@example.com',
        password: 'Pass12',
        role: 'empleado',
      };
      try {
        await registerSchema.parseAsync(invalidData);
        fail('Should have thrown validation error');
      } catch (err: any) {
        expect(err.issues[0].message).toContain('8 caracteres');
      }
    });

    // debe rechazar email invalido
    test('should reject invalid email', async () => {
      const invalidData = {
        name: 'Juan',
        email: 'not-an-email',
        password: 'Password123',
        role: 'empleado',
      };
      try {
        await registerSchema.parseAsync(invalidData);
        fail('Should have thrown validation error');
      } catch (err: any) {
        expect(err.issues).toBeDefined();
      }
    });

    // debe sanitizar caracteres especiales
    test('should sanitize HTML special characters', async () => {
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
    test('should accept valid login data', async () => {
      const validData = {
        email: 'juan@example.com',
        password: 'Password123',
      };
      const result = await loginSchema.parseAsync(validData);
      expect(result.email).toBeDefined();
      expect(result.password).toBeDefined();
    });

    // rol por defecto es empleado
    test('should have default rol as empleado', async () => {
      const validData = {
        email: 'juan@example.com',
        password: 'Password123',
      };
      const result = await loginSchema.parseAsync(validData);
  expect(result.role).toBe('empleado');
    });

    // debe rechazar email invalido
    test('should reject invalid email', async () => {
      const invalidData = {
        email: 'not-an-email',
        password: 'Password123',
      };
      try {
        await loginSchema.parseAsync(invalidData);
        fail('Should have thrown validation error');
      } catch (err: any) {
        expect(err.issues).toBeDefined();
      }
    });
  });
});
