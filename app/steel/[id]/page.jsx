import { fetchAllData } from '../../../src/lib/db';
import SteelLedgerClient from '../../SteelLedgerClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
    const { id } = await params;

    try {
        const data = await fetchAllData();
        // Normalize the ID (slug) for comparison
        const normalizedId = id.toLowerCase();

        const steel = data.steels.find(s => {
            const hasIdMatch = s.id === id;
            const hasNameMatch = s.name.toLowerCase().trim().replace(/\s+/g, '-') === normalizedId;
            // Also check raw name just in case
            const hasRawNameMatch = s.name.toLowerCase() === normalizedId;

            return hasIdMatch || hasNameMatch || hasRawNameMatch;
        });

        if (!steel) {
            return {
                title: 'Steel Not Found | MetalCore',
                description: 'The requested steel could not be found in our database.'
            };
        }

        return {
            title: `${steel.name} (${steel.producer}) Performance & Composition | MetalCore`,
            description: `Everything you need to know about ${steel.name} steel. Heat treatment data, performance charts, and knife examples. Composition: C: ${steel.C}%, Cr: ${steel.Cr}%, V: ${steel.V}%.`,
            openGraph: {
                title: `${steel.name} Steel Analysis - Composition, Properties & Deployment`,
                description: `Deep metallurgical dive into ${steel.name}. Explore edge retention, toughness, and how it compares to the legendary CPM MagnaCut.`,
                type: 'article',
                url: `https://metalcore.io/steel/${id}`,
            },
            twitter: {
                card: 'summary_large_image',
                title: `${steel.name} Steel Review`,
                description: `Full performance profile and chemical composition analysis of ${steel.name} steel.`,
            }
        };
    } catch (error) {
        return {
            title: 'MetalCore - Database Unavailable',
            description: 'Could not connect to the database.'
        };
    }
}

export default async function Page({ params }) {
    const { id } = await params;
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

    // Find the steel ID case-insensitively or by direct ID match
    const normalizedId = id.toLowerCase();
    const foundSteel = steels.find(s => {
        const hasIdMatch = s.id === id;
        const hasNameMatch = s.name.toLowerCase().trim().replace(/\s+/g, '-') === normalizedId;
        const hasRawNameMatch = s.name.toLowerCase() === normalizedId;
        return hasIdMatch || hasNameMatch || hasRawNameMatch;
    });
    const initialRouteState = {
        view: 'HOME',
        detailSteel: foundSteel ? (foundSteel.id || foundSteel.name) : null,
        detailKnife: null,
        compareSteels: null
    };

    return (
        <SteelLedgerClient
            initialSteels={steels}
            initialKnives={formattedKnives}
            initialGlossary={glossary}
            initialFaq={faq}
            initialProducers={producers}
            dbError={dbError}
            initialRouteState={initialRouteState}
        />
    );
}
