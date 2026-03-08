import { fetchAllData } from '../src/lib/db';
import { PREMIUM_STEELS } from '../src/data/steels';

export default async function sitemap() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://metalcore.io';

    // Try live DB; fall back to static bundle so sitemap always works
    let steels = [];
    try {
        const data = await fetchAllData();
        steels = data.steels;
    } catch (error) {
        console.error('Sitemap: DB unavailable, using static data', error.message);
        steels = PREMIUM_STEELS;
    }

    const now = new Date();

    const steelUrls = steels.map((steel) => {
        const slug = steel.name.toLowerCase().trim().replace(/\s+/g, '-');
        return {
            url: `${baseUrl}/steel/${slug}`,
            lastModified: steel.updatedAt ? new Date(steel.updatedAt) : now,
            changeFrequency: 'monthly',
            priority: 0.8,
        };
    });

    const mainRoutes = ['', '/compare', '/matrix', '/knives', '/education', '/search'].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: route === '' ? 1.0 : 0.9,
    }));

    return [...mainRoutes, ...steelUrls];
}
