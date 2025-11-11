import { ObjectId } from 'mongoose';
import Category from '../models/Category';
import { CategoryInterface, CategoryInputInterface } from '../types/categoryType';

class CategoryRepository {

    public async createCategory(categoryData:CategoryInputInterface):Promise<CategoryInterface> {
        return await Category.create(categoryData);
    }
  
    public async getCategories(): Promise<CategoryInterface[]> {
        return await Category.find({}).exec();
    }

    public async findCategoryById(id:ObjectId):Promise<CategoryInterface | null> {
        return await Category.findById(id).exec();
    }

    public async deleteCategory(id:ObjectId):Promise<CategoryInterface | null> {
        return Category.findByIdAndDelete(id).exec()
    }

    public async updateCategory(id:ObjectId, categoryData:CategoryInputInterface):Promise<CategoryInterface | null> {
        return Category.findByIdAndUpdate(id, categoryData, { new:true }).exec()
    }
}

export default new CategoryRepository();