import React from 'react';

const SearchView = ({ search, setSearch, filteredSteels, compareList, toggleCompare, clearCompare, setDetailSteel, setView }) => {
    return (
        <div className="flex flex-col flex-1 min-w-0">
            <header className="p-4 md:p-12 pb-6 pt-16 md:pt-12 space-y-6">
                <div>
                    <h1 className="text-3xl md:text-5xl font-display font-black text-white tracking-tighter mb-4 italic">GRADE LIBRARY</h1>
                    <p className="text-slate-500 max-w-xl text-sm md:text-base">Comprehensive database of premium knife steels. Filter by alloy content or search by grade.</p>
                </div>
                <div className="relative bg-white/5 border border-white/10 rounded-2xl flex items-center px-4 py-2 group focus-within:border-accent/50 transition-all max-w-xl">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500 mr-3 group-focus-within:text-accent transition-colors">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                    <input type="text" placeholder="Search grades..." className="w-full bg-transparent border-none text-white outline-none h-10" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 pb-32 custom-scrollbar">
                {filteredSteels.map(s => {
                    const isSelected = compareList.find(i => i.id === s.id);
                    return (
                        <div key={s.id} onClick={() => setDetailSteel(s)} className={`glass-panel rounded-2xl md:rounded-3xl p-5 md:p-6 cursor-pointer border transition-all hover:-translate-y-1 hover:border-white/20 active:scale-[0.98] relative group ${isSelected ? 'border-accent bg-accent/5' : 'border-white/5'}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{s.producer}</div>
                                    <h3 className="text-lg font-bold text-white group-hover:text-accent transition-colors">{s.name}</h3>
                                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-1 font-medium opacity-80 group-hover:opacity-100 transition-opacity italic">{s.desc}</p>
                                </div>
                                <div className={`p-2 rounded-full transition-all ${isSelected ? 'bg-accent text-black scale-110 shadow-lg shadow-accent/40' : 'bg-white/5 text-slate-500 hover:text-white hover:bg-white/10'}`}
                                    onClick={(e) => { e.stopPropagation(); toggleCompare(s); }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                                        <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                                        <path d="M7 21h10" />
                                        <path d="M12 3v18" />
                                        <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
                                    </svg>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {['C', 'Cr', 'V', 'Mo', 'W', 'Co'].map(el => (
                                    <div key={el} className="bg-black/40 rounded-lg p-2 text-center border border-white/5 group-hover:border-accent/10 transition-colors">
                                        <div className="text-[8px] text-slate-500 uppercase font-black">{el}</div>
                                        <div className="text-xs font-mono font-bold text-slate-300">{s[el] || 0}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                                <span className="text-[10px] text-slate-600 font-bold uppercase">View Details</span>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-700 group-hover:text-accent group-hover:translate-x-1 transition-all">
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                    <polyline points="12 5 19 12 12 19" />
                                </svg>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Comparison Tray (Bottom Overlay) */}
            {compareList.length > 0 && (
                <div className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 glass-panel border border-accent/30 p-2 pr-2 pl-4 md:pl-6 rounded-full flex items-center gap-3 md:gap-4 backdrop-blur-3xl z-50 animate-float shadow-2xl max-w-[95vw]">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="text-[10px] md:text-xs font-black text-white tracking-widest whitespace-nowrap">{compareList.length} SELECTED</div>
                        <button
                            onClick={(e) => { e.stopPropagation(); clearCompare(); }}
                            className="text-[10px] font-bold text-slate-400 hover:text-red-400 uppercase tracking-tighter transition-colors bg-white/5 px-3 py-1.5 rounded-full border border-white/10 hover:border-red-400/30"
                        >
                            Clear All
                        </button>
                    </div>
                    <div className="h-6 w-px bg-white/10"></div>
                    <button onClick={() => setView('COMPARE')} className="bg-accent text-black px-4 md:px-8 py-2.5 rounded-full font-bold text-xs md:text-sm flex items-center gap-2 hover:bg-white transition-all shadow-xl shadow-accent/20">
                        <span className="hidden sm:inline">Compare Analysis</span>
                        <span className="sm:hidden">Compare</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchView;
