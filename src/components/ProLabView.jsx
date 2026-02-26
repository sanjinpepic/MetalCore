'use client'

import React, { useState, useMemo } from 'react';
import { useUser } from '../context/UserContext';
import { useSettings } from '../context/SettingsContext';
import Footer from './Footer';
import AlloyBreakdown, { ELEMENT_DATA } from './ProLab/AlloyBreakdown';
import PerformanceFrontier from './ProLab/PerformanceFrontier';
import HeatTreatMaster from './ProLab/HeatTreatMaster';
import CustomSelect from './Common/CustomSelect';

const ProLabView = ({ steels }) => {
    const { myKnives } = useUser();
    const [simSteel, setSimSteel] = useState(steels.find(s => s.name === 'MagnaCut') || steels[0]);
    const [compareSteel, setCompareSteel] = useState(null);
    const [activeTab, setActiveTab] = useState('ANALYZE'); // ANALYZE, DUEL

    const filteredSteels = useMemo(() => {
        return steels.sort((a, b) => a.name.localeCompare(b.name));
    }, [steels]);

    const duelElements = useMemo(() => {
        if (!compareSteel) return null;
        const keys = Object.keys(ELEMENT_DATA);
        const union = keys.filter(el => (simSteel[el] > 0) || (compareSteel[el] > 0));
        return union;
    }, [simSteel, compareSteel]);

    return (
        <div className="flex flex-col flex-1 min-w-0 min-h-dvh md:h-full md:overflow-y-auto custom-scrollbar bg-slate-950 p-6 md:p-12">
            <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="text-xs font-black text-indigo-500 uppercase tracking-[0.3em] mb-2 italic">Metallurgical Suite</div>
                    <h1 className="text-4xl md:text-6xl font-display font-black text-white italic uppercase tracking-tighter leading-none">
                        PRO LAB <span className="text-indigo-500 underline underline-offset-8 decoration-4">ANALYTICS</span>
                    </h1>
                </div>

                <div className="flex gap-2 bg-white/5 p-1 rounded-2xl border border-white/5 w-fit">
                    <button
                        onClick={() => setActiveTab('ANALYZE')}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'ANALYZE' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Deep Analysis
                    </button>
                    <button
                        onClick={() => setActiveTab('DUEL')}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'DUEL' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Alloy Duel
                    </button>
                </div>
            </header>

            <div className="flex flex-col gap-8 pb-32">
                {/* Global Selection Bar */}
                <div className="glass-panel p-6 rounded-3xl flex flex-wrap items-center gap-6 border-white/5">
                    <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Primary Specimen</span>
                        <CustomSelect
                            options={filteredSteels}
                            value={simSteel.id}
                            onChange={(opt) => setSimSteel(opt)}
                            accentColor="indigo"
                            className="min-w-[240px]"
                        />
                    </div>

                    {activeTab === 'DUEL' && (
                        <>
                            <div className="text-indigo-500 font-display font-black italic text-2xl pt-4">VS</div>
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Opponent Specimen</span>
                                <CustomSelect
                                    options={filteredSteels.filter(s => s.id !== simSteel.id)}
                                    value={compareSteel?.id || ''}
                                    onChange={(opt) => setCompareSteel(opt)}
                                    placeholder="Select Opponent..."
                                    accentColor="emerald"
                                    className="min-w-[240px]"
                                />
                            </div>
                        </>
                    )}

                    <div className="ml-auto hidden xl:block">
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Selected Class</div>
                                <div className="text-sm font-black text-white italic uppercase">{simSteel.pm ? 'Powder Metallurgy' : 'Ingot Steel'}</div>
                            </div>
                            <div className="w-px h-8 bg-white/10" />
                            <div className="text-right">
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Producer</div>
                                <div className="text-sm font-black text-indigo-400 italic uppercase">{simSteel.producer}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {activeTab === 'ANALYZE' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Row 1: DNA & Performance Side-by-Side */}
                        <div className="glass-panel p-8 rounded-[2.5rem] border-white/5">
                            <AlloyBreakdown steel={simSteel} />
                        </div>

                        <div className="glass-panel p-8 rounded-[2.5rem] border-white/5 h-[600px]">
                            <PerformanceFrontier steel={simSteel} steels={steels} />
                        </div>

                        {/* Row 2: Industrial HT Protocols - Full Width */}
                        <div className="lg:col-span-2 glass-panel p-8 rounded-[2.5rem] border-indigo-500/10 bg-indigo-500/5">
                            <HeatTreatMaster steel={simSteel} />
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {compareSteel ? (
                            <>
                                <div className="glass-panel p-8 rounded-[2.5rem] border-white/5 space-y-8">
                                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                        <h2 className="text-3xl font-black text-white italic uppercase">{simSteel.name}</h2>
                                        <span className="text-[10px] font-black text-slate-500 uppercase">{simSteel.producer}</span>
                                    </div>
                                    <AlloyBreakdown steel={simSteel} customElements={duelElements} />
                                    <div className="pt-8 border-t border-white/5">
                                        <HeatTreatMaster steel={simSteel} />
                                    </div>
                                </div>
                                <div className="glass-panel p-8 rounded-[2.5rem] border-indigo-500/20 bg-indigo-500/5 space-y-8">
                                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                        <h2 className="text-3xl font-black text-indigo-400 italic uppercase">{compareSteel.name}</h2>
                                        <span className="text-[10px] font-black text-indigo-500/50 uppercase">{compareSteel.producer}</span>
                                    </div>
                                    <AlloyBreakdown steel={compareSteel} customElements={duelElements} />
                                    <div className="pt-8 border-t border-white/5">
                                        <HeatTreatMaster steel={compareSteel} />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="xl:col-span-2 py-32 flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 mb-6 animate-bounce">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Initialize Duel</h3>
                                <p className="text-slate-500 text-sm max-w-xs mt-2 uppercase font-black tracking-widest leading-loose">
                                    Select an opponent specimen above to compare chemical signatures and heat-treat protocols side-by-side.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default ProLabView;
