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
      .populate('user', 'name email role')
      .populate('detail.product', 'name price stock id_category')
      .exec();
  }

  //Buscar todos
  public async findAll(filter: any = {}): Promise<ISale[]> {
    return SaleModel.find(filter)
      .populate('user', 'name email role')
      .populate('detail.product', 'name price stock id_category')
      .sort({ date: -1 })
      .exec();
  }

  public async findPaginated(filter: any = {}, page: number = 1, limit: number = 10): Promise<{ sales: ISale[], totalCount: number, totalPages: number }> {
    
    const skip = (page - 1) * limit;

    // Contar el total de documentos que coinciden con el filtro
    const totalCount = await SaleModel.countDocuments(filter).exec();

    // Obtener los documentos paginados
    const sales = await SaleModel.find(filter)
      .populate('user', 'name email role')
      .populate('detail.product', 'name price stock id_category')
      .sort({ date: -1 })
      .skip(skip) // Saltar documentos anteriores
      .limit(limit) // Limitar la cantidad de documentos
      .exec();

    const totalPages = Math.ceil(totalCount / limit);

    return {
      sales: sales,
      totalCount: totalCount,
      totalPages: totalPages,
    };
  }

}

export default SaleRepository;