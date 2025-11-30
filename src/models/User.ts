import mongoose, { Schema, Document, model } from 'mongoose';

// interfaz para typescript
export interface IUser extends Document {
	name: string;
	email: string;
	password: string;
	role: 'empleado' | 'admin';
}

// schema de usuario
const UserSchema: Schema = new Schema<IUser>(
	{
		name: { type: String, required: true },
		// email unico y en minusculas
		email: { type: String, required: true, unique: true, lowercase: true, trim: true },
		password: { type: String, required: true },
		// rol por defecto empleado
		role: { type: String, enum: ['empleado', 'admin'], default: 'empleado' },
	},
	{ timestamps: true }
);

// exportar modelo
const User = model<IUser>('User', UserSchema);
export default User;