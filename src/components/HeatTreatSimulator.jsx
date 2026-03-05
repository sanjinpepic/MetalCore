'use client'

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

const HeatTreatSimulator = ({ steel }) => {
    const [temp, setTemp] = useState(500); // Celsius

    const prediction = useMemo(() => {
        if (!steel) return null;

        const c = steel.C || 0;
        const cr = steel.Cr || 0;
        const v = steel.V || 0;
        const mo = steel.Mo || 0;

        // Base hardness estimation (simplified)
        // Hardness drops as tempering temperature increases, 
        // but secondary hardening peaks occur around 500-550C for high alloy steels.

        let baseHardness = 65; // High end for quenched steel
        if (c < 0.5) baseHardness = 58;
        else if (c < 1.0) baseHardness = 62;

        // Tempering drop
        const drop = (temp / 100) * 3;

        // Secondary hardening peak effect
        let secondaryPeak = 0;
        if (temp >= 450 && temp <= 600) {
            // Factor based on V, Mo, and Cr
            secondaryPeak = (v * 1.5) + (mo * 0.8) + (cr * 0.2);
            // Peak shape (bell curve-ish)
            const peakIntensity = 1 - Math.abs(525 - temp) / 75;
            secondaryPeak *= Math.max(0, peakIntensity);
        }

        const hrc = baseHardness - drop + secondaryPeak;

        return {
            hrc: Math.min(68, Math.max(40, hrc)).toFixed(1),
            hasSecondaryHardening: secondaryPeak > 1
        };
    }, [steel, temp]);

    if (!steel) return null;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Tempering Temp</div>
                    <div className="text-2xl font-display font-black text-white italic">{temp}°C</div>
                </div>
                <div className="text-right">
                    <div className="text-[10px] font-black text-accent uppercase tracking-widest mb-1">Estimated Hardness</div>
                    <div className="text-3xl font-mono font-black text-white">{prediction.hrc} <span className="text-sm text-slate-500">HRC</span></div>
                </div>
            </div>

            <div className="relative pt-4">
                <input
                    type="range"
                    min="150"
                    max="700"
                    step="5"
                    value={temp}
                    onChange={(e) => setTemp(parseInt(e.target.value))}
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                    onTouchEnd={(e) => e.stopPropagation()}
                    className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-accent border border-white/5 touch-none"
                />
                <div className="flex justify-between mt-2 text-[8px] font-mono text-slate-600 font-black uppercase tracking-widest">
                    <span>150°C</span>
                    <span>Secondary Peak</span>
                    <span>700°C</span>
                </div>
            </div>

            {prediction.hasSecondaryHardening && (
                <div className="p-3 bg-accent/5 border border-accent/20 rounded-xl flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-lg shadow-accent/50"></div>
                    <div className="text-[10px] font-black text-accent uppercase tracking-widest leading-none">Secondary Hardening Peak Active</div>
                </div>
            )}

            <p className="text-[10px] text-slate-500 leading-relaxed italic opacity-60">
                *Simulated response curve based on {steel.V}% Vanadium and {steel.Mo || 0}% Molybdenum.
            </p>
        </div>
    );
};

export default HeatTreatSimulator;
