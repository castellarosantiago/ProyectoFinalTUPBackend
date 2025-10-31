import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

//Cargar variables de entorno
dotenv.config();

//Conexion DB

const app = express();


//Middlewares
app.use(cors());
app.use(express.json());

//Ruta de prueba
app.get('/', (req: Request, res: Response) => {
    res.status(200).send('API running successfully');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('Server running in PORT:', PORT);
    console.log(`http://localhost:${PORT}`);
});