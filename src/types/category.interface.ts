import { Document } from "mongoose"; // Métodos y propiedades especiales que Mongoose inyecta en cada documento (como save(), remove(), _id, __v, etc.)

// Interface que representa un documento Category en MongoDB
export interface CategoryInterface extends Document { 
    name:string;
    description?:string // opcional
}

// Interface Data Transfer Object (DTO) para la entrada (body) que envia el usuario
export interface CategoryInputInterface { 
    name:string;
    description?:string // opcional
}
