import SaleModel from "../models/Sale";
import { ISale } from "../types/sales.interface";
import { ClientSession, Types } from "mongoose";

class SaleRepository {
  //Creo un nuevo registro 
  public async create(
    saleData: Partial<ISale>, // partial para que campos como _id no sean obligatorios
    session?: ClientSession // session opcional: para casos simples no se requiere transacción
  ): Promise<ISale> {
    const newSale = new SaleModel(saleData);
    // Si se proporciona session la pasamos sino guardamos normalmente
    if (session) {
      return newSale.save({ session });
    }

    return newSale.save();
  }

  //Buscar por id
  public async findById(id: string | Types.ObjectId): Promise<ISale | null> {
    return SaleModel.findById(id)
      .populate('user', 'nombre email rol')
      .populate('detail.product', 'name price stock id_category')
      .exec();
  }

  //Buscar todos
  public async findAll(filter: any = {}): Promise<ISale[]> {
    return SaleModel.find(filter)
      .populate('user', 'nombre email rol')
      .populate('detail.product', 'name price stock id_category')
      .sort({ date: -1 })
      .exec();
  }
}

export default SaleRepository;