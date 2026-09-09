import React, { useState, useRef, useEffect } from 'react';
import { hapticFeedback } from '../../hooks/useMobile';

const PRODUCER_SHORT = {
    'New Jersey Steel Baron': 'NJSB',
    'Myodo Metals': 'Myodo',
    'Victorinox / Outokumpu': 'Victorinox',
};

// Metallurgically honest ceilings — old UI capped every element at 10%,
// which made "stainless (Cr >= 13)" literally unreachable.
const ALLOY_SPECS = [
    { id: 'minC', el: 'C', name: 'Carbon', max: 3, step: 0.05, fmt: (v) => v.toFixed(2) },
    { id: 'minCr', el: 'Cr', name: 'Chromium', max: 21, step: 0.5, fmt: (v) => v.toFixed(1) },
    { id: 'minV', el: 'V', name: 'Vanadium', max: 10, step: 0.5, fmt: (v) => v.toFixed(1) },
];

const PRESETS = [
    { label: 'High Carbon', patch: { minC: 1.0 } },
    { label: 'Stainless', patch: { minCr: 13 } },
    { label: 'Vanadium-Rich', patch: { minV: 2.0 } },
];

const IDLE_CHIP = 'flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-[10px] font-mono font-medium uppercase tracking-[0.2em] text-stone-400 hover:text-stone-200 hover:border-white/20 transition-all duration-300 ease-snap shrink-0 whitespace-nowrap active:scale-95';
const ACTIVE_CHIP = 'flex items-center gap-2 px-3.5 py-2 rounded-lg bg-accent/10 border border-accent/30 text-[10px] font-mono font-medium uppercase tracking-[0.2em] text-accent transition-all duration-300 ease-snap shrink-0 whitespace-nowrap active:scale-95';

const CriterionRow = ({ spec, filters, setFilters }) => {
    const value = filters[spec.id] || 0;
    const step = (dir) => {
        const next = Math.min(spec.max, Math.max(0, +(value + dir * spec.step).toFixed(2)));
        hapticFeedback('light');
        setFilters({ ...filters, [spec.id]: next });
    };
    return (
        <div>
            <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 grid place-items-center bg-white/5 border border-white/10 rounded-md text-[9px] font-mono font-bold text-stone-400 shrink-0">{spec.el}</span>
                    <span className="text-[10px] font-mono font-medium uppercase tracking-[0.2em] text-stone-500">{spec.name} Min.</span>
                </div>
                <span className="text-sm font-mono font-semibold text-accent">{spec.fmt(value)}%</span>
            </div>
            <div className="flex items-center gap-3">
                <button onClick={() => step(-1)} aria-label={`Decrease ${spec.name}`} className="w-7 h-7 grid place-items-center rounded-md bg-white/[0.04] border border-white/10 text-xs font-mono text-stone-400 hover:text-accent hover:border-accent/30 transition-all active:scale-90 shrink-0">−</button>
                <input
                    type="range"
                    min="0"
                    max={spec.max}
                    step={spec.step}
                    value={value}
                    onChange={(e) => setFilters({ ...filters, [spec.id]: parseFloat(e.target.value) })}
                    className="forge-range flex-1"
                    style={{ '--fill': `${(value / spec.max) * 100}%` }}
                />
                <button onClick={() => step(1)} aria-label={`Increase ${spec.name}`} className="w-7 h-7 grid place-items-center rounded-md bg-white/[0.04] border border-white/10 text-xs font-mono text-stone-400 hover:text-accent hover:border-accent/30 transition-all active:scale-90 shrink-0">+</button>
            </div>
        </div>
    );
};

