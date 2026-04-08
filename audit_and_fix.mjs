import { PREMIUM_STEELS } from './src/data/steels.js';
import fs from 'fs';

const unique = [];
const seen = new Set();
const seenIds = new Set();

PREMIUM_STEELS.forEach(s => {
    const nameKey = s.name.toLowerCase().trim();
    const idKey = s.id.toLowerCase().trim();
    if (!seen.has(nameKey) && !seenIds.has(idKey)) {
        unique.push(s);
        seen.add(nameKey);
        seenIds.add(idKey);
    } else {
        console.log('Removing duplicate:', s.name, s.id);
    }
});

const content = `// METALCORE - PREMIUM STEEL DATASET
// This file contains the core metallurgy data for the application.

export const PREMIUM_STEELS = [
${unique.map(s => '    ' + JSON.stringify(s)).join(',\n')}
];
`;

fs.writeFileSync('src/data/steels.js', content);
console.log('Final count: ' + unique.length);
