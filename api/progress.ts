import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'recife-digital-super-secret-key-2026';

function getDb() {
  const url = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING || '';
  if (!url) return null;
  return neon(url);
}

function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  cookieHeader.split(';').forEach(pair => {
    const idx = pair.indexOf('=');
    if (idx > 0) {
      cookies[pair.substring(0, idx).trim()] = decodeURIComponent(pair.substring(idx + 1).trim());
    }
  });
  return cookies;
}

function getUserFromRequest(req: VercelRequest) {
  try {
    let token = '';
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.headers.cookie) {
      const cookies = parseCookies(req.headers.cookie);
      token = cookies.auth_token || '';
    }
    if (!token) return null;
    try {
      const verifyFn = (jwt as any).verify || (jwt as any).default?.verify;
      if (typeof verifyFn === 'function') {
        return verifyFn(token, JWT_SECRET) as { userId: string; email: string; name: string };
      }
    } catch {}
    return JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
  } catch { return null; }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const sql = getDb();
  const authUser = getUserFromRequest(req);
  const userId = authUser?.userId || 'user-demo-1';

  try {
    if (req.method === 'POST') {
      const { courseId, lessonId, progressPercent } = req.body || {};
      if (!courseId) {
        return res.status(400).json({ error: 'courseId é obrigatório.' });
      }

      const id = `${userId}_${courseId}`;

      if (sql) {
        const existing = await sql`
          SELECT completed_lessons FROM user_progress WHERE id = ${id}
        `;
        let completed = existing && existing[0] ? existing[0].completed_lessons : [];
        if (lessonId && !completed.includes(lessonId)) {
          completed.push(lessonId);
        }

        await sql`
          INSERT INTO user_progress (id, user_id, course_id, progress_percent, completed_lessons, is_enrolled, updated_at)
          VALUES (${id}, ${userId}, ${courseId}, ${progressPercent || 25}, ${JSON.stringify(completed)}, true, CURRENT_TIMESTAMP)
          ON CONFLICT (user_id, course_id) DO UPDATE
          SET progress_percent = EXCLUDED.progress_percent, completed_lessons = EXCLUDED.completed_lessons, updated_at = CURRENT_TIMESTAMP;
        `;
      }

      return res.status(200).json({ success: true, message: 'Progresso atualizado!' });
    }

    if (req.method === 'GET') {
      let progressList: any[] = [];
      if (sql) {
        progressList = await sql`
          SELECT * FROM user_progress WHERE user_id = ${userId}
        `;
      }
      return res.status(200).json({ success: true, progress: progressList });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Progress API Error:', error);
    return res.status(500).json({ error: 'Erro ao salvar progresso.' });
  }
}
