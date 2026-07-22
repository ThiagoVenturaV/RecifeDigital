import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import { getDb } from '../db.js';
import { signToken, setAuthCookie } from './jwt.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

    const cleanEmail = email.toLowerCase().trim();
    const sql = getDb();
    let userName = cleanEmail.split('@')[0];
    let userId = `usr-${Date.now()}`;

    if (sql) {
      try {
        await sql`
          CREATE TABLE IF NOT EXISTS users (
            id VARCHAR(100) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `;

        const users = await sql`SELECT id, name, email, password_hash FROM users WHERE email = ${cleanEmail}`;
        if (users && users.length > 0) {
          const user = users[0];
          const validPassword = await bcrypt.compare(password, user.password_hash);
          if (!validPassword) {
            return res.status(401).json({ error: 'Senha incorreta. Tente novamente.' });
          }
          userName = user.name;
          userId = user.id;
        }
      } catch (dbErr: any) {
        console.warn('NeonDB Login Notice:', dbErr.message);
      }
    }

    const token = signToken({ userId, email: cleanEmail, name: userName });
    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso!',
      user: { id: userId, name: userName, email: cleanEmail },
      token
    });
  } catch (error: any) {
    console.error('Login Error:', error);
    return res.status(500).json({ error: 'Erro ao realizar login.' });
  }
}
