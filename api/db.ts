import { neon } from '@neondatabase/serverless';

export const getDatabaseUrl = () => {
  return (
    process.env.NEON_DATABASE_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.POSTGRES_PRISMA_URL ||
    ''
  );
};

export const getDb = () => {
  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    console.warn('No Neon Database URL found in process.env. Searched: NEON_DATABASE_URL, DATABASE_URL, POSTGRES_URL.');
    return null;
  }
  return neon(databaseUrl);
};
