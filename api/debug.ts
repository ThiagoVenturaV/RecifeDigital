import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const diagnostics: Record<string, any> = {
    step: 'start',
    nodeVersion: process.version,
    method: req.method,
    envVars: {
      hasNeonUrl: !!process.env.NEON_DATABASE_URL,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasPostgresUrl: !!process.env.POSTGRES_URL,
      hasPostgresNonPooling: !!process.env.POSTGRES_URL_NON_POOLING,
    }
  };

  // Test 1: Can we import neon?
  try {
    const { neon } = await import('@neondatabase/serverless');
    diagnostics.neonImport = 'OK';

    const url = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING || '';
    if (url) {
      diagnostics.dbUrlPrefix = url.substring(0, 30) + '...';
      const sql = neon(url);
      const result = await sql`SELECT 1 as test`;
      diagnostics.dbConnection = 'OK';
      diagnostics.dbResult = result;
    } else {
      diagnostics.dbConnection = 'NO_URL';
    }
  } catch (e: any) {
    diagnostics.neonError = e.message;
    diagnostics.neonStack = e.stack?.substring(0, 500);
  }

  // Test 2: Can we import bcryptjs?
  try {
    const bcrypt = await import('bcryptjs');
    const mod = bcrypt.default || bcrypt;
    diagnostics.bcryptImport = 'OK';
    diagnostics.bcryptType = typeof mod;
    diagnostics.bcryptHasHash = typeof mod.hash;
    diagnostics.bcryptHasCompare = typeof mod.compare;

    if (typeof mod.hash === 'function') {
      const hashed = await mod.hash('test123', 10);
      diagnostics.bcryptHash = 'OK: ' + hashed.substring(0, 20) + '...';
    } else {
      diagnostics.bcryptHash = 'NO_HASH_FN';
      diagnostics.bcryptKeys = Object.keys(mod);
    }
  } catch (e: any) {
    diagnostics.bcryptError = e.message;
    diagnostics.bcryptStack = e.stack?.substring(0, 500);
  }

  // Test 3: Can we import jsonwebtoken?
  try {
    const jwt = await import('jsonwebtoken');
    const mod = jwt.default || jwt;
    diagnostics.jwtImport = 'OK';
    diagnostics.jwtType = typeof mod;
    diagnostics.jwtHasSign = typeof mod.sign;
    diagnostics.jwtHasVerify = typeof mod.verify;
  } catch (e: any) {
    diagnostics.jwtError = e.message;
    diagnostics.jwtStack = e.stack?.substring(0, 500);
  }

  // Test 4: Can we import cookie?
  try {
    const cookie = await import('cookie');
    diagnostics.cookieImport = 'OK';
    diagnostics.cookieHasSerialize = typeof cookie.serialize;
  } catch (e: any) {
    diagnostics.cookieError = e.message;
  }

  return res.status(200).json(diagnostics);
}
