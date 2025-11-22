import { Request, Response } from 'express';
import SaleRepository from '../repositories/Sale.repository';

const saleRepository = new SaleRepository();

// Listar ventas con filtros opcionales (por fecha y usuario)
export const listSales = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, userId } = req.query;
    
    // construir filtro dinamico
    const filter: any = {};
    
    // filtro por rango de fechas
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate as string);
      }
      if (endDate) {
        // agregar 1 dia para incluir todo el dia final
        const end = new Date(endDate as string);
        end.setDate(end.getDate() + 1);
        filter.date.$lt = end;
      }
    }
    
    // filtro por usuario
    if (userId) {
      filter.user = userId;
    }
    
    // buscar ventas usando el repositorio
    const sales = await saleRepository.findAll(filter);
    
    return res.status(200).json({
      message: 'Ventas obtenidas',
      total: sales.length,
      sales: sales
    });
  } catch (err) {
    console.error('List sales error', err);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};

// Obtener detalle de una venta especifica
export const getSaleDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // validar que el id sea valido
    if (!id) {
      return res.status(400).json({ message: 'El ID de venta es requerido' });
    }
    
    // buscar venta por id usando el repositorio
    const sale = await saleRepository.findById(id);
    
    // verificar si existe la venta
    if (!sale) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }
    
    return res.status(200).json({
      message: 'Detalle de venta obtenido',
      sale: sale
    });
  } catch (err) {
    console.error('Get sale detail error', err);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};

export default { listSales, getSaleDetail };
