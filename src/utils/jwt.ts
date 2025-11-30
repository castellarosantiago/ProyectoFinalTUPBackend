import jwt, { Secret, SignOptions } from 'jsonwebtoken';

// util jwt: firma y verifica tokens para autenticación
// lee el secreto y la expiración desde las variables de entorno
const JWT_SECRET: Secret = process.env.JWT_SECRET || 'dev-jwt-secret-change-me';
const JWT_EXPIRES_IN: string | number = process.env.JWT_EXPIRES_IN || '1h';

/**
 * firma un jwt con el payload dado.
 * uso: generar token en register/login para enviar al cliente.
 * si no se pasa expiresIn usa JWT_EXPIRES_IN.
 * @param payload objeto a firmar (no incluir secretos)
 * @param expiresIn ttl opcional (ej. '2h' o 3600) ttl es time to live, un protocolo de internet que define limites de tiempo se guarda en memoria cache un registro
 */
export const signJwt = (payload: object, expiresIn?: string | number) => {
  const ttl = expiresIn || JWT_EXPIRES_IN;
  const options: SignOptions = { expiresIn: ttl as any };
  return jwt.sign(payload, JWT_SECRET, options);
};

// verifica un token jwt y retorna el payload decodificado
// uso: en middleware de autenticación para validar el bearer token
export const verifyJwt = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as Record<string, any>;
};

// export por defecto con las utilidades principales
export default { signJwt, verifyJwt };
