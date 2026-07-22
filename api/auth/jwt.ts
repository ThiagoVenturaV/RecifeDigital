import jwt from 'jsonwebtoken';
import { serialize, parse } from 'cookie';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const JWT_SECRET = process.env.JWT_SECRET || 'recife-digital-super-secret-key-2026';
const TOKEN_NAME = 'auth_token';

export interface TokenPayload {
  userId: string;
  email: string;
  name: string;
}

export const signToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
};

export const setAuthCookie = (res: VercelResponse, token: string): void => {
  const cookieStr = serialize(TOKEN_NAME, token, {
    httpOnly: false, // Allow client JS access for cookie detection
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/'
  });
  res.setHeader('Set-Cookie', cookieStr);
};

export const clearAuthCookie = (res: VercelResponse): void => {
  const cookieStr = serialize(TOKEN_NAME, '', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    expires: new Date(0),
    path: '/'
  });
  res.setHeader('Set-Cookie', cookieStr);
};

export const getUserFromRequest = (req: VercelRequest): TokenPayload | null => {
  try {
    // Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyToken(token);
      if (decoded) return decoded;
    }

    // Check Cookies
    const cookieHeader = req.headers.cookie;
    if (cookieHeader) {
      const cookies = parse(cookieHeader);
      if (cookies[TOKEN_NAME]) {
        const decoded = verifyToken(cookies[TOKEN_NAME]);
        if (decoded) return decoded;
      }
    }
  } catch (err) {
    console.error('Error extracting user from request:', err);
  }
  return null;
};
