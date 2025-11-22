import { Document, Types } from "mongoose"; 

export interface ProductInterface extends Document { 
    id_category:Types.ObjectId
    name:string
    price:number
    stock:number
}

export interface ProductPostInterface { 
    id_category:Types.ObjectId // TODO: el usuario pasa el ID? o lo obtenemos con una subconsulta en el modelo?
    name:string
    price:number
    stock:number
}

export interface ProductPutInterface { // TODO: Se le envia todo porque los campos que no desea modificar se mandan como estaban
// (imaginando la interfaz del front)?
    name:string
    price:number
    stock:number
}