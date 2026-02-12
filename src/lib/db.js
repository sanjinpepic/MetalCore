import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

let pools = {
    local: null,
    railway: null
};

function getPool() {
    let source = 'local';
    try {
        const configPath = path.resolve(process.cwd(), 'database-config.json');
        if (fs.existsSync(configPath)) {
            const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            source = config.source || 'local';
        }
    } catch (e) {
        // Fallback
    }

    if (!pools[source]) {
        const connectionString = source === 'railway'
            ? process.env.RAILWAY_DATABASE_URL
            : process.env.DATABASE_URL;

        pools[source] = new Pool({
            connectionString: connectionString,
            ssl: connectionString?.includes('sslmode') || source === 'railway'
                ? { rejectUnauthorized: false }
                : false,
        });
    }

    return pools[source];
}

export async function fetchAllData() {
    const [steelsRes, knivesRes, glossaryRes, faqRes, producersRes, joinRes] = await Promise.all([
        getPool().query('SELECT * FROM "Steel"'),
        getPool().query('SELECT * FROM "Knife"'),
        getPool().query('SELECT * FROM "Glossary"'),
        getPool().query('SELECT * FROM "FAQ"'),
        getPool().query('SELECT * FROM "Producer"'),
        getPool().query('SELECT * FROM "_SteelToKnife"'),
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
        const steelName = steelNameMap.get(sId);
        const knifeName = knifeNameMap.get(kId);

        if (kId && sId) {
            if (!knifeToSteels.has(kId)) knifeToSteels.set(kId, []);
            knifeToSteels.get(kId).push({ id: sId, name: steelName });

            if (!steelToKnives.has(sId)) steelToKnives.set(sId, []);
            steelToKnives.get(sId).push({ id: kId, name: knifeName });
        }
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

    const result = await getPool().query(query, values);

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

    const result = await getPool().query(query, values);

    if (knives !== undefined) {
        await updateSteelKnifeRelations(id, knives);
    }

    return result.rows[0];
}

export async function deleteSteel(id) {
    console.log(`DB: Deleting steel ${id}...`);
    // Explicitly delete relationships just in case CASCADE isn't enabled
    const relResult = await getPool().query('DELETE FROM "_SteelToKnife" WHERE "A" = $1 OR "B" = $1', [id]);
    const steelResult = await getPool().query('DELETE FROM "Steel" WHERE id = $1', [id]);
    console.log(`DB: Deleted ${steelResult.rowCount} steel(s) and ${relResult.rowCount} relationship(s)`);
    return { success: true, id, rowCount: steelResult.rowCount };
}

async function updateSteelKnifeRelations(steelId, knifeIds) {
    // Delete existing relations for this steel
    await getPool().query('DELETE FROM "_SteelToKnife" WHERE "A" = $1 OR "B" = $1', [steelId]);

    // Insert new relations
    if (knifeIds && knifeIds.length > 0) {
        // Determine column structure (steel could be in A or B)
        const sampleQuery = await getPool().query('SELECT "A", "B" FROM "_SteelToKnife" LIMIT 1');
        const steelCol = 'A'; // Based on schema, steel is in column A
        const knifeCol = 'B'; // Based on schema, knife is in column B

        const values = knifeIds.map((knifeId, i) =>
            `($${i * 2 + 1}, $${i * 2 + 2})`
        ).join(',');

        const query = `INSERT INTO "_SteelToKnife" ("${steelCol}", "${knifeCol}") VALUES ${values}`;
        const params = knifeIds.flatMap(knifeId => [steelId, knifeId]);

        await getPool().query(query, params);
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

    const result = await getPool().query(query, values);

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

    const result = await getPool().query(query, values);

    if (steels !== undefined) {
        await updateKnifeSteelRelations(id, steels);
    }

    return result.rows[0];
}

export async function deleteKnife(id) {
    console.log(`DB: Deleting knife ${id}...`);
    // Explicitly delete relationships just in case CASCADE isn't enabled
    const relResult = await getPool().query('DELETE FROM "_SteelToKnife" WHERE "A" = $1 OR "B" = $1', [id]);
    const knifeResult = await getPool().query('DELETE FROM "Knife" WHERE id = $1', [id]);
    console.log(`DB: Deleted ${knifeResult.rowCount} knife/knives and ${relResult.rowCount} relationship(s)`);
    return { success: true, id, rowCount: knifeResult.rowCount };
}

async function updateKnifeSteelRelations(knifeId, steelIds) {
    // Delete existing relations for this knife
    await getPool().query('DELETE FROM "_SteelToKnife" WHERE "A" = $1 OR "B" = $1', [knifeId]);

    // Insert new relations
    if (steelIds && steelIds.length > 0) {
        const steelCol = 'A'; // Steel is in column A
        const knifeCol = 'B'; // Knife is in column B

        const values = steelIds.map((steelId, i) =>
            `($${i * 2 + 1}, $${i * 2 + 2})`
        ).join(',');

        const query = `INSERT INTO "_SteelToKnife" ("${steelCol}", "${knifeCol}") VALUES ${values}`;
        const params = steelIds.flatMap(steelId => [steelId, knifeId]);

        await getPool().query(query, params);
    }
}

// ========== GLOSSARY CRUD OPERATIONS ==========

export async function createGlossary(data) {
    const query = `
        INSERT INTO "Glossary" (term, def, category, level)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;
    const values = [data.term, data.def, data.category || '', data.level || ''];
    const result = await getPool().query(query, values);
    return result.rows[0];
}

export async function updateGlossary(id, data) {
    const query = `
        UPDATE "Glossary"
        SET term = $1, def = $2, category = $3, level = $4
        WHERE id = $5
        RETURNING *
    `;
    const values = [data.term, data.def, data.category || '', data.level || '', id];
    const result = await getPool().query(query, values);
    return result.rows[0];
}

export async function deleteGlossary(id) {
    console.log(`DB: Deleting glossary ${id}...`);
    const result = await getPool().query('DELETE FROM "Glossary" WHERE id = $1', [id]);
    console.log(`DB: Deleted ${result.rowCount} glossary entry/entries`);
    return { success: true, id, rowCount: result.rowCount };
}

// ========== FAQ CRUD OPERATIONS ==========

export async function createFAQ(data) {
    const query = `
        INSERT INTO "FAQ" (q, a, category)
        VALUES ($1, $2, $3)
        RETURNING *
    `;
    const values = [data.q, data.a, data.category || ''];
    const result = await getPool().query(query, values);
    return result.rows[0];
}

export async function updateFAQ(id, data) {
    const query = `
        UPDATE "FAQ"
        SET q = $1, a = $2, category = $3
        WHERE id = $4
        RETURNING *
    `;
    const values = [data.q, data.a, data.category || '', id];
    const result = await getPool().query(query, values);
    return result.rows[0];
}

export async function deleteFAQ(id) {
    console.log(`DB: Deleting FAQ ${id}...`);
    const result = await getPool().query('DELETE FROM "FAQ" WHERE id = $1', [id]);
    console.log(`DB: Deleted ${result.rowCount} FAQ entry/entries`);
    return { success: true, id, rowCount: result.rowCount };
}

// ========== PRODUCER CRUD OPERATIONS ==========

export async function createProducer(data) {
    const query = `
        INSERT INTO "Producer" (name, location, coords, region, "desc")
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `;
    const values = [data.name, data.location, data.coords || [], data.region, data.desc];
    const result = await getPool().query(query, values);
    return result.rows[0];
}

export async function updateProducer(id, data) {
    const query = `
        UPDATE "Producer"
        SET name = $1, location = $2, coords = $3, region = $4, "desc" = $5
        WHERE id = $6
        RETURNING *
    `;
    const values = [data.name, data.location, data.coords || [], data.region, data.desc, id];
    const result = await getPool().query(query, values);
    return result.rows[0];
}

export async function deleteProducer(id) {
    console.log(`DB: Deleting producer ${id}...`);
    const result = await getPool().query('DELETE FROM "Producer" WHERE id = $1', [id]);
    console.log(`DB: Deleted ${result.rowCount} producer(s)`);
    return { success: true, id, rowCount: result.rowCount };
}
