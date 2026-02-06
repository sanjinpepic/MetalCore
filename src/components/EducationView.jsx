'use client'

import React, { useState, useMemo } from 'react';
// Imports removed
import ProducerMap from './ProducerMap';
import Footer from './Footer';

const EducationView = ({ glossary, faq, producers }) => {
    const [activeTab, setActiveTab] = useState('GLOSSARY');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredGlossary = useMemo(() => {
        if (!searchTerm) return glossary;
        return glossary.filter(item =>
            item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.def.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    return (
        <div className="flex-1 h-full overflow-y-auto bg-black custom-scrollbar">
            {/* Header */}
            <header className="p-6 md:p-12 pb-4 md:pb-8 pt-20 md:pt-16 space-y-2 md:space-y-6 shrink-0 bg-gradient-to-b from-indigo-500/10 to-transparent">
                <div>
                    <div className="text-[10px] md:text-xs font-black text-indigo-400 mb-1 md:mb-3 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-6 h-px bg-indigo-500/30"></span>
                        Knowledge Base
                    </div>
                    <h1 className="text-2xl md:text-6xl font-display font-black text-white tracking-tighter italic uppercase leading-none md:leading-tight">Metallurgy <br className="hidden md:block" /><span className="text-accent">Academy</span></h1>
                    <p className="text-slate-500 max-w-2xl text-xs md:text-lg leading-relaxed mt-2 md:mt-4 italic font-medium hidden md:block">Master the science of steel. Explore technical terms, frequently asked questions, and the global industry leaders.</p>
                </div>
            </header>

            {/* Navigation Tabs & Search */}
            <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-y border-white/5 px-4 md:px-12 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
                    {[
                        { id: 'GLOSSARY', label: 'Glossary', icon: 'M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5z' },
                        { id: 'PRODUCERS', label: 'Producers', icon: 'M12 22s8-4.5 8-11.8A8 8 0 0 0 4 10.2c0 7.3 8 11.8 8 11.8z' },
                        { id: 'FAQ', label: 'FAQ', icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-3 py-2 md:px-6 md:py-3 rounded-2xl flex items-center gap-2 md:gap-3 text-[10px] md:text-sm font-black uppercase italic tracking-wider transition-all shrink-0 ${activeTab === tab.id ? 'bg-accent text-black scale-105 shadow-lg shadow-accent/20' : 'bg-white/5 text-slate-500 hover:text-slate-300 hover:bg-white/10'}`}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d={tab.icon} />
                                {tab.id === 'PRODUCERS' && <circle cx="12" cy="10" r="3" />}
                            </svg>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === 'GLOSSARY' && (
                    <div className="relative w-full md:w-64 animate-in fade-in slide-in-from-right-4">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600">
                            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Filter glossary..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-6 text-white text-xs focus:outline-none focus:border-accent/40 transition-colors"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                )}
            </div>

            <div className="p-8 md:p-12 pb-32">
                {activeTab === 'GLOSSARY' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredGlossary.map((item, idx) => (
                                <div key={idx} className="glass-panel p-6 md:p-8 rounded-[2rem] border-white/5 bg-gradient-to-br from-white/5 to-transparent hover:border-white/20 transition-all group">
                                    <div className="text-accent text-[10px] font-black mb-2 uppercase tracking-[0.2em] opacity-60">Technical Term</div>
                                    <h3 className="text-lg md:text-xl font-display font-black text-white italic uppercase tracking-tighter mb-4 group-hover:text-accent transition-colors">{item.term}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed font-medium italic">"{item.def}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'PRODUCERS' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <ProducerMap producers={producers} />
                    </div>
                )}

                {activeTab === 'FAQ' && (
                    <div className="max-w-4xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {faq.map((item, idx) => (
                            <div key={idx} className="glass-panel p-6 md:p-8 rounded-[2rem] border-white/5 bg-gradient-to-r from-indigo-500/5 to-transparent">
                                <div className="flex gap-6">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 flex items-center justify-center shrink-0 border border-indigo-500/20 text-indigo-400 font-display font-black italic">Q</div>
                                    <div className="space-y-4">
                                        <h3 className="text-lg md:text-xl font-display font-black text-white uppercase italic tracking-tighter leading-tight">{item.q}</h3>
                                        <div className="flex gap-6">
                                            <div className="w-px bg-white/10 shrink-0 my-1"></div>
                                            <p className="text-slate-400 text-sm md:text-base leading-relaxed italic font-medium">{item.a}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div >
    );
};

export default EducationView;
