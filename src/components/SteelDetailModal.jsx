import React, { useState, useCallback, useMemo } from 'react';

const COMP_KEYS = ['C', 'Cr', 'V', 'Mo', 'W', 'Co'];
const PERF_KEYS = ['edge', 'toughness', 'corrosion', 'sharpen'];
const COMP_W = { C: 2, Cr: 1.5, V: 3, Mo: 1, W: 1, Co: 0.5 };
const PERF_W = { edge: 2, toughness: 2, corrosion: 1.5, sharpen: 1 };

import HeatTreatChart from './HeatTreatChart';
import PerformanceRadar from './PerformanceRadar';
import EdgeRetentionPredictor from './EdgeRetentionPredictor';
import { useUser } from '../context/UserContext';
import BottomSheet from './BottomSheet';
import ShareCard from './ShareCard';

function findSimilar(steel, allSteels, n = 4) {
    const maxComp = {};
    COMP_KEYS.forEach(k => { maxComp[k] = Math.max(...allSteels.map(s => s[k] || 0)) || 1; });
    return allSteels
        .filter(s => s.id !== steel.id)
        .map(s => {
            let dist = 0;
            COMP_KEYS.forEach(k => { dist += COMP_W[k] * ((((s[k] || 0) - (steel[k] || 0)) / maxComp[k]) ** 2); });
            PERF_KEYS.forEach(k => { dist += PERF_W[k] * ((((s[k] || 0) - (steel[k] || 0)) / 10) ** 2); });
            return { ...s, _dist: Math.sqrt(dist) };
        })
        .sort((a, b) => a._dist - b._dist)
        .slice(0, n);
}

const SectionLabel = ({ index, title }) => (
    <div className="flex items-center gap-3 mb-5">
        <span className="text-[9px] font-mono font-semibold text-accent/70 shrink-0">{index}</span>
        <h4 className="text-[10px] md:text-xs font-mono font-medium text-stone-300 uppercase tracking-[0.3em] whitespace-nowrap">{title}</h4>
        <div className="flex-1 h-px bg-white/5" />
    </div>
);

