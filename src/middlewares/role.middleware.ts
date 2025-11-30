// Middleware verifica que el rol del usuario es Admin, para acceder a las rutas protegidas.
import { Request, Response, NextFunction } from "express";

export function authorizeAdmin(req: Request, res: Response, next: NextFunction) {
    const role = (req as any).user.role;

    if (!role) {
        return res.status(401).json({ error: "Usuario no autenticado" });
    }

    if (role !== "admin") {
        return res.status(403).json({ error: "Acceso permitido solo para administradores" });
    }

    next();
}
