import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import categoryRouter from './routes/category.routes';
import productRouter from './routes/product.routes';
import { rateLimitGlobal } from './middlewares/rateLimit.middleware';

//Cargar variables de entorno
dotenv.config();
const { connect } = require('./config/db');

// conectar a base de datos
connect().catch((err: Error) => {
  console.error('DB connection error:', err.message);
  process.exit(1);
});

// crear app express
const app = express();

// middlewares globales
app.use(cors());
app.use(express.json());
app.use(rateLimitGlobal)

// rutas de autenticacion
import authRoutes from './routes/auth.routes';
app.use('/api/auth', authRoutes);

// rutas de ventas
import saleRoutes from './routes/sale.routes';
app.use('/api/sales', saleRoutes);

// ruta de categorias
app.use("/api/categories", categoryRouter);

// rutas de productos
app.use("/api/products", productRouter);

// middleware de manejo centralizado de errores
import errorHandler from './utils/errorHandler';
app.use(errorHandler);

// iniciar servidor
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log('Server running in PORT:', PORT);
  console.log(`http://localhost:${PORT}`);
});