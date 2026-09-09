import React, { useMemo, useRef, useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';
import { convertTemperature, getTemperatureUnit } from '../utils/temperature';
import Footer from './Footer';
import ViewHeader from './Common/ViewHeader';
import { PRODUCER_COLORS as producerColorsShared, getProducerColor as getProducerColorShared } from '../utils/producerColors';

import { hapticFeedback, useMobile } from '../hooks/useMobile';

const HomeView = ({ setView, steels, setDetailSteel, search, setSearch, compareList, toggleCompare, producers, incrementTrending, resetFilters, setShowRecommender }) => {
    const { isMobile } = useMobile();
    const { dashboardLayout, setDashboardLayout } = useSettings();
    const searchContainerRef = useRef(null);

    // Axis configuration for mini-matrix
    const axisOptions = {
        edge: { label: 'Edge Retention', shortLabel: 'Edge' },
        toughness: { label: 'Toughness', shortLabel: 'Tough' },
        corrosion: { label: 'Corrosion Resistance', shortLabel: 'Corrosion' },
        sharpen: { label: 'Ease of Sharpening', shortLabel: 'Sharpen' }
    };

    const [xAxis, setXAxis] = useState('edge');
    const [yAxis, setYAxis] = useState('toughness');

    // Robust Search Matching
    const normalize = (str) => typeof str === 'string' ? str.toLowerCase().replace(/[\s-]/g, '') : '';

    // Spotlight Logic
    const searchResults = useMemo(() => {
        if (!search || search.length < 1) return [];
        const normalizedSearch = normalize(search);
        return steels
            .filter(s =>
                normalize(s.name).includes(normalizedSearch) ||
                normalize((Array.isArray(s.parent) ? s.parent[0] : s.parent) ?? s.producer).includes(normalizedSearch)
            )
            .slice(0, 5);
    }, [search, steels]);

    // Producer Color Logic (shared module — single source of truth)
    const producerColors = producerColorsShared;

    const getProducerColor = getProducerColorShared;

    // Featured Steel
    const featuredSteel = useMemo(() => {
        if (!steels || steels.length === 0) return null;
        const seed = new Date().getHours();
        return steels[seed % steels.length];
    }, [steels]);

    // Mini-Matrix Data
    const eliteSteels = useMemo(() => {
        return steels
            .filter(s => s[xAxis] >= 6.5 && s[yAxis] >= 6)
            .sort((a, b) => (b[xAxis] + b[yAxis]) - (a[xAxis] + a[yAxis]))
            .slice(0, 20);
    }, [steels, xAxis, yAxis]);

    const activeProducers = useMemo(() => {
        const unique = new Set(eliteSteels.map(s => {
            const prod = Object.keys(producerColors).find(k => s.producer.includes(k));
            return prod || "Other";
        }));
        return Array.from(unique);
    }, [eliteSteels]);

    const stats = [
        { label: 'Steel Grades', value: steels.length, icon: 'database', target: 'SEARCH' },
        { label: 'Producers', value: new Set(steels.map(s => s.producer)).size, icon: 'factory', target: 'MATRIX' },
        { label: 'Workbench', value: compareList.length, icon: 'layers', target: 'COMPARE' },
    ];

    const featuredElements = featuredSteel ? ['C', 'Cr', 'V', 'Mo', 'W', 'Co', 'N', 'Nb'].filter(el => featuredSteel[el] > 0) : [];

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter' && search.length > 0) {
            if (resetFilters) resetFilters();
            setView('SEARCH');
        }
    };

    const handleSearchFocus = () => {
        if (searchContainerRef.current && window.innerWidth < 768) {
            setTimeout(() => {
                searchContainerRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 300);
        }
    };

    return (
        <div className="flex flex-col flex-1 min-w-0 min-h-dvh md:h-full md:overflow-y-auto overflow-x-hidden custom-scrollbar relative">
            <div className="relative z-10 flex flex-col min-h-full">
                {/* Hero Section */}
                <ViewHeader
                    subtitle="Knife Steel Database"
                    title="STEEL,"
                    highlight="DECODED"
                    color="amber"
                    isHero={true}
                >
                    <p className="text-stone-400 text-sm md:text-lg leading-relaxed max-w-2xl mx-auto font-medium">
                        Composition, heat treatment and performance data for the world's finest blade alloys — from VG-10 to MagnaCut.
                    </p>
                </ViewHeader>

                {/* Spotlight Global Search */}
                <div ref={searchContainerRef} className="forge-enter relative group w-full max-w-2xl px-4 md:px-0 z-[100] mx-auto -mt-6" style={{ '--stagger': '280ms' }}>
                    <div className="absolute -inset-1 bg-accent/40 rounded-2xl blur-lg opacity-20 group-focus-within:opacity-60 transition duration-700 ease-out-expo" />
                    <div className="relative bg-[#12100D]/90 border border-white/10 rounded-xl flex items-center px-6 py-5 backdrop-blur-2xl group-focus-within:border-accent/50 transition-all duration-300 ease-out-expo shadow-plate-lg">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-stone-500 mr-5 group-focus-within:text-accent transition-colors duration-300">
                            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search steels, producers, or performance tiers..."
                            className="bg-transparent border-none outline-none text-white placeholder:text-stone-600 w-full font-semibold text-xl"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            onFocus={handleSearchFocus}
                            data-tour="global-search"
                        />
                        {search && (
                            <button onClick={() => setSearch('')} className="p-2 hover:bg-white/10 rounded-lg transition-colors mr-2">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-stone-500 hover:text-white transition-colors">
                                    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                                </svg>
                            </button>
                        )}
                        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-lg border border-white/10 ml-4 group-focus-within:border-accent/40 transition-colors">
                            <span className="text-[10px] font-mono font-medium text-stone-500 group-focus-within:text-accent uppercase tracking-widest">
                                {typeof window !== 'undefined' && /Mac/.test(window.navigator.platform) ? '⌘K' : 'Ctrl+K'}
                            </span>
                        </div>
                    </div>

                    {/* Spotlight Dropdown */}
                    {search.trim().length > 0 && searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-3 bg-black/80 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-[110] animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="p-2">
                                {searchResults.map((result) => (
                                    <motion.button
                                        key={result.id}
                                        onClick={() => {
                                            hapticFeedback('light');
                                            setDetailSteel(result);
                                            setSearch('');
                                            incrementTrending(result.id);
                                            if (resetFilters) resetFilters();
                                        }}
                                        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors rounded-xl group/item"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-2 h-10 rounded-full" style={{ backgroundColor: getProducerColor(result.producer) }} />
                                            <div className="text-left">
                                                <div className="text-[10px] font-medium text-stone-500 uppercase tracking-[0.2em] leading-none mb-1 flex items-center gap-2">
                                                    {result.parent ?? result.producer}
                                                    {result.pm !== undefined && (
                                                        <>
                                                            <span className="w-1 h-1 rounded-full bg-stone-600" />
                                                            <span className={result.pm ? "text-accent" : ""}>{result.pm ? 'PM' : 'CONVENTIONAL'}</span>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="text-lg font-bold text-white leading-none group-hover/item:text-accent transition-colors duration-200">{result.name}</div>
                                            </div>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                            <button onClick={() => { setView('SEARCH'); if (resetFilters) resetFilters(); }} className="w-full py-3 bg-white/[0.04] border-t border-white/5 text-[10px] font-mono font-medium text-stone-500 uppercase tracking-[0.25em] hover:text-white hover:bg-white/[0.08] transition-all duration-300">
                                View all results for "{search}"
                            </button>
                        </div>
                    )}
                    {search.trim().length > 0 && searchResults.length === 0 && (
                        <div className="absolute top-full left-0 right-0 mt-3 glass-strong border border-white/10 rounded-xl overflow-hidden z-[110] p-6 text-center">
                            <div className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-1">No matches for "{search}"</div>
                            <button
                                onClick={() => { setView('SEARCH'); if (resetFilters) resetFilters(); }}
                                className="text-[10px] font-mono font-medium text-accent uppercase tracking-[0.25em] hover:underline"
                            >
                                Search the full database instead
                            </button>
                        </div>
                    )}
                </div>

                {/* Composition Ticker */}
                {steels.length > 0 && (
                    <div className="forge-enter mt-14 border-y border-white/5 py-3.5 overflow-hidden relative select-none" style={{ '--stagger': '380ms' }} aria-hidden="true">
                        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0B0A08] to-transparent z-10 pointer-events-none" />
                        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0B0A08] to-transparent z-10 pointer-events-none" />
                        <div className="animate-marquee flex items-center w-max">
                            {[0, 1].map(rep => (
                                <div key={rep} className="flex items-center shrink-0">
                                    {steels.slice(0, 24).map(s => (
                                        <span key={`${rep}-${s.id}`} className="flex items-center shrink-0">
                                            <span className="text-[10px] font-mono font-medium uppercase tracking-[0.3em] text-stone-600 px-7 whitespace-nowrap">{s.name}</span>
                                            <span className="w-1 h-1 rounded-full bg-accent/40 shrink-0" />
                                        </span>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Stats — Index Strip */}
                <div className="forge-enter flex flex-wrap md:flex-nowrap items-stretch justify-center w-full border-b border-white/5 px-4 py-10 md:py-14" style={{ '--stagger': '460ms' }}>
                    {stats.map((stat, i) => (
                        <button
                            key={i}
                            onClick={() => { setView(stat.target); if (stat.target === 'SEARCH' && resetFilters) resetFilters(); }}
                            className={`flex-1 flex flex-col items-center group transition-all px-6 md:px-12 py-2 ${i > 0 ? 'border-l border-white/5' : ''}`}
                            data-tour={`nav-${stat.target.toLowerCase()}`}
                        >
                            <div className="text-[9px] font-mono font-medium text-stone-600 uppercase tracking-[0.3em] mb-3 flex items-center gap-2.5 group-hover:text-stone-400 transition-colors">
                                <span className="text-accent/60">{String(i + 1).padStart(2, '0')}</span>
                                {stat.label}
                            </div>
                            <div className="text-5xl md:text-7xl font-display text-white group-hover:text-accent transition-colors duration-300 leading-none">{stat.value}</div>
                            <div className="h-0.5 w-0 bg-accent transition-all duration-300 ease-snap group-hover:w-full mt-4" />
                        </button>
                    ))}
                </div>

                {/* Main Content — Editorial Full-Bleed */}
                <div className="max-w-[1920px] mx-auto w-full">
                    {/* Performance Frontier */}
                    {dashboardLayout.showMatrix && (
                        <motion.section
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            className="border-b border-white/5 px-6 md:px-12 lg:px-20 py-12 md:py-16"
                        >
                            <div className="flex items-end justify-between gap-6 mb-8 md:mb-10">
                                <div>
                                    <div className="text-[10px] font-mono font-medium text-accent/80 uppercase tracking-[0.3em] mb-3 flex items-center gap-3">
                                        <span className="inline-block w-8 h-px bg-accent/50" />
                                        01 — Analysis
                                    </div>
                                    <h3 className="text-2xl md:text-4xl font-display text-white uppercase tracking-tight leading-none">Performance Frontier</h3>
                                    <p className="text-[10px] md:text-xs text-stone-500 uppercase font-mono font-medium tracking-[0.2em] mt-3">Real-time visualization of the elite knife alloys</p>
                                </div>
                                <button onClick={() => setView('MATRIX')} className="shrink-0 p-3 bg-white/[0.05] rounded-xl border border-white/10 text-stone-400 hover:text-accent hover:border-accent/40 hover:bg-accent/5 transition-all duration-300 ease-snap">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10H3 M21 6H3 M21 14H3 M21 18H3" /></svg>
                                </button>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 z-20 relative">
                                <div className="flex gap-1 p-1 bg-white/[0.04] rounded-xl w-fit border border-white/[0.06] overflow-x-auto no-scrollbar">
                                    {Object.entries(axisOptions).map(([key, { shortLabel }]) => (
                                        <button
                                            key={key}
                                            onClick={() => setXAxis(key)}
                                            className={`px-2.5 md:px-4 py-1.5 md:py-2 rounded-lg text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.15em] transition-all duration-200 ease-snap whitespace-nowrap ${xAxis === key ? 'bg-accent text-[#1A0C05] shadow-ember-sm' : 'text-stone-500 hover:text-stone-300'}`}
                                        >
                                            {shortLabel}
                                        </button>
                                    ))}
                                </div>

                                {/* Matrix Header Tags */}
                                <div className="flex gap-2">
                                    <span className="px-3 py-1.5 bg-black/50 backdrop-blur-md border border-white/10 rounded-lg text-[9px] font-mono font-medium text-stone-300 uppercase tracking-[0.2em]">
                                        Y: <span className="text-white">Toughness</span>
                                    </span>
                                    <span className="px-3 py-1.5 bg-accent/10 backdrop-blur-md border border-accent/20 rounded-lg text-[9px] font-mono font-medium text-accent uppercase tracking-[0.2em]">
                                        X: <span className="text-white">{axisOptions[xAxis].label}</span>
                                    </span>
                                </div>
                            </div>

                            <div className="w-full relative h-[380px] md:h-[480px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                        <XAxis
                                            type="number"
                                            dataKey={xAxis}
                                            name={axisOptions[xAxis].label}
                                            domain={[2, 10]}
                                            tick={{ fill: 'rgba(237,233,226,0.35)', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
                                            tickLine={false}
                                            axisLine={{ stroke: 'rgba(237,233,226,0.1)' }}
                                        />
                                        <YAxis
                                            type="number"
                                            dataKey={yAxis}
                                            name="Toughness"
                                            domain={[2, 10]}
                                            tick={{ fill: 'rgba(237,233,226,0.35)', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
                                            tickLine={false}
                                            axisLine={false}
                                            width={30}
                                        />
                                        <Tooltip
                                            cursor={{ strokeDasharray: '3 3', stroke: 'rgba(255, 90, 31, 0.4)' }}
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    const data = payload[0].payload;
                                                    return (
                                                        <div className="glass-strong p-4 rounded-xl">
                                                            <div className="text-[10px] font-mono font-medium text-stone-500 uppercase tracking-[0.2em] mb-1">{data.parent ?? data.producer}</div>
                                                            <div className="text-lg font-bold text-white">{data.name}</div>
                                                            <div className="mt-3 flex gap-4">
                                                                <div>
                                                                    <div className="text-[9px] font-medium text-stone-500 uppercase tracking-[0.2em]">{axisOptions[xAxis].shortLabel}</div>
                                                                    <div className="text-accent font-mono font-bold text-sm">{data[xAxis]}</div>
                                                                </div>
                                                                <div>
                                                                    <div className="text-[9px] font-medium text-stone-500 uppercase tracking-[0.2em]">Toughness</div>
                                                                    <div className="text-white font-mono font-bold text-sm">{data[yAxis]}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Scatter
                                            data={eliteSteels}
                                            onClick={(data) => setDetailSteel(data)}
                                            className="cursor-pointer"
                                            isAnimationActive={false}
                                        >
                                            {eliteSteels.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={getProducerColor(entry.producer)}
                                                    className="hover:brightness-150 transition-all duration-300 transform-origin-center filter drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                                                />
                                            ))}
                                        </Scatter>
                                    </ScatterChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Elite Rail */}
                            {eliteSteels.length > 0 && (
                                <div className="mt-8 flex gap-3 overflow-x-auto no-scrollbar pb-2">
                                    {eliteSteels.slice(0, 8).map((s, i) => (
                                        <button
                                            key={s.id}
                                            onClick={() => setDetailSteel(s)}
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/5 bg-white/[0.02] hover:border-accent/40 hover:bg-accent/5 transition-all duration-300 ease-snap shrink-0 group/elite"
                                        >
                                            <span className="text-[9px] font-mono font-medium text-stone-600 group-hover/elite:text-accent/70 transition-colors">{String(i + 1).padStart(2, '0')}</span>
                                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: getProducerColor(s.producer) }} />
                                            <span className="text-xs font-bold uppercase tracking-wide text-white group-hover/elite:text-accent transition-colors whitespace-nowrap">{s.name}</span>
                                            <span className="text-[9px] font-mono font-semibold text-stone-500">{s[xAxis]} / {s[yAxis]}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </motion.section>
                    )}

                    {/* Steel of the Day — Editorial Split */}
                    {featuredSteel && dashboardLayout.showSpotlight && (
                        <motion.section
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            className="px-6 md:px-12 lg:px-20 py-12 md:py-20 border-b border-white/5 relative"
                        >
                            <div className="absolute top-0 right-0 w-[40rem] h-[20rem] bg-accent/[0.06] rounded-full blur-[120px] pointer-events-none" />
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 relative">
                                {/* Left — Identity */}
                                <div className="lg:col-span-7 flex flex-col justify-between">
                                    <div>
                                        <div className="text-[10px] font-mono font-medium text-accent/80 uppercase tracking-[0.3em] mb-5 flex items-center gap-3">
                                            <span className="inline-block w-8 h-px bg-accent/50" />
                                            02 — Steel of the Day
                                            <span className="px-2.5 py-1 border border-accent/25 bg-accent/5 rounded-full text-[8px] font-mono font-medium text-accent uppercase tracking-[0.15em]">Community Choice</span>
                                        </div>
                                        <button
                                            onClick={() => setDetailSteel(featuredSteel)}
                                            className="block text-left text-5xl md:text-7xl xl:text-8xl font-display text-white uppercase tracking-tight leading-[0.95] hover:text-accent transition-colors duration-300 break-words"
                                        >
                                            {featuredSteel.name}
                                        </button>
                                        <p className="text-stone-400 text-sm md:text-base leading-relaxed mt-6 max-w-xl">{featuredSteel.desc}</p>
                                    </div>

                                    {/* Composition strip */}
                                    <div className="mt-10">
                                        <div className="text-[9px] font-mono font-medium text-stone-600 uppercase tracking-[0.3em] mb-4">Composition</div>
                                        <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm md:text-base">
                                            {featuredElements.map(el => (
                                                <span key={el} className="whitespace-nowrap">
                                                    <span className="text-stone-600 text-[10px] tracking-[0.2em] mr-1.5">{el}</span>
                                                    <span className="text-stone-200 font-semibold">{featuredSteel[el]}</span>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Right — Dossier */}
                                <div className="lg:col-span-5 flex flex-col justify-between">
                                    <div className="divide-y divide-white/5 border-y border-white/5">
                                        {[
                                            { label: 'Edge Retention', value: featuredSteel.edge },
                                            { label: 'Toughness', value: featuredSteel.toughness },
                                            { label: 'Corrosion Resistance', value: featuredSteel.corrosion },
                                            { label: 'Ease of Sharpening', value: featuredSteel.sharpen }
                                        ].map((stat, i) => (
                                            <div key={i} className="flex items-center justify-between py-4 md:py-5">
                                                <span className="text-[9px] md:text-[10px] font-mono font-medium text-stone-500 uppercase tracking-[0.2em]">{stat.label}</span>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 md:w-20 h-[3px] bg-white/10 rounded-full overflow-hidden">
                                                        <div className="h-full bg-accent rounded-full" style={{ width: `${((stat.value ?? 0) / 10) * 100}%` }} />
                                                    </div>
                                                    <span className="text-2xl md:text-3xl font-mono font-bold text-white w-12 text-right">{stat.value}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* CTA */}
                                    <button
                                        onClick={() => setDetailSteel(featuredSteel)}
                                        className="mt-10 w-full py-4 md:py-5 bg-accent hover:bg-accent-400 text-[#1A0C05] font-bold uppercase text-xs tracking-[0.2em] rounded-xl transition-all duration-300 ease-snap shadow-ember hover:shadow-ember active:scale-[0.97] flex items-center justify-center gap-3"
                                    >
                                        View Full Specs
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </motion.section>
                    )}
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default HomeView;
