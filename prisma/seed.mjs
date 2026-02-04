import 'dotenv/config';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

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

    // Detect _SteelToKnife column order from foreign key constraints
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
    console.log(`Join table columns: ${knifeCol}=Knife, ${steelCol}=Steel`);

    console.log('Clearing existing data...');
    await pool.query('DELETE FROM "_SteelToKnife"');
    await pool.query('DELETE FROM "Knife"');
    await pool.query('DELETE FROM "Steel"');
    await pool.query('DELETE FROM "Glossary"');
    await pool.query('DELETE FROM "FAQ"');
    await pool.query('DELETE FROM "Producer"');

    console.log('Seeding Steels...');
    for (const s of PREMIUM_STEELS) {
        await pool.query(
            `INSERT INTO "Steel" (id, name, producer, "C", "Cr", "V", "Mo", "W", "Co", edge, toughness, corrosion, sharpen, ht_curve, "desc", use_case, pros, cons)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
            [s.id, s.name, s.producer, s.C, s.Cr, s.V, s.Mo, s.W, s.Co, s.edge, s.toughness, s.corrosion, s.sharpen, s.ht_curve || '', s.desc, s.use_case, s.pros || [], s.cons || []]
        );
    }

    // Build name/id -> id lookup for steel matching
    const steelLookup = new Map();
    for (const s of PREMIUM_STEELS) {
        steelLookup.set(s.name.toLowerCase(), s.id);
        steelLookup.set(s.id.toLowerCase(), s.id);
    }
    // Aliases: knives.js uses different name variants than steels.js
    const aliases = {
        'cpm-s30v':           'crucible-7',
        'cpm-s35vn':          'crucible-10',
        'cpm-s45vn':          'crucible-5',
        'cpm-s90v':           'crucible-2',
        'cpm-s110v':          'crucible-8',
        'cpm-20cv':           'crucible-9',
        'cpm-3v':             'crucible-3',
        'cpm-154':            'crucible-11',
        'cpm-m4':             'crucible-6',
        'cpm-cruwear':        'crucible-4',
        'cpm-magnacut':       'crucible-1',
        'm390 microclean':    'bohler-1',
        'elmax superclean':   'uddeholm-1',
        'k390 microclean':    'bohler-2',
        'vanax superclean':   'uddeholm-6',
        's35vn':              'crucible-10',
        '15v':                'crucible-12',
        'mc63 (sg2)':         'takefu-1',
        'm4':                 'crucible-6',
        'carbon steel':       'carbon-4',   // generic "Carbon Steel" -> 1075
    };
    for (const [alias, id] of Object.entries(aliases)) {
        steelLookup.set(alias, id);
    }

    console.log('Seeding Knives...');
    for (const k of POPULAR_KNIVES) {
        await pool.query(
            `INSERT INTO "Knife" (id, name, maker, category, description, "whySpecial", image, link)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
            [k.id, k.name, k.maker, k.category, k.description, k.whySpecial, k.image, k.link]
        );

        if (k.steels) {
            for (const steelRef of k.steels) {
                const steelId = steelLookup.get(steelRef.toLowerCase());
                if (steelId) {
                    await pool.query(
                        `INSERT INTO "_SteelToKnife" ("${knifeCol}", "${steelCol}") VALUES ($1, $2)`,
                        [k.id, steelId]
                    );
                } else {
                    console.warn(`  Warning: steel "${steelRef}" not found for knife "${k.name}"`);
                }
            }
        }
    }

    console.log('Seeding Glossary...');
    for (const g of GLOSSARY) {
        await pool.query('INSERT INTO "Glossary" (term, def) VALUES ($1, $2)', [g.term, g.def]);
    }

    console.log('Seeding FAQ...');
    for (const f of FAQ) {
        await pool.query('INSERT INTO "FAQ" (q, a) VALUES ($1, $2)', [f.q, f.a]);
    }

    console.log('Seeding Producers...');
    for (const p of PRODUCERS) {
        await pool.query(
            'INSERT INTO "Producer" (name, location, coords, region, "desc") VALUES ($1,$2,$3,$4,$5)',
            [p.name, p.location, p.coords, p.region, p.desc]
        );
    }

    // Verify
    const counts = await pool.query(`
        SELECT
            (SELECT count(*) FROM "Steel") as steels,
            (SELECT count(*) FROM "Knife") as knives,
            (SELECT count(*) FROM "_SteelToKnife") as relations,
            (SELECT count(*) FROM "Glossary") as glossary,
            (SELECT count(*) FROM "FAQ") as faq,
            (SELECT count(*) FROM "Producer") as producers
    `);
    console.log('Seeding complete. Row counts:', counts.rows[0]);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => pool.end());
