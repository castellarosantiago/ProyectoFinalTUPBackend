import { z } from 'zod';

// Schema para el body de la solicitud create/update
export const categoryBodySchema = z.object({
    name: z.string().min(3, { message: "Name es un campo obligatorio y debe contener al menos 3 caracteres." }),
    description: z.string().optional()
});

