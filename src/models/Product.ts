import { Schema, model } from "mongoose";
import { ProductInterface } from "../types/product.interface";

const ProductSchema = new Schema<ProductInterface>({ 
    id_category: { type:Schema.Types.ObjectId, required:true, ref: "Category"},
    name: { type:String, required:true },
    price: { type:Number, required:true },
    stock: { type:Number, required:true }, 
});

const Product = model<ProductInterface>('Product', ProductSchema);

export default Product;