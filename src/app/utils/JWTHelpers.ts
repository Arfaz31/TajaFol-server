import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { UserRole } from '../module/User/user.constant';

interface JwtPayload {
  id: string;
  userId: string;
  email: string;
  contact: string;
  role: keyof typeof UserRole;
  profileImg?: string;
}

const generateToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expiresIn: string | number,
) => {
  const token = jwt.sign(payload, secret, { expiresIn } as SignOptions);
  return token;
};

const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelpers = {
  generateToken,
  verifyToken,
};
