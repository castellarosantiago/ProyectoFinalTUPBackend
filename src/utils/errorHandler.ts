// middleware de manejo centralizado de errores
import { Request, Response, NextFunction } from 'express';

type ErrorWithStatus = Error & { status?: number };

const errorHandler = (err: ErrorWithStatus, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status && Number.isInteger(err.status) ? err.status : 500;
  const message = err.message || 'internal server error';
  // log simple del error
  console.error('Unhandled error:', err);
  res.status(status).json({ error: message });
};

export default errorHandler;
