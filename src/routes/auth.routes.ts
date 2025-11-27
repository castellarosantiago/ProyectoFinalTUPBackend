import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { registerSchema, loginSchema } from '../validators/auth.schemas';
import { validate } from '../middlewares/validator.middleware';
const router = Router();

// ruta para registrar usuario
router.post('/register', validate(registerSchema, "body"), register);

// ruta para login
router.post('/login', validate(loginSchema, "body"), login);

export default router;