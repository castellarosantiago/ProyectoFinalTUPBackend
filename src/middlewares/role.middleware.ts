import { Request, Response, NextFunction } from "express";

// verifica el rol del usuario (admin o empleado)
export function authorizeAdmin(req:Request, res:Response, next:NextFunction) {
    const role = req.user?.role; // verificar que en jwt se agregue user y crear interface

    if (!role) {
        return res.status(401).json({ error: "Usuario no autenticado" });
    }

    if (role !== "admin") {
        return res.status(403).json({ error: "Acceso permitido solo para administradores" });
    }

    next();
}




