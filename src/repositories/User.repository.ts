// user repository: encapsula el acceso a datos de usuarios
import UserModel, { IUser } from '../models/User';

type CreateUserDTO = {
  name: string;
  email: string;
  password: string;
  role?: 'empleado' | 'admin';
};

const toPlain = (doc: IUser) => {
  const obj = doc.toObject();
  delete obj.password;
  return obj;
};

const findByEmail = async (email: string) => {
  const user = await UserModel.findOne({ email }).exec();
  return user ? toPlain(user as IUser) : null;
};

// devuelve el documento crudo, incluye password para autenticar
const findRawByEmail = async (email: string) => {
  return UserModel.findOne({ email }).exec();
};

const createUser = async (payload: CreateUserDTO) => {
  const user = new UserModel({
    name: payload.name,
    email: payload.email,
    password: payload.password,
    role: payload.role || 'empleado',
  });
  await user.save();
  return toPlain(user);
};

const findById = async (id: string) => {
  const user = await UserModel.findById(id).exec();
  return user ? toPlain(user as IUser) : null;
};

// Si hay usuarios los mapea y los devuelve sin password, y si no retorna []
const getUsers = async () => {
  const users = await UserModel.find({}).exec();
  if (!(users.length === -1)){
    return users.map( user => toPlain(user))
  }
  return users
}

const updateUser = async () => {

}



export default { findByEmail, findRawByEmail, createUser, findById };
