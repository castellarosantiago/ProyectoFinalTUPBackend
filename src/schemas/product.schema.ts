import { z } from 'zod';

export const productBodyCreateSchema = z.object({
    id_category: z.string().length(24, { message: "Id_category es un campo obligatorio." }).regex(/^[0-9a-fA-F]+$/, { message: "El ID debe ser en formato ObjectId de MongoDB." }),
    name: z.string().min(3, { message: "Name es un campo obligatorio y debe contener al menos 3 caracteres." }),
    price: z.number().positive({ message: "Price es un campo obligatorio y no debe ser menor a 1." }),
    stock: z.number().min(0, { message: "Stock es un campo obligatorio y no debe ser menor a 0." })
});

export const productBodyPutSchema = z.object({
    name: z.string().min(3, { message: "Name es un campo obligatorio y debe contener al menos 3 caracteres." }),
    price: z.number().positive({ message: "Price es un campo obligatorio y no debe ser menor a 1." }),
    stock: z.number().min(0, { message: "Stock es un campo obligatorio y no debe ser menor a 0." })
});