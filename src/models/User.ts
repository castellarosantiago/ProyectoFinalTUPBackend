import mongoose, { Schema, Document, model } from 'mongoose';

// interfaz para typescript
export interface IUser extends Document {
	nombre: string;
	email: string;
	password: string;
	rol: 'empleado' | 'admin';
}

// schema de usuario
const UserSchema: Schema = new Schema<IUser>(
	{
		nombre: { type: String, required: true },
		// email unico y en minusculas
		email: { type: String, required: true, unique: true, lowercase: true, trim: true },
		password: { type: String, required: true },
		// rol por defecto empleado
		rol: { type: String, enum: ['empleado', 'admin'], default: 'empleado' },
	},
	{ timestamps: true }
);

// exportar modelo
const User = model<IUser>('User', UserSchema);
export default User;