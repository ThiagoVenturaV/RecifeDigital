import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import { getDb } from '../db.js';
import { signToken, setAuthCookie } from './jwt.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const sql = getDb();
    let dbUser = { id: userId, name, email };

    if (sql) {
      // Check if user exists
      const existing = await sql`SELECT id FROM users WHERE email = ${email.toLowerCase().trim()}`;
      if (existing && existing.length > 0) {
        return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
      }

      // Insert into NeonDB
      await sql`
        INSERT INTO users (id, name, email, password_hash)
        VALUES (${userId}, ${name}, ${email.toLowerCase().trim()}, ${hashedPassword})
      `;
    }

    // Sign JWT token & set HTTP-only Cookie
    const token = signToken({ userId: dbUser.id, email: dbUser.email, name: dbUser.name });
    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      message: 'Usuário cadastrado com sucesso!',
      user: { id: dbUser.id, name: dbUser.name, email: dbUser.email },
      token
    });
  } catch (error: any) {
    console.error('Registration Error:', error);
    return res.status(500).json({ error: 'Erro interno ao realizar cadastro.' });
  }
}
