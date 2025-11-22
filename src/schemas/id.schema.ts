import { z } from 'zod'

// Schema general reutilizable para validar el ID enviado por parámetro
export const idSchema = z.object({
    id: z.string().length(24, { message: "El ID debe ser en formato ObjectId de MongoDB." }).regex(/^[0-9a-fA-F]+$/, { message: "El ID debe ser en formato ObjectId de MongoDB." })
});