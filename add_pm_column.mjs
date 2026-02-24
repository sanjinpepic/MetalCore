import { Pool } from 'pg';

const connectionString = String(process.env.DATABASE_URL || process.env.RAILWAY_DATABASE_URL || '');
const pool = new Pool({
    connectionString,
    ssl: connectionString.includes('sslmode') || connectionString.includes('rlwy.net')
        ? { rejectUnauthorized: false }
        : false
});

async function main() {
    console.log(`Connecting to: ${connectionString.split('@')[1] || 'Unknown'}`);
    console.log(`Adding "pm" column to "Steel" table...`);
    try {
        await pool.query('ALTER TABLE "Steel" ADD COLUMN IF NOT EXISTS "pm" BOOLEAN DEFAULT false;');
        console.log("Column added successfully!");
    } catch (e) {
        console.error("Error adding column:", e.message);
    }
}

main().finally(() => pool.end());
