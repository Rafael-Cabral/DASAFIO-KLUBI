import { Pool } from 'pg';

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20, idleTimeoutMillis: 30_000, statement_timeout: 5_000
});

export async function q<T = any>(text: string, params: any[] = []): Promise<T[]> {
    const client = await pool.connect();
    try {
        const res = await client.query(text, params);
        return res.rows as T[];
    } finally {
        client.release();
    }
}


