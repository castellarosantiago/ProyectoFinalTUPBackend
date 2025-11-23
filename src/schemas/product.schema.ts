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

export const productSearchNameSchema = z.object({
    name: z.string().min(1, { message: "El parámetro 'name' es requerido y no puede estar vacío." })
});

export const productFilterPriceSchema = z.object({
    minPrice: z.string().transform(Number).refine(val => !isNaN(val), { message: "minPrice debe ser un número válido." }).refine(val => val >= 0, { message: "minPrice no puede ser negativo." }),
    maxPrice: z.string().transform(Number).refine(val => !isNaN(val), { message: "maxPrice debe ser un número válido." }).refine(val => val >= 0, { message: "maxPrice no puede ser negativo." })
}).refine(data => data.minPrice <= data.maxPrice, {
    message: "El precio mínimo no puede ser mayor al máximo.",
    path: ["minPrice"]
});

export const productFilterIdCategorySchema = z.object({
    id_category: z.string().length(24, { message: "id_category debe ser un ObjectId válido." }).regex(/^[0-9a-fA-F]+$/, { message: "El ID debe ser en formato ObjectId de MongoDB." })
});