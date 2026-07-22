import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'recife-digital-super-secret-key-2026';
const TOKEN_NAME = 'auth_token';

export interface TokenPayload {
  userId: string;
  email: string;
  name: string;
}

export const signAuthToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

export const verifyAuthToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
};

export const createAuthCookie = (token: string): string => {
  return serialize(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/'
  });
};

export const clearAuthCookie = (): string => {
  return serialize(TOKEN_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0, // Immediately expire cookie on logout
    expires: new Date(0),
    path: '/'
  });
};
