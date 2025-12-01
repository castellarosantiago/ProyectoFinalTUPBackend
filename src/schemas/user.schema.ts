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

export const userProfileBodyPutSchema = z.object({
    name: z.string().min(3, { message: "Name debe contener al menos 3 caracteres." }).optional(), 
    email: z.string().email({ message: "Email debe ser una dirección de correo válida." }).transform((v: string) => sanitizeString(v)).optional(),
    password: z.string().min(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
        .regex(/(?=.*[A-Z])/, { message: 'La contraseña debe contener al menos una mayúscula.' })
        .regex(/(?=.*\d)/, { message: 'La contraseña debe contener al menos un número.' })
        .optional(),        
    confirmPassword: z.string().optional(),
})
.refine(data => {
    // Si se envía una contraseña, se debe enviar la confirmación
    if (data.password && !data.confirmPassword) {
        throw new z.ZodError([
            {
                code: z.ZodIssueCode.custom,
                message: 'Debe confirmar la nueva contraseña.',
                path: ['confirmPassword']
            }
        ]);
    }
    // Si se envían ambas, deben coincidir
    if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
        throw new z.ZodError([
            {
                code: z.ZodIssueCode.custom,
                message: 'Las contraseñas no coinciden.',
                path: ['confirmPassword']
            }
        ]);
    }
    return true;
})
.refine(data => {
    // Debe haber al menos un campo para actualizar (name, email, o password)
    return !!data.name || !!data.email || !!data.password;
}, {
    message: "Debe proveer al menos un campo (nombre, email, o contraseña) para actualizar.",
    path: ['name', 'email', 'password']
});