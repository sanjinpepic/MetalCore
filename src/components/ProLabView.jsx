'use client'

import React, { useState, useMemo } from 'react';
import { useUser } from '../context/UserContext';
import Footer from './Footer';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, AreaChart, Area } from 'recharts';

const ProLabView = ({ steels }) => {
    const { myKnives } = useUser();
    const [simSteel, setSimSteel] = useState(steels[0]);
    const [temperTemp, setTemperTemp] = useState(200); // Standard tempering temp in Celsius
    const [showIndustryStandard, setShowIndustryStandard] = useState(false);

    // 1. Collection Fingerprint Logic
    const collectionFingerprint = useMemo(() => {
        if (!myKnives || myKnives.length === 0) return [];

        const metrics = { C: 0, Cr: 0, V: 0, Mo: 0, W: 0, Co: 0 };
        let count = 0;

        myKnives.forEach(knife => {
            // Defensive check for user-added knives
            if (!knife.steels) return;

            const steel = steels.find(s =>
                knife.steels.some(knSteel =>
                    knSteel && knSteel.toLowerCase().includes(s.name.toLowerCase())
                )
            );

            if (steel) {
                metrics.C += steel.C || 0;
                metrics.Cr += steel.Cr || 0;
                metrics.V += steel.V || 0;
                metrics.Mo += steel.Mo || 0;
                metrics.W += steel.W || 0;
                metrics.Co += steel.Co || 0;
                count++;
            }
        });

        const industryStandard = { C: 0.8, Cr: 14, V: 1.5, Mo: 1, W: 0.5, Co: 0.2 };

        return Object.entries(metrics).map(([el, val]) => ({
            subject: el,
            collection: count > 0 ? (val / count).toFixed(2) : 0,
            industry: industryStandard[el],
            fullMark: 20
        }));
    }, [myKnives, steels]);

    // 2. Heat Treat Simulator Logic
    const simData = useMemo(() => {
        if (!simSteel || !simSteel.ht_curve) {
            // Fallback generated curve if data is missing
            return [
                { temp: 300, hrc: 62 },
                { temp: 400, hrc: 61 },
                { temp: 500, hrc: 59 },
                { temp: 600, hrc: 56 },
                { temp: 700, hrc: 52 },
                { temp: 800, hrc: 45 },
            ];
        }

        return simSteel.ht_curve.split(',').map(pair => {
            const [t, h] = pair.split(':');
            const fTemp = parseInt(t);
            const cTemp = Math.round((fTemp - 32) * 5 / 9);
            return { temp: cTemp, hrc: parseFloat(h) };
        }).sort((a, b) => a.temp - b.temp);
    }, [simSteel]);

    // Derived simulation value based on slider
    const currentHrc = useMemo(() => {
        if (simData.length < 2) return 0;
        // Simple linear interpolation
        const lower = [...simData].reverse().find(p => p.temp <= temperTemp) || simData[0];
        const upper = simData.find(p => p.temp >= temperTemp) || simData[simData.length - 1];

        if (lower.temp === upper.temp) return lower.hrc;

        const ratio = (temperTemp - lower.temp) / (upper.temp - lower.temp);
        return (lower.hrc + ratio * (upper.hrc - lower.hrc)).toFixed(1);
    }, [temperTemp, simData]);

    // 3. Recommended Grade Logic
    const recommendedGrade = useMemo(() => {
        if (collectionFingerprint.length === 0) return steels.find(s => s.name === "MagnaCut");

        // Find element with lowest score compared to industry
        const gaps = collectionFingerprint.map(f => ({
            el: f.subject,
            gap: f.industry - f.collection
        })).sort((a, b) => b.gap - a.gap);

        const primaryGap = gaps[0].el;

        // Find a steel that excels in this gap
        return steels
            .filter(s => s[primaryGap] > 3)
            .sort((a, b) => b[primaryGap] - a[primaryGap])[0] || steels[0];
    }, [collectionFingerprint, steels]);

    return (
        <div className="flex flex-col flex-1 min-w-0 h-screen overflow-y-auto custom-scrollbar bg-slate-950 p-6 md:p-12">
            <header className="mb-12">
                <div className="text-xs font-black text-accent uppercase tracking-[0.3em] mb-2 italic">Analytical Hub</div>
                <h1 className="text-4xl md:text-6xl font-display font-black text-white italic uppercase tracking-tighter leading-none">
                    PRO LAB <span className="text-accent underline underline-offset-8 decoration-4">BETA</span>
                </h1>
                <p className="mt-6 text-slate-400 max-w-2xl text-sm md:text-base leading-relaxed">
                    Welcome to the Pro Research Laboratory. Use these advanced simulators to analyze your collection's chemical DNA and predict heat-treat outcomes in Celsius.
                </p>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pb-32">

                    {/* 1. Collection Fingerprint Card */}
                    <div className="glass-panel p-8 rounded-[2.5rem] border-white/10 bg-black/40 flex flex-col h-[550px]">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-xl font-black text-white italic uppercase tracking-tight text-glow">Collection Fingerprint</h3>
                                <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mt-1">Compound Chemistry Analysis</p>
                            </div>
                            <button
                                onClick={() => setShowIndustryStandard(!showIndustryStandard)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${showIndustryStandard ? 'bg-accent text-black shadow-lg shadow-accent/20' : 'bg-white/5 text-slate-400 border border-white/5'}`}
                            >
                                {showIndustryStandard ? 'Hide' : 'Show'} Industry Std
                            </button>
                        </div>

                        {collectionFingerprint.length > 0 ? (
                            <div className="flex-1 min-h-0 relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={collectionFingerprint}>
                                        <PolarGrid stroke="#1e293b" strokeWidth={2} />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 14, fontWeight: '900', letterSpacing: '0.1em' }} />

                                        {showIndustryStandard && (
                                            <Radar
                                                name="Industry Standard"
                                                dataKey="industry"
                                                stroke="#334155"
                                                fill="#334155"
                                                fillOpacity={0.1}
                                                strokeWidth={2}
                                                strokeDasharray="4 4"
                                            />
                                        )}

                                        <Radar
                                            name="Your Collection"
                                            dataKey="collection"
                                            stroke="#00f2ff"
                                            fill="#00f2ff"
                                            fillOpacity={0.25}
                                            strokeWidth={4}
                                        />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0a0a0b', borderColor: '#334155', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.1)' }}
                                            itemStyle={{ color: '#00f2ff', fontWeight: 'bold' }}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                                <div className="p-8 bg-accent/5 rounded-full text-accent shadow-2xl shadow-accent/5 border border-accent/10">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M12 2v20M2 12h20" />
                                    </svg>
                                </div>
                                <p className="text-slate-400 text-sm max-w-xs uppercase font-black tracking-[0.2em] leading-loose italic">
                                    Add knives to your library to generate your unique chemical fingerprint
                                </p>
                            </div>
                        )}
                    </div>

                    {/* 2. Heat Treat Simulator Card */}
                    <div className="glass-panel p-8 rounded-[2.5rem] border-white/10 bg-black/40 flex flex-col h-[550px]">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-black text-white italic uppercase tracking-tight text-glow">Phase Simulation</h3>
                                <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mt-1">Heat Treat Predictor</p>
                            </div>
                            <select
                                value={simSteel.id}
                                onChange={(e) => setSimSteel(steels.find(s => s.id === e.target.value))}
                                className="bg-black/60 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black text-white uppercase tracking-widest outline-none focus:border-accent transition-all"
                            >
                                {steels.filter(s => s.ht_curve).map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex-1 min-h-0 mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={simData}>
                                    <defs>
                                        <linearGradient id="colorHrc" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis
                                        dataKey="temp"
                                        type="number"
                                        domain={['auto', 'auto']}
                                        tick={{ fill: '#475569', fontSize: 10, fontWeight: 'bold' }}
                                        label={{ value: 'Temper Temp (°C)', position: 'insideBottom', offset: -5, fill: '#475569', fontSize: 9, fontWeight: 'bold' }}
                                    />
                                    <YAxis
                                        domain={[40, 70]}
                                        tick={{ fill: '#475569', fontSize: 10, fontWeight: 'bold' }}
                                        label={{ value: 'Hardness (HRC)', angle: -90, position: 'insideLeft', fill: '#475569', fontSize: 9, fontWeight: 'bold' }}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0a0a0b', borderColor: '#334155', borderRadius: '1.2rem' }}
                                        itemStyle={{ color: '#f59e0b', fontWeight: 'bold' }}
                                    />
                                    <Area type="monotone" dataKey="hrc" stroke="#f59e0b" strokeWidth={4} fillOpacity={1} fill="url(#colorHrc)" />
                                    <ReferenceLine x={temperTemp} stroke="#ef4444" strokeWidth={2} strokeDasharray="3 3" label={{ position: 'top', value: `${currentHrc} HRC`, fill: '#ef4444', fontSize: 12, fontWeight: '900' }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="mt-8 space-y-6">
                            <div className="flex justify-between items-center px-2">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Adjust Tempering Temperature</span>
                                <span className="text-sm font-black text-white italic">{temperTemp}°C</span>
                            </div>
                            <input
                                type="range"
                                min={simData[0]?.temp || 150}
                                max={simData[simData.length - 1]?.temp || 500}
                                value={temperTemp}
                                onChange={(e) => setTemperTemp(parseInt(e.target.value))}
                                className="w-full accent-orange-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="p-4 bg-orange-500/10 rounded-2xl border border-orange-500/20 flex items-center gap-4">
                                <div className="p-2 bg-orange-500/20 rounded-lg text-orange-500">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                                    </svg>
                                </div>
                                <p className="text-[11px] text-slate-300 leading-snug">
                                    Targeting <b>{currentHrc} HRC</b> for <b>{simSteel.name}</b> will maximize {parseFloat(currentHrc) > 60 ? 'Edge Retention' : 'Toughness'} balance.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 3. Recommendation Engine Card */}
                    <div className="glass-panel p-10 rounded-[2.5rem] border-white/10 bg-gradient-to-br from-indigo-500/10 to-transparent border-indigo-500/20 col-span-1 xl:col-span-2 flex flex-col items-center text-center">
                        <div className="p-4 bg-indigo-500/20 rounded-full text-indigo-400 border border-indigo-500/30 mb-6">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-4">Strategic Acquisition Target</h3>
                        <p className="text-slate-400 text-sm max-w-2xl mb-12">
                            Based on your collection's chemical gaps, we recommend adding a high-performance variant that balances your current {collectionFingerprint.length > 0 ? "metallurgical profile" : "starting point"}.
                        </p>

                        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                            <div className="md:col-span-2 glass-panel p-8 rounded-3xl bg-black/60 border-white/5 flex flex-col md:flex-row items-center gap-8">
                                <div className="text-6xl font-display font-black text-accent italic uppercase tracking-tighter shrink-0">{recommendedGrade?.name}</div>
                                <div className="space-y-4">
                                    <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 rounded-full w-fit">Optimal Fit</div>
                                    <p className="text-sm text-slate-300 leading-relaxed italic">
                                        "{recommendedGrade?.desc}"
                                    </p>
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {recommendedGrade?.knives.slice(0, 2).map((k, i) => (
                                            <span key={i} className="px-3 py-1.5 bg-white/5 rounded-xl text-[10px] font-bold text-slate-400 border border-white/5">{k}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="glass-panel p-8 rounded-3xl bg-indigo-600/10 border-indigo-500/20 flex flex-col justify-between">
                                <div className="space-y-2">
                                    <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Gap Resolved</div>
                                    <div className="text-2xl font-black text-white italic">
                                        {collectionFingerprint.length > 0 ? collectionFingerprint.sort((a, b) => b.industry - a.collection)[0].subject : "VANADIUM"}
                                    </div>
                                    <p className="text-[11px] text-slate-400 leading-loose">
                                        Adding this will increase your collection's wear resistance index by approximately <b>+18%</b>.
                                    </p>
                                </div>
                                <button className="w-full py-3 bg-white text-black rounded-xl font-black uppercase tracking-widest text-[10px] mt-6 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/10">
                                    Check Market
                                </button>
                            </div>
                        </div>
                    </div>

            </div>
            <Footer />
        </div>
    );
};

export default ProLabView;
