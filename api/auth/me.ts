import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'recife-digital-super-secret-key-2026';

function getDb() {
  const url = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING || '';
  if (!url) return null;
  return neon(url);
}

function verifyToken(token: string): { userId: string; email: string; name: string } | null {
  try {
    const verifyFn = (jwt as any).verify || (jwt as any).default?.verify;
    if (typeof verifyFn === 'function') {
      return verifyFn(token, JWT_SECRET) as any;
    }
    return JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
  } catch {
    return null;
  }
}

function getUserFromRequest(req: VercelRequest) {
  // Try Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const decoded = verifyToken(authHeader.substring(7));
    if (decoded) return decoded;
  }
  // Try cookie
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    const cookies = parse(cookieHeader);
    if (cookies.auth_token) {
      const decoded = verifyToken(cookies.auth_token);
      if (decoded) return decoded;
    }
  }
  return null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const userPayload = getUserFromRequest(req);
    if (!userPayload) {
      return res.status(401).json({ success: false, error: 'Sessão não encontrada ou token expirado.' });
    }

    const sql = getDb();
    if (sql) {
      try {
        const users = await sql`SELECT id, name, email FROM users WHERE id = ${userPayload.userId} OR email = ${userPayload.email}`;
        if (users && users.length > 0) {
          return res.status(200).json({
            success: true,
            user: { id: users[0].id, name: users[0].name, email: users[0].email }
          });
        }
      } catch {}
    }

    return res.status(200).json({
      success: true,
      user: { id: userPayload.userId, name: userPayload.name, email: userPayload.email }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: String(error?.message || error) });
  }
}
