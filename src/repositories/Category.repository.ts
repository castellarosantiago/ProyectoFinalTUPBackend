import { ObjectId } from 'mongoose';
import Category from '../models/Category';
import { CategoryInterface } from '../types/categoryType';

export class CategoryRepository {

    public async createCategory(categoryData: CategoryInterface):Promise<CategoryInterface> {
        return await Category.create(categoryData);
    }
  
    public async getCategorys(): Promise<CategoryInterface[]> {
        return await Category.find({}).exec();
    }

    public async findCategoryById(id:ObjectId):Promise<CategoryInterface | null> {
        return await Category.findById(id).exec();
    }

    public async findCategoryByName(name:string):Promise<CategoryInterface | null> {
        return await Category.findOne({ 'name': name }).exec();
    }

    public async deleteCategory(id:ObjectId):Promise<CategoryInterface | null> {
        return Category.findByIdAndDelete(id).exec()
    }

    public async updateCategory(id:ObjectId, categoryData:CategoryInterface):Promise<CategoryInterface | null> {
        return Category.findByIdAndUpdate(id, categoryData, { new:true }).exec()
    }
  
}