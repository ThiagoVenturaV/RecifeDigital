import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from './db.js';
import { getUserFromRequest } from './auth/jwt.js';

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
        // Fetch existing progress
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

      return res.status(200).json({ success: true, message: 'Progresso atualizado com sucesso no NeonDB!' });
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
    return res.status(500).json({ error: 'Erro ao salvar progresso no NeonDB.' });
  }
}
