import { PREMIUM_STEELS } from './src/data/steels.js';
import { POPULAR_KNIVES } from './src/data/knives.js';

const steelIds = new Set(PREMIUM_STEELS.map(s => s.id.toLowerCase().trim()));
const steelNames = new Map(PREMIUM_STEELS.map(s => [s.name.toLowerCase().trim(), s.id]));

const brokenRefs = new Set();

POPULAR_KNIVES.forEach(k => {
    if (k.steels) {
        k.steels.forEach(ref => {
            const lowerRef = ref.toLowerCase().trim();
            if (!steelIds.has(lowerRef) && !steelNames.has(lowerRef)) {
                brokenRefs.add(ref);
            }
        });
    }
});

console.log('Broken References:');
brokenRefs.forEach(ref => {
    // Try to find if this ref matches a name partially
    const possible = PREMIUM_STEELS.find(s => s.name.toLowerCase().includes(ref.toLowerCase()));
    console.log(`${ref} -> ${possible ? 'Matches name: ' + possible.name + ' (ID: ' + possible.id + ')' : 'NO MATCH FOUND'}`);
});
