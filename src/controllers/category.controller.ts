import { Request, Response } from "express";
import CategoryRepository from "../repositories/Category.repository";
import { CategoryInputInterface } from "../types/category.interface";
import { Types } from "mongoose";

class CategoryController {

    public async getCategories(req:Request, res:Response) { 
        try {
            const categories = await CategoryRepository.getCategories();
            return res.status(200).json(categories);
        } catch (err){
            if (err instanceof Error){
                return res.status(500).json({ message: "Ha ocurrido un problema al intentar obtener todas las Categorías.", error: err.message });
            }
        }
    }

    public async findCategoryById(req:Request, res:Response){
        const id = req.params.id;

        try {
            const objectId = new Types.ObjectId(id);
            const category = await CategoryRepository.findCategoryById(objectId);

            if (!category){
                return res.status(404).json({ message: "No se pudo encontrar una categoría con el ID ingresado."});
            }
    
            res.status(200).json(category);
        } catch (err){
            if (err instanceof Error){
                return res.status(500).json({ message: "Ha ocurrido un problema al intentar buscar la categoría.", error: err.message });
            }
        }
    }

    public async createCategory(req:Request, res:Response){
        const { name, description } = req.body;
        const dataValidate:CategoryInputInterface = { name, description}

        try {
            const newCategory = await CategoryRepository.createCategory(dataValidate);
            return res.status(201).json({ message: "Categoría creada correctamente.", category:newCategory });
        } catch (err){
            if (err instanceof Error){
                return res.status(500).json({ message: "Ha ocurrido un problema al intentar crear la categoría.", error: err.message });
            }
        }
    }    

    public async deleteCategory(req:Request, res:Response){
        const id = req.params.id;

        try {
            const objectId = new Types.ObjectId(id);
            const categoryDeleted = await CategoryRepository.deleteCategory(objectId); 

            if (!categoryDeleted){
                return res.status(404).json({ message: "No se pudo borrar la categoría con el ID ingresado."});
            }

            res.status(200).json({ message: "Categoría eliminada correctamente" });
        } catch (err){
            if (err instanceof Error){
                return res.status(500).json({ message: "Ha ocurrido un problema al intentar eliminar la categoría", error: err.message });
            }
        }
    }

    public async updateCategory(req:Request, res:Response){
        const id = req.params.id;
        const { name, description } = req.body;
        const dataValidate:CategoryInputInterface = { name, description}

        try {
            const objectId = new Types.ObjectId(id);
            const updatedCategory = await CategoryRepository.updateCategory(objectId, dataValidate);
            
            if (!updatedCategory){
                return res.status(404).json({ message: "No se pudo modificar la categoría con el ID ingresado."});
            }
            
            return res.status(200).json({ message: "Categoría modificada correctamente.", category:updatedCategory});
        } catch (err){
            if (err instanceof Error){
                return res.status(500).json({ message: "Ha ocurrido un problema al intentar modificar la categoría.", error: err.message });
            }
        }
    }
}

export default new CategoryController();