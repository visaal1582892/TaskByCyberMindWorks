import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // this disables SSL certificate validation
  },
});

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  try {
    const client = await pool.connect();
    const result = await client.query(sql, params);
    client.release();
    return result.rows;
  } catch (error) {
    console.error("❌ Database Query Error:", error);
    throw error;
  }
}
