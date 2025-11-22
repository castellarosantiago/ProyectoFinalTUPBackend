import { Router } from 'express';
import { listSales, getSaleDetail } from '../controllers/sale.controller';

const router = Router();

// ruta para listar ventas (con filtros opcionales)
// GET /api/sales?startDate=2024-01-01&endDate=2024-01-31&userId=xxx
router.get('/', listSales);

// ruta para obtener detalle de una venta especifica
// GET /api/sales/:id
router.get('/:id', getSaleDetail);

export default router;
