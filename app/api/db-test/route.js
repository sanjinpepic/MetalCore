import { Pool } from 'pg';

export async function GET() {
    const url = process.env.DATABASE_URL;
    const info = { url_defined: !!url, url_host: url ? new URL(url).hostname : null, url_port: url ? new URL(url).port : null };

    const pool = new Pool({ connectionString: url });
    try {
        const result = await pool.query('SELECT count(*)::int as steel_count FROM "Steel"');
        return new Response(JSON.stringify({ status: 'ok', ...info, steel_count: result.rows[0].steel_count }), { headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
        return new Response(JSON.stringify({ status: 'error', ...info, error: err.message }), { headers: { 'Content-Type': 'application/json' } });
    } finally {
        await pool.end();
    }
}
