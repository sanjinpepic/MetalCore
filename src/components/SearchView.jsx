import React, { useMemo } from 'react';
import Footer from './Footer';
import ViewHeader from './Common/ViewHeader';

import { hapticFeedback } from '../hooks/useMobile';

const ELEMENTS = ['C', 'Cr', 'V', 'Mo', 'W', 'Co', 'N', 'Nb'];

const PerfMicro = ({ label, value }) => (
    <div className="flex flex-col gap-1.5 w-14 shrink-0">
        <span className="text-[8px] font-mono font-medium text-stone-600 uppercase tracking-[0.2em]">{label}</span>
        <div className="flex items-center gap-2">
            <div className="w-9 h-[3px] bg-white/10 rounded-full overflow-hidden shrink-0">
                <div className="h-full bg-accent/80 rounded-full" style={{ width: `${((value ?? 0) / 10) * 100}%` }} />
            </div>
            <span className="text-[10px] font-mono font-semibold text-stone-300">{value ?? '—'}</span>
        </div>
    </div>
);

const LedgerHeader = () => (
    <div className="hidden md:flex items-center gap-6 px-8 pb-3 border-b border-white/10 text-[9px] font-mono font-medium text-stone-600 uppercase tracking-[0.25em]">
        <span className="w-8 shrink-0">No.</span>
        <span className="w-48 shrink-0">Grade</span>
        <span className="flex-1">Composition</span>
        <span className="hidden xl:block w-[13rem] shrink-0">Performance</span>
        <span className="w-28 shrink-0 text-right">Workbench</span>
    </div>
);

const LedgerRow = ({ s, index, isSelected, toggleCompare, setDetailSteel }) => (
    <div
        onClick={() => { hapticFeedback('light'); setDetailSteel(s); }}
        className={`group relative flex items-center gap-4 md:gap-6 px-4 md:px-8 py-4 md:py-5 cursor-pointer border-b border-white/[0.04] transition-colors duration-300 ease-snap ${isSelected ? 'bg-accent/[0.05]' : 'hover:bg-white/[0.025]'}`}
    >
        <span className={`absolute left-0 top-0 h-full w-[2px] bg-accent origin-top transition-transform duration-500 ease-snap ${isSelected ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-100'}`} />
        <span className={`hidden md:block w-8 shrink-0 text-[10px] font-mono font-medium transition-colors duration-300 ${isSelected ? 'text-accent' : 'text-stone-700 group-hover:text-stone-500'}`}>
            {String(index + 1).padStart(3, '0')}
        </span>
        <div className="w-32 sm:w-40 md:w-48 shrink-0 min-w-0">
            <h3 className={`text-base md:text-lg font-display uppercase tracking-tight truncate leading-tight transition-colors duration-300 ${isSelected ? 'text-accent' : 'text-white group-hover:text-accent'}`}>{s.name}</h3>
            <div className="text-[8px] md:text-[9px] font-mono font-medium text-stone-600 uppercase tracking-[0.2em] mt-1 truncate">
                {(Array.isArray(s.parent) ? s.parent[0] : s.parent) || s.producer}
            </div>
        </div>
        <div className="hidden md:flex flex-1 items-center gap-x-4 gap-y-1 flex-wrap font-mono text-[11px] min-w-0">
            {ELEMENTS.filter(el => s[el] > 0).map(el => (
                <span key={el} className="whitespace-nowrap">
                    <span className="text-stone-600 mr-1">{el}</span>
                    <span className="text-stone-300 font-semibold">{s[el]}</span>
                </span>
            ))}
            {s.pm !== undefined && (
                <span className={`px-2 py-0.5 text-[8px] font-mono font-medium uppercase tracking-[0.2em] border rounded-full shrink-0 ${s.pm ? 'text-accent border-accent/30 bg-accent/5' : 'text-stone-600 border-white/10'}`}>
                    {s.pm ? 'PM' : 'CONV'}
                </span>
            )}
        </div>
        <div className="hidden xl:flex items-center gap-5 shrink-0">
            <PerfMicro label="Edge" value={s.edge} />
            <PerfMicro label="Tough" value={s.toughness} />
            <PerfMicro label="Rust" value={s.corrosion} />
        </div>
        <div className="ml-auto md:ml-0 shrink-0 flex items-center gap-3 pl-2">
            <span className="hidden sm:block text-[9px] font-mono font-medium text-stone-600 uppercase tracking-[0.25em] opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Open</span>
            <div
                onClick={(e) => { e.stopPropagation(); hapticFeedback('medium'); toggleCompare(s); }}
                className={`p-2.5 rounded-full transition-all duration-300 ease-snap shrink-0 ${isSelected ? 'bg-accent text-[#1A0C05] shadow-ember-sm' : 'bg-white/5 text-stone-500 hover:text-white hover:bg-white/10'}`}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                    <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                    <path d="M7 21h10" />
                    <path d="M12 3v18" />
                    <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
                </svg>
            </div>
        </div>
    </div>
);

