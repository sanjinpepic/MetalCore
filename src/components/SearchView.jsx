import React from 'react';

const SearchView = ({ search, setSearch, filteredSteels, compareList, toggleCompare, clearCompare, setDetailSteel, setView }) => {
    return (
        <div className="flex flex-col flex-1 min-w-0 h-screen overflow-y-auto custom-scrollbar">
            <header className="p-6 md:p-12 pb-6 md:pb-8 pt-24 md:pt-12 space-y-4 md:space-y-6 shrink-0">
                <div>
                    <h1 className="text-2xl md:text-5xl font-display font-black text-white tracking-tighter mb-3 md:mb-4 italic uppercase leading-none">GRADE LIBRARY</h1>
                    <p className="text-slate-500 max-w-2xl text-sm md:text-lg leading-relaxed">Comprehensive database of premium knife steels. Filter by alloy content or search by grade.</p>
                </div>
            </header>

            <div className="sticky top-0 z-20 px-6 md:px-12 py-4 bg-black/95 backdrop-blur-md border-b border-white/5">
                <div className="relative bg-white/5 border border-white/10 rounded-xl md:rounded-2xl flex items-center px-4 py-3 md:py-4 group focus-within:border-accent/50 transition-all max-w-2xl">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-500 mr-3 group-focus-within:text-accent transition-colors">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                    <input type="text" placeholder="Search grades..." className="w-full bg-transparent border-none text-white outline-none h-10 text-sm md:text-base" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
            </div>

            <div className="p-6 md:p-8 pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 pb-32 items-start">
                {filteredSteels.map(s => {
                    const isSelected = compareList.find(i => i.id === s.id);
                    return (
                        <div key={s.id} onClick={() => setDetailSteel(s)} className={`glass-panel rounded-2xl md:rounded-3xl p-6 md:p-8 cursor-pointer border transition-all hover:border-white/20 active:scale-[0.98] relative group ${isSelected ? 'border-accent bg-accent/5' : 'border-white/5'}`}>
                            <div className="flex justify-between items-start mb-4 md:mb-6">
                                <div className="min-w-0">
                                    <div className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">{s.producer}</div>
                                    <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-accent transition-colors leading-tight truncate uppercase tracking-tight italic">{s.name}</h3>
                                    <p className="text-xs md:text-sm text-slate-400 line-clamp-1 mt-2 font-medium opacity-80 group-hover:opacity-100 transition-opacity italic">{s.desc}</p>
                                </div>
                                <div className={`p-2.5 rounded-full transition-all shrink-0 ${isSelected ? 'bg-accent text-black scale-110 shadow-lg shadow-accent/40' : 'bg-white/5 text-slate-500 hover:text-white hover:bg-white/10'}`}
                                    onClick={(e) => { e.stopPropagation(); toggleCompare(s); }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                                        <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                                        <path d="M7 21h10" />
                                        <path d="M12 3v18" />
                                        <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
                                    </svg>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 md:gap-3">
                                {['C', 'Cr', 'V', 'Mo', 'W', 'Co'].map(el => (
                                    <div key={el} className="bg-black/40 rounded-xl p-3 text-center border border-white/5 group-hover:border-accent/10 transition-colors">
                                        <div className="text-[9px] text-slate-500 uppercase font-black mb-1.5">{el}</div>
                                        <div className="text-xs md:text-sm font-mono font-bold text-slate-300">{s[el] || 0}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between">
                                <span className="text-xs text-slate-600 font-bold uppercase tracking-widest">View Details</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-700 group-hover:text-accent group-hover:translate-x-1 transition-all">
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
                <div className="fixed bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 glass-panel border border-accent/40 p-3 md:p-3 pr-3 md:pr-3 pl-6 md:pl-10 rounded-full flex items-center gap-4 md:gap-8 backdrop-blur-3xl z-[90] animate-in slide-in-from-bottom-10 duration-500 shadow-[0_20px_50px_rgba(245,158,11,0.2)] ring-1 ring-white/10">
                    <div className="flex items-center gap-4 md:gap-6">
                        <div className="flex flex-col">
                            <div className="text-sm md:text-base font-black text-white tracking-[0.2em] whitespace-nowrap leading-none mb-1">{compareList.length} <span className="hidden xs:inline">GRADES</span></div>
                            <div className="text-[9px] font-bold text-accent/60 uppercase tracking-widest hidden xs:block">Workbench Active</div>
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); clearCompare(); }}
                            className="text-xs font-bold text-slate-500 hover:text-red-400 uppercase tracking-tighter transition-colors bg-white/5 px-2.5 md:px-3 py-1.5 rounded-full border border-white/5 hover:border-red-400/20"
                        >
                            Reset
                        </button>
                    </div>
                    <div className="h-8 w-px bg-white/10"></div>
                    <button onClick={() => setView('COMPARE')} className="bg-white text-black px-6 md:px-10 py-3.5 md:py-4 rounded-full font-bold text-sm md:text-base flex items-center gap-3 hover:bg-accent transition-all shadow-xl shadow-white/5 active:scale-95 group">
                        <span className="hidden sm:inline">Launch Analysis</span>
                        <span className="sm:hidden uppercase tracking-widest">Launch</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform">
                            <path d="M5 12h14" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchView;
