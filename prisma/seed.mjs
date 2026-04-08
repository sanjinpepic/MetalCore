import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

process.loadEnvFile(path.resolve(__dirname, '../.env'));
const connectionString = String(process.env.DIRECT_URL || process.env.DATABASE_URL || '');
const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
});

function loadData(filePath) {
    const code = fs.readFileSync(path.resolve(__dirname, filePath), 'utf8');
    const cleanCode = code.replace(/export\s+const/g, 'var');
    const sandbox = {};
    vm.createContext(sandbox);
    vm.runInContext(cleanCode, sandbox);
    return sandbox;
}

async function main() {
    console.log('Loading raw data...');
    const { PREMIUM_STEELS } = loadData('../src/data/steels.js');
    const { POPULAR_KNIVES } = loadData('../src/data/knives.js');
    const { GLOSSARY, FAQ, PRODUCERS } = loadData('../src/data/education.js');
    console.log(`Loaded: ${PREMIUM_STEELS.length} steels, ${POPULAR_KNIVES.length} knives, ${GLOSSARY.length} glossary, ${FAQ.length} FAQ, ${PRODUCERS.length} producers`);

    const fkRows = await pool.query(`
        SELECT kcu.column_name, ccu.table_name AS ref_table
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
            ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage ccu
            ON tc.constraint_name = ccu.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY' AND kcu.table_name = '_SteelToKnife'
    `);
    let knifeCol = 'A', steelCol = 'B';
    for (const row of fkRows.rows) {
        if (row.ref_table === 'Knife') knifeCol = row.column_name;
        if (row.ref_table === 'Steel') steelCol = row.column_name;
    }

    const aliases = {
        'cpm-s30v': 'crucible-14',
        'cpm-s35vn': 'crucible-15',
        'cpm-s45vn': 'crucible-16',
        'cpm-s90v': 'crucible-18',
        'cpm-s110v': 'crucible-13',
        'cpm-20cv': 'crucible-5',
        'cpm-3v': 'crucible-6',
        'cpm-154': 'crucible-4',
        'cpm-m4': 'crucible-9',
        'cpm-cruwear': 'crucible-8',
        'cpm-magnacut': 'boutique-21',
        'm390 microclean': 'bohler-5',
        'elmax superclean': 'uddeholm-3',
        'k390 microclean': 'bohler-22',
        'vanax superclean': 'uddeholm-10',
        's35vn': 'crucible-15',
        '15v': 'crucible-3',
        'mc63 (sg2)': 'takefu-2',
        'm4': 'crucible-9',
        'carbon steel': 'carbon-1',
        'magnacut': 'boutique-21',
        'cpm rex 45': 'crucible-10',
        '1095 high carbon': 'carbon-5',
        's30v': 'crucible-14',
        's45vn': 'crucible-16',
        's110v': 'crucible-13',
        'maxamet': 'carpenter-5',
        'd2': 'toolsteel-2',
        '420hc': 'carpenter-1',
        'x55crmov14': 'victorinox-1',
        'lc200n / cronidur 30': 'zapp-1',
        'cru-wear': 'crucible-8',
    };

    console.log('Clearing optional tables outside transaction...');
    try { await pool.query('DELETE FROM "SteelPrice"'); } catch (e) { }
    try { await pool.query('DELETE FROM "SteelComparison"'); } catch (e) { }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        console.log('Clearing main tables...');
        await client.query('TRUNCATE TABLE "_SteelToKnife", "Knife", "Steel", "Glossary", "FAQ", "Producer" CASCADE');

        console.log('Seeding Steels...');
        const steelLookup = new Map();
        const canonLookup = new Map();
        const canon = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

        for (const s of PREMIUM_STEELS) {
            const parentArr = s.parent ? (Array.isArray(s.parent) ? s.parent : [s.parent]) : [];
            const normalizedId = s.id.toLowerCase().trim();
            await client.query(
                `INSERT INTO "Steel" (id, name, producer, "C", "Cr", "V", "Mo", "W", "Co", edge, toughness, corrosion, sharpen, ht_curve, "desc", use_case, pros, cons, pm, parent)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)`,
                [normalizedId, s.name, s.producer, s.C, s.Cr, s.V, s.Mo, s.W, s.Co, s.edge, s.toughness, s.corrosion, s.sharpen, s.ht_curve || '', s.desc, s.use_case, s.pros || [], s.cons || [], s.pm ?? false, parentArr]
            );
            steelLookup.set(normalizedId, normalizedId);
            steelLookup.set(s.name.toLowerCase().trim(), normalizedId);
            canonLookup.set(canon(s.name), normalizedId);
            canonLookup.set(canon(s.id), normalizedId);
        }

        for (const [alias, id] of Object.entries(aliases)) {
            const normalizedId = id.toLowerCase().trim();
            steelLookup.set(alias.toLowerCase().trim(), normalizedId);
            canonLookup.set(canon(alias), normalizedId);
        }

        console.log('Seeding Knives...');
        for (const k of POPULAR_KNIVES) {
            await client.query(
                `INSERT INTO "Knife" (id, name, maker, category, description, "whySpecial", image, link)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
                [k.id, k.name, k.maker, k.category, k.description, k.whySpecial, k.image, k.link]
            );
            if (k.steels) {
                for (const steelRef of k.steels) {
                    const lowerRef = steelRef.toLowerCase().trim();
                    const steelId = steelLookup.get(lowerRef) || canonLookup.get(canon(steelRef));
                    if (steelId) {
                        await client.query(
                            `INSERT INTO "_SteelToKnife" ("${knifeCol}", "${steelCol}") VALUES ($1, $2)`,
                            [k.id, steelId]
                        );
                    }
                }
            }
        }

        console.log('Seeding Education...');
        for (const g of GLOSSARY) await client.query('INSERT INTO "Glossary" (term, def, category, level) VALUES ($1, $2, $3, $4)', [g.term, g.def, g.category || '', g.level || '']);
        for (const f of FAQ) await client.query('INSERT INTO "FAQ" (q, a, category) VALUES ($1, $2, $3)', [f.q, f.a, f.category || '']);
        for (const p of PRODUCERS) await client.query('INSERT INTO "Producer" (name, location, coords, region, "desc") VALUES ($1,$2,$3,$4,$5)', [p.name, p.location, p.coords, p.region, p.desc]);

        await client.query('COMMIT');
        console.log('Seeding complete successfully.');
    } catch (e) {
        if (client) await client.query('ROLLBACK').catch(() => {});
        console.error('Seeding failed.', e);
        process.exit(1);
    } finally {
        if (client) client.release();
    }
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => pool.end());
