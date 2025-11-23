import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import categoryRouter from './routes/category.routes';
import productRouter from './routes/product.routes';

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

// rutas de autenticacion
import authRoutes from './routes/auth.routes';
app.use('/api/auth', authRoutes);

// ruta de prueba
app.get('/', (req: Request, res: Response) => {
  res.status(200).send('API running successfully');
});
// Rutas funcionales
app.use("/categories", categoryRouter);
app.use("/products", productRouter)

// iniciar servidor
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log('Server running in PORT:', PORT);
  console.log(`http://localhost:${PORT}`);
});