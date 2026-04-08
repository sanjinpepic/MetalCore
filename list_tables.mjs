import { Pool } from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

process.loadEnvFile(path.resolve(__dirname, './.env'));
const connectionString = String(process.env.DIRECT_URL || process.env.DATABASE_URL || '');
const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
});

async function main() {
    const res = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log('Tables:', res.rows.map(r => r.table_name).join(', '));
    await pool.end();
}

main();
