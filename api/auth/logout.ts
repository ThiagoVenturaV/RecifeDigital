import type { VercelRequest, VercelResponse } from '@vercel/node';

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

  res.setHeader('Set-Cookie', makeCookie('auth_token', '', 0));

  return res.status(200).json({
    success: true,
    message: 'Logout realizado com sucesso.'
  });
}
