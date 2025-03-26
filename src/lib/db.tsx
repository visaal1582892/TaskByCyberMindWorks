import { Pool } from 'pg';

// Log the DATABASE_URL for debugging (remove in production!)
console.log("DATABASE_URL:", process.env.DATABASE_URL);

// Create a new Pool instance for PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Ensure this env var is set both locally (.env.local) and on Vercel
  ssl: {
    // This is required for Neon or any managed PostgreSQL service that mandates SSL
    rejectUnauthorized: false,
  },
  max: 10, // Maximum number of connections (adjust as needed)
});

// Optional: Test the connection with a simple query (for debugging)
(async () => {
  try {
    const client = await pool.connect();
    const testResult = await client.query("SELECT NOW()", []);
    console.log("DB Connection Test Successful, current time:", testResult.rows);
    client.release();
  } catch (error) {
    console.error("DB Connection Test Error:", error);
  }
})();

/**
 * Executes a SQL query using the PostgreSQL pool.
 * @param sql - The SQL query to execute.
 * @param params - The parameters for the SQL query.
 * @returns A promise that resolves with the query result rows.
 */
export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  try {
    console.log("Executing SQL:", sql, "with params:", params);
    const client = await pool.connect();
    const result = await client.query(sql, params);
    client.release();
    console.log("Query result:", result.rows);
    return result.rows;
  } catch (error: any) {
    console.error("❌ Database Query Error:", error);
    throw error;
  }
}
