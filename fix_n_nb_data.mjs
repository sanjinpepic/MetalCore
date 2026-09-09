/**
 * N/Nb datapoint verification pass - all values from producer datasheets:
 * - Crucible CPM MagnaCut datasheet (Issue #1): Nb 2.00, N 0.20
 * - Niagara Specialty Metals S45VN datasheet: N 0.15 (S35VN has no N)
 * - Spyderco steel chart / KSN analysis: SPY27 Nb 1.0, N ~0.1
 * - Bohler Knife Steels BL010E: N680 N 0.20 (C 0.55), N360 N 0.40, K390 C 2.45, N695 Cr 16.7 Mo 0.5
 * - Carpenter BD1N datasheet: N 0.10-0.15 (kept 0.10)
 * - Alleima 14C28N datasheet: N 0.11 (kept)
 * - Lohmann Niolox table: Nb 0.7 (kept); Nitrobe 77 N 0.77 (kept)
 * - KSN Nitro-V analysis (NJSB data): N = 14C28N level (0.11), C/Cr as AEB-L
 * - Uddeholm Vanax SuperClean: C 0.35, N 1.55
 * - Uddeholm Vancron SuperClean (current product): C 1.30 Cr 4.50 Mo 1.80 V 10.00 N 1.80
 * - Zapp LC200N datasheet: N 0.5
 * - Myodo H1 (zknives/Myodo): C 0.15, N 0.10
 * - Aubert & Duval X15TN brochure: N 0.16-0.25 (mid 0.2), Mo 1.50-1.90 (mid 1.7)
 * Usage: node fix_n_nb_data.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.resolve(__dirname, 'src/data/steels.js');

const code = fs.readFileSync(FILE, 'utf8').replace(/export\s+const/g, 'var');
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(code, sandbox);
const steels = sandbox.PREMIUM_STEELS.map(s => ({ ...s }));
const byId = Object.fromEntries(steels.map(s => [s.id, s]));

const FIX = {
    'crucible-1': {
        Nb: 2.0,
        N: 0.2,
        desc: 'Revolutionary stainless steel designed specifically for knives by Dr. Larrin Thomas. Its chromium-carbide-free microstructure \u2014 only small vanadium and niobium carbides (8% total) with nitrogen assisting corrosion resistance \u2014 offers an unrivaled balance of toughness and corrosion resistance.',
    },
    'crucible-16': { N: 0.15 },
    'crucible-19': { Nb: 1.0, N: 0.1 },
    'bohler-3': { C: 2.45 },
    'bohler-7': { C: 0.55, N: 0.2 },
    'bohler-20': { Cr: 16.7, Mo: 0.5 },
    'njsb-1': { N: 0.11 },
    'uddeholm-10': { C: 0.35 },
    'uddeholm-17': {
        name: 'Vancron SuperClean',
        C: 1.3,
        Cr: 4.5,
        Mo: 1.8,
        V: 10,
        W: 0,
        N: 1.8,
        desc: 'Uddeholm\u2019s nitrogen-alloyed PM cold-work steel (the rebalanced successor to Vancron 40). Ten percent vanadium forms fine vanadium carbonitrides \u2014 instead of the old grade\u2019s Mo/W carbides \u2014 for extreme abrasive and adhesive wear resistance with self-lubricating, galling-resistant properties.',
    },
    'zapp-1': { N: 0.5 },
    'myodo-1': { C: 0.15, N: 0.1, desc: 'A precipitation-hardened austenitic stainless steel with very low carbon (0.15%), high silicon (~3.5%), and nickel (~6%). Hardened not through martensite but through precipitation of intermetallic phases and nitrogen \u2014 meaning there are no chromium carbides depleting the corrosion resistance.' },
    'boutique-7': { N: 0.2, Mo: 1.7 },
};
for (const [id, patch] of Object.entries(FIX)) {
    if (!byId[id]) { console.error('MISSING id:', id); process.exit(1); }
    Object.assign(byId[id], patch);
}

// Re-serialize preserving key order
const lines = steels.map((s, i) => {
    const ordered = {};
    for (const key of ['id', 'name', 'producer', 'parent', 'pm', 'C', 'Cr', 'V', 'Mo', 'W', 'Co', 'N', 'Nb', 'edge', 'toughness', 'corrosion', 'sharpen', 'ht_curve', 'desc', 'knives', 'pros', 'cons', 'use_case']) {
        if (s[key] !== undefined) ordered[key] = s[key];
    }
    for (const key of Object.keys(s)) if (!(key in ordered)) ordered[key] = s[key];
    return '    ' + JSON.stringify(ordered) + (i < steels.length - 1 ? ',' : '');
});
fs.writeFileSync(FILE, 'export const PREMIUM_STEELS = [\n' + lines.join('\n') + '\n];\n', 'utf8');
console.log('Applied', Object.keys(FIX).length, 'datasheet corrections.');
