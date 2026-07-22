import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

function getDb() {
  const url = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING || '';
  if (!url) return null;
  return neon(url);
}

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
