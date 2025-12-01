import { Request, Response, NextFunction } from "express";
import UserRepository from "../repositories/User.repository";
import { UserPutInterface } from "../types/user.interface";
import bcrypt from 'bcryptjs';

class UserController {
    public async getUsers(req:Request, res:Response) {
        try {
            const users = await UserRepository.getUsers();
            return res.status(200).json(users);
        } catch (err){
            if (err instanceof Error){
                return res.status(500).json({ message: "Ha ocurrido un problema al intentar obtener todos los Usuarios.", error: err.message });
            }
        }
    }

    public async getProfile (req: Request, res: Response, next: NextFunction){
      try {
        const userId = (req as any).user.id;
        const user = await UserRepository.findById(userId);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
        return res.status(200).json(user);
      } catch (err) {
        next(err);
      }
    }

    public async deleteUser(req:Request, res:Response) {
        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ message: "ID de usuario es requerido." });
        }
        
        try {

            const userDeleted = await UserRepository.deleteUser(id); 
        
            if (!userDeleted){
                return res.status(404).json({ message: "No se pudo borrar el usuario con el ID ingresado."});
            }
        
            res.status(200).json({ message: "Usuario eliminado correctamente" });
        } catch (err){
            if (err instanceof Error){
                 return res.status(500).json({ message: "Ha ocurrido un problema al intentar eliminar el usuario", error: err.message });
            }
        }
    }

    public async updateUser(req:Request, res:Response){
        const id = req.params.id;
        const { name, email, role } = req.body;
        const dataValidate:UserPutInterface = { name, email, role }

        if (!id) {
            return res.status(400).json({ message: "ID de usuario es requerido." });
        }

        try {
            const updatedUser = await UserRepository.updateUser(id, dataValidate);
            
            if (!updatedUser){
                return res.status(404).json({ message: "No se pudo modificar el usuario con el ID ingresado."});
            }
            
            return res.status(200).json({ message: "Usuario modificado correctamente.", user:updatedUser});
        } catch (err){
            if (err instanceof Error){
                return res.status(500).json({ message: "Ha ocurrido un problema al intentar modificar el usuario.", error: err.message });
            }
        }
    }

    // actualizar credenciales (nombre, email, password)
    public async updateCredentials(req: Request, res: Response, next: NextFunction){
      try {
        const userId = (req as any).user.id;
        const { name, email, password } = req.body;

        const updateData: any = {};
        if (name) updateData.name = name;
        if (email) {
          // verificar si el email ya existe en otro usuario
          const existing = await UserRepository.findByEmail(email);
          if (existing && existing._id.toString() !== userId) {
            return res.status(409).json({ message: 'El email ya esta en uso' });
          }
          updateData.email = email;
        }
        if (password) {
          const salt = await bcrypt.genSalt(10);
          updateData.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await UserRepository.updateUser(userId, updateData);
        if (!updatedUser) return res.status(404).json({ message: 'Usuario no encontrado' });

        return res.status(200).json({ message: 'Perfil actualizado', user: updatedUser });
      } catch (err) {
        next(err);
      }
    };

}

export default new UserController();


