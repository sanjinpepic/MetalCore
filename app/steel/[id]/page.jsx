import { fetchAllData } from '../../../src/lib/db';
import { PREMIUM_STEELS } from '../../../src/data/steels';
import Link from 'next/link';

// Pre-render all known steels at build time from static data.
// dynamicParams = true (default) means unknown slugs still SSR from DB.
export async function generateStaticParams() {
    return PREMIUM_STEELS.map((steel) => ({
        id: steel.name.toLowerCase().trim().replace(/\s+/g, '-'),
    }));
}

// Revalidate every 24h so DB edits propagate without a full rebuild
export const revalidate = 86400;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function findSteel(steels, id) {
    const n = id.toLowerCase();
    return steels.find(
        (s) =>
            s.id === id ||
            s.name.toLowerCase().trim().replace(/\s+/g, '-') === n ||
            s.name.toLowerCase() === n
    );
}

async function getSteel(id) {
    // Try live DB first; fall back to static bundle
    try {
        const data = await fetchAllData();
        const found = findSteel(data.steels, id);
        if (found) return found;
    } catch (_) {}
    return findSteel(PREMIUM_STEELS, id);
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }) {
    const { id } = await params;
    const steel = await getSteel(id);

    if (!steel) {
        return {
            title: 'Steel Not Found | MetalCore',
            description: 'The requested steel could not be found in our database.',
        };
    }

    const compositionParts = [
        steel.C  && `${steel.C}% Carbon`,
        steel.Cr && `${steel.Cr}% Chromium`,
        steel.V  && `${steel.V}% Vanadium`,
        steel.Mo && `${steel.Mo}% Molybdenum`,
    ].filter(Boolean);

    const shortDesc = steel.desc?.slice(0, 150) ?? '';

    return {
        title: `${steel.name} Knife Steel — Composition, Properties & Reviews | MetalCore`,
        description: `${steel.name} by ${steel.producer}: ${shortDesc}... Composition: ${compositionParts.join(', ')}. Edge retention ${steel.edge}/10, Toughness ${steel.toughness}/10, Corrosion resistance ${steel.corrosion}/10.`,
        keywords: [
            steel.name,
            `${steel.name} steel`,
            `${steel.name} knife steel`,
            `${steel.name} composition`,
            `${steel.name} review`,
            `${steel.name} properties`,
            `${steel.name} edge retention`,
            `${steel.producer} steel`,
            'knife steel database',
            'metallurgy',
            'blade steel',
            steel.pm ? 'powder metal steel' : 'stainless steel',
        ],
        openGraph: {
            title: `${steel.name} Knife Steel — Complete Analysis | MetalCore`,
            description: steel.desc?.slice(0, 200),
            type: 'article',
            url: `https://metalcore.io/steel/${id}`,
            siteName: 'MetalCore',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${steel.name} — Edge ${steel.edge}/10 · Toughness ${steel.toughness}/10`,
            description: steel.desc?.slice(0, 200),
        },
        alternates: {
            canonical: `https://metalcore.io/steel/${id}`,
        },
    };
}

// ─── Sub-components (server-only, no 'use client') ────────────────────────────

function RatingBar({ label, value }) {
    const pct = Math.round((Math.min(value, 10) / 10) * 100);
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: '#a1a1aa', fontSize: '14px' }}>{label}</span>
                <span style={{ color: '#e4e4e7', fontSize: '14px', fontFamily: 'monospace' }}>{value}/10</span>
            </div>
            <div style={{ height: '6px', background: '#27272a', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: '#f97316', borderRadius: '9999px' }} />
            </div>
        </div>
    );
}

