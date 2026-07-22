import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getUserFromRequest } from './jwt.js';
import { getDb } from '../db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const userPayload = getUserFromRequest(req);
    if (!userPayload) {
      return res.status(401).json({ success: false, message: 'Sessão não encontrada ou token expirado.' });
    }

    const sql = getDb();
    if (sql) {
      const users = await sql`SELECT id, name, email FROM users WHERE id = ${userPayload.userId} OR email = ${userPayload.email}`;
      if (users && users.length > 0) {
        return res.status(200).json({
          success: true,
          user: {
            id: users[0].id,
            name: users[0].name,
            email: users[0].email
          }
        });
      }
    }

    return res.status(200).json({
      success: true,
      user: {
        id: userPayload.userId,
        name: userPayload.name,
        email: userPayload.email
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
