import { useState, useMemo } from 'react';
import Footer from './Footer';

const normalize = (val) => {
    if (!val) return "";
    return val.toLowerCase()
        .replace(/cpm[- ]?/, "")
        .replace(/böhler |bohler /, "")
        .replace(/sandvik |alleima |alleima-/, "")
        .replace(/[ \-]/g, "")
        .trim();
};

const KnifeLibrary = ({ knives, steels, setDetailSteel, setDetailKnife, knifeSearch, setKnifeSearch }) => {
    const [activeCategory, setActiveCategory] = useState("ALL");

    const categories = ["ALL", "EDC", "Kitchen", "Survival", "Outdoor", "Tactical"];

    const filteredKnives = useMemo(() => {
        return knives.filter(knife => {
            const matchesCategory = activeCategory === "ALL" || knife.category === activeCategory;
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
        <div className="flex-1 min-h-dvh md:h-full md:overflow-y-auto bg-black custom-scrollbar max-w-[100vw] [overflow-x:clip]">
            {/* Header */}
            <header className="p-6 md:p-12 pb-4 md:pb-8 pt-20 md:pt-16 space-y-2 md:space-y-6 shrink-0 bg-gradient-to-b from-sky-500/10 to-transparent">
                <div>
                    <div className="text-[10px] md:text-xs font-black text-sky-400 mb-1 md:mb-3 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-6 h-px bg-sky-500/30"></span>
                        Armory
                    </div>
                    <h1 className="text-2xl md:text-6xl font-display font-black text-white tracking-tighter italic uppercase leading-none md:leading-tight">Knife <br className="hidden md:block" /><span className="text-accent">Registry</span></h1>
                    <p className="text-slate-500 max-w-2xl text-xs md:text-lg leading-relaxed mt-2 md:mt-4 italic font-medium hidden md:block">Iconic models that defined the industry. Click any card for details. Click a steel variant to view its metallurgical breakdown.</p>
                </div>
            </header>

            {/* Category Filters & Search */}
            <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl">
                {/* Mobile categories — plain block, NOT inside flex */}
                <div className="md:hidden px-4 pt-3 overflow-x-auto no-scrollbar">
                    <div className="flex gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-3 py-2 rounded-2xl text-[10px] font-black transition-all whitespace-nowrap uppercase italic tracking-wider shrink-0 ${activeCategory === cat
                                    ? "bg-sky-500 text-black scale-105 shadow-lg shadow-sky-500/20"
                                    : "bg-white/5 text-slate-500 hover:text-slate-300 hover:bg-white/10"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Desktop: categories + search row. Mobile: just search */}
                <div className="px-4 md:px-12 pb-3 pt-2 md:py-4 flex justify-between items-center gap-4">
                    <div className="hidden md:flex gap-2 overflow-x-auto no-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-3 rounded-2xl text-sm font-black transition-all whitespace-nowrap uppercase italic tracking-wider shrink-0 ${activeCategory === cat
                                    ? "bg-sky-500 text-black scale-105 shadow-lg shadow-sky-500/20"
                                    : "bg-white/5 text-slate-500 hover:text-slate-300 hover:bg-white/10"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-64 md:shrink-0">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600">
                            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search knives..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-6 text-white text-xs focus:outline-none focus:border-accent/40 transition-colors"
                            value={knifeSearch}
                            onChange={e => setKnifeSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="p-6 md:p-12 pb-32 space-y-10 md:space-y-16">
                {Object.entries(groupedKnives).map(([maker, makerKnives]) => (
                    <section key={maker}>
                        <div className="sticky top-[7.5rem] md:top-[4.5rem] z-20 -mx-6 px-6 md:-mx-12 md:px-12 py-3 mb-4 md:mb-6 bg-black/80 backdrop-blur-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                                <h2 className="text-xs md:text-sm font-black text-slate-400 uppercase tracking-[0.2em] italic">{maker}</h2>
                                <div className="flex-1 h-px bg-white/5"></div>
                                <span className="text-[10px] font-bold text-slate-600">{makerKnives.length} {makerKnives.length === 1 ? 'knife' : 'knives'}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
                            {makerKnives.map(knife => (
                                <div
                                    key={knife.id}
                                    onClick={() => setDetailKnife && setDetailKnife(knife)}
                                    className="glass-panel rounded-[2rem] md:rounded-[3rem] overflow-hidden flex flex-col xl:flex-row group border-white/5 hover:border-white/20 transition-all cursor-pointer hover:shadow-2xl hover:shadow-accent/5 active:scale-[0.99]"
                                >
                                    <div className="xl:w-2/5 h-72 xl:h-auto bg-white/5 relative overflow-hidden shrink-0">
                                        {knife.image ? (
                                            <img src={knife.image.replace('file:///', '')} alt={knife.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
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
                                            <h3 className="text-xl md:text-4xl font-display font-black text-white italic tracking-tight uppercase leading-none">{knife.name}</h3>
                                        </div>
                                    </div>
                                    <div className="xl:w-3/5 p-8 md:p-10 flex flex-col justify-between">
                                        <div className="space-y-6">
                                            <div className="flex gap-3 items-start">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-accent mt-1 shrink-0">
                                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                                </svg>
                                                <p className="text-xs md:text-sm text-slate-400 italic leading-relaxed">{knife.description}</p>
                                            </div>
                                            <div className="flex gap-3 items-start">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-500 mt-1 shrink-0">
                                                    <path d="M12 2v20" />
                                                    <path d="M2 12h20" />
                                                    <path d="m4.93 4.93 14.14 14.14" />
                                                    <path d="m19.07 4.93-14.14 14.14" />
                                                </svg>
                                                <p className="text-sm md:text-base text-slate-300 font-medium leading-relaxed">{knife.whySpecial}</p>
                                            </div>
                                        </div>
                                        <div className="mt-8 pt-6 border-t border-white/5 space-y-6">
                                            <div className="flex flex-wrap items-center gap-6">
                                                <div className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">{knife.category}</div>
                                                <a href={knife.link} onClick={e => e.stopPropagation()} target="_blank" rel="noreferrer" className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-accent transition-colors flex items-center gap-2">
                                                    Product Page
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                                        <polyline points="15 3 21 3 21 9" />
                                                        <line x1="10" y1="14" x2="21" y2="3" />
                                                    </svg>
                                                </a>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="text-[10px] md:text-xs font-bold text-slate-600 uppercase tracking-widest">Available Configurations</div>
                                                <div className="flex flex-wrap gap-2 md:gap-3">
                                                    {knife.steels.map(sName => {
                                                        const steel = steels.find(s => normalize(s.name) === normalize(sName));
                                                        return (
                                                            <button
                                                                key={sName}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    steel ? setDetailSteel(steel) : alert(`Data for ${sName} not found.`);
                                                                }}
                                                                className="px-3.5 py-1.5 md:px-4 md:py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-slate-200 hover:bg-white/10 hover:text-white hover:border-accent transition-all active:scale-95"
                                                            >
                                                                {sName}
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
