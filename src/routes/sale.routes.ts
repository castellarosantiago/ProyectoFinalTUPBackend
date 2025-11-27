import { Router } from 'express';
import { listSales, getSaleDetail, createSale } from '../controllers/sale.controller';
import { SaleSchema } from '../schemas/sale.schema';
import authenticate from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validator.middleware';
const router = Router();

// ruta para registrar una nueva venta (POST)
// POST /api/sales
// Body: { details: [{ product: "id", amountSold: number }, ...] }
router.post('/', authenticate, validate(SaleSchema, "body"), createSale);

// ruta para listar ventas (con filtros opcionales)
// GET /api/sales?startDate=2024-01-01&endDate=2024-01-31&userId=xxx
router.get('/', authenticate, listSales);

// ruta para obtener detalle de una venta especifica
// GET /api/sales/:id
router.get('/:id', authenticate, getSaleDetail);

export default router;
