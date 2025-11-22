import { Document, Types } from "mongoose"; 

export interface ProductInterface extends Document { 
    id_category:Types.ObjectId
    name:string
    price:number
    stock:number
}