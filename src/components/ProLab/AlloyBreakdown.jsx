'use client'

import React from 'react';
import { motion } from 'framer-motion';

export const ELEMENT_DATA = {
    C: { name: 'Carbon', impact: 'Hardness & Strength', desc: 'The fundamental hardening element. Increases HRC potential but reduces toughness and corrosion resistance at high levels.' },
    Cr: { name: 'Chromium', impact: 'Corrosion Resistance', desc: 'Provides stainless properties (at 10.5%+). Also forms hard carbides that improve wear resistance.' },
    V: { name: 'Vanadium', impact: 'Wear Resistance', desc: 'Forms extremely hard, fine carbides. Refines grain structure for a sharper, more durable edge.' },
    Mo: { name: 'Molybdenum', impact: 'Hardenability', desc: 'Increases deep-hardening and prevents temper brittleness. Enhances corrosion resistance, especially against pitting.' },
    W: { name: 'Tungsten', impact: 'Hot Hardness', desc: 'Improves wear resistance and red-hardness. Crucial for high-speed steels and heavy-use industrial alloys.' },
    Co: { name: 'Cobalt', impact: 'Alloy Stability', desc: 'Intensifies the effects of other elements. Increases hot-hardness and allows for higher tempering temperatures.' },
    Ni: { name: 'Nickel', impact: 'Toughness', desc: 'Improves impact resistance and low-temperature toughness. Slight boost to corrosion resistance.' },
    N: { name: 'Nitrogen', impact: 'Corrosion/Purity', desc: 'Used to replace carbon for extreme corrosion resistance without sacrificing hardness (e.g., Vanax, MagnaCut).' },
    Nb: { name: 'Niobium', impact: 'Grain Refinement', desc: 'Forms very stable carbides that refine the grain structure, significantly boosting toughness.' },
};

const AlloyBreakdown = ({ steel, customElements = null }) => {
    if (!steel) return null;

    const elements = customElements || Object.keys(ELEMENT_DATA).filter(el => steel[el] > 0);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black text-white italic uppercase tracking-tight">Chemical DNA</h3>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Metallurgical Signature Analysis</p>
                </div>
                <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alloy Content: {(elements.reduce((acc, el) => acc + (steel[el] || 0), 0)).toFixed(1)}%</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {elements.map((el, i) => (
                    <motion.div
                        key={el}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`p-4 rounded-2xl border transition-all group ${steel[el] > 0
                            ? 'bg-black/40 border-white/5 hover:border-indigo-500/30'
                            : 'bg-black/10 border-white/5 opacity-40 hover:opacity-100 hover:border-white/10'}`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${steel[el] > 0
                                    ? 'bg-indigo-500/10 border-indigo-500/20'
                                    : 'bg-white/5 border-white/10'}`}>
                                    <span className={`text-lg font-black ${steel[el] > 0 ? 'text-indigo-400' : 'text-slate-600'}`}>{el}</span>
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{ELEMENT_DATA[el].name}</div>
                                    <div className={`text-xs font-black uppercase transition-colors ${steel[el] > 0 ? 'text-white group-hover:text-indigo-400' : 'text-slate-600'}`}>{ELEMENT_DATA[el].impact}</div>
                                </div>
                            </div>
                            <div className={`text-xl font-black italic transition-colors ${steel[el] > 0 ? 'text-white' : 'text-slate-700'}`}>{steel[el] || 0}%</div>
                        </div>
                        <p className={`text-[10px] leading-relaxed italic transition-colors ${steel[el] > 0 ? 'text-slate-400' : 'text-slate-700'}`}>{ELEMENT_DATA[el].desc}</p>

                        <div className="mt-3 h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(((steel[el] || 0) / (el === 'Cr' ? 20 : 5)) * 100, 100)}%` }}
                                className={`h-full ${steel[el] > 0 ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.4)]' : 'bg-slate-800'}`}
                            />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default AlloyBreakdown;
