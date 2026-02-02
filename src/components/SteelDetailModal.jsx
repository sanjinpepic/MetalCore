import React from 'react';
import HeatTreatChart from './HeatTreatChart';
import PerformanceRadar from './PerformanceRadar';
import { useUser } from '../context/UserContext';

const SteelDetailModal = ({ steel, onClose, onOpenKnife }) => {
    const { favoriteSteels, toggleFavorite } = useUser();
    const isFavorite = favoriteSteels.includes(steel.id);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 bg-black/80 backdrop-blur-md" onClick={onClose}>
            <div className="glass-panel w-full h-full md:h-auto md:max-h-[90vh] md:max-w-7xl p-6 md:p-8 md:rounded-[2.5rem] border-white/10 shadow-2xl relative overflow-y-auto custom-scrollbar" onClick={e => e.stopPropagation()}>
                <div className="absolute top-4 right-4 md:top-6 md:right-6 z-[110]">
                    <button onClick={onClose} className="p-2.5 bg-black/40 hover:bg-white/10 rounded-full text-slate-400 transition-all border border-white/10 backdrop-blur-3xl group">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:rotate-90 transition-transform">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 pt-8 md:pt-4 items-start">
                    {/* Column 1: Identity & Composition */}
                    <div className="space-y-8">
                        <div>
                            <div className="text-[10px] md:text-xs font-black text-accent uppercase tracking-[0.2em] mb-2">{steel.producer}</div>
                            <div className="flex items-center gap-4 mb-4">
                                <h2 className="text-2xl md:text-3xl font-display font-black text-white leading-none italic uppercase tracking-tighter">{steel.name}</h2>
                                <button
                                    onClick={(e) => { e.stopPropagation(); toggleFavorite(steel.id); }}
                                    className={`p-2.5 rounded-xl border transition-all ${isFavorite ? 'bg-accent text-black border-accent shadow-lg shadow-accent/20' : 'bg-white/5 text-slate-500 border-white/10 hover:text-accent'}`}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5">
                                        <path d="m12 17.75-6.172 3.245 1.179-6.873-4.993-4.867 6.9-1.002L12 2l3.086 6.253 6.9 1.002-4.993 4.867 1.179 6.873z" />
                                    </svg>
                                </button>
                            </div>
                            <div className="h-1 w-12 bg-accent rounded-full mb-6"></div>
                            <p className="text-slate-300 text-sm leading-relaxed font-medium italic">"{steel.desc}"</p>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            {['C', 'Cr', 'V', 'Mo', 'W', 'Co'].map(el => (
                                <div key={el} className="bg-black/40 rounded-2xl p-2.5 text-center border border-white/10">
                                    <div className="text-[9px] text-slate-600 uppercase font-black mb-1">{el}</div>
                                    <div className="text-sm font-mono font-black text-white">{steel[el] || 0}%</div>
                                </div>
                            ))}
                        </div>

                        <div>
                            <div className="text-[10px] md:text-xs font-bold text-accent uppercase tracking-widest mb-3">Optimal Deployment</div>
                            <div className="px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-slate-200 flex items-center gap-3.5 shadow-xl">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-accent shrink-0">
                                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                </svg>
                                <span className="font-semibold">{steel.use_case}</span>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Performance Profile */}
                    <div className="glass-panel p-5 md:p-6 rounded-[2rem] border-white/10 bg-black/40 h-full flex flex-col">
                        <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-3">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-accent">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                            Performance Profile
                        </h4>

                        <div className="mb-4">
                            <PerformanceRadar items={[steel]} compact={true} />
                        </div>

                        <div className="space-y-5 flex-1 overflow-y-auto custom-scrollbar pr-2">
                            <div>
                                <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2.5">Core Strengths</div>
                                <div className="space-y-2">
                                    {steel.pros?.map((p, i) => (
                                        <div key={i} className="text-xs text-slate-400 flex items-start gap-2">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></div>
                                            <span className="font-medium">{p}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-2.5">Trade-offs</div>
                                <div className="space-y-2">
                                    {steel.cons?.map((p, i) => (
                                        <div key={i} className="text-xs text-slate-400 flex items-start gap-2">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></div>
                                            <span className="font-medium">{p}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Column 3: Stats, Use Case & Examples */}
                    <div className="space-y-6 md:col-span-2 lg:col-span-1">
                        <HeatTreatChart items={[steel]} containerClass="h-[280px]" compact={true} />

                        {steel.knives && steel.knives.length > 0 && (
                            <div className="pb-2">
                                <div className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Famous in Knives</div>
                                <div className="grid grid-cols-1 gap-2">
                                    {steel.knives.map((k, i) => (
                                        <button
                                            key={i}
                                            onClick={() => onOpenKnife && onOpenKnife(k)}
                                            className="px-4 py-2.5 bg-white/5 border border-white/5 hover:border-accent/40 hover:bg-white/10 rounded-xl text-xs md:text-sm text-slate-200 text-left transition-all group flex items-center justify-between shadow-md"
                                        >
                                            <span className="font-bold truncate mr-2">{k}</span>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="opacity-40 group-hover:opacity-100 transition-opacity text-accent group-hover:translate-x-1 transition-transform shrink-0">
                                                <path d="M5 12h14" />
                                                <path d="m12 5 7 7-7 7" />
                                            </svg>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-slate-700 uppercase tracking-[0.4em] font-bold">
                    <span>Metallurgy Core</span>
                    <span>System v2.5</span>
                </div>
            </div>
        </div>
    );
};

export default SteelDetailModal;
