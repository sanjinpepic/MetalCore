'use client'

import React, { useMemo } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { getTemperatureUnit, convertTemperature } from '../../utils/temperature';

const HeatTreatMaster = ({ steel }) => {
    const { unitSystem } = useSettings();

    const data = useMemo(() => {
        if (!steel) return null;

        // Heuristics based on steel type for utility-driven data
        const isStainless = steel.Cr >= 10.5;
        const isPM = steel.pm;
        const carbon = steel.C;

        const protocols = {
            quench: (isStainless || isPM) ? 'Plate Quench or Still Air' : (carbon > 1.0 ? 'Fast Oil (10-12s)' : 'Medium Oil'),
            cryo: (isStainless || carbon > 1.0) ? 'Deep Cryo Required (-196°C/°F)' : 'Sub-Zero Optional',
            tempers: [
                { target: 'Maximum Edge', hrc: (parseFloat(steel.edge) * 2 + 45).toFixed(1), application: 'Kitchen / Slicer' },
                { target: 'Balanced', hrc: (parseFloat(steel.edge) * 2 + 42).toFixed(1), application: 'General EDC' },
                { target: 'Maximum Toughness', hrc: (parseFloat(steel.edge) * 2 + 38).toFixed(1), application: 'Bushcraft / Heavy' },
            ]
        };

        return protocols;
    }, [steel]);

    if (!data) return null;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black text-white italic uppercase tracking-tight">Industrial Protocol</h3>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Foundry-Spec Heat Treatment Guide</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Hardening Phase</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Protocol Cards */}
                <div className="p-6 bg-black/40 rounded-3xl border border-white/5 space-y-6">
                    <div>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Quench Medium</div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                            </div>
                            <div className="text-lg font-black text-white italic uppercase tracking-tight">{data.quench}</div>
                        </div>
                    </div>

                    <div>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Austenitizing Temp</div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M12 2v20M2 12h20" />
                                </svg>
                            </div>
                            <div className="text-xl font-black text-white italic">{steel.ht_curve ? steel.ht_curve.split(',')[0].split(':')[0] : '1050'}°C / {convertTemperature(parseInt(steel.ht_curve ? steel.ht_curve.split(',')[0].split(':')[0] : '1050'), 'imperial')}°F</div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${data.cryo.includes('Required') ? 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]' : 'bg-slate-600'}`} />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cryogenic Phase: <b>{data.cryo}</b></span>
                        </div>
                    </div>
                </div>

                {/* HRC Target Column */}
                <div className="space-y-4">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Target Hardness by Application</div>
                    {data.tempers.map((t, i) => (
                        <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-all cursor-default">
                            <div>
                                <div className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{t.application}</div>
                                <div className="text-sm font-black text-white italic uppercase group-hover:text-indigo-400 transition-colors">{t.target}</div>
                            </div>
                            <div className="text-2xl font-black text-white font-display italic tracking-tighter">{t.hrc} <span className="text-[10px] text-slate-500 not-italic">HRC</span></div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-4 bg-orange-500/5 rounded-2xl border border-orange-500/10">
                <p className="text-[10px] text-slate-400 leading-relaxed italic">
                    <b className="text-orange-500 uppercase">Warning:</b> These values are industrial approximations. Always verify with specific foundry datasheets for <b>{steel.producer} {steel.name}</b>. Inconsistent quench speeds can lead to retained austenite and reduced edge stability.
                </p>
            </div>
        </div>
    );
};

export default HeatTreatMaster;
