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
        <div className="flex flex-col flex-1 min-w-0 md:h-full md:overflow-y-auto custom-scrollbar bg-transparent relative pb-40 md:pb-0">
            {/* Desktop gradient overlay — matches sidebar and HomeView gradient spread */}
            <div className="hidden md:block absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-accent/10 to-transparent pointer-events-none" />

            <ViewHeader
                subtitle="Metallurgical Suite"
                title="Pro Lab"
                highlight="Analytics"
                color="orange"
            />

            {/* Navigation Tabs */}
            <div className="sticky top-0 z-30 bg-transparent backdrop-blur-2xl mb-6 md:mb-12 transition-colors">
                <div className="px-6 md:px-12 pb-3 pt-2 md:py-4 flex flex-wrap items-center gap-4">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar">
                        <button
                            onClick={() => setActiveTab('ANALYZE')}
                            className={activeTab === 'ANALYZE' ? 'px-6 py-3 rounded-2xl text-[10px] md:text-[11px] font-mono font-medium whitespace-nowrap uppercase tracking-[0.2em] transition-colors shrink-0 bg-accent text-[#1A0C05] shadow-ember-sm' : 'px-6 py-3 rounded-2xl text-[10px] md:text-[11px] font-mono font-medium whitespace-nowrap uppercase tracking-[0.2em] transition-colors shrink-0 bg-white/5 text-stone-500 hover:text-stone-300 hover:bg-white/10 border border-transparent'}
                        >
                            Deep Analysis
                        </button>
                        <button
                            onClick={() => setActiveTab('DUEL')}
                            className={activeTab === 'DUEL' ? 'px-6 py-3 rounded-2xl text-[10px] md:text-[11px] font-mono font-medium whitespace-nowrap uppercase tracking-[0.2em] transition-colors shrink-0 bg-accent text-[#1A0C05] shadow-ember-sm' : 'px-6 py-3 rounded-2xl text-[10px] md:text-[11px] font-mono font-medium whitespace-nowrap uppercase tracking-[0.2em] transition-colors shrink-0 bg-white/5 text-stone-500 hover:text-stone-300 hover:bg-white/10 border border-transparent'}
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
                        <span className="text-[10px] font-mono font-medium text-stone-500 uppercase tracking-[0.2em]">Primary Grade</span>
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
                            <div className="text-accent font-display text-2xl pt-4">VS</div>
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-mono font-medium text-stone-500 uppercase tracking-[0.2em]">Opponent Grade</span>
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
                                <div className="text-[10px] font-mono font-medium text-stone-500 uppercase tracking-[0.2em]">Selected Class</div>
                                <div className="text-sm font-semibold text-white uppercase">{simSteel.pm ? 'Powder Metallurgy' : 'Ingot Steel'}</div>
                            </div>
                            <div className="w-px h-8 bg-white/10" />
                            <div className="text-right">
                                <div className="text-[10px] font-mono font-medium text-stone-500 uppercase tracking-[0.2em]">Producer</div>
                                <div className="text-sm font-semibold text-accent-400 uppercase">{simSteel.parent ?? simSteel.producer}</div>
                                {simSteel.parent && <div className="text-[9px] text-stone-600 uppercase tracking-[0.2em]">inv. {simSteel.producer}</div>}
                            </div>
                        </div>
                    </div>
                </div>

                {activeTab === 'ANALYZE' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Row 1: DNA & Performance Side-by-Side */}
                        <div className="glass-panel p-8 rounded-3xl border-white/5">
                            <AlloyBreakdown steel={simSteel} />
                        </div>

                        <div className="glass-panel p-8 rounded-3xl border-white/5 h-[600px]">
                            <PerformanceFrontier steel={simSteel} steels={steels} />
                        </div>

                        {/* Interactive Laboratory Tools */}
                        <div className="glass-panel p-8 rounded-3xl border-white/5">
                            <h4 className="text-base font-display text-white uppercase tracking-tight mb-8 flex items-center gap-3">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-accent">
                                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                                </svg>
                                Thermodynamic Simulator
                            </h4>
                            <HeatTreatSimulator steel={simSteel} />
                        </div>

                        {/* Row 2: Industrial HT Protocols - Full Width */}
                        <div className="lg:col-span-2 glass-panel p-8 rounded-3xl border-accent/10 bg-accent/5">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-accent/20 rounded-xl">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-accent-400">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                </div>
                                <h3 className="text-sm md:text-base font-display text-white uppercase tracking-tight">Industrial Protocol</h3>
                            </div>
                            <HeatTreatMaster steel={simSteel} />
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {compareSteel ? (
                            <>
                                <div className="xl:col-span-2 glass-panel p-8 rounded-3xl border-accent/20 bg-accent/5">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="p-2 bg-accent/20 rounded-xl">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-accent-400">
                                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-sm md:text-base font-display text-white uppercase tracking-tight">Metallurgical Duel Analysis</h3>
                                    </div>
                                    <p className="text-stone-400 text-sm max-w-2xl">
                                        Comparing the chemical signatures and thermal processing protocols of {simSteel.name} versus {compareSteel.name}.
                                        Below you will find the carbide-forming element breakdown and suggested optimization protocols for both grades.
                                    </p>
                                </div>
                                <div className="glass-panel p-8 rounded-3xl border-white/5 space-y-8">
                                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                        <h2 className="text-3xl font-display text-white uppercase tracking-tight">{simSteel.name}</h2>
                                        <div className="text-right">
                                            <span className="text-[10px] font-mono font-medium text-stone-500 uppercase">{simSteel.parent ?? simSteel.producer}</span>
                                            {simSteel.parent && <div className="text-[9px] text-stone-600 uppercase tracking-[0.2em]">inv. {simSteel.producer}</div>}
                                        </div>
                                    </div>
                                    <AlloyBreakdown steel={simSteel} customElements={duelElements} />
                                    <div className="pt-8 border-t border-white/5">
                                        <div className="flex items-center gap-2 mb-6">
                                            <div className="w-2 h-2 rounded-full bg-accent animate-ember-pulse" />
                                            <span className="text-[10px] font-mono font-medium text-stone-500 uppercase tracking-[0.2em]">Industrial Protocol</span>
                                        </div>
                                        <HeatTreatSimulator steel={simSteel} />
                                    </div>
                                </div>
                                <div className="glass-panel p-8 rounded-3xl border-accent/20 bg-accent/5 space-y-8">
                                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                        <h2 className="text-3xl font-display text-accent-400 uppercase tracking-tight">{compareSteel.name}</h2>
                                        <div className="text-right">
                                            <span className="text-[10px] font-mono font-medium text-accent/50 uppercase">{compareSteel.parent ?? compareSteel.producer}</span>
                                            {compareSteel.parent && <div className="text-[9px] text-accent/50 uppercase tracking-[0.2em]">inv. {compareSteel.producer}</div>}
                                        </div>
                                    </div>
                                    <AlloyBreakdown steel={compareSteel} customElements={duelElements} />
                                    <div className="pt-8 border-t border-white/5">
                                        <div className="flex items-center gap-2 mb-6">
                                            <div className="w-2 h-2 rounded-full bg-accent animate-ember-pulse" />
                                            <span className="text-[10px] font-mono font-medium text-accent/50 uppercase tracking-[0.2em]">Industrial Protocol</span>
                                        </div>
                                        <HeatTreatSimulator steel={compareSteel} />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="xl:col-span-2 py-32 flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-6 animate-ember-pulse shadow-ember-sm">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-display text-white uppercase tracking-tight">Initialize Duel</h3>
                                <p className="text-stone-500 text-sm max-w-xs mt-2 leading-relaxed">
                                    Select an opponent grade above to compare chemical signatures and heat-treat protocols side-by-side.
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
