import { login, register } from '../controllers/auth.controller';
import userRepository from '../repositories/User.repository';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';


jest.mock('../repositories/User.repository');
jest.mock('bcryptjs');

describe('Auth Controller Unitarios', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJsonResponse: jest.Mock;
  let mockStatusResponse: jest.Mock;

  const baseUserData = {
    name: 'Juan Pérez',
    email: 'juan@example.com',
    password: 'Password123',
    role: 'empleado',
  };

  const mockUserPlain = {
    _id: '123',
    name: baseUserData.name,
    email: baseUserData.email,
    role: baseUserData.role,
  };

  const mockUserDoc = {
    ...mockUserPlain,
    password: 'hashedPassword',
    toObject: jest.fn().mockReturnValue(mockUserPlain),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockJsonResponse = jest.fn().mockReturnValue(undefined);
    mockStatusResponse = jest.fn().mockReturnValue({ json: mockJsonResponse });
    mockResponse = { status: mockStatusResponse };
    mockRequest = {};
  });

  describe('Register', () => {
    it('crea un usuario y devuelve 201', async () => {
      mockRequest = { body: baseUserData };
      (userRepository.findByEmail as jest.Mock).mockResolvedValueOnce(null);
      (userRepository.createUser as jest.Mock).mockResolvedValueOnce(mockUserPlain);
      (bcrypt.genSalt as jest.Mock).mockResolvedValueOnce('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashedPassword');

      const mockNext = jest.fn();
      await register(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockStatusResponse).toHaveBeenCalledWith(201);
      expect(mockJsonResponse).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Usuario creado', user: expect.objectContaining({ email: baseUserData.email }) })
      );
      expect(userRepository.createUser).toHaveBeenCalledTimes(1);
    });

    it('retorna 409 cuando el email ya existe', async () => {
      mockRequest = { body: baseUserData };
      (userRepository.findByEmail as jest.Mock).mockResolvedValueOnce(mockUserPlain);

      await register(mockRequest as Request, mockResponse as Response, jest.fn());

      expect(mockStatusResponse).toHaveBeenCalledWith(409);
      expect(mockJsonResponse).toHaveBeenCalledWith({ message: 'El email ya esta registrado' });
      expect(userRepository.createUser).not.toHaveBeenCalled();
    });

    it('pasa errores a next()', async () => {
      mockRequest = { body: baseUserData };
      (userRepository.findByEmail as jest.Mock).mockResolvedValueOnce(null);
      (bcrypt.genSalt as jest.Mock).mockResolvedValueOnce('salt');
      (bcrypt.hash as jest.Mock).mockRejectedValueOnce(new Error('Hash failed'));

      const mockNext = jest.fn();
      await register(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockStatusResponse).not.toHaveBeenCalled();
    });
  });

  describe('Login', () => {
    const loginData = { email: 'juan@example.com', password: 'Password123' };

    it('inicia sesión y devuelve 200', async () => {
      mockRequest = { body: loginData };
      (userRepository.findRawByEmail as jest.Mock).mockResolvedValueOnce(mockUserDoc);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      const mockNext = jest.fn();
      await login(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockStatusResponse).toHaveBeenCalledWith(200);
      expect(mockJsonResponse).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Login exitoso', user: expect.objectContaining({ email: loginData.email }) })
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(loginData.password, mockUserDoc.password);
    });

    it('retorna 401 cuando el usuario no existe', async () => {
      mockRequest = { body: loginData };
      (userRepository.findRawByEmail as jest.Mock).mockResolvedValueOnce(null);

      await login(mockRequest as Request, mockResponse as Response, jest.fn());

      expect(mockStatusResponse).toHaveBeenCalledWith(401);
      expect(mockJsonResponse).toHaveBeenCalledWith({ message: 'Credenciales invalidas' });
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('retorna 401 cuando la contraseña es incorrecta', async () => {
      mockRequest = { body: loginData };
      (userRepository.findRawByEmail as jest.Mock).mockResolvedValueOnce(mockUserDoc);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      await login(mockRequest as Request, mockResponse as Response, jest.fn());

      expect(mockStatusResponse).toHaveBeenCalledWith(401);
      expect(mockJsonResponse).toHaveBeenCalledWith({ message: 'Credenciales invalidas' });
    });

    it('pasa errores de BD a next()', async () => {
      mockRequest = { body: loginData };
      (userRepository.findRawByEmail as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

      const mockNext = jest.fn();
      await login(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockStatusResponse).not.toHaveBeenCalled();
    });
  });
});