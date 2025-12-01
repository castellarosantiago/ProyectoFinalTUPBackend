import { Request, Response, NextFunction } from 'express';
import userRepository from '../repositories/User.repository';
import bcrypt from 'bcryptjs';

// obtener perfil del usuario autenticado
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const user = await userRepository.findById(userId);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// actualizar credenciales (nombre, email, password)
export const updateCredentials = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const { name, email, password } = req.body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) {
      // verificar si el email ya existe en otro usuario
      const existing = await userRepository.findByEmail(email);
      if (existing && existing._id.toString() !== userId) {
        return res.status(409).json({ message: 'El email ya esta en uso' });
      }
      updateData.email = email;
    }
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await userRepository.updateUser(userId, updateData);
    if (!updatedUser) return res.status(404).json({ message: 'Usuario no encontrado' });

    return res.status(200).json({ message: 'Perfil actualizado', user: updatedUser });
  } catch (err) {
    next(err);
  }
};

export default { getProfile, updateCredentials };
