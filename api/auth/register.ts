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
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const sql = getDb();
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

        const existing = await sql`SELECT id FROM users WHERE email = ${cleanEmail}`;
        if (existing && existing.length > 0) {
          return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
        }

        await sql`
          INSERT INTO users (id, name, email, password_hash)
          VALUES (${userId}, ${name}, ${cleanEmail}, ${hashedPassword})
        `;
      } catch (dbErr: any) {
        console.warn('NeonDB Register Notice:', dbErr.message);
      }
    }

    const token = signToken({ userId, email: cleanEmail, name });
    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      message: 'Cadastro realizado com sucesso!',
      user: { id: userId, name, email: cleanEmail },
      token
    });
  } catch (error: any) {
    console.error('Registration Error:', error);
    return res.status(500).json({ error: 'Erro ao realizar cadastro.' });
  }
}
