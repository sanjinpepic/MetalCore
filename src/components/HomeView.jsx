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

    // Producer Color Logic (shared module â€” single source of truth)
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
                        Composition, heat treatment and performance data for the world's finest blade alloys â€” from VG-10 to MagnaCut.
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
                                {typeof window !== 'undefined' && /Mac/.test(window.navigator.platform) ? 'âŒ˜K' : 'Ctrl+K'}
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

                {/* Stats */}
                <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-6 md:gap-x-12 md:gap-y-8 w-full border-y border-white/5 px-4 py-8 md:py-12 mt-12">
                    {stats.map((stat, i) => (
                        <button key={i} onClick={() => { setView(stat.target); if (stat.target === 'SEARCH' && resetFilters) resetFilters(); }} className="flex flex-col items-center group transition-all" data-tour={`nav-${stat.target.toLowerCase()}`}>
                            <div className="text-[10px] font-mono font-medium text-stone-500 uppercase tracking-[0.25em] mb-1 group-hover:text-stone-400 transition-colors">{stat.label}</div>
                            <div className="text-4xl md:text-5xl font-display text-white group-hover:text-accent transition-colors duration-300">{stat.value}</div>
                            <div className="h-0.5 w-0 bg-accent transition-all duration-300 ease-snap group-hover:w-full mt-2" />
                        </button>
                    ))}
                </div>

                {/* Main Content */}
                <div className="px-6 md:px-12 lg:px-20 py-12 pb-24 grid grid-cols-1 xl:grid-cols-12 gap-8 md:gap-16 max-w-[1920px] mx-auto w-full">
                    {/* Left Column */}
                    <div className="xl:col-span-8 space-y-12">
                        {dashboardLayout.showMatrix && (
                            <section className="glass-panel p-6 md:p-10 rounded-3xl relative group h-full flex flex-col min-h-[500px]">
                                <div className="flex items-center justify-between mb-8 md:mb-12">
                                    <div>
                                        <h3 className="text-xl md:text-2xl font-display text-white uppercase tracking-tight">Performance Frontier</h3>
                                        <p className="text-[10px] md:text-xs text-stone-500 uppercase font-mono font-medium tracking-[0.2em] mt-2">Real-time visualization of the elite knife alloys</p>
                                    </div>
                                    <button onClick={() => setView('MATRIX')} className="p-3 bg-white/[0.05] rounded-xl border border-white/10 text-stone-400 hover:text-accent hover:border-accent/40 hover:bg-accent/5 transition-all duration-300 ease-snap group">
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
                                <div className="flex-1 w-full relative min-h-[400px]">
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
                            </section>
                        )}
                    </div>

                    {/* Right Column */}
                    <div className="xl:col-span-4 space-y-8">
                        {featuredSteel && dashboardLayout.showSpotlight && (
                            <motion.section
                                className="glass-accent p-10 rounded-3xl relative overflow-hidden group h-full flex flex-col justify-between"
                            >
                                {/* Decorative Background Elements */}
                                <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-accent/20 transition-colors duration-700" />

                                <div className="relative z-10 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="text-[10px] font-mono font-medium text-stone-400 uppercase tracking-[0.3em]">Steel of the Day</div>
                                        <div className="px-3 py-1 bg-accent/15 border border-accent/30 rounded-full text-[9px] font-mono font-medium text-accent uppercase tracking-[0.15em] flex items-center gap-2">
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="m12 15 3.5 3.5L12 22l-3.5-3.5L12 15Z" /><path d="M12 2 4.5 9.5 12 17l7.5-7.5L12 2Z" /></svg>
                                            Community Choice
                                        </div>
                                    </div>
                                    <h2 className="text-4xl font-display text-white leading-none truncate group-hover:text-accent transition-colors duration-300 cursor-pointer" onClick={() => setDetailSteel(featuredSteel)}>{featuredSteel.name}</h2>
                                    <p className="text-stone-400 text-sm leading-relaxed line-clamp-3">"{featuredSteel.desc}"</p>
                                </div>

                                <div className="relative z-10 mt-10">
                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 gap-3 mb-8">
                                        {[
                                            { label: 'Edge', value: featuredSteel.edge },
                                            { label: 'Tough', value: featuredSteel.toughness },
                                            { label: 'Rust', value: featuredSteel.corrosion },
                                            { label: 'Sharp', value: featuredSteel.sharpen }
                                        ].map((stat, i) => (
                                            <div key={i} className="bg-black/40 border border-white/5 rounded-xl p-4 group-hover:border-accent/20 transition-colors duration-300">
                                                <div className="text-[9px] font-mono font-medium text-stone-500 uppercase tracking-[0.2em] mb-1">{stat.label}</div>
                                                <div className="text-xl font-mono font-bold text-white">{stat.value}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* CTA */}
                                    <button
                                        onClick={() => setDetailSteel(featuredSteel)}
                                        className="w-full py-4 bg-accent hover:bg-accent-400 text-[#1A0C05] font-bold uppercase text-xs tracking-[0.2em] rounded-xl transition-all duration-300 ease-snap shadow-ember hover:shadow-ember active:scale-[0.97] flex items-center justify-center gap-3"
                                    >
                                        View Full Specs
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </motion.section>
                        )}
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default HomeView;
