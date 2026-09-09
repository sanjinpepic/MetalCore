import React, { useMemo, useState, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import HeatTreatChart from './HeatTreatChart';
import PerformanceRadar from './PerformanceRadar';
import Footer from './Footer';
import ViewHeader from './Common/ViewHeader';


const CompareView = ({ items, setView, toggleCompare, clearCompare, generateReport, isAiLoading, savedComparisons = [], onSaveComparison, onLoadComparison, onDeleteComparison }) => {
    const [copied, setCopied] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveName, setSaveName] = useState('');

    const shareComparison = useCallback(() => {
        const steelNames = items.map(s => encodeURIComponent(s.name)).join(',');
        const url = `${window.location.origin}${window.location.pathname}?view=COMPARE&steels=${steelNames}`;
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(() => {
            prompt('Copy this link:', url);
        });
    }, [items]);

    // Transform data for Composition Bar Chart (Elements on X-axis)
    // Expected format: [{ element: 'C', SteelA: 1.5, SteelB: 0.8 }, ...]
    const compositionData = useMemo(() => {
        if (!items || items.length === 0) return [];
        // Include N/Nb only when at least one compared steel carries them
        const elements = ['C', 'Cr', 'V', 'Mo', 'W', 'Co'];
        if (items.some(item => item.N > 0)) elements.push('N');
        if (items.some(item => item.Nb > 0)) elements.push('Nb');

        return elements.map(el => {
            const point = { element: el };
            items.forEach(item => {
                point[item.id] = item[el] || 0;
            });
            return point;
        });
    }, [items]);



    const colors = ['#FFD9A8', '#FF9D62', '#FF5A1F', '#C53A0C'];

    // Datasheet matrix: element rows
    const matrixElements = useMemo(() => {
        if (!items || items.length === 0) return [];
        const els = ['C', 'Cr', 'V', 'Mo', 'W', 'Co'];
        if (items.some(item => item.N > 0)) els.push('N');
        if (items.some(item => item.Nb > 0)) els.push('Nb');
        return els;
    }, [items]);

    // Datasheet matrix: performance rows
    const perfSpecs = [
        { key: 'edge', label: 'Edge Retention' },
        { key: 'toughness', label: 'Toughness' },
        { key: 'corrosion', label: 'Corrosion Res.' },
        { key: 'sharpen', label: 'Ease of Sharpening' }
    ];

    if (!items || items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] md:h-full bg-[#0B0A08] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-accent/10 to-transparent pointer-events-none" />
                <div className="relative text-center px-6">
                    <div className="text-[10px] font-mono font-medium text-accent uppercase tracking-[0.3em] mb-6 flex items-center justify-center gap-3">
                        <span className="inline-block w-8 h-px bg-accent/50" />
                        00 — Workbench
                        <span className="inline-block w-8 h-px bg-accent/50" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-display text-white uppercase tracking-tight leading-[0.95] mb-5">
                        Nothing<br />On The Bench
                    </h2>
                    <p className="text-stone-500 text-xs md:text-sm font-mono font-medium uppercase tracking-[0.2em] mb-10 max-w-md mx-auto leading-relaxed">
                        Pull grades from the library to open a comparative analysis
                    </p>
                    <button onClick={() => setView('SEARCH')} className="px-8 py-4 bg-accent text-[#1A0C05] rounded-full text-xs font-mono font-medium uppercase tracking-[0.25em] transition-all duration-300 ease-snap shadow-ember-sm hover:shadow-ember active:scale-95">
                        Open Grade Library
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col flex-1 min-w-0 md:h-full md:overflow-y-auto custom-scrollbar bg-transparent relative pb-40 md:pb-0">
            {/* View-wide background glow */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-accent/10 to-transparent pointer-events-none" />

            <ViewHeader
                subtitle="Analysis"
                title="Side-by-Side"
                highlight="Comparison"
                color="cyan"
                className="sticky top-0 bg-stone-950/90 backdrop-blur-xl z-[90] border-b border-white/10"
            >
                <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-12 flex items-center gap-3">
                    <button onClick={() => setView('SEARCH')} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-stone-400 hover:text-white transition-all duration-300 ease-snap border border-white/5 group">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:-translate-x-1 transition-transform">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                    </button>
                </div>

                <div className="absolute top-1/2 -translate-y-1/2 right-4 md:right-12 flex items-center gap-3">
                    {saving ? (
                        <div className="flex items-center gap-2">
                            <input
                                autoFocus
                                type="text"
                                value={saveName}
                                onChange={e => setSaveName(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter' && saveName.trim()) { onSaveComparison(saveName.trim()); setSaving(false); setSaveName(''); } if (e.key === 'Escape') { setSaving(false); setSaveName(''); } }}
                                placeholder="Name this set..."
                                className="bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-accent/50 w-44"
                            />
                            <button
                                onClick={() => { if (saveName.trim()) { onSaveComparison(saveName.trim()); setSaving(false); setSaveName(''); } }}
                                className="p-2.5 bg-accent text-[#1A0C05] rounded-xl font-bold text-xs transition-all duration-300 ease-snap hover:bg-accent/80 disabled:opacity-40"
                                disabled={!saveName.trim()}
                            >Save</button>
                            <button onClick={() => { setSaving(false); setSaveName(''); }} className="p-2.5 bg-white/5 text-stone-400 rounded-xl hover:bg-white/10 transition-all duration-300 ease-snap">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setSaving(true)}
                            className="p-3 md:px-6 md:py-4 bg-white/5 hover:bg-accent/10 text-stone-500 hover:text-accent border border-white/10 rounded-xl md:rounded-2xl transition-all duration-300 ease-snap"
                            title="Save Comparison"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
                            </svg>
                        </button>
                    )}
                    <button
                        onClick={shareComparison}
                        className="p-3 md:px-6 md:py-4 bg-white/5 hover:bg-accent/10 text-stone-500 hover:text-accent border border-white/10 rounded-xl md:rounded-2xl transition-all duration-300 ease-snap"
                        title="Share Comparison"
                    >
                        {copied ? (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-400">
                                <path d="M20 6 9 17l-5-5" />
                            </svg>
                        ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                                <polyline points="16 6 12 2 8 6" />
                                <line x1="12" y1="2" x2="12" y2="15" />
                            </svg>
                        )}
                    </button>

                    <button
                        onClick={() => { clearCompare(); setView('SEARCH'); }}
                        className="p-3 md:px-6 md:py-4 bg-white/5 hover:bg-red-500/10 text-stone-500 hover:text-red-400 border border-white/10 rounded-xl md:rounded-2xl transition-all duration-300 ease-snap"
                        title="Clear All"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                    </button>
                </div>
            </ViewHeader>


            <div className="p-6 md:p-12 space-y-12">
                {/* Specification Matrix */}
                <section className="glass-panel rounded-3xl border border-white/10 shadow-plate-lg overflow-hidden">
                    <div className="overflow-x-auto no-scrollbar">
                        <div
                            className="min-w-[42rem]"
                            style={{ display: 'grid', gridTemplateColumns: `minmax(8.5rem, 11rem) repeat(${items.length}, minmax(9.5rem, 1fr))` }}
                        >
                            {/* Column headers */}
                            <div className="px-5 md:px-7 pt-9 pb-7 flex items-end">
                                <div>
                                    <div className="text-[9px] font-mono font-medium text-stone-600 uppercase tracking-[0.25em] mb-1">Reference</div>
                                    <div className="text-lg md:text-xl font-display text-stone-400 uppercase tracking-tight leading-none">Spec Sheet</div>
                                </div>
                            </div>
                            {items.map((s, i) => (
                                <div key={s.id} className="relative border-l border-white/5 px-5 md:px-7 pt-9 pb-7 group/col">
                                    <span className="absolute top-0 inset-x-0 h-[3px]" style={{ backgroundColor: colors[i % colors.length] }} />
                                    <button onClick={() => toggleCompare(s)} title={`Remove ${s.name}`} className="absolute top-4 right-3 p-1.5 text-stone-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-300 ease-snap z-10">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                    </button>
                                    <div className="text-[9px] font-mono font-medium text-stone-600 uppercase tracking-[0.2em] mb-2.5 truncate pr-6">{s.producer}</div>
                                    <h3 className="text-lg md:text-2xl font-display text-white uppercase tracking-tight leading-none truncate pr-4">{s.name}</h3>
                                </div>
                            ))}

                            {/* Composition rows */}
                            {matrixElements.map(el => {
                                const max = Math.max(...items.map(s => s[el] || 0));
                                return (
                                    <React.Fragment key={el}>
                                        <div className="px-5 md:px-7 py-4 border-t border-white/5 flex items-center">
                                            <span className="text-[10px] md:text-xs font-mono font-semibold text-stone-500 uppercase tracking-[0.25em]">{el}</span>
                                        </div>
                                        {items.map((s, i) => (
                                            <div key={s.id} className="border-l border-t border-white/5 px-5 md:px-7 py-4">
                                                <div className="flex items-baseline justify-between gap-2">
                                                    <span className="font-mono text-sm md:text-base font-semibold text-stone-200">{s[el] || 0}</span>
                                                </div>
                                                <div className="mt-2 h-[3px] bg-white/[0.07] rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full origin-left transition-all duration-700 ease-out-expo"
                                                        style={{
                                                            width: `${max > 0 ? ((s[el] || 0) / max) * 100 : 0}%`,
                                                            backgroundColor: colors[i % colors.length],
                                                            opacity: max > 0 ? 0.85 : 0
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </React.Fragment>
                                );
                            })}

                            {/* Performance rows */}
                            {perfSpecs.map(spec => {
                                const max = Math.max(...items.map(s => s[spec.key] || 0));
                                return (
                                    <React.Fragment key={spec.key}>
                                        <div className="px-5 md:px-7 py-4 border-t border-white/[0.08] bg-white/[0.02] flex items-center">
                                            <span className="text-[9px] md:text-[10px] font-mono font-semibold text-stone-400 uppercase tracking-[0.2em] leading-snug">{spec.label}</span>
                                        </div>
                                        {items.map(s => {
                                            const v = s[spec.key] || 0;
                                            const isBest = items.length > 1 && max > 0 && v === max;
                                            return (
                                                <div key={s.id} className="border-l border-t border-white/[0.08] bg-white/[0.02] px-5 md:px-7 py-4">
                                                    <div className="flex items-baseline justify-between gap-2">
                                                        <span className={`font-mono text-sm md:text-base font-bold ${isBest ? 'text-accent' : 'text-stone-200'}`}>{v}</span>
                                                        {isBest && <span className="text-[7px] font-mono font-medium text-accent/70 tracking-[0.25em]">BEST</span>}
                                                    </div>
                                                    <div className="mt-2 h-[3px] bg-white/[0.07] rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full origin-left transition-all duration-700 ease-out-expo"
                                                            style={{
                                                                width: `${(v / 10) * 100}%`,
                                                                backgroundColor: isBest ? '#FF5A1F' : 'rgba(237,233,226,0.25)'
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 pb-20">
                    {/* Radar Chart */}
                    <PerformanceRadar items={items} colors={colors} />

                    {/* Bar Chart (Composition) */}
                    <div className="glass-panel p-6 md:p-10 rounded-3xl border-white/10 bg-black/40 shadow-plate-lg">
                        <h3 className="text-lg font-display text-white mb-8 uppercase tracking-widest flex items-center gap-3">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-accent">
                                <path d="M3 3v18h18" />
                                <path d="m19 9-5 5-4-4-3 3" />
                            </svg>
                            Composition Analysis
                        </h3>
                        <div className="h-[450px] md:h-[550px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={compositionData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                                    <XAxis dataKey="element" stroke="rgba(237,233,226,0.2)" tick={{ fill: 'rgba(237,233,226,0.4)', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }} dy={10} />
                                    <YAxis stroke="rgba(237,233,226,0.2)" tick={{ fill: 'rgba(237,233,226,0.4)', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        contentStyle={{ backgroundColor: '#12100D', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '1rem', padding: '1rem' }}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: '40px', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace' }} />
                                    {items.map((s, i) => (
                                        <Bar
                                            key={s.id}
                                            dataKey={s.id}
                                            name={s.name}
                                            fill={colors[i % colors.length]}
                                            radius={[6, 6, 0, 0]}
                                        />
                                    ))}
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>


                    {/* Line Chart (Heat Treatment) */}
                    <div className="col-span-1 lg:col-span-2">
                        <HeatTreatChart items={items} colors={colors} />
                    </div>
                </div>
            </div>

            {savedComparisons.length > 0 && (
                <div className="px-6 md:px-12 pb-12">
                    <h3 className="text-xs font-mono font-medium text-stone-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2.5">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
                        </svg>
                        Saved Comparisons
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {savedComparisons.map(comp => (
                            <div key={comp.id} className="flex items-center gap-0 rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                                <button
                                    onClick={() => onLoadComparison(comp)}
                                    className="px-4 py-3 text-xs font-bold text-stone-300 hover:text-white hover:bg-white/5 transition-all duration-300 ease-snap flex items-center gap-2.5"
                                >
                                    <span className="text-stone-500 font-mono">{comp.steelIds.length}×</span>
                                    {comp.name}
                                </button>
                                <button
                                    onClick={() => onDeleteComparison(comp.id)}
                                    className="px-3 py-3 text-stone-600 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300 ease-snap border-l border-white/5"
                                >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default CompareView;
