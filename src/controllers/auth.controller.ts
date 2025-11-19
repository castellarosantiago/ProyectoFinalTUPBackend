import { Request, Response } from 'express';
import userRepository from '../repositories/User.repository';
import bcrypt from 'bcryptjs';
import { signJwt } from '../utils/jwt';

// registrar nuevo usuario
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    // verificar si el email ya existe
    const existing = await userRepository.findByEmail(email);
    if (existing) return res.status(409).json({ message: 'El email ya esta registrado' });

    // hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // crear nuevo usuario a traves del repositorio
    const user = await userRepository.createUser({ name, email, password: hashed, role });

    return res.status(201).json({ message: 'Usuario creado', user });
  } catch (err) {
    console.error('Register error', err);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};

// login de usuario
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    // buscar usuario por email (documento crudo con password)
    const userDoc: any = await userRepository.findRawByEmail(email);
    if (!userDoc) return res.status(401).json({ message: 'Credenciales invalidas' });

    // validar contrasena
    const match = await bcrypt.compare(password, userDoc.password);
    if (!match) return res.status(401).json({ message: 'Credenciales invalidas' });

    // obtener usuario sin contrasena
    const userObj = userDoc.toObject();
    const { password: _, ...userWithoutPassword } = userObj;

  const token = signJwt({ id: userWithoutPassword._id, email: userWithoutPassword.email, nombre: userWithoutPassword.nombre, rol: userWithoutPassword.rol });

  return res.status(200).json({ message: 'Login exitoso', user: userWithoutPassword, token });
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};

export default { register, login };