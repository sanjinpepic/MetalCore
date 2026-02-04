import prisma from '../src/lib/prisma';
import SteelLedgerClient from './SteelLedgerClient';

// Force dynamic rendering to ensure fresh data on each request (optional, can be cached)
export const dynamic = 'force-dynamic';

export default async function Page() {
    // Parallel data fetching
    const [steels, knives, glossary, faq, producers] = await Promise.all([
        prisma.steel.findMany(),
        prisma.knife.findMany({
            include: {
                steels: {
                    select: { name: true } // We only need names for compatibility with existing UI logic
                }
            }
        }),
        prisma.glossary.findMany(),
        prisma.fAQ.findMany(),
        prisma.producer.findMany()
    ]);

    // Transform knives data to match the expected format (array of steel names)
    const formattedKnives = knives.map(k => ({
        ...k,
        steels: k.steels.map(s => s.name)
    }));

    return (
        <SteelLedgerClient
            initialSteels={steels}
            initialKnives={formattedKnives}
            initialGlossary={glossary}
            initialFaq={faq}
            initialProducers={producers}
        />
    );
}
