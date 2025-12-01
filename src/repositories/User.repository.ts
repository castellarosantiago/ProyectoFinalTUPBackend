// user repository: encapsula el acceso a datos de usuarios
import UserModel, { IUser } from '../models/User';
import { CreateUserDTO, UserPutInterface } from '../types/user.interface';

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

const getUsers = async () => {
  const users = await UserModel.find({}).exec();
  return users.map(user => toPlain(user));
};

const updateUsers = async (id: string, data: UserPutInterface) => {
  const updatedUser = await UserModel.findByIdAndUpdate(id, data, { new: true }).exec();
  return updatedUser ? toPlain(updatedUser) : null;
};

const deleteUser = async (id:string) => {
  const deletedUser = await UserModel.findByIdAndDelete(id).exec() 
  return deletedUser ? toPlain(deletedUser) : null
}

const updateUser = async (id: string, payload: Partial<CreateUserDTO>) => {
  const user = await UserModel.findByIdAndUpdate(id, payload, { new: true }).exec();
  return user ? toPlain(user as IUser) : null;
};

export default { findByEmail, findRawByEmail, createUser, findById, deleteUser, updateUser, getUsers, updateUsers };
