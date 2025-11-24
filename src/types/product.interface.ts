import { Document, Types } from "mongoose"; 

export interface ProductInterface extends Document { 
    id_category:Types.ObjectId
    name:string
    price:number
    stock:number
}

export interface ProductPostInterface { 
    id_category:Types.ObjectId 
    name:string
    price:number
    stock:number
}

export interface ProductPutInterface { 
    name:string
    price:number
    stock:number
}