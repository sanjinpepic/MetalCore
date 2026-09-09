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
                    <h3 className="text-xl font-display text-white uppercase tracking-tight">Chemical DNA</h3>
                    <p className="text-[10px] text-stone-500 uppercase font-mono font-medium tracking-[0.2em] mt-1">Metallurgical Signature Analysis</p>
                </div>
                <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10">
                    <span className="text-[10px] font-mono font-medium text-stone-400 uppercase tracking-[0.2em]">Alloy Content: {(elements.reduce((acc, el) => acc + (steel[el] || 0), 0)).toFixed(1)}%</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {elements.map((el, i) => (
                    <motion.div
                        key={el}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, type: 'spring', stiffness: 400, damping: 30 }}
                        className={steel[el] > 0
                            ? 'p-4 rounded-2xl border transition-colors group bg-black/40 border-white/5 hover:border-accent/30'
                            : 'p-4 rounded-2xl border transition-opacity group bg-black/10 border-white/5 opacity-40 hover:opacity-100 hover:border-white/10'}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                                <div className={steel[el] > 0
                                    ? 'w-10 h-10 rounded-xl flex items-center justify-center border transition-colors bg-accent/10 border-accent/20'
                                    : 'w-10 h-10 rounded-xl flex items-center justify-center border transition-colors bg-white/5 border-white/10'}>
                                    <span className={steel[el] > 0 ? 'text-lg font-mono font-medium text-accent-400' : 'text-lg font-mono font-medium text-stone-600'}>{el}</span>
                                </div>
                                <div>
                                    <div className="text-[10px] font-mono font-medium text-stone-500 uppercase tracking-[0.2em]">{ELEMENT_DATA[el].name}</div>
                                    <div className={steel[el] > 0 ? 'text-xs font-semibold uppercase transition-colors text-white group-hover:text-accent-400' : 'text-xs font-semibold uppercase transition-colors text-stone-600'}>{ELEMENT_DATA[el].impact}</div>
                                </div>
                            </div>
                            <div className={steel[el] > 0 ? 'text-xl font-mono font-semibold transition-colors text-white' : 'text-xl font-mono font-semibold transition-colors text-stone-700'}>{steel[el] || 0}%</div>
                        </div>
                        <p className={steel[el] > 0 ? 'text-[10px] leading-relaxed transition-colors text-stone-400' : 'text-[10px] leading-relaxed transition-colors text-stone-700'}>{ELEMENT_DATA[el].desc}</p>

                        <div className="mt-3 h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(((steel[el] || 0) / (el === 'Cr' ? 20 : 5)) * 100, 100)}%` }}
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                className={steel[el] > 0 ? 'h-full bg-accent shadow-ember-sm' : 'h-full bg-stone-800'}
                            />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default AlloyBreakdown;
