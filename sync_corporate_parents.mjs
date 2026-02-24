import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

// Helper to load .env manually since we're running with raw node
function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');
            envContent.split('\n').forEach(line => {
                const [key, ...valueParts] = line.split('=');
                if (key && valueParts.length > 0) {
                    const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
                    process.env[key.trim()] = value;
                }
            });
        }
    } catch (e) {
        console.warn("Could not load .env file:", e.message);
    }
}

loadEnv();

let source = 'local';
try {
    const configPath = path.resolve(process.cwd(), 'database-config.json');
    if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        source = config.source || 'local';
    }
} catch (e) { }

const connectionString = source === 'railway'
    ? process.env.RAILWAY_DATABASE_URL
    : process.env.DATABASE_URL;

if (!connectionString) {
    console.error(`ERROR: No connection string found for source: ${source.toUpperCase()} `);
    process.exit(1);
}

const pool = new Pool({
    connectionString,
    ssl: connectionString.includes('sslmode') || source === 'railway'
        ? { rejectUnauthorized: false }
        : false
});

async function main() {
    console.log(`Using Database Source: ${source.toUpperCase()} `);
    console.log(`Adding "parent" column if needed...`);

    try {
        await pool.query('ALTER TABLE "Steel" ADD COLUMN IF NOT EXISTS "parent" TEXT;');
        console.log("Column checked/added.");

        console.log("Updating corporate parents...");

        const updates = [
            { producer: 'Crucible', parent: 'Erasteel' },
            { producer: 'Hitachi', parent: 'Proterial' },
            { producer: 'Alleima', parent: 'Sandvik' }
        ];

        for (const update of updates) {
            const res = await pool.query(
                'UPDATE "Steel" SET "parent" = $1 WHERE "producer" = $2',
                [update.parent, update.producer]
            );
            console.log(`Updated ${res.rowCount} records for ${update.producer} -> ${update.parent}`);
        }

        console.log("Sync complete!");
    } catch (e) {
        console.error("Migration failed:", e.message);
    }
}

main().finally(() => pool.end());
