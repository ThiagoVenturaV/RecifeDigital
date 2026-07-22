import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'recife-digital-super-secret-key-2026';

function getDb() {
  const url = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING || '';
  if (!url) return null;
  return neon(url);
}

function getUserFromRequest(req: VercelRequest) {
  try {
    let token = '';
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      const cookieHeader = req.headers.cookie;
      if (cookieHeader) {
        const cookies = parse(cookieHeader);
        token = cookies.auth_token || '';
      }
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

      return res.status(200).json({ success: true, message: 'Certificado salvo!' });
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
    return res.status(500).json({ error: 'Erro ao processar certificados.' });
  }
}
