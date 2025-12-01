import { z } from 'zod';

// esquema general reutilizable para validar el id enviado por parámetro
export const idSchema = z.object({
    id: z.string().regex(/^[0-9a-f]{24}$/i, { message: 'el id debe ser en formato objectid de mongodb.' })
});