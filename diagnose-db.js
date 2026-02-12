const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function check() {
    const idToDelete = 'custom-1770884575563';
    try {
        console.log(`Attempting to delete steel with ID: ${idToDelete}`);

        // 1. Delete relations
        const relResult = await pool.query('DELETE FROM "_SteelToKnife" WHERE "A" = $1 OR "B" = $1', [idToDelete]);
        console.log(`Deleted relationships: ${relResult.rowCount}`);

        // 2. Delete steel
        const steelResult = await pool.query('DELETE FROM "Steel" WHERE id = $1', [idToDelete]);
        console.log(`Deleted steels: ${steelResult.rowCount}`);

        // 3. Verify
        const verify = await pool.query('SELECT * FROM "Steel" WHERE id = $1', [idToDelete]);
        if (verify.rows.length === 0) {
            console.log("VERIFIED: Steel is gone from DB.");
        } else {
            console.log("FAILED: Steel still exists in DB!");
        }

    } catch (err) {
        console.error("DB Delete Error:", err);
    } finally {
        await pool.end();
    }
}

check();
