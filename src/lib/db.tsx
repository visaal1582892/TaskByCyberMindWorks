import { Pool } from 'pg';

// Debug: Log that the DB file is being loaded
console.log("[DB] db.tsx is loading...");

// Check if the DATABASE_URL environment variable is set
if (!process.env.DATABASE_URL) {
  console.error("[DB] ERROR: DATABASE_URL is not defined!");
} else {
  console.log("[DB] DATABASE_URL is set.");
}

// Create a new PostgreSQL pool with SSL configuration for Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    // For Neon-managed databases, disable certificate validation
    rejectUnauthorized: false,
  },
  max: 10, // Maximum number of connections in the pool
});

// Immediately test the connection by running a simple query
(async () => {
  try {
    console.log("[DB] Testing database connection with SELECT NOW()...");
    const client = await pool.connect();
    const testResult = await client.query("SELECT NOW()");
    console.log("[DB] Connection test successful. Current time:", testResult.rows);
    client.release();
  } catch (error) {
    console.error("[DB] Connection test failed:", error);
  }
})();

/**
 * Executes a SQL query using the PostgreSQL pool.
 * @param sql - The SQL query to execute.
 * @param params - Optional parameters for the SQL query.
 * @returns A promise that resolves with the query result rows.
 */
export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const client = await pool.connect();
  try {
    console.log("[DB] Executing SQL:", sql);
    console.log("[DB] With parameters:", params);
    const result = await client.query(sql, params);
    console.log("[DB] Query result:", result.rows);
    return result.rows;
  } catch (error: any) {
    console.error("[DB] Query error:", error);
    throw error;
  } finally {
    client.release();
  }
}
