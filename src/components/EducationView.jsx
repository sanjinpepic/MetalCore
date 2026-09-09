'use client'

import React, { useState, useMemo } from 'react';
import ProducerMap from './ProducerMap';
import Footer from './Footer';
import ViewHeader from './Common/ViewHeader';


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
    'Beginner': { bg: 'bg-white/5', text: 'text-stone-300', border: 'border-white/10' },
    'Intermediate': { bg: 'bg-accent/10', text: 'text-accent', border: 'border-accent/25' },
    'Advanced': { bg: 'bg-accent-600/10', text: 'text-accent-600', border: 'border-accent-600/25' },
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
        <div className="flex flex-col flex-1 min-w-0 md:h-full md:overflow-y-auto custom-scrollbar bg-transparent relative pb-40 md:pb-0">
            {/* Desktop gradient overlay */}
            <div className="hidden md:block absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-accent/10 to-transparent pointer-events-none" />

            {/* Header */}
            <ViewHeader
                subtitle="Knowledge Base"
                title="Metallurgy"
                highlight="Academy"
                color="indigo"
            >
                <p className="text-stone-500 max-w-2xl text-xs md:text-lg leading-relaxed mt-2 md:mt-4 font-medium hidden md:block">
                    Master the science of steel. Explore technical terms, frequently asked questions, and the global industry leaders.
                </p>
            </ViewHeader>


            {/* Navigation Tabs & Search */}
            <div className="sticky top-0 z-[40] bg-transparent backdrop-blur-2xl transition-all w-full">
                {/* Mobile tabs — own row */}
                <div className="md:hidden px-4 pt-3 overflow-x-auto no-scrollbar">
                    <div className="flex gap-2">
                        {[
                            { id: 'GLOSSARY', label: 'Glossary', icon: 'M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5z' },
                            { id: 'PRODUCERS', label: 'Producers', icon: 'M12 22s8-4.5 8-11.8A8 8 0 0 0 4 10.2c0 7.3 8 11.8 8 11.8z' },
                            { id: 'FAQ', label: 'FAQ', icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-3 py-2 rounded-2xl flex items-center gap-2 text-[10px] font-mono font-medium uppercase tracking-[0.2em] transition-all duration-300 ease-snap shrink-0 ${activeTab === tab.id ? 'bg-accent text-[#1A0C05] scale-105 shadow-ember-sm' : 'bg-white/5 text-stone-500 hover:text-stone-300 hover:bg-white/10'}`}
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
                    <div className="md:hidden px-4 pb-2 overflow-x-auto no-scrollbar" style={{ maxWidth: '100vw' }}>
                        <div className="flex gap-1.5 py-1">
                            {GLOSSARY_CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`px-2.5 py-1 rounded-lg text-[9px] font-mono font-medium uppercase tracking-[0.2em] transition-all duration-300 ease-snap whitespace-nowrap shrink-0 ${activeCategory === cat.id
                                        ? 'bg-accent text-[#1A0C05] shadow-ember-sm'
                                        : 'bg-white/5 text-stone-500 hover:text-stone-300 hover:bg-white/10'
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Desktop: tabs + search row. Mobile: just search */}
                <div className="px-4 md:px-12 pb-3 pt-2 md:py-4 flex justify-between items-center gap-4">
                    <div className="hidden md:flex gap-2 shrink-0">
                        {[
                            { id: 'GLOSSARY', label: 'Glossary', icon: 'M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5z' },
                            { id: 'PRODUCERS', label: 'Producers', icon: 'M12 22s8-4.5 8-11.8A8 8 0 0 0 4 10.2c0 7.3 8 11.8 8 11.8z' },
                            { id: 'FAQ', label: 'FAQ', icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-3 rounded-2xl flex items-center gap-3 text-sm font-mono font-medium uppercase tracking-[0.2em] transition-all duration-300 ease-snap shrink-0 ${activeTab === tab.id ? 'bg-accent text-[#1A0C05] scale-105 shadow-ember-sm' : 'bg-white/5 text-stone-500 hover:text-stone-300 hover:bg-white/10'}`}
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
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-600">
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

            <div className="p-6 md:p-12 pb-32">
                {activeTab === 'GLOSSARY' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
                        {/* Category Filter Chips — desktop only (mobile chips are in sticky header) */}
                        {!searchTerm && (
                            <div className="hidden md:flex gap-2 overflow-x-auto no-scrollbar mb-8 pb-1">
                                {GLOSSARY_CATEGORIES.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveCategory(cat.id)}
                                        className={`px-5 py-2.5 rounded-2xl text-xs font-mono font-medium uppercase tracking-[0.2em] transition-all duration-300 ease-snap shrink-0 ${activeCategory === cat.id
                                            ? 'bg-accent text-[#1A0C05] shadow-ember-sm'
                                            : 'bg-white/5 text-stone-500 hover:text-stone-300 hover:bg-white/10 border border-white/5'
                                            }`}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Grouped Sections (ALL mode, no search) */}
                        {groupedGlossary ? (
                            <div className="space-y-8 md:space-y-12">
                                {GLOSSARY_CATEGORIES.filter(c => c.id !== 'ALL').map(cat => {
                                    const items = groupedGlossary[cat.id];
                                    if (!items || items.length === 0) return null;
                                    return (
                                        <section key={cat.id}>
                                            <div className="sticky top-[8.5rem] md:top-[4.25rem] z-20 -mx-6 px-6 md:-mx-12 md:px-12 py-2 md:py-3 mb-4 md:mb-6 bg-transparent backdrop-blur-2xl transition-all">
                                                <div className="flex items-center gap-2 md:gap-3">
                                                    <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-accent"></div>
                                                    <h2 className="text-xs md:text-sm font-mono font-medium text-stone-400 uppercase tracking-[0.2em]">{cat.id}</h2>
                                                    <div className="flex-1 h-px bg-white/5"></div>
                                                    <span className="text-[10px] font-mono font-medium text-stone-600">{items.length} {items.length === 1 ? 'term' : 'terms'}</span>
                                                </div>
                                            </div>
                                            <div>
                                                {items.map((item, idx) => (
                                                    <GlossaryEntry key={idx} item={item} index={idx} />
                                                ))}
                                            </div>
                                        </section>
                                    );
                                })}
                            </div>
                        ) : (
                            /* Filtered or searched view */
                            <div>
                                {filteredGlossary.map((item, idx) => (
                                    <GlossaryEntry key={idx} item={item} index={idx} />
                                ))}
                                {filteredGlossary.length === 0 && (
                                    <div className="text-center py-20">
                                        <p className="text-stone-600 text-sm font-medium">No terms found matching "{searchTerm}"</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'PRODUCERS' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
                        <ProducerMap producers={producers} />
                    </div>
                )}

                {activeTab === 'FAQ' && (
                    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10 w-full">
                        {FAQ_CATEGORIES.map(cat => {
                            const items = groupedFaq[cat];
                            if (!items || items.length === 0) return null;
                            return (
                                <section key={cat}>
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="p-1.5 rounded-lg bg-accent/10 border border-accent/25">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-accent">
                                                <path d={FAQ_CATEGORY_ICONS[cat]} />
                                            </svg>
                                        </div>
                                        <h2 className="text-xs md:text-sm font-mono font-medium text-stone-400 uppercase tracking-[0.2em]">{cat}</h2>
                                        <div className="flex-1 h-px bg-white/5"></div>
                                    </div>
                                    <div className="space-y-3">
                                        {items.map((item, idx) => {
                                            const globalIdx = faq.indexOf(item);
                                            const isOpen = expandedFaq.has(globalIdx);
                                            return (
                                                <div
                                                    key={globalIdx}
                                                    className={`glass-panel rounded-2xl border transition-all duration-300 ease-snap ${isOpen ? 'border-accent/25 bg-gradient-to-r from-accent/5 to-transparent' : 'border-white/5 hover:border-white/10'}`}
                                                >
                                                    <button
                                                        onClick={() => toggleFaq(globalIdx)}
                                                        className="w-full p-5 md:p-6 flex items-center gap-4 md:gap-5 text-left"
                                                    >
                                                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 border font-display text-sm transition-all duration-300 ease-snap ${isOpen ? 'bg-accent/15 border-accent/30 text-accent' : 'bg-accent/10 border-accent/25 text-accent/60'}`}>
                                                            Q
                                                        </div>
                                                        <h3 className={`flex-1 text-sm md:text-base font-display uppercase tracking-tight leading-tight transition-colors duration-300 ${isOpen ? 'text-white' : 'text-stone-300'}`}>
                                                            {item.q}
                                                        </h3>
                                                        <svg
                                                            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                                                            className={`shrink-0 text-stone-500 transition-transform duration-300 ease-snap ${isOpen ? 'rotate-180' : ''}`}
                                                        >
                                                            <polyline points="6 9 12 15 18 9" />
                                                        </svg>
                                                    </button>
                                                    <div
                                                        className={`grid transition-all duration-300 ease-out-expo ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                                                    >
                                                        <div className="overflow-hidden">
                                                            <div className="px-5 md:px-6 pb-5 md:pb-6 pl-[4.25rem] md:pl-[5rem]">
                                                                <div className="flex gap-5">
                                                                    <div className="w-px bg-accent/25 shrink-0 my-1"></div>
                                                                    <p className="text-stone-400 text-sm md:text-base leading-relaxed font-medium">{item.a}</p>
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

const GlossaryEntry = ({ item, index }) => {
    const level = LEVEL_COLORS[item.level] || LEVEL_COLORS['Beginner'];
    return (
        <div className="group relative grid grid-cols-[auto_1fr] md:grid-cols-[3rem_minmax(11rem,18rem)_6.5rem_1fr] gap-x-4 md:gap-x-8 items-baseline px-2 md:px-4 py-4 md:py-5 border-b border-white/[0.04] hover:bg-white/[0.025] transition-colors duration-300 ease-snap">
            <span className="absolute left-0 top-0 h-full w-[2px] bg-accent origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-snap" />
            <span className="text-[10px] font-mono font-medium text-stone-700 group-hover:text-accent transition-colors duration-300">
                {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="text-base md:text-lg font-display text-white uppercase tracking-tight leading-tight group-hover:text-accent transition-colors duration-300">
                {item.term}
            </h3>
            <span className={`justify-self-start hidden md:inline-block text-[8px] font-mono font-medium uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border ${level.bg} ${level.text} ${level.border}`}>
                {item.level}
            </span>
            <p className="col-span-2 md:col-span-1 text-stone-400 text-xs md:text-sm leading-relaxed font-medium mt-1 md:mt-0">
                {item.def}
            </p>
        </div>
    );
};

export default EducationView;
