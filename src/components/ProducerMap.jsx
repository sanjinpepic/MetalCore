'use client'

import React, { useState } from 'react';
import { PRODUCERS } from '../data/education';

const ProducerMap = () => {
    const [activeProducer, setActiveProducer] = useState(null);

    // Coordinate to SVG position mapping (highly simplified)
    // Map bounding: Lon -180 to 180, Lat -90 to 90
    // SVG Size: 800 x 400
    const getPos = (lat, lon) => {
        const x = ((lon + 180) * 800) / 360;
        const y = ((90 - lat) * 400) / 180;
        return { x, y };
    };

    return (
        <div className="relative w-full bg-black/40 rounded-[2.5rem] border border-white/5 overflow-hidden p-6 md:p-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h3 className="text-xl md:text-2xl font-display font-black text-white italic uppercase tracking-tighter">Global Production Hubs</h3>
                    <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-widest">Major High-Performance Steel Manufacturers</p>
                </div>
                {activeProducer && (
                    <div className="px-4 py-2 bg-accent/10 border border-accent/20 rounded-xl animate-in fade-in slide-in-from-right-4">
                        <span className="text-[10px] font-black text-accent uppercase tracking-widest">{activeProducer.region}</span>
                        <div className="text-sm font-bold text-white">{activeProducer.name}</div>
                    </div>
                )}
            </div>

            <div className="relative aspect-[2/1] w-full">
                {/* Stylized World Map SVG with Silhouettes */}
                <svg viewBox="0 0 800 400" className="w-full h-full opacity-30 select-none pointer-events-none">
                    <defs>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                        <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
                            <stop offset="50%" stopColor="rgba(255,255,255,0.12)" />
                            <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
                        </linearGradient>
                    </defs>

                    {/* Background Grids */}
                    <g className="text-white/[0.03]">
                        {[...Array(20)].map((_, i) => (
                            <line key={`h-${i}`} x1="0" y1={i * 20} x2="800" y2={i * 20} stroke="currentColor" strokeWidth="0.5" />
                        ))}
                        {[...Array(40)].map((_, i) => (
                            <line key={`v-${i}`} x1={i * 20} y1="0" x2={i * 20} y2="400" stroke="currentColor" strokeWidth="0.5" />
                        ))}
                    </g>

                    {/* Continent Outlines (Simplified but recognizable) */}
                    <g fill="url(#mapGradient)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeLinejoin="round" filter="url(#glow)">
                        {/* North America */}
                        <path d="M120,80 L180,60 L240,100 L220,180 L160,200 L120,160 Z" />
                        <path d="M40,40 L100,50 L120,100 L80,140 L20,100 Z" />
                        {/* South America */}
                        <path d="M220,200 L280,220 L260,340 L220,360 L180,280 Z" />
                        {/* Europe & Africa */}
                        <path d="M380,60 L460,40 L500,80 L480,140 L400,120 L360,80 Z" />
                        <path d="M360,140 L460,160 L480,260 L420,340 L340,300 L320,200 Z" />
                        {/* Asia */}
                        <path d="M500,40 L680,20 L760,100 L720,220 L580,240 L480,180 Z" />
                        <path d="M640,240 L700,260 L680,300 L620,300 Z" />
                        {/* Australia */}
                        <path d="M640,300 L740,320 L720,380 L660,380 Z" />
                    </g>
                </svg>

                {/* Markers */}
                <div className="absolute inset-0">
                    {PRODUCERS.map((p, i) => {
                        const { x, y } = getPos(p.coords[0], p.coords[1]);
                        const isActive = activeProducer?.name === p.name;

                        return (
                            <div
                                key={i}
                                className="absolute group cursor-pointer"
                                style={{
                                    left: `${(x / 800) * 100}%`,
                                    top: `${(y / 400) * 100}%`,
                                    transform: 'translate(-50%, -50%)'
                                }}
                                onMouseEnter={() => setActiveProducer(p)}
                                onMouseLeave={() => setActiveProducer(null)}
                            >
                                <div className={`relative flex items-center justify-center transition-all duration-300 ${isActive ? 'scale-150' : 'hover:scale-125'}`}>
                                    {/* Pulse ring */}
                                    <div className={`absolute inset-0 rounded-full animate-ping bg-accent/40 ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>
                                    {/* Main dot */}
                                    <div className={`w-3 h-3 rounded-full border-2 border-black transition-colors ${isActive ? 'bg-accent shadow-[0_0_15px_rgba(245,158,11,0.8)]' : 'bg-white/40'}`}></div>
                                </div>

                                {/* Label */}
                                <div className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 bg-black/90 border border-white/10 rounded-lg text-white pointer-events-none transition-all duration-300 z-20 ${isActive ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-1 scale-95'}`}>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-accent mb-0.5">{p.name}</div>
                                    <div className="text-[9px] font-medium text-slate-400 italic">{p.location}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {PRODUCERS.map((p, i) => (
                    <div
                        key={i}
                        className={`p-4 rounded-2xl border transition-all cursor-crosshair ${activeProducer?.name === p.name ? 'bg-accent/5 border-accent/20' : 'bg-white/2 border-white/5 hover:border-white/10'}`}
                        onMouseEnter={() => setActiveProducer(p)}
                        onMouseLeave={() => setActiveProducer(null)}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <span className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(245,158,11,0.5)]"></span>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{p.region}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white mb-1 uppercase italic tracking-tighter">{p.name}</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 italic">"{p.desc}"</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProducerMap;
