import { Pool } from 'pg';
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });

async function verify() {
    console.log("Verifying Data Relationships...");
    const res = await pool.query(`
        SELECT k.name as knife, s.name as steel
        FROM "Knife" k
        LEFT JOIN "_SteelToKnife" sk ON k.id = sk."A"
        LEFT JOIN "Steel" s ON s.id = sk."B"
        WHERE k.maker IN ('Benchmade', 'Buck Knives', 'KA-BAR', 'Spyderco', 'Victorinox')
        AND k.name IN ('Infidel', '110 Folding Hunter', '119 Special', 'USMC Utility Knife', 'Para Military 2 (PM2)', 'Classic SD')
        ORDER BY k.name, s.name
    `);

    console.table(res.rows);

    const countRes = await pool.query('SELECT count(*) FROM "_SteelToKnife"');
    console.log("Total Relations:", countRes.rows[0].count);

    await pool.end();
}

verify().catch(console.error);
