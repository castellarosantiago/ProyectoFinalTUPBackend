import SaleModel from "../models/Sale";
import { ISale } from "../types/sales.interface";
import { ClientSession, Types } from "mongoose";

class SaleRepository {
  //Creo un nuevo registro (la logica de actualizacion de stock se va a manejar con el Controlador/servicio)
  public async create(
    saleData: Partial<ISale>, // partial para que campos como _id no sean obligatorios
    session: ClientSession // sesion obligatoria
  ): Promise<ISale> {
    const newSale = new SaleModel(saleData);
    return newSale.save({ session });
  }

  //Buscar por id
  public async findById(id: string | Types.ObjectId): Promise<ISale | null> {
    return SaleModel.findById(id)
      .populate('user', 'nombre email rol')
      .populate('detail.product', 'nombre precio stock categoria')
      .exec();
  }

  //Buscar todos
  public async findAll(filter: any = {}): Promise<ISale[]> {
    return SaleModel.find(filter)
      .populate('user', 'nombre email rol')
      .populate('detail.product', 'nombre precio stock categoria')
      .sort({ date: -1 })
      .exec();
  }
}

export default SaleRepository;