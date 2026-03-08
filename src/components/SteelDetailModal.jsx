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

    const handleDownload = async (dataUrl) => {
        if (navigator.share && navigator.canShare) {
            try {
                const res = await fetch(dataUrl);
                const blob = await res.blob();
                const file = new File([blob], `${steel.name.replace(/\s+/g, '_')}_Performance.png`, { type: 'image/png' });
                if (navigator.canShare({ files: [file] })) {
                    await navigator.share({ title: `${steel.name} Performance Card`, files: [file] });
                    return;
                }
            } catch (err) {
                if (err.name === 'AbortError') return;
            }
        }
        // link.click() is blocked on iOS Safari — window.open() is the reliable fallback
        try {
            const link = document.createElement('a');
            link.download = `${steel.name.replace(/\s+/g, '_')}_Performance.png`;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch {
            window.open(dataUrl, '_blank');
        }
    };

    return (
        <BottomSheet isOpen={!!steel} onClose={onClose}>
            <div className="relative">
                {/* Close button - positioned for both mobile and desktop */}
                <div className="absolute top-1 right-0 z-10 flex items-center gap-2">
                    <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-black/40 hover:bg-white/10 rounded-full text-slate-400 transition-all border border-white/10 backdrop-blur-3xl group">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:rotate-90 transition-transform">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pt-4 items-start">
                    <div className="space-y-6">
                        <div>
                            <div className="text-[10px] md:text-xs font-black text-accent uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                                {steel.parent ?? steel.producer}
                                {steel.pm !== undefined && (
                                    <>
                                        <span className="w-1 h-1 rounded-full bg-accent/50" />
                                        <span className={steel.pm ? "text-white" : ""}>{steel.pm ? 'PM' : 'CONVENTIONAL'}</span>
                                    </>
                                )}
                            </div>
                            <div className="flex items-center gap-4 mb-3">
                                <h2 className="text-2xl md:text-3xl font-display font-black text-white leading-none italic uppercase tracking-tighter">{steel.name}</h2>
                                <button
                                    onClick={(e) => { e.stopPropagation(); toggleFavorite(steel.id); }}
                                    className={`p-2 rounded-xl border transition-all flex items-center justify-center w-9 h-9 shrink-0 ${isFavorite ? 'bg-accent text-black border-accent shadow-lg shadow-accent/20' : 'bg-white/5 text-slate-500 border-white/10 hover:text-accent'}`}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" className="shrink-0">
                                        <path d="m12 17.75-6.172 3.245 1.179-6.873-4.993-4.867 6.9-1.002L12 2l3.086 6.253 6.9 1.002-4.993 4.867 1.179 6.873z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); shareSteel(); }}
                                    className="p-2 rounded-xl border border-white/10 transition-all flex items-center justify-center w-9 h-9 shrink-0 bg-white/5 text-slate-500 hover:text-accent"
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
                                    className="p-2 rounded-xl border border-white/10 transition-all flex items-center justify-center w-9 h-9 shrink-0 bg-white/5 text-slate-500 hover:text-accent group"
                                    title="Export Performance Card"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:scale-110 transition-transform">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="7 10 12 15 17 10" />
                                        <line x1="12" y1="15" x2="12" y2="3" />
                                    </svg>
                                </button>
                            </div>
                            <p className="text-slate-300 text-xs md:text-sm leading-relaxed font-medium italic mb-6">"{steel.desc}"</p>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            {['C', 'Cr', 'V', 'Mo', 'W', 'Co'].map(el => (
                                <div key={el} className="bg-black/40 rounded-2xl p-2 text-center border border-white/10">
                                    <div className="text-[8px] text-slate-600 uppercase font-black mb-1">{el}</div>
                                    <div className="text-xs font-mono font-black text-white">{steel[el] || 0}%</div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                            <div className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-3 italic">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-accent">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                                Optimal Deployment
                            </div>
                            <div className="text-xs text-slate-200 font-semibold leading-tight">
                                {steel.use_case}
                            </div>
                        </div>

                        {steel.knives && steel.knives.length > 0 && (
                            <div className="glass-panel p-5 rounded-2xl">
                                <h4 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-3 italic">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-blue-400">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                    Famous Deployment
                                </h4>
                                <div className="flex flex-wrap gap-1.5">
                                    {steel.knives.map((k, i) => (
                                        <button
                                            key={i}
                                            onClick={() => onOpenKnife && onOpenKnife(k.name)}
                                            className="px-3 py-1.5 bg-white/3 border border-white/5 hover:border-accent/40 hover:bg-white/8 rounded-lg text-[10px] text-slate-200 transition-all font-bold"
                                        >
                                            {k.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {similarSteels.length > 0 && (
                            <div className="glass-panel p-5 rounded-2xl">
                                <h4 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-3 italic">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-violet-400">
                                        <circle cx="18" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><path d="M13 6h3a2 2 0 0 1 2 2v7" /><path d="M11 18H8a2 2 0 0 1-2-2V9" />
                                    </svg>
                                    Consider Also
                                </h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {similarSteels.map(s => (
                                        <button
                                            key={s.id}
                                            onClick={() => onOpenSteel && onOpenSteel(s)}
                                            className="text-left p-3 rounded-xl bg-white/3 border border-white/5 hover:border-violet-400/30 hover:bg-white/8 transition-all group"
                                        >
                                            <div className="text-xs font-black text-slate-200 group-hover:text-white transition-colors uppercase tracking-tight leading-tight">{s.name}</div>
                                            <div className="text-[10px] text-slate-600 mt-0.5 font-medium">{s.producer}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Column 2: Performance Profile */}
                    <div className="glass-gradient p-5 rounded-2xl h-full">
                        <h4 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3 italic">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-accent">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                            Performance Profile
                        </h4>

                        <div className="mb-4">
                            <PerformanceRadar items={[steel]} compact={true} noContainer={true} noTitle={true} />
                        </div>

                        <div className="space-y-8">
                            <div>
                                <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-3">Core Strengths</div>
                                <div className="space-y-2.5">
                                    {steel.pros?.map((p, i) => (
                                        <div key={i} className="text-xs text-slate-300 flex items-start gap-2 leading-snug">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 shadow-lg shadow-emerald-500/20"></div>
                                            <span className="font-medium">{p}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-3">Trade-offs</div>
                                <div className="space-y-2.5">
                                    {steel.cons?.map((p, i) => (
                                        <div key={i} className="text-xs text-slate-300 flex items-start gap-2 leading-snug">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 shadow-lg shadow-rose-500/20"></div>
                                            <span className="font-medium">{p}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Column 3: Technical Lab & Shop */}
                    <div className="space-y-6">
                        <div className="glass-accent p-5 rounded-2xl">
                            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-3 italic">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-orange-500">
                                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                                </svg>
                                Hitting Hardness Matrix
                            </h4>
                            <HeatTreatChart items={[steel]} containerClass="h-[220px]" compact={true} noContainer={true} noTitle={true} />
                        </div>

                        <div className="glass-gradient p-5 rounded-2xl">
                            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-5 flex items-center gap-3 italic">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-accent">
                                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                                    <polyline points="2 17 12 22 22 17" />
                                    <polyline points="2 12 12 17 22 12" />
                                </svg>
                                Pro Analysis Lab
                            </h4>
                            <EdgeRetentionPredictor steel={steel} />
                        </div>

                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 flex justify-center">
                    <div className="w-full max-w-sm">
                        <ShareCard ref={shareCardRef} steel={steel} onGenerated={handleDownload} hideButton={true} />
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-slate-700 uppercase tracking-[0.4em] font-bold">
                    <span>Metallurgy Core</span>
                    <span>System v2.5</span>
                </div>
            </div>
        </BottomSheet>
    );
};

export default SteelDetailModal;
