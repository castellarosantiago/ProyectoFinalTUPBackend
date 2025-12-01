export interface UserPutInterface { 
    name:string
    email:string
    role: 'empleado' | 'admin'
}

export type CreateUserDTO = {
  name: string;
  email: string;
  password: string;
  role?: 'empleado' | 'admin';
};


