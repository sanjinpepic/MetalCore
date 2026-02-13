import { fetchAllData } from '../src/lib/db';

export default async function sitemap() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://metalcre.vercel.app'; // Replace with actual domain

    let steels = [];
    let knives = [];

    try {
        const data = await fetchAllData();
        steels = data.steels;
        knives = data.knives;
    } catch (error) {
        console.error('Sitemap generation failed:', error);
    }

    const steelUrls = steels.map((steel) => {
        // Slugify the name: "M390 Microclean" -> "m390-microclean"
        const slug = steel.name.toLowerCase().trim().replace(/\s+/g, '-');
        return {
            url: `${baseUrl}/steel/${slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        };
    });

    // We can also add knife URLs if we create a route for them later (e.g. /knife/[id])
    // For now, let's just stick to steels as requested, but maybe add the main pages.

    const mainRoutes = [
        '',
        '/search',
        '/matrix',
        '/knives',
        '/compare',
        '/education'
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
    }));

    return [...mainRoutes, ...steelUrls];
}
