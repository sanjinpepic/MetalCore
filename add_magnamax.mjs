import fs from 'fs';

const FILE = 'src/data/steels.js';
let c = fs.readFileSync(FILE, 'utf8');

// Remove any previously inserted (broken) MagnaMax entry
c = c.replace(/\n    \{"id":"nsm-1"[\s\S]*?\},?\n\];/, '\n];');

const entry = '    ' + JSON.stringify({
    id: 'nsm-1',
    name: 'MagnaMax',
    producer: 'Niagara Specialty Metals',
    parent: 'Crucible',
    pm: true,
    C: 1.45,
    Cr: 10.7,
    V: 6.5,
    Mo: 2,
    W: 0,
    Co: 0,
    N: 0.2,
    Nb: 3,
    edge: 9.5,
    toughness: 6.5,
    corrosion: 9.5,
    sharpen: 3,
    ht_curve: '150:64,175:63,205:62,230:61',
    desc: 'The next evolution of MagnaCut, designed by Dr. Larrin Thomas and owned by Niagara Specialty Metals (composition patent-pending \u2014 figures below are estimates pending official publication). Roughly double the carbide volume of MagnaCut (~16%) in fine vanadium and niobium carbides with no chromium carbides and confirmed 2% molybdenum \u2014 delivering S110V-class edge retention at S35VN-class toughness with MagnaCut-level corrosion resistance. Best properties with 2150\u00B0F austenitizing, plate quench, liquid-nitrogen cryo, and a double 350\u00B0F temper.',
    knives: ['Spyderco Mule Team (first commercial heat)', 'NSM flatstock (wide release May 2026)', 'Select 2026 production knives'],
    pros: ['S110V-class edge retention with roughly double the toughness of S90V/20CV/M390', 'No large chromium carbides \u2014 very fine, stable edges', 'Similar toughness to CPM-154, S35VN, and Vanax'],
    cons: ['Composition not yet published (patent pending)', 'Requires cryogenic treatment for best properties', 'Very new \u2014 limited heat-treat track record'],
    use_case: 'High-wear stainless EDC and fixed blades where maximum edge retention is wanted without the toughness penalty of S90V/20CV-class steels.',
});

// Append after the current last entry (which has no trailing comma)
c = c.replace(/\n\];/, ',\n' + entry + '\n];');

fs.writeFileSync(FILE, c);
console.log('MagnaMax inserted');
