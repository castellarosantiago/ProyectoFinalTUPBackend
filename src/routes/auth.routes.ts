import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { registerSchema, loginSchema } from '../schemas/auth.schemas';
import { validate } from '../middlewares/validator.middleware';
import { rateLimitLogin } from '../middlewares/rateLimitLogin.middleware';

const router = Router();

// ruta para registrar usuario
router.post('/register', validate(registerSchema, "body"), register);

// ruta para login
router.post('/login', rateLimitLogin, validate(loginSchema, "body"), login);

export default router;