const SearchView = ({ search, setSearch, filteredSteels, compareList, toggleCompare, clearCompare, setDetailSteel, setView, resetFilters, activeProducer }) => {
    const isFiltered = activeProducer && activeProducer !== 'ALL';

    const groupedSteels = useMemo(() => {
        if (isFiltered) return null;
        const groups = {};
        for (const s of filteredSteels) {
            const parentVal = Array.isArray(s.parent) ? s.parent[0] : s.parent;
            const producer = (parentVal && parentVal.trim()) || s.producer || 'Other';
            if (!groups[producer]) groups[producer] = [];
            groups[producer].push(s);
        }
        return groups;
    }, [filteredSteels, isFiltered]);

    return (
        <div className="flex flex-col flex-1 min-w-0 min-h-dvh md:h-full md:overflow-y-auto custom-scrollbar bg-[#0B0A08]">
            {/* View-wide background glow */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-accent/10 to-transparent pointer-events-none" />

            <ViewHeader
                subtitle="Grade Library"
                title="Alloy"
                highlight="Database"
                color="amber"
            >
                <p className="text-stone-500 max-w-2xl text-xs md:text-lg leading-relaxed mt-2 md:mt-4 font-medium hidden md:block">
                    Comprehensive database of premium knife & tool steels. Filter by alloy content or search by grade.
                </p>
            </ViewHeader>

            {/* Search Bar */}
            <div className="sticky top-0 z-30 bg-transparent backdrop-blur-2xl px-4 md:px-12 py-3 md:py-4 flex justify-end items-center transition-all">
                <div className="relative w-full md:w-64">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-600">
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

            <div className="p-6 md:p-12 pt-6 md:pt-8 pb-32 space-y-10 md:space-y-16">
                {filteredSteels.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 text-center gap-6">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-stone-600">
                                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-stone-400 font-bold text-lg">No grades match your filters</p>
                            <p className="text-stone-600 text-sm mt-1">Try adjusting the alloy minimums or changing the brand filter.</p>
                        </div>
                        <button
                            onClick={resetFilters}
                            className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-sm font-bold text-stone-300 hover:bg-white/10 hover:border-accent/30 hover:text-white transition-all duration-300 ease-snap"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
                {filteredSteels.length > 0 && (
                    <div>
                        <LedgerHeader />
                        {isFiltered ? (
                            filteredSteels.map((s, i) => (
                                <LedgerRow
                                    key={s.id}
                                    s={s}
                                    index={i}
                                    isSelected={!!compareList.find(item => item.id === s.id)}
                                    toggleCompare={toggleCompare}
                                    setDetailSteel={setDetailSteel}
                                />
                            ))
                        ) : (
                            Object.entries(groupedSteels).sort(([a], [b]) => {
                                if (a === 'Various') return 1;
                                if (b === 'Various') return -1;
                                return a.localeCompare(b);
                            }).map(([producer, steels]) => (
                                <section key={producer}>
                                    <div className="sticky top-[3.75rem] md:top-[4.25rem] z-20 flex items-center gap-3 px-4 md:px-8 py-3 bg-[#0B0A08]/90 backdrop-blur-xl border-b border-white/5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0"></div>
                                        <h2 className="text-xs md:text-sm font-mono font-medium text-stone-400 uppercase tracking-[0.2em] truncate">{producer}</h2>
                                        <div className="flex-1 h-px bg-white/5"></div>
                                        <span className="text-[10px] font-mono font-medium text-stone-600 shrink-0">{steels.length} {steels.length === 1 ? 'grade' : 'grades'}</span>
                                    </div>
                                    {steels.map((s, i) => (
                                        <LedgerRow
                                            key={s.id}
                                            s={s}
                                            index={i}
                                            isSelected={!!compareList.find(item => item.id === s.id)}
                                            toggleCompare={toggleCompare}
                                            setDetailSteel={setDetailSteel}
                                        />
                                    ))}
                                </section>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Comparison Tray (Bottom Overlay) */}
            {compareList.length > 0 && (
                <div className="fixed bottom-24 md:bottom-10 left-1/2 -translate-x-1/2 glass-panel border border-accent/40 p-3 md:p-3 pr-3 md:pr-3 pl-6 md:pl-10 rounded-full flex items-center gap-4 md:gap-8 backdrop-blur-3xl z-[90] animate-in slide-in-from-bottom-10 duration-500 shadow-ember ring-1 ring-white/10">
                    <div className="flex items-center gap-4 md:gap-6">
                        <div className="flex flex-col">
                            <div className="text-sm md:text-base font-mono font-semibold text-white tracking-[0.2em] whitespace-nowrap leading-none mb-1">{compareList.length} <span className="hidden xs:inline">GRADES</span></div>
                            <div className="text-[9px] font-mono font-medium text-accent/60 uppercase tracking-[0.2em] hidden xs:block">Workbench Active</div>
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); clearCompare(); }}
                            className="text-xs font-mono font-medium text-stone-500 hover:text-red-400 uppercase tracking-tight transition-colors duration-300 ease-snap bg-white/5 px-2.5 md:px-3 py-1.5 rounded-full border border-white/5 hover:border-red-400/20"
                        >
                            Reset
                        </button>
                    </div>
                    <div className="h-8 w-px bg-white/10"></div>
                    <button onClick={() => setView('COMPARE')} className="bg-bone text-[#1A0C05] px-6 md:px-10 py-3.5 md:py-4 rounded-full font-bold text-sm md:text-base flex items-center gap-3 hover:bg-accent transition-all duration-300 ease-snap shadow-plate active:scale-95 group">
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
