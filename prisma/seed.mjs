import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function loadData(filePath) {
    const code = fs.readFileSync(path.resolve(__dirname, filePath), 'utf8');
    // Remove "export " and change "const" to "var" to attach to sandbox global
    const cleanCode = code.replace(/export\s+const/g, 'var');

    const sandbox = {};
    vm.createContext(sandbox);
    vm.runInContext(cleanCode, sandbox);
    return sandbox;
}

async function main() {
    console.log('Loading raw data...');
    const steelsSandbox = loadData('../src/data/steels.js');
    console.log('Steels keys:', Object.keys(steelsSandbox));
    const PREMIUM_STEELS = steelsSandbox.PREMIUM_STEELS;

    const knivesSandbox = loadData('../src/data/knives.js');
    console.log('Knives keys:', Object.keys(knivesSandbox));
    const POPULAR_KNIVES = knivesSandbox.POPULAR_KNIVES;

    const educationSandbox = loadData('../src/data/education.js');
    console.log('Education keys:', Object.keys(educationSandbox));
    const GLOSSARY = educationSandbox.GLOSSARY;
    const FAQ = educationSandbox.FAQ;
    const PRODUCERS = educationSandbox.PRODUCERS;

    console.log('Clearing existing data...');
    await prisma.knife.deleteMany({});
    await prisma.steel.deleteMany({});
    await prisma.glossary.deleteMany({});
    await prisma.fAQ.deleteMany({});
    await prisma.producer.deleteMany({});

    console.log('Seeding Steels...');
    for (const s of PREMIUM_STEELS) {
        await prisma.steel.create({
            data: {
                id: s.id,
                name: s.name,
                producer: s.producer,
                C: s.C,
                Cr: s.Cr,
                V: s.V,
                Mo: s.Mo,
                W: s.W,
                Co: s.Co,
                edge: s.edge,
                toughness: s.toughness,
                corrosion: s.corrosion,
                sharpen: s.sharpen,
                ht_curve: s.ht_curve || "",
                desc: s.desc,
                use_case: s.use_case,
                pros: s.pros || [],
                cons: s.cons || [],
            },
        });
    }

    console.log('Seeding Knives and connecting to Steels...');
    for (const k of POPULAR_KNIVES) {
        const connectedSteels = [];
        if (k.steels) {
            for (const steelName of k.steels) {
                const match = PREMIUM_STEELS.find(s => s.name.toLowerCase() === steelName.toLowerCase() || s.id.toLowerCase() === steelName.toLowerCase());
                if (match) {
                    connectedSteels.push({ id: match.id });
                }
            }
        }

        await prisma.knife.create({
            data: {
                id: k.id,
                name: k.name,
                maker: k.maker,
                category: k.category,
                description: k.description,
                whySpecial: k.whySpecial,
                image: k.image,
                link: k.link,
                steels: {
                    connect: connectedSteels,
                },
            },
        });
    }

    console.log('Seeding Glossary...');
    for (const g of GLOSSARY) {
        await prisma.glossary.create({
            data: {
                term: g.term,
                def: g.def,
            },
        });
    }

    console.log('Seeding FAQ...');
    for (const f of FAQ) {
        await prisma.fAQ.create({
            data: {
                q: f.q,
                a: f.a,
            },
        });
    }

    console.log('Seeding Producers...');
    for (const p of PRODUCERS) {
        await prisma.producer.create({
            data: {
                name: p.name,
                location: p.location,
                coords: p.coords,
                region: p.region,
                desc: p.desc,
            },
        });
    }

    console.log('Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
