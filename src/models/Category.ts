import { Schema, model } from "mongoose";
import { CategoryInterface } from "../types/category.interface";

// Crea un schema correspondiente a la interfaz de documento
// Le dice a Mongoose la forma de los datos
const CategorySchema = new Schema<CategoryInterface>({ 
    name: { type:String, required:true},
    description:String
});

// Crea el modelo
// Es la clase que se usar para realizar operaciones CRUD
const Category = model<CategoryInterface>('Category', CategorySchema);

export default Category;

