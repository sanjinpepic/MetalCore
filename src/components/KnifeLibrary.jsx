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
            <header className="sticky top-0 z-10 bg-black/95 backdrop-blur-sm border-b border-white/5 p-4 md:p-12 pb-6 pt-16 md:pt-12 space-y-6 shrink-0">
                <div>
                    <h1 className="text-3xl md:text-5xl font-display font-black text-white tracking-tighter mb-4 italic">KNIFE LIBRARY</h1>
                    <p className="text-slate-500 max-w-xl text-sm md:text-base">Iconic models that defined the industry. Click any card for details. Click a steel variant to view its metallurgical breakdown.</p>
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-6 max-w-4xl">
                    <div className="relative bg-white/5 border border-white/10 rounded-2xl flex items-center px-4 py-2 group focus-within:border-accent/50 transition-all flex-1">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500 mr-3 group-focus-within:text-accent transition-colors">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        <input type="text" placeholder="Search knives..." className="w-full bg-transparent border-none text-white outline-none h-10" value={knifeSearch} onChange={e => setKnifeSearch(e.target.value)} />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeCategory === cat
                                        ? "bg-accent text-black"
                                        : "bg-white/5 text-slate-400 hover:bg-white/10"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </header>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="p-4 md:p-12 pt-4 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 pb-32">
                    {filteredKnives.map(knife => (
                        <div
                            key={knife.id}
                            onClick={() => setDetailKnife && setDetailKnife(knife)}
                            className="glass-panel rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row group border-white/5 hover:border-white/20 transition-all cursor-pointer hover:shadow-2xl hover:shadow-accent/5"
                        >
                            <div className="md:w-1/3 h-64 md:h-auto bg-white/5 relative overflow-hidden">
                                {knife.image ? (
                                    <img src={knife.image.replace('file:///', '')} alt={knife.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/10">
                                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
                                            <line x1="13" y1="19" x2="19" y2="13" />
                                            <line x1="16" y1="16" x2="20" y2="20" />
                                            <line x1="19" y1="21" x2="21" y2="19" />
                                        </svg>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                <div className="absolute bottom-6 left-6">
                                    <div className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1">{knife.maker}</div>
                                    <h3 className="text-2xl font-display font-black text-white">{knife.name}</h3>
                                </div>
                            </div>
                            <div className="md:w-2/3 p-8 flex flex-col justify-between">
                                <div className="space-y-4">
                                    <div className="flex gap-2 items-start">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent mt-1 shrink-0">
                                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                        </svg>
                                        <p className="text-sm text-slate-400 italic leading-relaxed">{knife.description}</p>
                                    </div>
                                    <div className="flex gap-2 items-start">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500 mt-1 shrink-0">
                                            <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                        <p className="text-sm text-slate-300 font-medium leading-relaxed">{knife.whySpecial}</p>
                                    </div>
                                </div>
                                <div className="mt-8 pt-6 border-t border-white/5">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">{knife.category}</div>
                                    <a href={knife.link} onClick={e => e.stopPropagation()} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 hover:text-accent transition-colors block">Product Page</a>
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Steel Availability</div>
                                    <div className="flex flex-wrap gap-2">
                                        {knife.steels.map(sName => {
                                            const steel = steels.find(s => normalize(s.name) === normalize(sName));
                                            return (
                                                <button
                                                    key={sName}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        steel ? setDetailSteel(steel) : alert(`Data for ${sName} (${normalize(sName)}) not found in database.`);
                                                    }}
                                                    className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-xs font-bold text-slate-300 hover:bg-accent hover:text-black hover:border-accent transition-all active:scale-95"
                                                >
                                                    {sName}
                                                </button>
                                            );
                                        })}
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
