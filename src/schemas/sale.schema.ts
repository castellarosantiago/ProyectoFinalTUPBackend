import { z } from "zod";

// schema para la validacion de cada producto en la venta
export const SaleDetailSchema = z.object({
  product: z
    .string()
    .length(
      24,
      "El ID del producto debe ser un string válido de ObjectId de MongoDB"
    ),
  amountSold: z
    .number()
    .int()
    .positive("La cantidad vendida debe ser un número entero positivo"),
  subtotal: z
    .number()
    .nonnegative("Subtotal debe ser un numero con dos decimales o un entero")
    .optional(),
});

// schema principal para la validación de la venta completa
export const SaleSchema = z.object({
  details: z
    .array(SaleDetailSchema)
    .min(1, "La venta debe contener al menos un detalle de producto"),
});

// tipo inferido de la entrada para tipar la funcion del controlador
export type SaleInput = z.infer<typeof SaleSchema>;