function Badge({ children, color = '#f97316' }) {
    return (
        <span style={{
            fontSize: '11px',
            fontFamily: 'monospace',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color,
            background: `${color}1a`,
            padding: '3px 10px',
            borderRadius: '6px',
            border: `1px solid ${color}33`,
        }}>
            {children}
        </span>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function SteelPage({ params }) {
    const { id } = await params;
    const steel = await getSteel(id);

    if (!steel) {
        return (
            <div style={{ minHeight: '100vh', background: '#09090b', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Steel Not Found</h1>
                    <p style={{ color: '#71717a', marginBottom: '24px' }}>No steel matching &quot;{id}&quot; in our database.</p>
                    <Link href="/" style={{ color: '#f97316', textDecoration: 'underline' }}>← Back to MetalCore</Link>
                </div>
            </div>
        );
    }

    const elements = [
        { symbol: 'C',  name: 'Carbon',     value: steel.C  },
        { symbol: 'Cr', name: 'Chromium',   value: steel.Cr },
        { symbol: 'V',  name: 'Vanadium',   value: steel.V  },
        { symbol: 'Mo', name: 'Molybdenum', value: steel.Mo },
        { symbol: 'W',  name: 'Tungsten',   value: steel.W  },
        { symbol: 'Co', name: 'Cobalt',     value: steel.Co },
    ].filter((e) => e.value > 0);

    // JSON-LD structured data for rich results in Google / AI
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: `${steel.name} Knife Steel — Composition, Properties & Reviews`,
        description: steel.desc,
        url: `https://metalcore.io/steel/${id}`,
        author: { '@type': 'Organization', name: 'MetalCore', url: 'https://metalcore.io' },
        publisher: {
            '@type': 'Organization',
            name: 'MetalCore',
            url: 'https://metalcore.io',
            logo: { '@type': 'ImageObject', url: 'https://metalcore.io/icons/icon-512x512.png' },
        },
        mainEntityOfPage: { '@type': 'WebPage', '@id': `https://metalcore.io/steel/${id}` },
        about: {
            '@type': 'Product',
            name: `${steel.name} Steel`,
            description: steel.desc,
            manufacturer: { '@type': 'Organization', name: steel.producer },
            additionalProperty: [
                { '@type': 'PropertyValue', name: 'Carbon',              value: `${steel.C}%`  },
                { '@type': 'PropertyValue', name: 'Chromium',            value: `${steel.Cr}%` },
                { '@type': 'PropertyValue', name: 'Vanadium',            value: `${steel.V}%`  },
                { '@type': 'PropertyValue', name: 'Molybdenum',          value: `${steel.Mo}%` },
                { '@type': 'PropertyValue', name: 'Edge Retention',      value: `${steel.edge}/10`      },
                { '@type': 'PropertyValue', name: 'Toughness',           value: `${steel.toughness}/10` },
                { '@type': 'PropertyValue', name: 'Corrosion Resistance', value: `${steel.corrosion}/10` },
                { '@type': 'PropertyValue', name: 'Ease of Sharpening',  value: `${steel.sharpen}/10`   },
                { '@type': 'PropertyValue', name: 'Powder Metal',        value: steel.pm ? 'Yes' : 'No' },
            ],
        },
        // FAQPage block so Google can show rich snippets
        ...(steel.pros?.length || steel.cons?.length ? {
            speakable: {
                '@type': 'SpeakableSpecification',
                cssSelector: ['h1', 'h2', '.steel-description'],
            },
        } : {}),
    };

    const s = {
        page:       { position: 'fixed', inset: 0, overflowY: 'auto', background: '#09090b', color: '#f4f4f5', fontFamily: 'system-ui, sans-serif' },
        nav:        { borderBottom: '1px solid #27272a', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
        navBrand:   { color: '#f97316', fontWeight: 800, fontSize: '18px', letterSpacing: '0.15em', textDecoration: 'none' },
        navBack:    { color: '#71717a', fontSize: '14px', textDecoration: 'none' },
        main:       { maxWidth: '900px', margin: '0 auto', padding: '48px 24px' },
        label:      { fontSize: '11px', fontFamily: 'monospace', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '12px', display: 'block' },
        card:       { background: '#18181b', borderRadius: '16px', padding: '24px', border: '1px solid #27272a' },
        grid2:      { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' },
        h2:         { fontSize: '11px', fontFamily: 'monospace', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '16px' },
        knifeItem:  { background: '#27272a', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', color: '#d4d4d8' },
        knifeGrid:  { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' },
        footer:     { borderTop: '1px solid #27272a', padding: '32px 24px', textAlign: 'center', color: '#52525b', fontSize: '13px' },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div style={s.page}>
                {/* ── Nav ── */}
                <nav style={s.nav}>
                    <Link href="/" style={s.navBrand}>METALCORE</Link>
                    <Link href="/" style={s.navBack}>← Full Database</Link>
                </nav>

                <main style={s.main}>
                    {/* ── Header ── */}
                    <header style={{ marginBottom: '48px' }}>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                            <Badge>{steel.producer}</Badge>
                            {steel.pm && <Badge color="#a855f7">Powder Metal</Badge>}
                        </div>
                        <h1 style={{ fontSize: '56px', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: '20px' }}>
                            {steel.name}
                        </h1>
                        <p className="steel-description" style={{ color: '#a1a1aa', fontSize: '18px', lineHeight: 1.7, maxWidth: '680px' }}>
                            {steel.desc}
                        </p>
                        {steel.use_case && (
                            <p style={{ marginTop: '12px', color: '#71717a', fontSize: '15px', fontStyle: 'italic' }}>
                                Best for: {steel.use_case}
                            </p>
                        )}
                    </header>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        {/* ── Performance + Composition row ── */}
                        <div style={s.grid2}>
                            <section aria-labelledby="perf-heading">
                                <h2 id="perf-heading" style={s.h2}>Performance Ratings</h2>
                                <div style={{ ...s.card, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <RatingBar label="Edge Retention"      value={steel.edge}      />
                                    <RatingBar label="Toughness"           value={steel.toughness} />
                                    <RatingBar label="Corrosion Resistance" value={steel.corrosion} />
                                    <RatingBar label="Ease of Sharpening"  value={steel.sharpen}   />
                                </div>
                            </section>

                            <section aria-labelledby="comp-heading">
                                <h2 id="comp-heading" style={s.h2}>Chemical Composition</h2>
                                <div style={s.card}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr>
                                                <th style={{ textAlign: 'left', fontSize: '11px', color: '#52525b', paddingBottom: '12px', fontWeight: 500 }}>Element</th>
                                                <th style={{ textAlign: 'right', fontSize: '11px', color: '#52525b', paddingBottom: '12px', fontWeight: 500 }}>Content</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {elements.map((el) => (
                                                <tr key={el.symbol} style={{ borderTop: '1px solid #27272a' }}>
                                                    <td style={{ padding: '10px 0' }}>
                                                        <span style={{ fontFamily: 'monospace', color: '#f97316', fontSize: '14px' }}>{el.symbol}</span>
                                                        <span style={{ color: '#71717a', fontSize: '13px', marginLeft: '10px' }}>{el.name}</span>
                                                    </td>
                                                    <td style={{ padding: '10px 0', textAlign: 'right', fontFamily: 'monospace', color: '#e4e4e7', fontSize: '14px' }}>
                                                        {el.value}%
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </div>

                        {/* ── Pros & Cons ── */}
                        {(steel.pros?.length > 0 || steel.cons?.length > 0) && (
                            <section aria-labelledby="proscons-heading">
                                <h2 id="proscons-heading" style={s.h2}>Pros &amp; Cons of {steel.name}</h2>
                                <div style={s.grid2}>
                                    {steel.pros?.length > 0 && (
                                        <div style={s.card}>
                                            <h3 style={{ color: '#4ade80', fontWeight: 600, marginBottom: '16px', fontSize: '15px' }}>Advantages</h3>
                                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                {steel.pros.map((pro, i) => (
                                                    <li key={i} style={{ display: 'flex', gap: '10px', color: '#d4d4d8', fontSize: '14px' }}>
                                                        <span style={{ color: '#4ade80', flexShrink: 0 }}>✓</span> {pro}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {steel.cons?.length > 0 && (
                                        <div style={s.card}>
                                            <h3 style={{ color: '#f87171', fontWeight: 600, marginBottom: '16px', fontSize: '15px' }}>Disadvantages</h3>
                                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                {steel.cons.map((con, i) => (
                                                    <li key={i} style={{ display: 'flex', gap: '10px', color: '#d4d4d8', fontSize: '14px' }}>
                                                        <span style={{ color: '#f87171', flexShrink: 0 }}>✗</span> {con}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* ── Known Knives ── */}
                        {steel.knives?.length > 0 && (
                            <section aria-labelledby="knives-heading">
                                <h2 id="knives-heading" style={s.h2}>Notable Knives Made With {steel.name}</h2>
                                <div style={s.card}>
                                    <ul style={{ ...s.knifeGrid, listStyle: 'none', padding: 0, margin: 0 }}>
                                        {steel.knives.map((knife, i) => (
                                            <li key={i} style={s.knifeItem}>{typeof knife === 'string' ? knife : knife.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            </section>
                        )}

                        {/* ── CTA ── */}
                        <div style={{ textAlign: 'center', borderTop: '1px solid #27272a', paddingTop: '48px', marginTop: '16px' }}>
                            <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
                                Compare {steel.name} Against 250+ Steels
                            </h2>
                            <p style={{ color: '#71717a', marginBottom: '24px', fontSize: '15px' }}>
                                Use the MetalCore interactive database to compare composition, heat treatment curves, and performance side-by-side.
                            </p>
                            <Link
                                href={`/?compare=${encodeURIComponent(steel.name)}`}
                                style={{
                                    display: 'inline-block',
                                    background: '#f97316',
                                    color: '#000',
                                    fontWeight: 700,
                                    padding: '14px 32px',
                                    borderRadius: '12px',
                                    textDecoration: 'none',
                                    fontSize: '15px',
                                }}
                            >
                                Open MetalCore App →
                            </Link>
                        </div>
                    </div>
                </main>

                <footer style={s.footer}>
                    <p>© {new Date().getFullYear()} MetalCore · The Premier Knife Steel Database</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '8px' }}>
                        <Link href="/legal/privacy" style={{ color: '#52525b', textDecoration: 'none' }}>Privacy</Link>
                        <Link href="/legal/terms"   style={{ color: '#52525b', textDecoration: 'none' }}>Terms</Link>
                        <Link href="/"              style={{ color: '#52525b', textDecoration: 'none' }}>Full Database</Link>
                    </div>
                </footer>
            </div>
        </>
    );
}
