import { Request, Response } from "express";
import ProductRepository from "../repositories/Product.repository";
import { ProductPutInterface, ProductPostInterface } from "../types/productType";
import { Types } from "mongoose";

class ProductController {

    public async getProducts(req:Request, res:Response) { 
        try {
            const products = await ProductRepository.getProducts();
            return res.status(200).json(products);
        } catch (err){
            if (err instanceof Error){
                return res.status(500).json({ message: "Ha ocurrido un problema al intentar obtener todos los Productos.", error: err.message });
            }
        }
    }

    public async findProductById(req:Request, res:Response){
        const id = req.params.id;

        try {
            const objectId = new Types.ObjectId(id);
            const product = await ProductRepository.findProductById(objectId);

            if (!product){
                return res.status(404).json({ message: "No se pudo encontrar un producto con el ID ingresado."});
            }
    
            res.status(200).json(product);
        } catch (err){
            if (err instanceof Error){
                return res.status(500).json({ message: "Ha ocurrido un problema al intentar buscar el producto.", error: err.message });
            }
        }
    }

    public async createProduct(req:Request, res:Response){
        const { id_category, name, price, stock } = req.body;
        const dataValidate:ProductPostInterface = { id_category, name, price, stock }

        try {
            const newProduct = await ProductRepository.createProduct(dataValidate);

            if (!newProduct) return res.status(400).json({ message: "La categoría ingresada no existe." });
        
            return res.status(201).json({ message: "Producto creado correctamente.", product:newProduct });
        } catch (err){
            if (err instanceof Error){
                return res.status(500).json({ message: "Ha ocurrido un problema al intentar crear el producto.", error: err.message });
            }
        }
    }    

    public async deleteProduct(req:Request, res:Response){
        const id = req.params.id;

        try {
            const objectId = new Types.ObjectId(id);
            const productDeleted = await ProductRepository.deleteProduct(objectId); 

            if (!productDeleted){
                return res.status(404).json({ message: "No se pudo borrar el producto con el ID ingresado."});
            }

            res.status(200).json({ message: "Producto eliminado correctamente" });
        } catch (err){
            if (err instanceof Error){
                return res.status(500).json({ message: "Ha ocurrido un problema al intentar eliminar el producto", error: err.message });
            }
        }
    }

    public async updateProduct(req:Request, res:Response){
        const id = req.params.id;
        const { name, price, stock } = req.body;
        const dataValidate:ProductPutInterface = { name, price, stock }

        try {
            const objectId = new Types.ObjectId(id);
            const updatedProduct = await ProductRepository.updateProduct(objectId, dataValidate);
            
            if (!updatedProduct){
                return res.status(404).json({ message: "No se pudo modificar el producto con el ID ingresado."});
            }
            
            return res.status(200).json({ message: "Producto modificado correctamente.", product:updatedProduct});
        } catch (err){
            if (err instanceof Error){
                return res.status(500).json({ message: "Ha ocurrido un problema al intentar modificar el producto.", error: err.message });
            }
        }
    }

    public async findProductByName(req:Request, res:Response){
        const { name } = req.query;

        try {

            const product = await ProductRepository.findProductByName(String(name));

            if (!product){
                return res.status(404).json({ message: "No se encontró ningún producto con el nombre ingresado." });
            }
    
            res.status(200).json(product);
        } catch (err){
            if (err instanceof Error){
                return res.status(500).json({ message: "Ha ocurrido un problema al buscar un producto por su nombre.", error: err.message });
            }
        }
    }

    public async filterByCategory(req:Request, res:Response){
        const { id_category } = req.query;

        try {
            const objectId = new Types.ObjectId(String(id_category));
            
            const products = await ProductRepository.filterByCategory(objectId);
    
            res.status(200).json(products);
        } catch (err){
            if (err instanceof Error){
                return res.status(500).json({ message: "Ha ocurrido un problema al filtrar por categoría.", error: err.message });
            }
        }
    }

    public async filterByPrice(req:Request, res:Response){
        const { minPrice, maxPrice } = req.query;

        try {

            const min = Number(minPrice);
            const max = Number(maxPrice);

            const products = await ProductRepository.filterByPrice(min, max);
    
            res.status(200).json(products);
        } catch (err){
            if (err instanceof Error){
                return res.status(500).json({ message: "Ha ocurrido un problema al filtrar por precio.", error: err.message });
            }
        }
    }


}

export default new ProductController();