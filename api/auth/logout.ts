import type { VercelRequest, VercelResponse } from '@vercel/node';
import { clearAuthCookie } from './jwt.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  clearAuthCookie(res);

  return res.status(200).json({
    success: true,
    message: 'Logout realizado com sucesso. Token expirado.'
  });
}
