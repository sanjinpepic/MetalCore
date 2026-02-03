import React, { useState } from 'react';
import { PRODUCERS } from '../data/education';

const ProducerMap = () => {
    const [activeProducer, setActiveProducer] = useState(null);

    return (
        <div className="relative w-full bg-[#050505] rounded-[2.5rem] border border-white/5 overflow-hidden p-6 md:p-10 shadow-2xl">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4 relative z-10">
                <div>
                    <h3 className="text-xl md:text-2xl font-display font-black text-white italic uppercase tracking-tighter">Global Production Hubs</h3>
                    <p className="text-[10px] text-accent font-black mt-1 uppercase tracking-[0.3em]">Precision Metallurgy Network</p>
                </div>
            </div>

            {/* Producer List View (Replacing the map) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                {PRODUCERS.map((p, i) => (
                    <div
                        key={i}
                        className={`group p-8 rounded-[2.5rem] border transition-all cursor-pointer relative overflow-hidden bg-gradient-to-br from-white/[0.03] to-transparent ${activeProducer?.name === p.name ? 'border-accent/30 shadow-2xl scale-[1.02]' : 'border-white/5 hover:border-white/10'}`}
                        onMouseEnter={() => setActiveProducer(p)}
                        onMouseLeave={() => setActiveProducer(null)}
                    >
                        {/* Status / Region Badge */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <span className={`w-2 h-2 rounded-full transition-all duration-500 ${activeProducer?.name === p.name ? 'bg-accent shadow-[0_0_12px_rgba(245,158,11,1)] scale-125' : 'bg-slate-700'}`}></span>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{p.region}</span>
                            </div>
                            <div className="text-[9px] font-mono text-slate-600 font-bold uppercase tracking-tighter">Hub ID: 0{i + 1}</div>
                        </div>

                        {/* Title & Location */}
                        <div className="mb-6">
                            <h4 className="text-xl font-display font-black text-white italic uppercase tracking-tight group-hover:text-accent transition-colors mb-1">{p.name}</h4>
                            <div className="text-[10px] font-bold text-slate-400 italic flex items-center gap-2">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-accent/60">
                                    <path d="M20 10c0 4.418-8 12-8 12s-8-7.582-8-12a8 8 0 1 1 16 0Z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                                {p.location}
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-slate-400 leading-relaxed italic font-medium">"{p.desc}"</p>

                        {/* Hover Overlay Visual */}
                        <div className={`absolute -bottom-6 -right-6 w-32 h-32 bg-accent/5 rounded-full blur-2xl transition-all duration-700 ${activeProducer?.name === p.name ? 'opacity-100 scale-150' : 'opacity-0 scale-50'}`}></div>
                    </div>
                ))}
            </div>

            {/* System Footer (Internal) */}
            <div className="mt-16 pt-8 border-t border-white/5 flex justify-between items-center text-[8px] font-mono text-slate-800 uppercase tracking-[0.4em] font-bold">
                <span>Network Integrity: Verified</span>
                <span>Active Nodes: {PRODUCERS.length}</span>
            </div>
        </div>
    );
};

export default ProducerMap;
