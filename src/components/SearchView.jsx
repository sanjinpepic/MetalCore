import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useMobile } from '../hooks/useMobile';
import Footer from './Footer';
import ViewHeader from './Common/ViewHeader';

import { hapticFeedback } from '../hooks/useMobile';

const SteelCard = ({ s, isSelected, toggleCompare, setDetailSteel }) => {
    const { isMobile } = useMobile();

    return (
        <motion.div
            onClick={() => { hapticFeedback('light'); setDetailSteel(s); }}
            className={`glass-panel rounded-2xl md:rounded-3xl p-6 md:p-8 cursor-pointer border hover:border-white/20 active:scale-[0.98] relative group ${isSelected ? 'border-accent bg-accent/5' : 'border-white/5'}`}
        >
            <div className="flex justify-between items-start mb-4 md:mb-6">
                <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-1.5 opacity-80">{s.producer}</div>
                    <h3 className="text-lg md:text-2xl font-display font-black text-white italic tracking-tight uppercase leading-none truncate">{s.name}</h3>
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); toggleCompare(s, e); }}
                    className={`p-2 rounded-xl border transition-all flex items-center justify-center w-9 h-9 shrink-0 ${isSelected ? 'bg-accent text-black border-accent shadow-lg shadow-accent/20' : 'bg-white/5 text-slate-500 border-white/10 hover:text-accent'}`}
                >
                    {isSelected ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                    )}
                </button>
            </div>
            <p className="text-xs md:text-sm text-slate-400 line-clamp-1 mt-1 font-medium opacity-80 group-hover:opacity-100 transition-opacity italic">{s.desc}</p>
            <div className="grid grid-cols-3 gap-px bg-white/5 rounded-xl overflow-hidden group-hover:bg-accent/10 transition-colors">
                {['C', 'Cr', 'V', 'Mo', 'W', 'Co'].map(el => (
                    <div key={el} className="bg-black/90 p-3 text-center">
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
        </motion.div>
    );
};

const SearchView = ({ search, setSearch, filteredSteels, compareList, toggleCompare, clearCompare, setDetailSteel, setView, resetFilters }) => {
    const groupedSteels = useMemo(() => {
        const groups = {};
        for (const s of filteredSteels) {
            const producer = s.parent || s.producer || 'Other';
            if (!groups[producer]) groups[producer] = [];
            groups[producer].push(s);
        }
        return groups;
    }, [filteredSteels]);

    return (
        <div className="flex flex-col flex-1 min-w-0 md:h-full md:overflow-y-auto custom-scrollbar bg-transparent pb-40 md:pb-0">
            {/* View-wide background glow */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none" />

            <ViewHeader
                subtitle="Grade Library"
                title="Alloy"
                highlight="Database"
                color="amber"
            >
                <p className="text-slate-500 max-w-2xl text-xs md:text-lg leading-relaxed mt-2 md:mt-4 italic font-medium hidden md:block">
                    Comprehensive database of premium knife & tool steels. Filter by alloy content or search by grade.
                </p>
            </ViewHeader>


            {/* Search Bar */}
            <div className="sticky top-0 z-30 bg-transparent backdrop-blur-2xl px-4 md:px-12 py-3 md:py-4 flex justify-end items-center transition-all">
                <div className="relative w-full md:w-64">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600">
                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search steels by name or producer..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-6 text-white text-xs focus:outline-none focus:border-accent/40 transition-colors"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="p-6 md:p-12 pb-32 space-y-10 md:space-y-16">
                {Object.entries(groupedSteels).sort(([a], [b]) => {
                    if (a === 'Various') return 1;
                    if (b === 'Various') return -1;
                    return a.localeCompare(b);
                }).map(([producer, steels]) => (
                    <section key={producer}>
                        <div className="sticky top-[3.75rem] md:top-[4.25rem] z-[5] -mx-6 px-6 md:-mx-12 md:px-12 py-3 mb-4 md:mb-6 bg-black/60 backdrop-blur-md border-b border-white/5 flex items-center justify-between transition-all">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                                <h2 className="text-xs md:text-sm font-black text-slate-400 uppercase tracking-[0.2em] italic">{producer}</h2>
                                <div className="flex-1 h-px bg-white/5"></div>
                                <span className="text-[10px] font-bold text-slate-600">{steels.length} {steels.length === 1 ? 'grade' : 'grades'}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 items-start">
                            {steels.map(s => (
                                <SteelCard
                                    key={s.id}
                                    s={s}
                                    isSelected={compareList.find(i => i.id === s.id)}
                                    toggleCompare={toggleCompare}
                                    setDetailSteel={setDetailSteel}
                                />
                            ))}
                        </div>
                    </section>
                ))}
            </div>

            {/* Comparison Tray (Bottom Overlay) */}
            {compareList.length > 0 && (
                <div className="fixed bottom-24 md:bottom-10 left-1/2 -translate-x-1/2 glass-panel border border-accent/40 p-3 md:p-3 pr-3 md:pr-3 pl-6 md:pl-10 rounded-full flex items-center gap-4 md:gap-8 backdrop-blur-3xl z-[90] animate-in slide-in-from-bottom-10 duration-500 shadow-[0_20px_50px_rgba(245,158,11,0.2)] ring-1 ring-white/10">
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
            <Footer />
        </div>
    );
};

export default SearchView;
