import fs from 'fs';
import path from 'path';

const isPM = (name, desc) => {
    const pmNames = [
        'M390', 'M398', 'K340', 'K390', 'M340', 'S390',
        'CTS-204P', 'CTS-XHP', 'Maxamet',
        'MagnaCut', 'CPM', 'SPY27',
        'DS93X', 'RWL34',
        'ASP',
        'HAP40', 'HAP72', 'ZDP-189',
        'SG2', 'R2', 'SRS13', 'SRS15',
        'Caldie', 'Elmax', 'Vanadis', 'Vanax'
    ];
    if (pmNames.some(pm => name.includes(pm))) return true;
    const descLower = (desc || '').toLowerCase();
    if (descLower.includes('powder') || descLower.includes(' pm ') || descLower.includes(' pm,')) return true;
    return false;
};

async function main() {
    let content = fs.readFileSync('src/data/steels.js', 'utf8');

    // Find all blocks { id: '...', ... }
    const blocks = content.match(/{[^}]+id:\s*['"][^'"]+['"][^}]+}/g) || [];

    for (const block of blocks) {
        const idMatch = block.match(/id:\s*['"]([^'"]+)['"]/);
        const nameMatch = block.match(/name:\s*['"]([^'"]+)['"]/);
        const descMatch = block.match(/desc:\s*['"]([^'"]+)['"]/);

        if (!idMatch || !nameMatch) continue;

        const id = idMatch[1];
        const name = nameMatch[1];
        const desc = descMatch ? descMatch[1] : '';

        if (block.includes('pm:')) continue; // Already has it

        const pmStatus = isPM(name, desc);

        // Find the `name: "xxx",` or `producer: "xxx",` and insert pm
        const updatedBlock = block.replace(/(producer:\s*['"][^'"]+['"]\s*,)/, `$1 pm: ${pmStatus},`);

        content = content.replace(block, updatedBlock);
    }

    fs.writeFileSync('src/data/steels.js', content);
    console.log("Updated steels.js with PM flags.");
}

main().catch(console.error);
