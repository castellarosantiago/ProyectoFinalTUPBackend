import { Request, Response } from "express";
import UserRepository from "../repositories/User.repository";
import { UserPutInterface } from "../types/user.interface";

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
            const updatedProduct = await UserRepository.updateUser(id, dataValidate);
            
            if (!updatedProduct){
                return res.status(404).json({ message: "No se pudo modificar el usuario con el ID ingresado."});
            }
            
            return res.status(200).json({ message: "Usuario modificado correctamente.", product:updatedProduct});
        } catch (err){
            if (err instanceof Error){
                return res.status(500).json({ message: "Ha ocurrido un problema al intentar modificar el usuario.", error: err.message });
            }
        }
    }
}

export default new UserController();