const GradeFilterBar = ({
    producers = [],
    activeProducer,
    setActiveProducer,
    filters,
    setFilters,
    pmOnly,
    setPmOnly,
    producerCounts = {},
    total = 0,
    shown = 0,
    onClear
}) => {
    const [openPanel, setOpenPanel] = useState(null);
    const barRef = useRef(null);

    useEffect(() => {
        if (!openPanel) return undefined;
        const onDocClick = (e) => {
            if (barRef.current && !barRef.current.contains(e.target)) setOpenPanel(null);
        };
        document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, [openPanel]);

    const compActive = filters && (filters.minC > 0 || filters.minCr > 0 || filters.minV > 0);
    const isActive = (activeProducer && activeProducer !== 'ALL') || pmOnly || compActive;
    const realProducers = producers.filter(p => p !== 'ALL');

    const compSummary = compActive
        ? ALLOY_SPECS.filter(spec => filters[spec.id] > 0).map(spec => `${spec.el}${spec.fmt(filters[spec.id])}`).join(' · ')
        : '';

    const pickProducer = (p) => {
        hapticFeedback('light');
        setActiveProducer(p);
        setOpenPanel(null);
    };

    return (
        <div ref={barRef} className="relative flex flex-wrap items-center gap-2 min-w-0">
            <button
                onClick={() => { hapticFeedback('light'); setOpenPanel(openPanel === 'producer' ? null : 'producer'); }}
                aria-expanded={openPanel === 'producer'}
                title="Filter by producer"
                className={activeProducer && activeProducer !== 'ALL' ? ACTIVE_CHIP : IDLE_CHIP}
            >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                <span className="hidden sm:inline max-w-[7rem] truncate">{activeProducer && activeProducer !== 'ALL' ? (PRODUCER_SHORT[activeProducer] ?? activeProducer) : 'Producer'}</span>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={`hidden sm:block shrink-0 transition-transform duration-300 ${openPanel === 'producer' ? 'rotate-180' : ''}`}>
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </button>

            <button
                onClick={() => { hapticFeedback('light'); setOpenPanel(openPanel === 'composition' ? null : 'composition'); }}
                aria-expanded={openPanel === 'composition'}
                title="Filter by composition"
                className={compActive ? ACTIVE_CHIP : IDLE_CHIP}
            >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0">
                    <path d="M3 5v14M8 5v14M13 5v14M18 9v6M21 9v6" />
                </svg>
                <span className="hidden sm:inline max-w-[9rem] truncate">{compActive ? compSummary : 'Composition'}</span>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={`hidden sm:block shrink-0 transition-transform duration-300 ${openPanel === 'composition' ? 'rotate-180' : ''}`}>
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </button>

            <button
                onClick={() => { hapticFeedback('medium'); setPmOnly(!pmOnly); }}
                aria-pressed={pmOnly}
                title="Powder-metallurgy steels only"
                className={pmOnly ? ACTIVE_CHIP : IDLE_CHIP}
            >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${pmOnly ? 'bg-accent shadow-ember-sm' : 'bg-stone-600'}`} />
                <span className="hidden sm:inline">PM Route</span>
            </button>

            {isActive && onClear && (
                <button
                    onClick={() => { hapticFeedback('light'); onClear(); setOpenPanel(null); }}
                    title="Clear all criteria"
                    className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-[10px] font-mono font-medium uppercase tracking-[0.2em] text-stone-500 hover:text-accent transition-colors duration-300 shrink-0 whitespace-nowrap"
                >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    <span className="hidden sm:inline">Clear</span>
                </button>
            )}

            <div className="hidden xl:flex items-baseline gap-1.5 pl-2 shrink-0">
                <span className="text-sm font-mono font-semibold text-white">{shown}</span>
                <span className="text-[9px] font-mono text-stone-600">/ {total} GRADES</span>
            </div>

            {openPanel === 'producer' && (
                <div className="absolute right-0 top-full mt-2.5 w-80 max-w-[calc(100vw-2rem)] glass-strong border border-white/10 rounded-2xl overflow-hidden shadow-plate-lg z-40 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
                        <span className="text-[9px] font-mono font-medium text-stone-500 uppercase tracking-[0.25em]">Producer Index</span>
                        <span className="text-[9px] font-mono text-stone-700">{realProducers.length} Mills</span>
                    </div>
                    <div className="max-h-72 overflow-y-auto custom-scrollbar py-1">
                        <button
                            onClick={() => pickProducer('ALL')}
                            className={`w-full flex items-center gap-3 px-5 py-2.5 text-left border-l-2 transition-all duration-200 ${activeProducer === 'ALL' ? 'border-accent bg-accent/[0.06]' : 'border-transparent hover:bg-white/[0.04]'}`}
                        >
                            <span className={`text-[9px] font-mono w-5 shrink-0 ${activeProducer === 'ALL' ? 'text-accent' : 'text-stone-700'}`}>00</span>
                            <span className={`flex-1 truncate text-xs font-bold ${activeProducer === 'ALL' ? 'text-bone' : 'text-stone-400'}`}>All Producers</span>
                            <span className="text-[9px] font-mono text-stone-600 shrink-0">{total}</span>
                        </button>
                        {realProducers.map((p, i) => {
                            const active = activeProducer === p;
                            return (
                                <button
                                    key={p}
                                    onClick={() => pickProducer(p)}
                                    className={`w-full flex items-center gap-3 px-5 py-2.5 text-left border-l-2 transition-all duration-200 ${active ? 'border-accent bg-accent/[0.06]' : 'border-transparent hover:bg-white/[0.04]'}`}
                                >
                                    <span className={`text-[9px] font-mono w-5 shrink-0 ${active ? 'text-accent' : 'text-stone-700'}`}>{String(i + 1).padStart(2, '0')}</span>
                                    <span className={`flex-1 truncate text-xs font-bold ${active ? 'text-bone' : 'text-stone-400'}`}>{PRODUCER_SHORT[p] ?? p}</span>
                                    <span className="text-[9px] font-mono text-stone-600 shrink-0">{producerCounts[p] ?? 0}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {openPanel === 'composition' && (
                <div className="absolute right-0 top-full mt-2.5 w-80 max-w-[calc(100vw-2rem)] glass-strong border border-white/10 rounded-2xl shadow-plate-lg z-40 p-5 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between mb-5">
                        <span className="text-[9px] font-mono font-medium text-stone-500 uppercase tracking-[0.25em]">Composition Floor</span>
                        {compActive && (
                            <button
                                onClick={() => { hapticFeedback('light'); setFilters({ minC: 0, minCr: 0, minV: 0 }); }}
                                className="text-[9px] font-mono font-medium uppercase tracking-[0.2em] text-accent hover:underline"
                            >
                                Reset
                            </button>
                        )}
                    </div>
                    <div className="space-y-5">
                        {ALLOY_SPECS.map(spec => (
                            <CriterionRow key={spec.id} spec={spec} filters={filters} setFilters={setFilters} />
                        ))}
                        <div className="pt-3 mt-1 border-t border-white/[0.06] flex flex-wrap gap-2">
                            {PRESETS.map(pr => (
                                <button
                                    key={pr.label}
                                    onClick={() => { hapticFeedback('light'); setFilters({ ...filters, ...pr.patch }); }}
                                    className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-[9px] font-mono font-medium uppercase tracking-[0.2em] text-stone-400 hover:text-accent hover:border-accent/30 transition-all duration-300"
                                >
                                    {pr.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GradeFilterBar;
