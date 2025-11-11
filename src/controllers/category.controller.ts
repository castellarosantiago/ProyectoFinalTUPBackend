import { Request, Response } from "express";
import CategoryRepository from "../repositories/Category.repository";
import { CategoryInputInterface } from "../types/categoryType";

class CategoryController {

    public async getCategories(res:Response) { 
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
    // MIDDLEWARES? JOI
        if (!id){
            return res.status(400).json({ message: "Debe ingresar un ID para buscar la Categoría." });
        }

        //TODO: validar si el id no es de tipo ObjectID 

        try {
            const category = await CategoryRepository.findCategoryById(id); // tiene que pasarse como ObjectID

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

    public createCategory(req:Request, res:Response){
        const { name, description } = req.body;
    //MIDDLEWARES?? JOI
        if (!name) {
            return res.status(400).json({ message: "Debe ingresar el campo name para crear la categoría." });
        }
        const dataValidate:CategoryInputInterface = { name, description}

        try {
            const newCategory = CategoryRepository.createCategory(dataValidate);
            return res.status(201).json({ message: "Categoría creada correctamente.", category:newCategory });
        } catch (err){
            if (err instanceof Error){
                return res.status(500).json({ message: "Ha ocurrido un problema al intentar crear la categoría.", error: err.message });
            }
        }
    }    

    public deleteCategory(req:Request, res:Response){
        const id = req.params.id;
    //MIDDLEWARE
        if (!id){
            return res.status(400).json({ message: "Debe ingresar un ID para eliminar la categoría." });
        }

        try {
            const categoryDeleted = CategoryRepository.deleteCategory(id); // debe pasar como ObjectID

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


    public updateCategory(req:Request, res:Response){
        const id = req.params.id;
        const { name, description } = req.body;

    // MIDDLEWARE
        if (!id){
            return res.status(400).json({ message: "Debe ingresar un ID para modificar la categoría" });
        }

        if (!name) {
            return res.status(400).json({ message: "Debe ingresar el campo name para crear la categoría." });
        }
        
        const dataValidate:CategoryInputInterface = { name, description}

        try {
            const updatedCategory = CategoryRepository.updateCategory(id, dataValidate); // debe pasar como ObjectID
            return res.status(200).json({ message: "Categoría modificada correctamente.", category:updatedCategory});
        } catch (err){
            if (err instanceof Error){
                return res.status(500).json({ message: "Ha ocurrido un problema al intentar modificar la categoría.", error: err.message });
            }
        }
    }
}

export default new CategoryController();