const SteelDetailModal = ({ steel, onClose, onOpenKnife, allSteels = [], onOpenSteel }) => {
    const { favoriteSteels, toggleFavorite } = useUser();
    const isFavorite = favoriteSteels.includes(steel.id);
    const [copied, setCopied] = useState(false);
    const similarSteels = useMemo(() => allSteels.length > 1 ? findSimilar(steel, allSteels) : [], [steel, allSteels]);

    const shareSteel = useCallback(async () => {
        const url = `${window.location.origin}${window.location.pathname}?steel=${encodeURIComponent(steel.name)}`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${steel.name} | MetalCore`,
                    text: `Check out ${steel.name} on MetalCore — the knife steel database`,
                    url,
                });
            } catch (err) {
                if (err.name !== 'AbortError') {
                    navigator.clipboard.writeText(url).catch(() => prompt('Copy this link:', url));
                }
            }
        } else {
            navigator.clipboard.writeText(url).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }).catch(() => prompt('Copy this link:', url));
        }
    }, [steel.name]);

    const shareCardRef = React.useRef(null);

    const handleDownload = async (blob) => {
        const filename = `${steel.name.replace(/\s+/g, '_')}_Performance.png`;
        if (navigator.share && navigator.canShare) {
            try {
                const file = new File([blob], filename, { type: 'image/png' });
                if (navigator.canShare({ files: [file] })) {
                    await navigator.share({ title: `${steel.name} Performance Card`, files: [file] });
                    return;
                }
            } catch (err) {
                if (err.name === 'AbortError') return;
            }
        }
        // createObjectURL works on all browsers including mobile Safari
        const url = URL.createObjectURL(blob);
        try {
            const link = document.createElement('a');
            link.download = filename;
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch {
            window.open(url, '_blank');
        } finally {
            URL.revokeObjectURL(url);
        }
    };

    return (
        <BottomSheet isOpen={!!steel} onClose={onClose} label={`${steel?.name ?? 'Steel'} details`}>
            <div className="relative">
                {/* Dossier Header */}
                <header className="relative pt-2 pb-8 border-b border-white/10">
                    <div className="absolute top-1 right-0 z-10 flex items-center gap-2">
                        <button onClick={onClose} aria-label="Close details" className="w-10 h-10 flex items-center justify-center bg-black/40 hover:bg-white/10 rounded-full text-stone-400 transition-colors duration-300 ease-snap border border-white/10 backdrop-blur-3xl group">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:rotate-90 transition-transform duration-300 ease-snap">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap pr-24 mb-4">
                        <span className="text-[10px] md:text-xs font-mono font-medium text-accent uppercase tracking-[0.3em]">
                            {(Array.isArray(steel.parent) ? steel.parent[0] : steel.parent) || steel.producer}
                        </span>
                        {steel.pm !== undefined && (
                            <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-[9px] font-mono font-medium uppercase tracking-[0.25em] ${steel.pm ? 'border-accent/30 bg-accent/5 text-accent' : 'border-white/10 text-stone-500'}`}>
                                <span className={`w-1 h-1 rounded-full ${steel.pm ? 'bg-accent shadow-ember-sm' : 'bg-stone-600'}`} />
                                {steel.pm ? 'PM Route' : 'Conventional'}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-4 md:gap-6 flex-wrap pr-24">
                        <h2 className="text-3xl md:text-5xl font-display text-white leading-none uppercase tracking-tight">{steel.name}</h2>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={(e) => { e.stopPropagation(); toggleFavorite(steel.id); }}
                                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                                aria-pressed={isFavorite}
                                className={`p-2 rounded-xl border transition-colors duration-300 ease-snap flex items-center justify-center w-9 h-9 shrink-0 ${isFavorite ? 'bg-accent text-[#1A0C05] border-accent shadow-ember-sm' : 'bg-white/5 text-stone-500 border-white/10 hover:text-accent'}`}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" className="shrink-0">
                                    <path d="m12 17.75-6.172 3.245 1.179-6.873-4.993-4.867 6.9-1.002L12 2l3.086 6.253 6.9 1.002-4.993 4.867 1.179 6.873z" />
                                </svg>
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); shareSteel(); }}
                                aria-label={copied ? 'Link copied' : 'Copy share link'}
                                className="p-2 rounded-xl border border-white/10 transition-colors duration-300 ease-snap flex items-center justify-center w-9 h-9 shrink-0 bg-white/5 text-stone-500 hover:text-accent"
                            >
                                {copied ? (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-400 shrink-0">
                                        <path d="M20 6 9 17l-5-5" />
                                    </svg>
                                ) : (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0">
                                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                                        <polyline points="16 6 12 2 8 6" />
                                        <line x1="12" y1="2" x2="12" y2="15" />
                                    </svg>
                                )}
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); shareCardRef.current?.generateImage(); }}
                                className="p-2 rounded-xl border border-white/10 transition-colors duration-300 ease-snap flex items-center justify-center w-9 h-9 shrink-0 bg-white/5 text-stone-500 hover:text-accent group"
                                title="Export Performance Card"
                                aria-label="Export performance card as image"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:scale-110 transition-transform duration-300 ease-snap">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Body — editorial dossier grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-12 pt-10">
                    {/* 01 — Identity */}
                    <section className="lg:col-span-4 space-y-12">
                        <div>
                            <SectionLabel index="01" title="Identity" />
                            <p className="text-stone-300 text-xs md:text-sm leading-relaxed font-medium">{steel.desc}</p>
                            {steel.use_case && (
                                <div className="mt-6 pl-5 border-l-2 border-accent/60">
                                    <div className="text-[9px] font-mono font-medium text-stone-500 uppercase tracking-[0.25em] mb-2">Optimal Deployment</div>
                                    <div className="text-xs text-stone-200 font-semibold leading-relaxed">{steel.use_case}</div>
                                </div>
                            )}
                        </div>

                        <div>
                            <SectionLabel index="02" title="Composition" />
                            <div className="grid grid-cols-4 gap-px bg-white/[0.06] border border-white/[0.06] rounded-lg overflow-hidden">
                                {['C', 'Cr', 'V', 'Mo', 'W', 'Co', 'N', 'Nb'].filter(el => steel[el] > 0).map(el => (
                                    <div key={el} className="bg-[#0B0A08] p-3 text-center">
                                        <div className="text-[8px] font-mono font-medium text-stone-600 uppercase tracking-[0.2em] mb-1.5">{el}</div>
                                        <div className="text-xs font-mono font-bold text-white">{steel[el]}%</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {steel.knives && steel.knives.length > 0 && (
                            <div>
                                <SectionLabel index="03" title="Famous Deployment" />
                                <div className="flex flex-wrap gap-2">
                                    {steel.knives.map((k, i) => (
                                        <button
                                            key={i}
                                            onClick={() => onOpenKnife && onOpenKnife(k.name)}
                                            className="px-3 py-1.5 bg-white/[0.03] border border-white/10 hover:border-accent/40 hover:bg-accent/5 rounded-lg text-[10px] font-mono font-medium text-stone-200 hover:text-accent uppercase tracking-[0.15em] transition-colors duration-300 ease-snap"
                                        >
                                            {k.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>

                    {/* 04 — Performance Profile */}
                    <section className="lg:col-span-4">
                        <SectionLabel index="04" title="Performance Profile" />
                        <div className="mb-8">
                            <PerformanceRadar items={[steel]} compact={true} noContainer={true} noTitle={true} />
                        </div>
                        <div className="space-y-8">
                            <div>
                                <div className="text-[10px] font-mono font-medium text-emerald-500 uppercase tracking-[0.25em] mb-3">Core Strengths</div>
                                <div className="space-y-2.5">
                                    {steel.pros?.map((p, i) => (
                                        <div key={i} className="text-xs text-stone-300 flex items-start gap-2 leading-snug">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></div>
                                            <span className="font-medium">{p}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="text-[10px] font-mono font-medium text-rose-500 uppercase tracking-[0.25em] mb-3">Trade-offs</div>
                                <div className="space-y-2.5">
                                    {steel.cons?.map((p, i) => (
                                        <div key={i} className="text-xs text-stone-300 flex items-start gap-2 leading-snug">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></div>
                                            <span className="font-medium">{p}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 05/06 — Lab */}
                    <section className="lg:col-span-4 space-y-12">
                        <div>
                            <SectionLabel index="05" title="Heat Treatment" />
                            <HeatTreatChart items={[steel]} containerClass="h-[220px]" compact={true} noContainer={true} noTitle={true} />
                        </div>
                        <div>
                            <SectionLabel index="06" title="Edge Retention Lab" />
                            <EdgeRetentionPredictor steel={steel} />
                        </div>
                    </section>
                </div>

                {/* 07 — Consider Also: full-width ledger */}
                {similarSteels.length > 0 && (
                    <section className="mt-12 pt-10 border-t border-white/5">
                        <SectionLabel index="07" title="Consider Also" />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06] border border-white/[0.06] rounded-lg overflow-hidden">
                            {similarSteels.map(s => (
                                <button
                                    key={s.id}
                                    onClick={() => onOpenSteel && onOpenSteel(s)}
                                    className="text-left p-4 bg-[#0B0A08] hover:bg-white/[0.04] transition-colors duration-300 ease-snap group"
                                >
                                    <div className="text-sm font-display text-stone-200 group-hover:text-accent transition-colors duration-300 uppercase tracking-tight leading-tight">{s.name}</div>
                                    <div className="text-[9px] font-mono font-medium text-stone-600 mt-1.5 uppercase tracking-[0.2em]">{s.producer}</div>
                                </button>
                            ))}
                        </div>
                    </section>
                )}

                <div className="mt-10 pt-10 border-t border-white/5 flex justify-center">
                    <div className="w-full max-w-sm">
                        <ShareCard ref={shareCardRef} steel={steel} onGenerated={handleDownload} hideButton={true} />
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-stone-700 uppercase tracking-[0.4em] font-medium">
                    <span>Metallurgy Core</span>
                    <span>System v2.5</span>
                </div>
            </div>
        </BottomSheet>
    );
};

export default SteelDetailModal;
