import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import { getDb } from '../db';
import { signAuthToken, createAuthCookie } from './jwt';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email e senha são obrigatórios' });
  }

  try {
    const sql = getDb();
    let user = null;

    if (sql) {
      const results = await sql`SELECT * FROM users WHERE email = ${email.toLowerCase()};`;
      if (results.length === 0) {
        return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
      }
      user = results[0];
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
      }
    } else {
      // Mock Fallback User for local dev testing
      const mockPasswordHash = await bcrypt.hash('123456', 10);
      const isPasswordValid = await bcrypt.compare(password, mockPasswordHash);
      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
      }
      user = {
        id: 'user-mock-1',
        name: 'Thiago Ventura',
        email: email.toLowerCase()
      };
    }

    const tokenPayload = { userId: user.id, email: user.email, name: user.name };
    const token = signAuthToken(tokenPayload);
    const cookieHeader = createAuthCookie(token);

    res.setHeader('Set-Cookie', cookieHeader);
    return res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso',
      user: { id: user.id, name: user.name, email: user.email },
      token
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
