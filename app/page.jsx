import { fetchAllData } from '../src/lib/db';
import SteelLedgerClient from './SteelLedgerClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ searchParams }) {
    const params = await searchParams;
    const view = params.view;
    const steels = params.steels;
    const search = params.search;

    if (view === 'COMPARE' && steels) {
        const steelList = steels.split(',').map(s => decodeURIComponent(s)).join(' vs ');
        return {
            title: `Comparing ${steelList} | MetalCore`,
            description: `Side-by-side metallurgical analysis of ${steelList}. Explore edge retention, toughness, and composition trade-offs.`,
            openGraph: {
                title: `Steel Comparison: ${steelList}`,
                description: `Deep dive comparison of the world's most elite knife alloys.`,
                type: 'website',
            }
        };
    }

    if (search) {
        return {
            title: `Search results for "${search}" | MetalCore`,
            description: `Discover performance data and chemical composition for ${search} and related knife steels.`,
        };
    }

    return {
        title: 'MetalCore - Premium Metallurgy | Knife Steel Database',
        description: 'The ultimate resource for knife steel composition, performance charts, and heat treatment protocols.',
    };
}

export default async function Page({ searchParams }) {
    let steels = [], formattedKnives = [], glossary = [], faq = [], producers = [];
    let dbError = false;

    try {
        const data = await fetchAllData();
        steels = data.steels;
        formattedKnives = data.knives;
        glossary = data.glossary;
        faq = data.faq;
        producers = data.producers;
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
