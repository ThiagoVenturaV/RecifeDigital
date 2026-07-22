import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from './db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const sql = getDb();
    if (sql) {
      const courses = await sql`SELECT * FROM courses;`;
      return res.status(200).json({ success: true, courses });
    }
    return res.status(200).json({
      success: true,
      message: 'Serverless response (Mock / Local Mode)'
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
