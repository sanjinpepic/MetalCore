import prisma from '../src/lib/prisma';
import SteelLedgerClient from './SteelLedgerClient';

// Force dynamic rendering to ensure fresh data on each request (optional, can be cached)
export const dynamic = 'force-dynamic';

export default async function Page() {
    let steels = [], formattedKnives = [], glossary = [], faq = [], producers = [];
    let dbError = false;

    try {
        const [steelsData, knives, glossaryData, faqData, producersData] = await Promise.all([
            prisma.steel.findMany(),
            prisma.knife.findMany({
                include: {
                    steels: {
                        select: { name: true }
                    }
                }
            }),
            prisma.glossary.findMany(),
            prisma.fAQ.findMany(),
            prisma.producer.findMany()
        ]);

        steels = steelsData;
        formattedKnives = knives.map(k => ({
            ...k,
            steels: k.steels.map(s => s.name)
        }));
        glossary = glossaryData;
        faq = faqData;
        producers = producersData;
    } catch (err) {
        console.error('Database connection failed:', err.message);
        dbError = err.message;
    }

    return (
        <SteelLedgerClient
            initialSteels={steels}
            initialKnives={formattedKnives}
            initialGlossary={glossary}
            initialFaq={faq}
            initialProducers={producers}
            dbError={dbError}
        />
    );
}
