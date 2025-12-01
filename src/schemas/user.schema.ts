import z from "zod";
import validator from 'validator';

// TODO: reutilizar funcion de sanitizado
// limpieza y escape de strings
const sanitizeString = (s: unknown) => {
  if (typeof s !== 'string') return '';
  return validator.escape(s).trim();
};

export const userBodyPutSchema = z.object({
    name: z.string().min(3, { message: "Name es un campo obligatorio y debe contener al menos 3 caracteres." }),
    email: z.string().email().transform((v: string) => sanitizeString(v)),
    role: z.enum(['empleado', 'admin']).optional().transform((v: string | undefined) => v || 'empleado'),
});