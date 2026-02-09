'use client'

import React, { useState, useMemo } from 'react';
import ProducerMap from './ProducerMap';
import Footer from './Footer';

const GLOSSARY_CATEGORIES = [
    { id: 'ALL', label: 'All' },
    { id: 'Fundamentals', label: 'Fundamentals' },
    { id: 'Alloying Elements', label: 'Elements' },
    { id: 'Microstructure', label: 'Microstructure' },
    { id: 'Heat Treatment', label: 'Heat Treat' },
    { id: 'Manufacturing', label: 'Manufacturing' },
];

const FAQ_CATEGORIES = ['Getting Started', 'Maintenance', 'Technology'];

const FAQ_CATEGORY_ICONS = {
    'Getting Started': 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
    'Maintenance': 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
    'Technology': 'M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83',
};

const LEVEL_COLORS = {
    'Beginner': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    'Intermediate': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
    'Advanced': { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' },
};

const EducationView = ({ glossary, faq, producers }) => {
    const [activeTab, setActiveTab] = useState('GLOSSARY');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('ALL');
    const [expandedFaq, setExpandedFaq] = useState(new Set());

    const toggleFaq = (idx) => {
        setExpandedFaq(prev => {
            const next = new Set(prev);
            if (next.has(idx)) next.delete(idx);
            else next.add(idx);
            return next;
        });
    };

    const filteredGlossary = useMemo(() => {
        let items = glossary;
        if (searchTerm) {
            items = items.filter(item =>
                item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.def.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (activeCategory !== 'ALL' && !searchTerm) {
            items = items.filter(item => item.category === activeCategory);
        }
        return items;
    }, [searchTerm, activeCategory, glossary]);

    const groupedGlossary = useMemo(() => {
        if (searchTerm || activeCategory !== 'ALL') return null;
        const groups = {};
        for (const item of glossary) {
            if (!groups[item.category]) groups[item.category] = [];
            groups[item.category].push(item);
        }
        return groups;
    }, [searchTerm, activeCategory, glossary]);

    const groupedFaq = useMemo(() => {
        const groups = {};
        for (const cat of FAQ_CATEGORIES) {
            groups[cat] = faq.filter(item => item.category === cat);
        }
        return groups;
    }, [faq]);

    return (
        <div className="flex-1 min-h-dvh md:h-full md:overflow-y-auto bg-black custom-scrollbar max-w-[100vw] [overflow-x:clip]">
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
            <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl">
                {/* Mobile tabs — own row */}
                <div className="md:hidden px-4 pt-4 pb-2 overflow-x-auto no-scrollbar">
                    <div className="flex gap-2">
                        {[
                            { id: 'GLOSSARY', label: 'Glossary', icon: 'M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5z' },
                            { id: 'PRODUCERS', label: 'Producers', icon: 'M12 22s8-4.5 8-11.8A8 8 0 0 0 4 10.2c0 7.3 8 11.8 8 11.8z' },
                            { id: 'FAQ', label: 'FAQ', icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-3 py-2 rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase italic tracking-wider transition-all shrink-0 ${activeTab === tab.id ? 'bg-accent text-black scale-105 shadow-lg shadow-accent/20' : 'bg-white/5 text-slate-500 hover:text-slate-300 hover:bg-white/10'}`}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d={tab.icon} />
                                    {tab.id === 'PRODUCERS' && <circle cx="12" cy="10" r="3" />}
                                </svg>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Mobile glossary category chips — own row below tabs */}
                {activeTab === 'GLOSSARY' && !searchTerm && (
                    <div className="md:hidden px-4 pb-2 overflow-x-auto no-scrollbar">
                        <div className="flex gap-2">
                            {GLOSSARY_CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`px-3 py-1.5 rounded-2xl text-[10px] font-black uppercase italic tracking-wider transition-all whitespace-nowrap shrink-0 ${activeCategory === cat.id
                                        ? 'bg-indigo-500 text-black scale-105 shadow-lg shadow-indigo-500/20'
                                        : 'bg-white/5 text-slate-500 hover:text-slate-300 hover:bg-white/10'
                                    }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Desktop: tabs + search row. Mobile: just search */}
                <div className="px-4 md:px-12 pb-4 pt-2 md:py-4 flex justify-between items-center gap-4">
                    <div className="hidden md:flex gap-2 overflow-x-auto no-scrollbar">
                        {[
                            { id: 'GLOSSARY', label: 'Glossary', icon: 'M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5z' },
                            { id: 'PRODUCERS', label: 'Producers', icon: 'M12 22s8-4.5 8-11.8A8 8 0 0 0 4 10.2c0 7.3 8 11.8 8 11.8z' },
                            { id: 'FAQ', label: 'FAQ', icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-3 rounded-2xl flex items-center gap-3 text-sm font-black uppercase italic tracking-wider transition-all shrink-0 ${activeTab === tab.id ? 'bg-accent text-black scale-105 shadow-lg shadow-accent/20' : 'bg-white/5 text-slate-500 hover:text-slate-300 hover:bg-white/10'}`}
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
                        <div className="relative w-full md:w-64">
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
            </div>

            <div className="p-4 md:p-12 pb-32">
                {activeTab === 'GLOSSARY' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Category Filter Chips — desktop only (mobile chips are in sticky header) */}
                        {!searchTerm && (
                            <div className="hidden md:flex gap-2 overflow-x-auto no-scrollbar mb-8 pb-1">
                                {GLOSSARY_CATEGORIES.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveCategory(cat.id)}
                                        className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase italic tracking-wider transition-all shrink-0 ${activeCategory === cat.id
                                            ? 'bg-accent text-black scale-105 shadow-lg shadow-accent/20'
                                            : 'bg-white/5 text-slate-500 hover:text-slate-300 hover:bg-white/10 border border-white/5'
                                        }`}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Grouped Sections (ALL mode, no search) */}
                        {groupedGlossary ? (
                            <div className="space-y-12">
                                {GLOSSARY_CATEGORIES.filter(c => c.id !== 'ALL').map(cat => {
                                    const items = groupedGlossary[cat.id];
                                    if (!items || items.length === 0) return null;
                                    return (
                                        <section key={cat.id}>
                                            <div className="sticky top-[9.75rem] md:top-[4.5rem] z-20 -mx-4 px-4 md:-mx-12 md:px-12 py-3 mb-3 bg-black/80 backdrop-blur-xl">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                                                    <h2 className="text-xs md:text-sm font-black text-slate-400 uppercase tracking-[0.2em] italic">{cat.id}</h2>
                                                    <div className="flex-1 h-px bg-white/5"></div>
                                                    <span className="text-[10px] font-bold text-slate-600">{items.length} terms</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                                {items.map((item, idx) => (
                                                    <GlossaryCard key={idx} item={item} />
                                                ))}
                                            </div>
                                        </section>
                                    );
                                })}
                            </div>
                        ) : (
                            /* Filtered or searched view */
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                {filteredGlossary.map((item, idx) => (
                                    <GlossaryCard key={idx} item={item} />
                                ))}
                                {filteredGlossary.length === 0 && (
                                    <div className="col-span-full text-center py-20">
                                        <p className="text-slate-600 text-sm italic font-medium">No terms found matching "{searchTerm}"</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'PRODUCERS' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <ProducerMap producers={producers} />
                    </div>
                )}

                {activeTab === 'FAQ' && (
                    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
                        {FAQ_CATEGORIES.map(cat => {
                            const items = groupedFaq[cat];
                            if (!items || items.length === 0) return null;
                            return (
                                <section key={cat}>
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-indigo-400">
                                                <path d={FAQ_CATEGORY_ICONS[cat]} />
                                            </svg>
                                        </div>
                                        <h2 className="text-xs md:text-sm font-black text-slate-400 uppercase tracking-[0.2em] italic">{cat}</h2>
                                        <div className="flex-1 h-px bg-white/5"></div>
                                    </div>
                                    <div className="space-y-3">
                                        {items.map((item, idx) => {
                                            const globalIdx = faq.indexOf(item);
                                            const isOpen = expandedFaq.has(globalIdx);
                                            return (
                                                <div
                                                    key={globalIdx}
                                                    className={`glass-panel rounded-2xl border transition-all ${isOpen ? 'border-indigo-500/20 bg-gradient-to-r from-indigo-500/5 to-transparent' : 'border-white/5 hover:border-white/10'}`}
                                                >
                                                    <button
                                                        onClick={() => toggleFaq(globalIdx)}
                                                        className="w-full p-5 md:p-6 flex items-center gap-4 md:gap-5 text-left"
                                                    >
                                                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 border font-display font-black italic text-sm transition-all ${isOpen ? 'bg-indigo-600/30 border-indigo-500/30 text-indigo-300' : 'bg-indigo-600/10 border-indigo-500/20 text-indigo-500'}`}>
                                                            Q
                                                        </div>
                                                        <h3 className={`flex-1 text-sm md:text-base font-display font-black uppercase italic tracking-tighter leading-tight transition-colors ${isOpen ? 'text-white' : 'text-slate-300'}`}>
                                                            {item.q}
                                                        </h3>
                                                        <svg
                                                            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                                                            className={`shrink-0 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                                                        >
                                                            <polyline points="6 9 12 15 18 9" />
                                                        </svg>
                                                    </button>
                                                    <div
                                                        className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                                                    >
                                                        <div className="overflow-hidden">
                                                            <div className="px-5 md:px-6 pb-5 md:pb-6 pl-[4.25rem] md:pl-[5rem]">
                                                                <div className="flex gap-5">
                                                                    <div className="w-px bg-indigo-500/20 shrink-0 my-1"></div>
                                                                    <p className="text-slate-400 text-sm md:text-base leading-relaxed italic font-medium">{item.a}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

const GlossaryCard = ({ item }) => {
    const level = LEVEL_COLORS[item.level] || LEVEL_COLORS['Beginner'];
    return (
        <div className="glass-panel p-5 md:p-7 rounded-2xl md:rounded-[2rem] border-white/5 bg-gradient-to-br from-white/5 to-transparent hover:border-white/20 transition-all group">
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="text-accent text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] opacity-60">{item.category}</div>
                <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${level.bg} ${level.text} ${level.border}`}>
                    {item.level}
                </span>
            </div>
            <h3 className="text-base md:text-lg font-display font-black text-white italic uppercase tracking-tighter mb-3 group-hover:text-accent transition-colors leading-tight">{item.term}</h3>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-medium italic">"{item.def}"</p>
        </div>
    );
};

export default EducationView;
