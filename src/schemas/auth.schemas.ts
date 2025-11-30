import { z } from 'zod';
import validator from 'validator';

// limpieza y escape de strings
const sanitizeString = (s: unknown) => {
  if (typeof s !== 'string') return '';
  return validator.escape(s).trim();
};

// schema para registrar usuario
export const registerSchema = z.object({
  name: z.string().min(1).transform((v: string) => sanitizeString(v)),
  email: z.string().email().transform((v: string) => sanitizeString(v)),
  // reglas de contrasena: 8+, mayuscula y numero
  password: z
    .string()
    .min(8, { message: 'La contrasena debe tener al menos 8 caracteres' })
    .regex(/(?=.*[A-Z])/, { message: 'La contrasena debe contener al menos una mayuscula' })
    .regex(/(?=.*\d)/, { message: 'La contrasena debe contener al menos un numero' }),
  // rol por defecto
  role: z.enum(['empleado', 'admin']).optional().transform((v: string | undefined) => v || 'empleado'),
});

// schema para login
export const loginSchema = z.object({
  email: z.string().email().transform((v: string) => sanitizeString(v)),
  password: z.string().min(1).transform((v: string) => (typeof v === 'string' ? v.trim() : '')),
  // rol por defecto
  role: z.enum(['empleado', 'admin']).optional().transform((v: string | undefined) => v || 'empleado'),
});

// tipos typescript generados desde schemas
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
