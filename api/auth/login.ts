import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'recife-digital-super-secret-key-2026';

function getDb() {
  const url = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING || '';
  if (!url) return null;
  return neon(url);
}

function signToken(payload: { userId: string; email: string; name: string }): string {
  try {
    const signFn = (jwt as any).sign || (jwt as any).default?.sign;
    if (typeof signFn === 'function') {
      return signFn(payload, JWT_SECRET, { expiresIn: '24h' });
    }
  } catch {}
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

function makeCookie(name: string, value: string, maxAge: number): string {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  parts.push(`Path=/`);
  parts.push(`Max-Age=${maxAge}`);
  parts.push(`SameSite=Lax`);
  parts.push(`Secure`);
  return parts.join('; ');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido.' });

  try {
    const body = req.body || {};
    const email = String(body.email || '').toLowerCase().trim();
    const password = String(body.password || '');

    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }

    const sql = getDb();
    if (!sql) {
      return res.status(500).json({ error: 'Banco de dados não configurado.' });
    }

    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const users = await sql`SELECT id, name, email, password_hash FROM users WHERE email = ${email}`;
    if (!users || users.length === 0) {
      return res.status(401).json({ error: 'E-mail não encontrado. Cadastre-se primeiro.' });
    }

    const user = users[0];

    const compareFn = (bcrypt as any).compare || (bcrypt as any).default?.compare;
    let valid = false;
    if (typeof compareFn === 'function') {
      valid = await compareFn(password, user.password_hash);
    } else {
      valid = user.password_hash === Buffer.from(password).toString('base64');
    }

    if (!valid) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }

    const token = signToken({ userId: user.id, email: user.email, name: user.name });
    res.setHeader('Set-Cookie', makeCookie('auth_token', token, 86400));

    return res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso!',
      user: { id: user.id, name: user.name, email: user.email },
      token
    });

  } catch (error: any) {
    console.error('LOGIN ERROR:', error);
    return res.status(500).json({
      error: 'Erro interno ao fazer login.',
      details: String(error?.message || error)
    });
  }
}
