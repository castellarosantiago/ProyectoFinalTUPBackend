import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny, ZodError } from 'zod';

// middleware para validar request con zod
export const validateRequest = (schema: ZodTypeAny) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    // parsear y validar el body
    const result = await schema.parseAsync(req.body);
    // guardar datos validados en el request
    req.body = result;
    return next();
  } catch (err) {
    if (err instanceof ZodError) {
      // errores de validacion formateados
      const errors = err.errors.map((e) => ({ field: e.path.join('.'), message: e.message }));
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    // error del servidor
    return res.status(500).json({ message: 'Server error during validation' });
  }
};
