import { z } from 'zod';

// Schema para el body de la solicitud create/update
export const categoryBodySchema = z.object({
    name: z.string().min(3, { message: "Name es un campo obligatorio y debe contener al menos 3 caracteres." }),
    description: z.string().optional()
});

// Schema para validar el ID enviado por parámetro
export const categoryIdSchema = z.object({
    id: z.string().length(24, { message: "El ID debe ser en formato ObjectId de MongoDB." }).regex(/^[0-9a-fA-F]+$/, { message: "El ID debe ser en formato ObjectId de MongoDB." })
});