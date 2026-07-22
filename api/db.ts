import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;

export const getDb = () => {
  if (!databaseUrl) {
    console.warn('NEON_DATABASE_URL not found in env. Running in mock serverless mode.');
    return null;
  }
  return neon(databaseUrl);
};
