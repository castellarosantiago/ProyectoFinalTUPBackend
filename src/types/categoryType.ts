import { Document } from "mongoose"; // Métodos y propiedades especiales que Mongoose inyecta en cada documento (como save(), remove(), _id, __v, etc.).

// Interface que representa un documento Category en MongoDB
export interface CategoryInterface extends Document{ 
    name:string;
    description?:string // opcional
}
