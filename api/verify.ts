import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from './db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { code } = req.body || {};
  if (!code) {
    return res.status(400).json({ success: false, message: 'Verification code is required' });
  }

  try {
    const sql = getDb();
    if (sql) {
      const results = await sql`SELECT * FROM certificates WHERE verification_code = ${code.toUpperCase()};`;
      if (results.length > 0) {
        return res.status(200).json({ success: true, valid: true, certificate: results[0] });
      }
      return res.status(200).json({ success: true, valid: false });
    }

    // Mock fallback response
    if (code.toUpperCase() === 'RDFE-2024-9842X') {
      return res.status(200).json({
        success: true,
        valid: true,
        certificate: {
          courseTitle: 'Desenvolvimento Web Front-End Avançado',
          studentName: 'Thiago Ventura',
          issueDate: '15 de Dezembro, 2024',
          workloadHours: 120,
          grade: 9.8,
          verificationCode: 'RDFE-2024-9842X'
        }
      });
    }

    return res.status(200).json({ success: true, valid: false });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
