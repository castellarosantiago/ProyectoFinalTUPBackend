import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import { signJwt } from '../utils/jwt';

// registrar nuevo usuario
export const register = async (req: Request, res: Response) => {
  try {
    const { nombre, email, password, rol } = req.body;

    // verificar si el email ya existe
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'El email ya esta registrado' });

    // hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // crear nuevo usuario
    const user = new User({ nombre, email, password: hashed, rol });
    await user.save();

  // retornar usuario sin contraseña y firmar un token
  const userObj = user.toObject();
  const { password: _, ...userWithoutPassword } = userObj;

  const token = signJwt({ id: user._id, email: user.email, nombre: user.nombre, rol: user.rol });

  return res.status(201).json({ message: 'Usuario creado', user: userWithoutPassword, token });
  } catch (err) {
    console.error('Register error', err);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};

// login de usuario
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    // buscar usuario por email
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Credenciales invalidas' });

    // validar contraseña
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Credenciales invalidas' });

  // retornar usuario sin contraseña y token
  const userObj = user.toObject();
  const { password: _, ...userWithoutPassword } = userObj;

  const token = signJwt({ id: user._id, email: user.email, nombre: user.nombre, rol: user.rol });

  return res.status(200).json({ message: 'Login exitoso', user: userWithoutPassword, token });
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};

export default { register, login };