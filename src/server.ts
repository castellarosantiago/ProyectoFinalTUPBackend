import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import categoryRouter from './routes/category.routes';
import productRouter from './routes/product.routes';
import { rateLimitGlobal } from './middlewares/rateLimit.middleware';
import saleRoutes from './routes/sale.routes';
import authRoutes from './routes/auth.routes';
import userRouter from './routes/user.routes';
import errorHandler from './utils/errorHandler';

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
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(rateLimitGlobal)

// rutas de autenticacion
app.use('/api/auth', authRoutes);

// rutas de ventas
app.use('/api/sales', saleRoutes);

// ruta de categorias
app.use("/api/categories", categoryRouter);

// rutas de productos
app.use("/api/products", productRouter);

// rutas de usuarios
app.use("/api/users", userRouter);

app.use(errorHandler);

// iniciar servidor
const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log('Server running in PORT:', PORT);
  console.log(`http://localhost:${PORT}`);
}).on('error', (err) => {
  console.error('Error starting server:', err);
});