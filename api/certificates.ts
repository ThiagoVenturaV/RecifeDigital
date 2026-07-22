import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from './db.js';
import { getUserFromRequest } from './auth/jwt.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const sql = getDb();
  const authUser = getUserFromRequest(req);
  const userId = authUser?.userId || 'user-demo-1';

  try {
    if (req.method === 'POST') {
      const { certificate } = req.body || {};
      if (!certificate) {
        return res.status(400).json({ error: 'Objeto certificate é obrigatório.' });
      }

      if (sql) {
        await sql`
          INSERT INTO certificates (id, user_id, course_id, course_title, student_name, issue_date, workload_hours, grade, verification_code)
          VALUES (
            ${certificate.id},
            ${userId},
            ${certificate.courseId},
            ${certificate.courseTitle},
            ${certificate.studentName},
            ${certificate.issueDate},
            ${certificate.workloadHours},
            ${certificate.grade},
            ${certificate.verificationCode}
          )
          ON CONFLICT (id) DO NOTHING;
        `;
      }

      return res.status(200).json({ success: true, message: 'Certificado salvo no NeonDB!' });
    }

    if (req.method === 'GET') {
      let certs: any[] = [];
      if (sql) {
        certs = await sql`
          SELECT * FROM certificates WHERE user_id = ${userId} ORDER BY created_at DESC
        `;
      }
      return res.status(200).json({ success: true, certificates: certs });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Certificates API Error:', error);
    return res.status(500).json({ error: 'Erro ao processar certificados no NeonDB.' });
  }
}
