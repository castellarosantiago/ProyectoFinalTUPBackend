import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { validateRequest } from '../middlewares/validateRequest';
import { registerSchema, loginSchema } from '../validators/auth.schemas';

const router = Router();

// ruta para registrar usuario
router.post('/register', validateRequest(registerSchema), register);

// ruta para login
router.post('/login', validateRequest(loginSchema), login);

export default router;