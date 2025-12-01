// Middleware genérico que puede ser utilizado por cualquier schema Zod.
import { Request, Response, NextFunction } from 'express';
import { ZodType, ZodError } from 'zod';

// `source` indica dónde buscar los datos a validar.
export const validate = (schema:ZodType, source: 'body' | 'params' | 'query' = 'body') => {
    
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await schema.parseAsync(req[source]); 

            if (source === 'body') {
                req[source] = result;
            }
            next();
            
        } catch (error) {
            // si falla la validación
            if (error instanceof ZodError) {
                const errors = error.errors.map((e) => ({ field: e.path.join('.'), message: e.message }));
                return res.status(400).json({ message: 'Error de validación de datos de entrada.', errors });
            }
            // si sucede otro error
            return res.status(500).json({ message: 'Error interno del servidor en la validación.' });
        }
    };
};