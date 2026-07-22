import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import { getDb, getDatabaseUrl } from '../db.js';
import { signToken, setAuthCookie } from './jwt.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }

    const sql = getDb();

    if (!sql) {
      return res.status(500).json({
        error: 'Conexão com o banco NeonDB não configurada.',
        details: 'A variável NEON_DATABASE_URL ou DATABASE_URL não foi encontrada no ambiente do Vercel.'
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Ensure users table exists in NeonDB
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Query user from NeonDB
    const users = await sql`SELECT id, name, email, password_hash FROM users WHERE email = ${cleanEmail}`;
    if (!users || users.length === 0) {
      return res.status(401).json({ error: 'E-mail não encontrado. Cadastre-se primeiro!' });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Senha incorreta. Tente novamente.' });
    }

    // Sign JWT token & set cookie
    const token = signToken({ userId: user.id, email: user.email, name: user.name });
    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso via NeonDB!',
      user: { id: user.id, name: user.name, email: user.email },
      token
    });
  } catch (error: any) {
    console.error('Login Error:', error);
    return res.status(500).json({
      error: 'Erro de consulta no NeonDB.',
      details: error.message || String(error)
    });
  }
}
