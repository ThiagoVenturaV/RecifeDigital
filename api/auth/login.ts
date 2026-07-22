import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import { getDb } from '../db.js';
import { signToken, setAuthCookie } from './jwt.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }

    const sql = getDb();
    let dbUser = { id: `usr-${Date.now()}`, name: email.split('@')[0], email };

    if (sql) {
      const users = await sql`SELECT id, name, email, password_hash FROM users WHERE email = ${email.toLowerCase().trim()}`;
      if (!users || users.length === 0) {
        return res.status(401).json({ error: 'Credenciais inválidas. Usuário não encontrado.' });
      }

      const user = users[0];
      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        return res.status(401).json({ error: 'Credenciais inválidas. Senha incorreta.' });
      }

      dbUser = { id: user.id, name: user.name, email: user.email };
    }

    // Sign JWT token & set HTTP-only Cookie (expires in 24 hours)
    const token = signToken({ userId: dbUser.id, email: dbUser.email, name: dbUser.name });
    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso!',
      user: { id: dbUser.id, name: dbUser.name, email: dbUser.email },
      token
    });
  } catch (error: any) {
    console.error('Login Error:', error);
    return res.status(500).json({ error: 'Erro interno ao realizar login.' });
  }
}
