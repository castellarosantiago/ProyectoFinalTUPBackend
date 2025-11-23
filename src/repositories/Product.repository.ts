import { Types } from 'mongoose';
import Product from '../models/Product';
import { ProductInterface, ProductPostInterface, ProductPutInterface } from '../types/productType';
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
}

export default new ProductRepository();