import { Request, Response, NextFunction } from 'express';

// middleware que verifica que el usuario tenga uno de los roles permitidos
// uso: requireRole('admin') o requireRole('empleado', 'admin')
export const requireRole = (...roles: string[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const user = (req as any).user;
		if (!user) return res.status(401).json({ message: 'No autenticado' });

		const userRole = user.rol || user.role;
		if (!userRole || !roles.includes(userRole)) {
			return res.status(403).json({ message: 'Acceso denegado: rol insuficiente' });
		}

		return next();
	};
};

export default requireRole;