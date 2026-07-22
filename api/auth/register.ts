import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import { getDb } from '../db';
import { signAuthToken, createAuthCookie } from './jwt';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { name, email, password } = req.body || {};

  if (!email || !password || !name) {
    return res.status(400).json({ success: false, message: 'Nome, email e senha são obrigatórios' });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'A senha deve conter no mínimo 6 caracteres' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = `user-${Date.now()}`;
    const sql = getDb();

    if (sql) {
      // Check existing
      const existing = await sql`SELECT id FROM users WHERE email = ${email.toLowerCase()};`;
      if (existing.length > 0) {
        return res.status(409).json({ success: false, message: 'Este e-mail já está cadastrado' });
      }

      await sql`
        INSERT INTO users (id, name, email, password_hash)
        VALUES (${userId}, ${name}, ${email.toLowerCase()}, ${passwordHash});
      `;
    }

    const tokenPayload = { userId, email: email.toLowerCase(), name };
    const token = signAuthToken(tokenPayload);
    const cookieHeader = createAuthCookie(token);

    res.setHeader('Set-Cookie', cookieHeader);
    return res.status(201).json({
      success: true,
      message: 'Usuário registrado com sucesso',
      user: { id: userId, name, email: email.toLowerCase() },
      token
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
