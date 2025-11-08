import { Schema, model } from "mongoose";
import { ISale, ISaleDetail } from "../types/sales.interface";

// Schema para detalle de la venta
const SaleDetailSchema = new Schema<ISaleDetail>({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  amountSold: { type: Number, required: true, min: 1 },
  subtotal: { type: Number, required: true, min: 0 },
});

//Schema para venta
const SaleSchema = new Schema<ISale>({
    date:{type:Date, default:Date.now, required: true},
    user: {type:Schema.Types.ObjectId, ref: 'User', required: true},
    detail: {type: [SaleDetailSchema], required: true},
    total: {type:Number, required:true, min:0},
})

const VentaModel = model<ISale>('Sale', SaleSchema)

export default VentaModel;