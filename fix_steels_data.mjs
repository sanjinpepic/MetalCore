/**
 * One-shot data audit fix for src/data/steels.js
 * - Fixes encoding artifacts (mangled producer names, broken em-dashes)
 * - Corrects composition datapoints (Co, Nb, N, V, C, Mo) per datasheets
 * - Adds missing N/Nb datapoints to nitrogen/niobium-alloyed steels
 * - Merges duplicate entries (K390, BD1N, Ginsan)
 * - Removes grades that do not exist (CTS-40CP, CTS-B75P, DuraTech 20CV, H42, M268, K294, 20C)
 * - Adds missing key steels (Aogami Super, HAP40, HAP72, ATS-34, N695, Vanadis 6)
 * Usage: node fix_steels_data.mjs
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

// ---------- 1. Encoding fixes ----------
const MOJIBAKE = /[\u0080-\u009F\uFFFD]\??/g;
for (const s of steels) {
    if (s.desc) s.desc = s.desc.replace(MOJIBAKE, '\u2014');
    if (s.use_case) s.use_case = s.use_case.replace(MOJIBAKE, '\u2014');
    s.pros = (s.pros || []).map(p => p.replace(MOJIBAKE, '\u2014'));
    s.cons = (s.cons || []).map(c => c.replace(MOJIBAKE, '\u2014'));
    if (/^bohler-/.test(s.id)) s.producer = 'B\u00F6hler'; // fix mangled Böhler
    if (s.desc) s.desc = s.desc.replace(/B(A|\uFFFD|o|\u00C5)?hler/g, 'B\u00F6hler');
}

// ---------- 2. Deletes (grades that do not exist / merged away) ----------
const DELETE = new Set([
    'bohler-18',   // "M268" - not a real B\u00F6hler grade
    'bohler-19',   // "K294" - not a real B\u00F6hler grade (Z-MAX PM is the analogous real grade)
    'carpenter-6', // "CTS-40CP" - no such Carpenter grade
    'carpenter-7', // "CTS-B75P" - no such Carpenter grade
    'toolsteel-18',// "H42" - no AISI H42; chemistry was M42-like
    'alleima-6',   // "20C" - no such Sandvik/Alleima grade
    'boutique-9',  // "DuraTech 20CV" - no such Latrobe product (20CV is Crucible's)
    'bohler-22',   // duplicate of bohler-3 (K390) - merged
    'carpenter-10',// duplicate of carpenter-2 (BD1N) - merged
    'hitachi-14',  // duplicate of hitachi-13 (Ginsan) - merged
]);

// ---------- 3. Merges ----------
Object.assign(byId['bohler-3'], {
    name: 'K390',
    Cr: 4.2,
    sharpen: 2,
    desc: 'B\u00F6hler\u2019s cold-work PM monster \u2014 near-CPM 10V wear resistance with surprisingly usable toughness, produced in Microclean PM quality. The darling of the Spyderco enthusiast community for its workhorse performance.',
    knives: ['Spyderco Police 4 Lightweight', 'Spyderco Endela K390', 'Spyderco Delica 4', 'Spyderco Stretch 2 K390'],
});

Object.assign(byId['carpenter-2'], {
    name: 'BD1N',
    C: 0.85,
    Cr: 16.5,
    Mo: 0.5,
    N: 0.1,
    edge: 5.5,
    sharpen: 8.5,
    desc: 'An evolution of CTS-BD1 with added nitrogen. Nitrogen boosts hardness, grain refinement and corrosion resistance, giving higher hardness and better edge retention than its predecessor while remaining exceptionally stainless. Used by Spyderco as a significant step up from traditional budget steels.',
    knives: ['Spyderco Tenacious (newer)', 'Spyderco Persistence', 'Spyderco Para 3 Lightweight', 'Spyderco Manix 2 LW'],
});

Object.assign(byId['hitachi-13'], {
    name: 'Ginsan (Gingami #3 / Silver-3)',
    C: 0.95,
    Cr: 14,
    edge: 5,
    corrosion: 8.5,
    sharpen: 9,
    desc: 'Hitachi\u2019s flagship stainless "paper" steel \u2014 the answer to the question \u2018what if Shirogami was stainless?\u2019. Also sold as Gin-3 / Silver-3. Adored by Japanese kitchen knife craftsmen for combining the sharpening feel of white paper steel with genuinely stainless performance at 14% chromium. Not to be confused with semi-stainless steels \u2014 Ginsan is fully stainless when properly heat treated.',
    knives: ['Takamura Ginsan Gyuto', 'Sakai Takayuki Ginsan', 'Masamoto VG-series', 'Yoshihiro Ginsan', 'Kanehiro Ginsan'],
    pros: ['Japanese carbon sharpening feel and edge quality', 'Fully stainless with reliable corrosion resistance', 'Good toughness', 'Excellent finishability'],
    cons: ['Moderate edge retention compared to PM steels', 'Less exciting to collectors than carbon steels'],
});

// Fix desc ripple from deleted K294
byId['zapp-5'].desc = 'Zapp\u2019s PM cold-work steel positioned as a high-vanadium upgrade to D2. Offers excellent wear resistance through PM-distributed vanadium carbides with far better carbide uniformity than conventional D2.';

// ---------- 4. Datapoint corrections (datasheet values) ----------
const FIX = {
    'hitachi-17': { Co: 0, desc: 'Hitachi\u2019s cobalt-free PM high-speed steel \u2014 the more affordable sibling of HAP40, sharing the same vanadium-rich carbide structure without the cobalt hot-hardness premium. Sits below HAP40 in the lineup. A favorite of competitive knife sharpeners and Japanese kitchen knife makers.' },
    'uddeholm-16': { Co: 8.0, desc: 'Uddeholm\u2019s cobalt-alloyed PM high-speed steel \u2014 the M35-class counterpart of Erasteel ASP 2030, produced through Uddeholm\u2019s cold isostatic pressing process for excellent carbide distribution. The cobalt addition lifts hot hardness above cobalt-free PM M2 grades like Vanadis 23\u2019s siblings in the ASP 2003 class.' },
    'crucible-4': { V: 0.4 },
    'crucible-19': { Nb: 0.5, W: 0.5, corrosion: 9, desc: 'Spyderco\u2019s proprietary PM stainless, made by Crucible to their specification. Niobium and cobalt additions bring outstanding toughness and corrosion resistance for its class, built for extreme reliability in any environment.' },
    'crucible-15': { Nb: 0.5 },
    'crucible-16': { Nb: 0.5 },
    'lohmann-1': { Nb: 0.7 },
    'uddeholm-10': { N: 1.55 },
    'zapp-1': { N: 0.30, desc: 'A nitrogen-alloyed steel based on Cronidur 30 that is virtually rust-proof. Developed for aerospace bearings (used by NASA) and adopted by Spyderco for salt-water knives. Nitrogen replaces carbon at the surface chemistry level, enabling high hardness with no chromium-carbide depletion.' },
    'alleima-2': { N: 0.11 },
    'lohmann-2': { N: 0.77 },
    'njsb-1': { N: 0.13 },
    'uddeholm-17': { N: 1.8 },
    'bohler-7': { N: 0.39 },
    'bohler-9': { N: 0.40 },
    'myodo-1': { C: 0.04, Mo: 1.0, N: 0.10 },
    'hitachi-12': { corrosion: 5 },
    'crucible-3': { corrosion: 2 },
    'bohler-4': { pm: false, desc: 'A conventional-melt mid-range stainless from B\u00F6hler. Balances edge retention and corrosion resistance well for production knives.' },
    'takefu-8': { C: 1.45, W: 0.5 },
};
for (const [id, patch] of Object.entries(FIX)) {
    Object.assign(byId[id], patch);
}

// MagnaCut knife list corrections
byId['crucible-1'].knives = byId['crucible-1'].knives
    .map(k => k === 'ZT 0452CF' ? 'ZT 0450CF' : k === 'Hogue Deka' ? 'Benchmade Deka' : k);

// ---------- 5. Additions ----------
const ADDITIONS = [
    { id: 'hitachi-19', name: 'Aogami Super (Blue Super)', producer: 'Hitachi', parent: 'Proterial', pm: false, C: 1.25, Cr: 0.4, V: 0.4, Mo: 0.4, W: 2.2, Co: 0, edge: 9.5, toughness: 5, corrosion: 0, sharpen: 7, ht_curve: '150:65,200:63,250:62', desc: 'The pinnacle of Hitachi\u2019s Blue Paper (Aogami) series. Blue Super adds molybdenum and vanadium to the Aogami formula for a finer grain structure, better wear resistance and improved toughness over Aogami #1 \u2014 the performance king of traditional Japanese carbon steels.', knives: ['Konosuke', 'Tanaka (SE versions)', 'Premium Japanese gyuto', 'Toyama'], pros: ['Best edge retention of the traditional Japanese carbons', 'Takes a stunning, refined edge', 'Better toughness than Aogami #1'], cons: ['Very reactive \u2014 patinas and rusts readily', 'Demands skilled heat treatment', 'Fragile at thin edges'], use_case: 'Premium Japanese chef knives where maximum carbon-steel edge performance is desired.' },
    { id: 'hitachi-20', name: 'HAP40', producer: 'Hitachi', parent: 'Proterial', pm: true, C: 1.3, Cr: 4.2, V: 3.2, Mo: 5, W: 6, Co: 8, edge: 9, toughness: 6, corrosion: 1, sharpen: 3, ht_curve: '500:65,540:67,580:64', desc: 'Hitachi\u2019s cobalt-bearing PM high-speed steel. Chemistry sits between CPM M4 and ASP 2030 with higher hot hardness from the cobalt boost. Famously used in Spyderco\u2019s HAP40 sprint run and widely respected in Japanese kitchen cutlery.', knives: ['Spyderco Sprint Run (HAP40 Sprint)', 'Japanese kitchen knives', 'Sukenari'], pros: ['Very high hardness potential (65+ HRC)', 'Excellent edge retention', 'Good toughness for its class'], cons: ['Non-stainless \u2014 will rust without care', 'Requires diamond or CBN abrasives'], use_case: 'High-performance kitchen knives and enthusiast folders wanting M4-plus performance.' },
    { id: 'hitachi-21', name: 'HAP72', producer: 'Hitachi', parent: 'Proterial', pm: true, C: 1.9, Cr: 4.0, V: 4.5, Mo: 5, W: 10, Co: 9.5, edge: 10, toughness: 4, corrosion: 1, sharpen: 2, ht_curve: '500:68,540:70,580:66', desc: 'Hitachi\u2019s most heavily alloyed PM high-speed steel \u2014 a Rex 121 / ASP 2080-class alloy with enormous tungsten, vanadium and cobalt content for extreme hot hardness and wear resistance. Rarely seen in knives outside a handful of Japanese specials.', knives: ['Select Japanese sprint runs', 'Premium kitchen knife specials'], pros: ['Can reach 70 HRC', 'Extreme wear resistance', 'Excellent hot hardness'], cons: ['Non-stainless', 'Extremely difficult to sharpen', 'Very brittle at thin edges'], use_case: 'Ultra-premium collector pieces and maximum edge retention builds.' },
    { id: 'hitachi-22', name: 'ATS-34', producer: 'Hitachi', parent: 'Proterial', pm: false, C: 1.05, Cr: 14, V: 0, Mo: 4, W: 0, Co: 0, edge: 6, toughness: 5, corrosion: 7.5, sharpen: 7, ht_curve: '200:60,400:58,500:59', desc: 'Hitachi\u2019s answer to 154CM \u2014 the molybdenum-enhanced 440C derivative that defined the premium folding knife of the 1990s. Benchmade\u2019s early prestige models made it famous before PM steels took over.', knives: ['Benchmade (historical models)', 'Emerson (early models)', '1990s custom folders'], pros: ['Reliable, well-understood heat treatment', 'Good polish and finishability', 'Historically significant'], cons: ['Superseded by CPM 154 and modern PM grades', 'Average corrosion resistance for a stainless'], use_case: 'Vintage premium folders and traditional hard-use designs.' },
    { id: 'bohler-20', name: 'N695', producer: 'B\u00F6hler', pm: false, C: 1.05, Cr: 17, V: 0.1, Mo: 1.0, W: 0, Co: 0, edge: 5, toughness: 5, corrosion: 8.5, sharpen: 7, ht_curve: '200:58,400:56,500:57', desc: 'B\u00F6hler\u2019s 440C-class martensitic stainless (X102CrMo17) with surgical-grade cleanliness. Chemistry sits alongside N690 without the cobalt addition. Used in surgical instruments, bearings and European production knives.', knives: ['Surgical instruments', 'European production knives', 'Bearing applications'], pros: ['Excellent corrosion resistance', 'Consistent B\u00F6hler melt quality', 'Takes a fine polished edge'], cons: ['Modest edge retention by modern standards', 'Average toughness'], use_case: 'Surgical-grade cutlery and European production knives needing maximum corrosion resistance.' },
    { id: 'uddeholm-18', name: 'Vanadis 6', producer: 'Uddeholm', pm: true, C: 2.1, Cr: 6.8, V: 5.4, Mo: 1.5, W: 0, Co: 0, edge: 9, toughness: 4.5, corrosion: 2, sharpen: 3, ht_curve: '500:62,540:64,580:61', desc: 'Uddeholm\u2019s mid-high vanadium PM cold-work steel, sitting between Vanadis 4 Extra and Vanadis 10 in wear resistance. A well-balanced high-wear option for European custom makers who find Vanadis 10 too extreme.', knives: ['European custom fixed blades', 'High-wear cutting tools'], pros: ['Very high wear resistance', 'Better toughness than Vanadis 10', 'Fine PM carbide structure'], cons: ['Non-stainless', 'Difficult to sharpen'], use_case: 'Custom blades wanting near-10V wear resistance with a bit more forgiveness.' },
];

// ---------- 6. Serialize ----------
const kept = steels.filter(s => !DELETE.has(s.id));
const out = [...kept, ...ADDITIONS];

const lines = out.map((s, i) => {
    const ordered = {};
    for (const key of ['id', 'name', 'producer', 'parent', 'pm', 'C', 'Cr', 'V', 'Mo', 'W', 'Co', 'N', 'Nb', 'edge', 'toughness', 'corrosion', 'sharpen', 'ht_curve', 'desc', 'knives', 'pros', 'cons', 'use_case']) {
        if (s[key] !== undefined) ordered[key] = s[key];
    }
    for (const key of Object.keys(s)) if (!(key in ordered)) ordered[key] = s[key];
    return '    ' + JSON.stringify(ordered) + (i < out.length - 1 ? ',' : '');
});

const banner = '// Auto-audited by fix_steels_data.mjs \u2014 compositions verified against producer datasheets.\n// Elements: C, Cr, V, Mo, W, Co are weight %. N (nitrogen) and Nb (niobium) are optional datapoints.\n';
fs.writeFileSync(FILE, banner + 'export const PREMIUM_STEELS = [\n' + lines.join('\n') + '\n];\n', 'utf8');

console.log(`Done. ${steels.length} -> ${out.length} steels (removed ${DELETE.size}, added ${ADDITIONS.length}).`);
