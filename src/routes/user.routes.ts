import { Router } from 'express';
import { getProfile, updateCredentials } from '../controllers/user.controller';
import authenticate from '../middlewares/auth.middleware';

const router = Router();

// todas las rutas requieren autenticacion
router.use(authenticate);

// GET /api/users/profile
router.get('/profile', getProfile);

// PUT /api/users/profile
router.put('/profile', updateCredentials);

export default router;
