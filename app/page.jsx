import { fetchAllData } from '../src/lib/db';
import SteelLedgerClient from './SteelLedgerClient';

export const dynamic = 'force-dynamic';

export default async function Page() {
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
