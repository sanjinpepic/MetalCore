import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('sslmode')
        ? { rejectUnauthorized: false }
        : false,
});

export async function fetchAllData() {
    const [steelsRes, knivesRes, glossaryRes, faqRes, producersRes, joinRes] = await Promise.all([
        pool.query('SELECT * FROM "Steel"'),
        pool.query('SELECT * FROM "Knife"'),
        pool.query('SELECT * FROM "Glossary"'),
        pool.query('SELECT * FROM "FAQ"'),
        pool.query('SELECT * FROM "Producer"'),
        pool.query('SELECT * FROM "_SteelToKnife"'),
    ]);

    // Build steel id -> name map
    const steelNameMap = new Map(steelsRes.rows.map(s => [s.id, s.name]));

    // _SteelToKnife has columns A and B. Determine which is which from the data.
    const knifIds = new Set(knivesRes.rows.map(k => k.id));
    const sampleA = joinRes.rows[0]?.A;
    const knifeCol = knifIds.has(sampleA) ? 'A' : 'B';
    const steelCol = knifeCol === 'A' ? 'B' : 'A';

    // Build knife id -> [steel names] and steel id -> [knife names] maps
    const knifeToSteels = new Map();
    const steelToKnives = new Map();
    const knifeNameMap = new Map(knivesRes.rows.map(k => [k.id, k.name]));
    for (const row of joinRes.rows) {
        const kId = row[knifeCol];
        const sId = row[steelCol];
        if (!knifeToSteels.has(kId)) knifeToSteels.set(kId, []);
        knifeToSteels.get(kId).push(steelNameMap.get(sId));
        if (!steelToKnives.has(sId)) steelToKnives.set(sId, []);
        steelToKnives.get(sId).push(knifeNameMap.get(kId));
    }

    const formattedKnives = knivesRes.rows.map(k => ({
        ...k,
        steels: knifeToSteels.get(k.id) || [],
    }));

    return {
        steels: steelsRes.rows.map(s => ({
            ...s,
            knives: steelToKnives.get(s.id) || [],
        })),
        knives: formattedKnives,
        glossary: glossaryRes.rows,
        faq: faqRes.rows,
        producers: producersRes.rows,
    };
}

// ========== STEEL CRUD OPERATIONS ==========

export async function createSteel(steelData) {
    const { knives, ...steelFields } = steelData;

    const query = `
        INSERT INTO "Steel" (id, name, producer, "C", "Cr", "V", "Mo", "W", "Co",
                             edge, toughness, corrosion, sharpen, ht_curve, "desc",
                             use_case, pros, cons)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        RETURNING *
    `;

    const values = [
        steelFields.id || `custom-${Date.now()}`,
        steelFields.name,
        steelFields.producer,
        steelFields.C || 0,
        steelFields.Cr || 0,
        steelFields.V || 0,
        steelFields.Mo || 0,
        steelFields.W || 0,
        steelFields.Co || 0,
        steelFields.edge || 5,
        steelFields.toughness || 5,
        steelFields.corrosion || 5,
        steelFields.sharpen || 5,
        steelFields.ht_curve || '',
        steelFields.desc || '',
        steelFields.use_case || '',
        steelFields.pros || [],
        steelFields.cons || []
    ];

    const result = await pool.query(query, values);

    // Handle knife relationships if provided
    if (knives && knives.length > 0) {
        await updateSteelKnifeRelations(result.rows[0].id, knives);
    }

    return result.rows[0];
}

export async function updateSteel(id, steelData) {
    const { knives, ...steelFields } = steelData;

    const query = `
        UPDATE "Steel"
        SET name = $1, producer = $2, "C" = $3, "Cr" = $4, "V" = $5,
            "Mo" = $6, "W" = $7, "Co" = $8, edge = $9, toughness = $10,
            corrosion = $11, sharpen = $12, ht_curve = $13, "desc" = $14,
            use_case = $15, pros = $16, cons = $17
        WHERE id = $18
        RETURNING *
    `;

    const values = [
        steelFields.name,
        steelFields.producer,
        steelFields.C || 0,
        steelFields.Cr || 0,
        steelFields.V || 0,
        steelFields.Mo || 0,
        steelFields.W || 0,
        steelFields.Co || 0,
        steelFields.edge || 5,
        steelFields.toughness || 5,
        steelFields.corrosion || 5,
        steelFields.sharpen || 5,
        steelFields.ht_curve || '',
        steelFields.desc || '',
        steelFields.use_case || '',
        steelFields.pros || [],
        steelFields.cons || [],
        id
    ];

    const result = await pool.query(query, values);

    if (knives !== undefined) {
        await updateSteelKnifeRelations(id, knives);
    }

    return result.rows[0];
}

