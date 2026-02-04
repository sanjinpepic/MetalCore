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
