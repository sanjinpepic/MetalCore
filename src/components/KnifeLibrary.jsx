import { useState, useMemo } from 'react';
import Image from 'next/image';
import Footer from './Footer';
import ViewHeader from './Common/ViewHeader';
import GradeFilterBar from './Common/GradeFilterBar';

const normalize = (val) => {
    if (typeof val !== 'string') return "";
    return val.toLowerCase()
        .replace(/cpm[- ]?/, "")
        .replace(/böhler |bohler /, "")
        .replace(/sandvik |alleima |alleima-/, "")
        .replace(/[ \-]/g, "")
        .trim();
};

const KnifeLibrary = ({ knives, steels, setDetailSteel, setDetailKnife, knifeSearch, setKnifeSearch, activeProducer, setActiveProducer, filters, setFilters, pmOnly, setPmOnly, producers, producerCounts, totalSteels, resetFilters }) => {
    const [activeCategory, setActiveCategory] = useState("ALL");

    const categories = ["ALL", "EDC", "Kitchen", "Survival", "Outdoor", "Tactical"];

    const filteredKnives = useMemo(() => {
        return knives.filter(knife => {
            const matchesCategory = activeCategory === "ALL" || knife.category === activeCategory;

            // Search is already filtered in parent (SteelLedgerClient), but let's be safe 
            // and ensure we only filter by category here since we're using the 'knives' prop 
            // which is already filtered by search in the parent.
            return matchesCategory;
        });
    }, [knives, activeCategory]);

    const groupedKnives = useMemo(() => {
        const groups = {};
        for (const knife of filteredKnives) {
            const maker = knife.maker || 'Other';
            if (!groups[maker]) groups[maker] = [];
            groups[maker].push(knife);
        }
        return groups;
    }, [filteredKnives]);

    return (
        <div className="flex-1 min-h-dvh md:h-full md:overflow-y-auto bg-[#0B0A08] custom-scrollbar max-w-[100vw] [overflow-x:clip]">
            {/* Desktop gradient overlay — matches sidebar and HomeView gradient spread */}
            <div className="hidden md:block h-[500px] -mb-[500px] bg-gradient-to-b from-accent/10 to-transparent pointer-events-none" />
            <ViewHeader
                subtitle="Armory"
                title="Knife"
                highlight="Registry"
                color="sky"
            >
                <p className="text-stone-500 max-w-2xl text-xs md:text-lg leading-relaxed mt-2 md:mt-4 font-medium hidden md:block">
                    Iconic models that defined the industry. Click any card for details. Click a steel variant to view its metallurgical breakdown.
                </p>
            </ViewHeader>

            {/* Category Filters & Search */}
            <div className="sticky top-0 z-30 bg-[#0B0A08]/90 backdrop-blur-2xl border-b border-white/[0.06] transition-colors">
                {/* Mobile categories — plain block, NOT inside flex */}
                <div className="md:hidden px-4 pt-3 overflow-x-auto no-scrollbar">
                    <div className="flex gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-3 py-2 rounded-2xl text-[10px] font-mono font-medium transition-colors whitespace-nowrap uppercase tracking-[0.2em] shrink-0 ${activeCategory === cat
                                    ? "bg-accent text-[#1A0C05] scale-105 shadow-ember-sm"
                                    : "bg-white/5 text-stone-500 hover:text-white hover:bg-white/10"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Desktop: categories | criteria | search. Mobile: search + criteria scroll */}
                <div className="px-4 md:px-12 py-3 flex items-center gap-3">
                    <div className="hidden md:flex gap-2 overflow-x-auto no-scrollbar flex-1 min-w-0">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-lg text-[10px] font-mono font-medium transition whitespace-nowrap uppercase tracking-[0.2em] shrink-0 active:scale-95 ${activeCategory === cat
                                    ? "bg-accent text-[#1A0C05] shadow-ember-sm"
                                    : "bg-white/5 text-stone-500 hover:text-white hover:bg-white/10 border border-white/5"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="flex md:hidden flex-1 min-w-0 items-center gap-2">
                        <div className="relative w-36 shrink-0">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-600">
                                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search knives..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-white text-xs focus:outline-none focus:border-accent/40 transition-colors placeholder:text-stone-600"
                                value={knifeSearch}
                                onChange={e => setKnifeSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex-1 min-w-0 flex justify-end">
                            <GradeFilterBar
                                producers={producers}
                                activeProducer={activeProducer}
                                setActiveProducer={setActiveProducer}
                                filters={filters}
                                setFilters={setFilters}
                                pmOnly={pmOnly}
                                setPmOnly={setPmOnly}
                                producerCounts={producerCounts}
                                total={totalSteels}
                                shown={knives.length}
                                onClear={resetFilters}
                            />
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-3 shrink-0">
                        <GradeFilterBar
                            producers={producers}
                            activeProducer={activeProducer}
                            setActiveProducer={setActiveProducer}
                            filters={filters}
                            setFilters={setFilters}
                            pmOnly={pmOnly}
                            setPmOnly={setPmOnly}
                            producerCounts={producerCounts}
                            total={totalSteels}
                            shown={knives.length}
                            onClear={resetFilters}
                        />
                        <div className="relative w-44 xl:w-52">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-600">
                                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search knives..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-6 text-white text-xs focus:outline-none focus:border-accent/40 transition-colors placeholder:text-stone-600"
                                value={knifeSearch}
                                onChange={e => setKnifeSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 md:p-12 pb-32 space-y-10 md:space-y-16">
                {Object.entries(groupedKnives).map(([maker, makerKnives]) => (
                    <section key={maker}>
                        <div className="sticky top-[7.25rem] md:top-16 z-20 -mx-6 px-6 md:-mx-12 md:px-12 py-3 mb-4 md:mb-6 bg-[#0B0A08]/85 backdrop-blur-2xl transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                                <h2 className="text-xs md:text-sm font-mono font-medium text-stone-400 uppercase tracking-[0.2em]">{maker}</h2>
                                <div className="flex-1 h-px bg-white/5"></div>
                                <span className="text-[10px] font-mono font-medium text-stone-600">{makerKnives.length} {makerKnives.length === 1 ? 'knife' : 'knives'}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
                            {makerKnives.map(knife => (
                                <div
                                    key={knife.id}
                                    onClick={() => setDetailKnife && setDetailKnife(knife)}
                                    className="glass-panel rounded-3xl overflow-hidden flex flex-col xl:flex-row group border-white/5 hover:border-white/20 transition cursor-pointer hover:shadow-plate-lg active:scale-[0.99]"
                                >
                                    {/* <div className="xl:w-2/5 h-72 xl:h-auto bg-white/5 relative overflow-hidden shrink-0">
                                        {knife.image ? (
                                            <Image
                                                src={(() => {
                                                    let url = knife.image.replace('file:///', '').replace(/\\/g, '/');
                                                    if (!url.startsWith('http') && !url.startsWith('/')) {
                                                        url = '/' + url;
                                                    }
                                                    return url;
                                                })()}
                                                alt={knife.name}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white/10">
                                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
                                                    <line x1="13" y1="19" x2="19" y2="13" />
                                                    <line x1="16" y1="16" x2="20" y2="20" />
                                                    <line x1="19" y1="21" x2="21" y2="19" />
                                                </svg>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                                        <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-8 md:right-8">
                                            <div className="text-[10px] md:text-xs font-bold text-accent uppercase tracking-widest mb-1.5">{knife.maker}</div>
                                            <h3 className="text-xl md:text-4xl font-display text-white tracking-tight uppercase leading-none">{knife.name}</h3>
                                        </div>
                                    </div> */}
                                    <div className="xl:w-full p-8 md:p-10 flex flex-col justify-between">
                                        <div className="mb-6">
                                            <h3 className="text-xl md:text-4xl font-display text-white tracking-tight uppercase leading-none">{knife.name}</h3>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="flex gap-3 items-start">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-accent mt-1 shrink-0">
                                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                                </svg>
                                                <p className="text-xs md:text-sm text-stone-400 leading-relaxed">{knife.description}</p>
                                            </div>
                                            <div className="flex gap-3 items-start">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-stone-500 mt-1 shrink-0">
                                                    <path d="M12 2v20" />
                                                    <path d="M2 12h20" />
                                                    <path d="m4.93 4.93 14.14 14.14" />
                                                    <path d="m19.07 4.93-14.14 14.14" />
                                                </svg>
                                                <p className="text-sm md:text-base text-stone-300 font-medium leading-relaxed">{knife.whySpecial}</p>
                                            </div>
                                        </div>
                                        <div className="mt-8 pt-6 border-t border-white/5 space-y-6">
                                            <div className="flex flex-wrap items-center gap-6">
                                                <div className="text-[10px] md:text-xs font-bold text-stone-500 uppercase tracking-widest">{knife.category}</div>
                                                <a href={knife.link} onClick={e => e.stopPropagation()} target="_blank" rel="noreferrer" className="text-[10px] md:text-xs font-bold text-stone-400 uppercase tracking-widest hover:text-accent transition-colors flex items-center gap-2">
                                                    Product Page
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                                        <polyline points="15 3 21 3 21 9" />
                                                        <line x1="10" y1="14" x2="21" y2="3" />
                                                    </svg>
                                                </a>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="text-[10px] md:text-xs font-bold text-stone-600 uppercase tracking-widest">Available Configurations</div>
                                                <div className="flex flex-wrap gap-2 md:gap-3">
                                                    {knife.steels.map(s => {
                                                        const steelName = typeof s === 'string' ? s : s.name;
                                                        const steel = steels.find(foundSteel => normalize(foundSteel.name) === normalize(steelName));
                                                        return (
                                                            <button
                                                                key={steelName}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    steel ? setDetailSteel(steel) : alert(`Data for ${steelName} not found.`);
                                                                }}
                                                                className="px-3.5 py-1.5 md:px-4 md:py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-mono font-medium text-stone-200 hover:bg-white/10 hover:text-white hover:border-accent transition active:scale-95"
                                                            >
                                                                {steelName}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
            <Footer />
        </div>
    );
};

export default KnifeLibrary;
