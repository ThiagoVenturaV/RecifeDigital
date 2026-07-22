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
    const name = String(body.name || '').trim();
    const email = String(body.email || '').toLowerCase().trim();
    const password = String(body.password || '');

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios.' });
    }

    const hashFn = (bcrypt as any).hash || (bcrypt as any).default?.hash;
    let hashedPassword: string;
    if (typeof hashFn === 'function') {
      hashedPassword = await hashFn(password, 10);
    } else {
      hashedPassword = Buffer.from(password).toString('base64');
    }

    const userId = 'usr-' + Date.now() + '-' + Math.floor(Math.random() * 9999);

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

    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing && existing.length > 0) {
      return res.status(409).json({ error: 'Este e-mail já está cadastrado.' });
    }

    await sql`
      INSERT INTO users (id, name, email, password_hash)
      VALUES (${userId}, ${name}, ${email}, ${hashedPassword})
    `;

    const token = signToken({ userId, email, name });
    res.setHeader('Set-Cookie', makeCookie('auth_token', token, 86400));

    return res.status(200).json({
      success: true,
      message: 'Cadastro realizado com sucesso!',
      user: { id: userId, name, email },
      token
    });

  } catch (error: any) {
    console.error('REGISTER ERROR:', error);
    return res.status(500).json({
      error: 'Erro interno ao cadastrar.',
      details: String(error?.message || error)
    });
  }
}
