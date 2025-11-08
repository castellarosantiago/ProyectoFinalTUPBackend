import {Document, Types} from 'mongoose'; // document le inyecta propiedades como save(), remove() etc

//Interface para el detalle de cada producto vendido
export interface SaleDetail {
    product: Types.ObjectId;
    name:string;
    amountSold:number;
    subtotal: number; // precio *cantidad
}

//Interface principal para Venta
export interface Sale extends Document {
    date: Date;
    user: Types.ObjectId; // hace referencia al usuario (Empleado/Admin) que hizo la venta para que quede el registro
    detail: SaleDetail[] // array de productos vendidos
}