import type { VercelRequest, VercelResponse } from '@vercel/node';
import { clearAuthCookie } from './jwt';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  // Set response header to immediately expire and clear the JWT token cookie
  const expiredCookieHeader = clearAuthCookie();
  res.setHeader('Set-Cookie', expiredCookieHeader);

  return res.status(200).json({
    success: true,
    message: 'Logout realizado com sucesso. Token expirado.'
  });
}
