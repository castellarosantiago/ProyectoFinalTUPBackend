import { Types } from 'mongoose';
import Product from '../models/Product';
import { ProductInterface, ProductPostInterface, ProductPutInterface } from '../types/product.interface';
import Category from '../models/Category';

class ProductRepository {
    
    public async createProduct(productData:ProductPostInterface):Promise<ProductInterface | null> {
      
        // Validar que la categoría exista
        const category = await Category.findById(productData.id_category).exec();
        if (!category) return null

        return await Product.create(productData);
    }

    public async getProducts(): Promise<ProductInterface[]> {
        return await Product.find({}).exec();
    }

    public async findProductById(id:Types.ObjectId):Promise<ProductInterface | null> {
        return await Product.findById(id).exec();
    }

    public async deleteProduct(id:Types.ObjectId):Promise<ProductInterface | null> {
        return Product.findByIdAndDelete(id).exec()
    }

    public async updateProduct(id:Types.ObjectId, productData:ProductPutInterface):Promise<ProductInterface | null> {
        return Product.findByIdAndUpdate(id, productData, { new:true }).exec()
    }

    // Opciones de filtrado
    public async findProductByName(name:string):Promise<ProductInterface[]> {
        return await Product.find({ name: { $regex: name, $options: 'i' } }).exec();
    }

    public async filterByCategory(id_category:Types.ObjectId):Promise<ProductInterface[]> {
        return await Product.find({ id_category }).exec();
    }

    public async filterByPrice(minPrice:number, maxPrice:number):Promise<ProductInterface[]> {
        return await Product.find({ price: { $gte: minPrice, $lte: maxPrice } }).exec();
    }

    // Decrementa el stock de un producto de forma segura
    
    public async decrementStock(id: Types.ObjectId, amount:number):Promise<boolean> {
        //  decrementar solo si hay stock suficiente
        const res = await Product.updateOne(
            { _id: id, stock: { $gte: amount } },
            { $inc: { stock: -amount } }
        ).exec();
        // puede ser modifiedCount o nModified dependiendo de la version de mongoose
        const modified = (res as any).modifiedCount ?? (res as any).nModified ?? 0; // esto lo que hace es verificar si modifiedCount existe, si no, usa nModified y si no usa 0
        return modified > 0; // Retorna true si se actualizo stock suficiente y false si stock insuficiente
    }
}

export default new ProductRepository();