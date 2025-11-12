import { login, register } from '../controllers/auth.controller';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';

// mocks globales para el aislamiento y no usar la bd
// mock de mongoose User model y bcryptjs
jest.mock('../models/User');
jest.mock('bcryptjs');

describe('Auth Controller Unitarios', () => {
  // mocks de Express: req, res, status y json
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJsonResponse: jest.Mock;
  let mockStatusResponse: jest.Mock;

  // datos base para las pruebas
  const baseUserData = {
    nombre: 'Juan Pérez',
    email: 'juan@example.com',
    password: 'Password123',
    rol: 'empleado',
  };
  
  // objeto de usuario simulado devuelto por Mongoose
  const mockUserInstance = {
    ...baseUserData,
    _id: '123',
    password: 'hashedPassword',
    toObject: jest.fn().mockReturnValue({ 
      _id: '123', 
      nombre: baseUserData.nombre, 
      email: baseUserData.email, 
      rol: baseUserData.rol 
    }),
    save: jest.fn(),
  };

  beforeEach(() => {
    // limpieza de mocks
    jest.clearAllMocks();

    // configuracion de la respuesta mockeada (res.status().json())
    mockJsonResponse = jest.fn().mockReturnValue(undefined);
    mockStatusResponse = jest.fn().mockReturnValue({ json: mockJsonResponse });
    mockResponse = { status: mockStatusResponse };
    mockRequest = {};
  });

  //  test de registro
  describe('Register', () => {
    it('Debería registrar un usuario y devolver 201', async () => {
      mockRequest = { body: baseUserData };

      // User.findOne busca email: retorna null simulando que el usuario no existe
      (User.findOne as jest.Mock).mockResolvedValueOnce(null);
      // User constructor (crea nueva instancia): simula la creacion de la instancia mock
      (User as unknown as jest.Mock).mockImplementationOnce(() => mockUserInstance);
      // bcrypt.genSalt: retorna salt
      (bcrypt.genSalt as jest.Mock).mockResolvedValueOnce('salt');
      // bcrypt.hash: retorna hash
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashedPassword');
      // userInstance.save: retorna la instancia guardada simulando exito
      (mockUserInstance.save as jest.Mock).mockResolvedValueOnce(mockUserInstance);
      
      await register(mockRequest as Request, mockResponse as Response);

      expect(mockStatusResponse).toHaveBeenCalledWith(201);
      expect(mockJsonResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Usuario creado',
          user: expect.objectContaining({ email: baseUserData.email }),
        })
      );
      expect(mockUserInstance.save).toHaveBeenCalledTimes(1);
    });

    it('debería retornar error 409 si el email ya existe', async () => {
      mockRequest = { body: baseUserData };

      // configuración de mocks: User.findOne encuentra usuario
      (User.findOne as jest.Mock).mockResolvedValueOnce(mockUserInstance);

      await register(mockRequest as Request, mockResponse as Response);

      expect(mockStatusResponse).toHaveBeenCalledWith(409);
      expect(mockJsonResponse).toHaveBeenCalledWith({
        message: 'El email ya esta registrado',
      });
      expect(mockUserInstance.save).not.toHaveBeenCalled();
    });

    it('Debería retornar error 500 si hay un fallo de servidor ej. error de hasheo', async () => {
        mockRequest = { body: baseUserData };
        
        // configuracion de mocks: simula un fallo en el proceso de hasheo
        (User.findOne as jest.Mock).mockResolvedValueOnce(null);
        (User as unknown as jest.Mock).mockImplementationOnce(() => mockUserInstance);
        (bcrypt.genSalt as jest.Mock).mockResolvedValueOnce('salt');
        (bcrypt.hash as jest.Mock).mockRejectedValueOnce(new Error('Hash failed'));

        await register(mockRequest as Request, mockResponse as Response);

        expect(mockStatusResponse).toHaveBeenCalledWith(500);
        expect(mockJsonResponse).toHaveBeenCalledWith({
          message: 'Error del servidor',
        });
    });
  });

  // test de login
  describe('Login', () => {
    const loginData = {
      email: 'juan@example.com',
      password: 'Password123',
    };
    
    // usuario encontrado en DB con hash
    const foundUser = {
      ...mockUserInstance,
      password: 'hashedPassword',
    };

    it('Debería hacer login correctamente y devolver 200', async () => {
      mockRequest = { body: loginData };

      // User.findOne: encuentra el usuario
      (User.findOne as jest.Mock).mockResolvedValueOnce(foundUser);
      // bcrypt.compare: retorna true (contraseña correcta)
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      await login(mockRequest as Request, mockResponse as Response);

      expect(mockStatusResponse).toHaveBeenCalledWith(200);
      expect(mockJsonResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Login exitoso',
          user: expect.objectContaining({ email: loginData.email }),
        })
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(loginData.password, foundUser.password);
    });

    it('Debería retornar error 401 si el usuario no existe', async () => {
      mockRequest = { body: loginData };

      //User.findOne no encuentra nada
      (User.findOne as jest.Mock).mockResolvedValueOnce(null);

      await login(mockRequest as Request, mockResponse as Response);

      expect(mockStatusResponse).toHaveBeenCalledWith(401);
      expect(mockJsonResponse).toHaveBeenCalledWith({
        message: 'Credenciales invalidas',
      });
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('Debería retornar error 401 si la contraseña es incorrecta', async () => {
      mockRequest = { body: loginData };

      (User.findOne as jest.Mock).mockResolvedValueOnce(foundUser);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false); // contraseña incorrecta

      await login(mockRequest as Request, mockResponse as Response);

      expect(mockStatusResponse).toHaveBeenCalledWith(401);
      expect(mockJsonResponse).toHaveBeenCalledWith({
        message: 'Credenciales invalidas',
      });
    });

    it('Debería retornar error 500 si hay un error del servidor fallo de db', async () => {
      mockRequest = { body: loginData };

      // User.findOne lanza error
      (User.findOne as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

      await login(mockRequest as Request, mockResponse as Response);

      expect(mockStatusResponse).toHaveBeenCalledWith(500);
      expect(mockJsonResponse).toHaveBeenCalledWith({
        message: 'Error del servidor',
      });
    });
  });
});