import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt';

// middleware que verifica el jwt en el header authorization (bearer token)
// uso: proteger rutas y adjuntar el payload decodificado en req.user
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({ message: 'Token no proporcionado' });
	}

		const token = authHeader.split(' ')[1] as string;
	try {
		const payload = verifyJwt(token);
		// adjunta el payload decodificado en req.user para handlers posteriores
		(req as any).user = payload;
		return next();
	} catch (err) {
		console.error('JWT verification failed', err);
		return res.status(401).json({ message: 'Token invalido' });
	}
};

export default authenticate;