// Middleware genérico que puede ser utilizado por cualquier schema Zod.
import { Request, Response, NextFunction } from 'express';
import { ZodType, ZodError } from 'zod';

// `source` indica dónde buscar los datos a validar.
export const validate = (schema:ZodType, source: 'body' | 'params' | 'query' = 'body') => {
    
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            //Valida los datos de la solicitud contra el schema de Zod
            schema.parse(req[source]); 
            next();
        } catch (error) {
            // Si falla la validación
            if (error instanceof ZodError) {
                return res.status(400).json({
                    message: 'Error de validación de datos de entrada.',
                    error: error.message,
                });
            }
            // Si sucede otro error
            return res.status(500).json({ message: 'Error interno del servidor en la validación.' });
        }
    };
};