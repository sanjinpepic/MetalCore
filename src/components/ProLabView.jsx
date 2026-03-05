'use client'

import React, { useState, useMemo } from 'react';
import { useUser } from '../context/UserContext';
import { useSettings } from '../context/SettingsContext';
import Footer from './Footer';
import ViewHeader from './Common/ViewHeader';

import AlloyBreakdown, { ELEMENT_DATA } from './ProLab/AlloyBreakdown';
import PerformanceFrontier from './ProLab/PerformanceFrontier';
import HeatTreatMaster from './ProLab/HeatTreatMaster';
import CustomSelect from './Common/CustomSelect';
import HeatTreatSimulator from './HeatTreatSimulator';

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
        <div className="flex flex-col flex-1 min-w-0 min-h-dvh md:h-full md:overflow-y-auto custom-scrollbar bg-black relative">
            {/* Desktop gradient overlay — matches sidebar and HomeView gradient spread */}
            <div className="hidden md:block absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-orange-500/10 to-transparent pointer-events-none" />

            <ViewHeader
                subtitle="Metallurgical Suite"
                title="Pro Lab"
                highlight="Analytics"
                color="orange"
            />

            {/* Navigation Tabs */}
            <div className="sticky top-0 z-30 bg-transparent backdrop-blur-2xl mb-6 md:mb-12 transition-all">
                <div className="px-6 md:px-12 pb-3 pt-2 md:py-4 flex flex-wrap items-center gap-4">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar">
                        <button
                            onClick={() => setActiveTab('ANALYZE')}
                            className={`px-6 py-3 rounded-2xl text-xs md:text-sm font-black whitespace-nowrap uppercase italic tracking-wider transition-all shrink-0 ${activeTab === 'ANALYZE' ? 'bg-orange-500 text-black scale-105 shadow-lg shadow-orange-500/20' : 'bg-white/5 text-slate-500 hover:text-slate-300 hover:bg-white/10'}`}
                        >
                            Deep Analysis
                        </button>
                        <button
                            onClick={() => setActiveTab('DUEL')}
                            className={`px-6 py-3 rounded-2xl text-xs md:text-sm font-black whitespace-nowrap uppercase italic tracking-wider transition-all shrink-0 ${activeTab === 'DUEL' ? 'bg-orange-500 text-black scale-105 shadow-lg shadow-orange-500/20' : 'bg-white/5 text-slate-500 hover:text-slate-300 hover:bg-white/10'}`}
                        >
                            Alloy Duel
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-8 pb-32 px-6 md:px-12">
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
                                <div className="text-sm font-black text-indigo-400 italic uppercase">{simSteel.parent ?? simSteel.producer}</div>
                                {simSteel.parent && <div className="text-[9px] text-slate-600 uppercase tracking-widest">inv. {simSteel.producer}</div>}
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

                        {/* Interactive Laboratory Tools */}
                        <div className="glass-panel p-8 rounded-[2.5rem] border-white/5">
                            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3 italic">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-orange-500">
                                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                                </svg>
                                Thermodynamic Simulator
                            </h4>
                            <HeatTreatSimulator steel={simSteel} />
                        </div>

                        {/* Row 2: Industrial HT Protocols - Full Width */}
                        <div className="lg:col-span-2 glass-panel p-8 rounded-[2.5rem] border-indigo-500/10 bg-indigo-500/5">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-indigo-500/20 rounded-xl">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-indigo-400">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                </div>
                                <h3 className="text-sm md:text-base font-black text-white uppercase tracking-widest italic">Industrial Protocol</h3>
                            </div>
                            <HeatTreatMaster steel={simSteel} />
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {compareSteel ? (
                            <>
                                <div className="xl:col-span-2 glass-panel p-8 rounded-[2.5rem] border-white/5">
                                    <h4 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3 italic">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-orange-500">
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                            <polyline points="22 4 12 14.01 9 11.01" />
                                        </svg>
                                        Chemical Signature Duel
                                    </h4>
                                    <ChemicalRadar steels={[simSteel, compareSteel]} />
                                </div>
                                <div className="glass-panel p-8 rounded-[2.5rem] border-white/5 space-y-8">
                                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                        <h2 className="text-3xl font-black text-white italic uppercase">{simSteel.name}</h2>
                                        <div className="text-right">
                                            <span className="text-[10px] font-black text-slate-500 uppercase">{simSteel.parent ?? simSteel.producer}</span>
                                            {simSteel.parent && <div className="text-[9px] text-slate-600 uppercase tracking-widest">inv. {simSteel.producer}</div>}
                                        </div>
                                    </div>
                                    <AlloyBreakdown steel={simSteel} customElements={duelElements} />
                                    <div className="pt-8 border-t border-white/5">
                                        <div className="flex items-center gap-2 mb-6">
                                            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Industrial Protocol</span>
                                        </div>
                                        <HeatTreatSimulator steel={simSteel} />
                                    </div>
                                </div>
                                <div className="glass-panel p-8 rounded-[2.5rem] border-indigo-500/20 bg-indigo-500/5 space-y-8">
                                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                        <h2 className="text-3xl font-black text-indigo-400 italic uppercase">{compareSteel.name}</h2>
                                        <div className="text-right">
                                            <span className="text-[10px] font-black text-indigo-500/50 uppercase">{compareSteel.parent ?? compareSteel.producer}</span>
                                            {compareSteel.parent && <div className="text-[9px] text-indigo-900/80 uppercase tracking-widest">inv. {compareSteel.producer}</div>}
                                        </div>
                                    </div>
                                    <AlloyBreakdown steel={compareSteel} customElements={duelElements} />
                                    <div className="pt-8 border-t border-white/5">
                                        <div className="flex items-center gap-2 mb-6">
                                            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                            <span className="text-[10px] font-black text-indigo-500/50 uppercase tracking-widest">Industrial Protocol</span>
                                        </div>
                                        <HeatTreatSimulator steel={compareSteel} />
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
