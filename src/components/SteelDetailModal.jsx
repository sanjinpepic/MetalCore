import React from 'react';

const SteelDetailModal = ({ steel, onClose, onOpenKnife }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 bg-black/80 backdrop-blur-md" onClick={onClose}>
            <div className="glass-panel w-full h-full md:h-auto md:max-w-2xl p-6 md:p-10 md:rounded-[2.5rem] border-white/10 shadow-2xl relative overflow-y-auto custom-scrollbar" onClick={e => e.stopPropagation()}>
                <div className="flex justify-end sticky top-0 md:absolute md:top-8 md:right-8 z-20 mb-4 md:mb-0">
                    <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 transition-all border border-white/5 backdrop-blur-xl">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 pt-6">
                    <div className="space-y-8">
                        <div>
                            <div className="text-[10px] md:text-xs font-black text-accent uppercase tracking-[0.2em] mb-2">{steel.producer}</div>
                            <h2 className="text-2xl md:text-4xl font-display font-black text-white mb-4 leading-none italic uppercase tracking-tighter">{steel.name}</h2>
                            <div className="h-1 w-12 bg-accent rounded-full mb-6"></div>
                            <p className="text-slate-300 text-sm md:text-base leading-relaxed font-medium italic">"{steel.desc}"</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <div className="text-[10px] md:text-xs font-bold text-accent uppercase tracking-widest mb-3">Optimal Deployment</div>
                                <div className="px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm md:text-base text-slate-200 flex items-center gap-3.5 shadow-xl">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-accent shrink-0">
                                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                    </svg>
                                    <span className="font-semibold">{steel.use_case}</span>
                                </div>
                            </div>

                            {steel.knives && steel.knives.length > 0 && (
                                <div className="pb-4">
                                    <div className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Popular Examples</div>
                                    <div className="grid grid-cols-1 gap-2.5">
                                        {steel.knives.map((k, i) => (
                                            <button
                                                key={i}
                                                onClick={() => onOpenKnife && onOpenKnife(k)}
                                                className="px-4 py-3.5 bg-white/5 border border-white/5 hover:border-accent/40 hover:bg-white/10 rounded-2xl text-sm md:text-base text-slate-200 text-left transition-all group flex items-center justify-between shadow-lg"
                                            >
                                                <span className="font-bold"> {k}</span>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="opacity-40 group-hover:opacity-100 transition-opacity text-accent group-hover:translate-x-1 transition-transform">
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

                    <div className="space-y-8">
                        <div className="glass-panel p-6 md:p-8 rounded-[2rem] border-white/10 bg-black/40">
                            <h4 className="text-sm md:text-base font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-accent">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                                Performance Profile
                            </h4>
                            <div className="space-y-6">
                                <div>
                                    <div className="text-[10px] md:text-xs font-bold text-emerald-500 uppercase tracking-widest mb-3">Core Strengths</div>
                                    <div className="space-y-2.5">
                                        {steel.pros?.map((p, i) => (
                                            <div key={i} className="text-xs md:text-sm text-slate-400 flex items-start gap-2.5">
                                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></div>
                                                <span className="font-medium">{p}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[10px] md:text-xs font-bold text-rose-500 uppercase tracking-widest mb-3">Trade-offs</div>
                                    <div className="space-y-2.5">
                                        {steel.cons?.map((p, i) => (
                                            <div key={i} className="text-xs md:text-sm text-slate-400 flex items-start gap-2.5">
                                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></div>
                                                <span className="font-medium">{p}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 pb-8">
                            {['C', 'Cr', 'V', 'Mo', 'W', 'Co'].map(el => (
                                <div key={el} className="bg-black/40 rounded-2xl p-4 text-center border border-white/10">
                                    <div className="text-[9px] text-slate-600 uppercase font-black mb-1.5">{el}</div>
                                    <div className="text-base md:text-xl font-mono font-black text-white">{steel[el] || 0}%</div>
                                </div>
                            ))}
                        </div>
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
