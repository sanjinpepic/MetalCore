import { useState, useMemo } from 'react';

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

    return (
        <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
            <header className="sticky top-0 z-10 bg-black/95 backdrop-blur-md border-b border-white/5 p-6 md:p-12 pb-6 md:pb-8 pt-24 md:pt-12 space-y-6 md:space-y-8 shrink-0">
                <div>
                    <h1 className="text-2xl md:text-5xl font-display font-black text-white tracking-tighter mb-3 md:mb-4 italic uppercase leading-none">KNIFE LIBRARY</h1>
                    <p className="text-slate-500 max-w-2xl text-sm md:text-lg leading-relaxed">Iconic models that defined the industry. Click any card for details. Click a steel variant to view its metallurgical breakdown.</p>
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8 max-w-5xl">
                    <div className="relative bg-white/5 border border-white/10 rounded-xl md:rounded-2xl flex items-center px-4 py-3 md:py-4 group focus-within:border-accent/50 transition-all flex-1">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-500 mr-3 group-focus-within:text-accent transition-colors">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        <input type="text" placeholder="Search knives..." className="w-full bg-transparent border-none text-white outline-none h-10 text-sm md:text-base" value={knifeSearch} onChange={e => setKnifeSearch(e.target.value)} />
                    </div>

                    <div className="flex gap-2 md:gap-3 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2.5 rounded-lg md:rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap uppercase tracking-widest ${activeCategory === cat
                                    ? "bg-accent text-black"
                                    : "bg-white/5 text-slate-400 hover:bg-white/10 border border-white/5"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </header>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="p-6 md:p-12 pt-6 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 pb-32">
                    {filteredKnives.map(knife => (
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
                                <div className="absolute bottom-6 left-8">
                                    <div className="text-[10px] md:text-xs font-bold text-accent uppercase tracking-widest mb-1.5">{knife.maker}</div>
                                    <h3 className="text-2xl md:text-4xl font-display font-black text-white italic tracking-tight uppercase leading-none">{knife.name}</h3>
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
            </div>
        </div>
    );
};

export default KnifeLibrary;
