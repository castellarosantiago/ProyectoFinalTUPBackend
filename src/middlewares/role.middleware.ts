<<<<<<< HEAD
import { Request, Response, NextFunction } from "express";

// verifica el rol del usuario (admin o empleado)
export function authorizeAdmin(req:Request, res:Response, next:NextFunction) {
    const role = req.user?.role; // verificar que en jwt se agregue user y crear interface
=======
// Middleware verifica que el rol del usuario es Admin, para acceder a las rutas protegidas.
import { Request, Response, NextFunction } from "express";

export function authorizeAdmin(req: Request, res: Response, next: NextFunction) {
    const role = (req as any).user.role;
>>>>>>> b4660632b40aa1fecea5c2d236399a52eb9da124

    if (!role) {
        return res.status(401).json({ error: "Usuario no autenticado" });
    }

    if (role !== "admin") {
        return res.status(403).json({ error: "Acceso permitido solo para administradores" });
    }

    next();
}
<<<<<<< HEAD




=======
>>>>>>> b4660632b40aa1fecea5c2d236399a52eb9da124