export async function deleteSteel(id) {
    // Cascade delete handled by DB constraint
    await pool.query('DELETE FROM "Steel" WHERE id = $1', [id]);
    return { success: true, id };
}

async function updateSteelKnifeRelations(steelId, knifeIds) {
    // Delete existing relations for this steel
    await pool.query('DELETE FROM "_SteelToKnife" WHERE "A" = $1 OR "B" = $1', [steelId]);

    // Insert new relations
    if (knifeIds && knifeIds.length > 0) {
        // Determine column structure (steel could be in A or B)
        const sampleQuery = await pool.query('SELECT "A", "B" FROM "_SteelToKnife" LIMIT 1');
        const steelCol = 'A'; // Based on schema, steel is in column A
        const knifeCol = 'B'; // Based on schema, knife is in column B

        const values = knifeIds.map((knifeId, i) =>
            `($${i * 2 + 1}, $${i * 2 + 2})`
        ).join(',');

        const query = `INSERT INTO "_SteelToKnife" ("${steelCol}", "${knifeCol}") VALUES ${values}`;
        const params = knifeIds.flatMap(knifeId => [steelId, knifeId]);

        await pool.query(query, params);
    }
}

// ========== KNIFE CRUD OPERATIONS ==========

export async function createKnife(knifeData) {
    const { steels, ...knifeFields } = knifeData;

    const query = `
        INSERT INTO "Knife" (id, name, maker, category, description, "whySpecial", image, link)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
    `;

    const values = [
        knifeFields.id || `custom-knife-${Date.now()}`,
        knifeFields.name,
        knifeFields.maker || '',
        knifeFields.category || 'EDC',
        knifeFields.description || '',
        knifeFields.whySpecial || '',
        knifeFields.image || '',
        knifeFields.link || ''
    ];

    const result = await pool.query(query, values);

    // Handle steel relationships if provided
    if (steels && steels.length > 0) {
        await updateKnifeSteelRelations(result.rows[0].id, steels);
    }

    return result.rows[0];
}

export async function updateKnife(id, knifeData) {
    const { steels, ...knifeFields } = knifeData;

    const query = `
        UPDATE "Knife"
        SET name = $1, maker = $2, category = $3, description = $4,
            "whySpecial" = $5, image = $6, link = $7
        WHERE id = $8
        RETURNING *
    `;

    const values = [
        knifeFields.name,
        knifeFields.maker || '',
        knifeFields.category || 'EDC',
        knifeFields.description || '',
        knifeFields.whySpecial || '',
        knifeFields.image || '',
        knifeFields.link || '',
        id
    ];

    const result = await pool.query(query, values);

    if (steels !== undefined) {
        await updateKnifeSteelRelations(id, steels);
    }

    return result.rows[0];
}

export async function deleteKnife(id) {
    // Cascade delete handled by DB constraint
    await pool.query('DELETE FROM "Knife" WHERE id = $1', [id]);
    return { success: true, id };
}

async function updateKnifeSteelRelations(knifeId, steelIds) {
    // Delete existing relations for this knife
    await pool.query('DELETE FROM "_SteelToKnife" WHERE "A" = $1 OR "B" = $1', [knifeId]);

    // Insert new relations
    if (steelIds && steelIds.length > 0) {
        const steelCol = 'A'; // Steel is in column A
        const knifeCol = 'B'; // Knife is in column B

        const values = steelIds.map((steelId, i) =>
            `($${i * 2 + 1}, $${i * 2 + 2})`
        ).join(',');

        const query = `INSERT INTO "_SteelToKnife" ("${steelCol}", "${knifeCol}") VALUES ${values}`;
        const params = steelIds.flatMap(steelId => [steelId, knifeId]);

        await pool.query(query, params);
    }
}
