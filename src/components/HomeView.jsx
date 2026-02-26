import React, { useMemo, useRef, useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { useSettings } from '../context/SettingsContext';
import { convertTemperature, getTemperatureUnit } from '../utils/temperature';
import Footer from './Footer';
import ViewHeader from './Common/ViewHeader';

import { hapticFeedback } from '../hooks/useMobile';

const HomeView = ({ setView, steels, setDetailSteel, search, setSearch, compareList, toggleCompare, producers, incrementTrending, resetFilters, setShowRecommender }) => {
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
    const normalize = (str) => str.toLowerCase().replace(/[\s-]/g, '');

    // Spotlight Logic
    const searchResults = useMemo(() => {
        if (!search || search.length < 1) return [];
        const normalizedSearch = normalize(search);
        return steels
            .filter(s =>
                normalize(s.name).includes(normalizedSearch) ||
                normalize(s.producer).includes(normalizedSearch)
            )
            .slice(0, 5);
    }, [search, steels]);

    // Producer Color Logic
    const producerColors = {
        "Crucible": "#FF5733", "Böhler": "#33FF57", "Uddeholm": "#3357FF",
        "Carpenter": "#F333FF", "Hitachi": "#FF33A1", "Takefu": "#33FFF5",
        "Alleima": "#FFF533", "Erasteel": "#FF8633", "Zapp": "#A133FF",
        "Various": "#94a3b8", "Other": "#ffffff"
    };

    const getProducerColor = (producer) => {
        const found = Object.keys(producerColors).find(k => producer.includes(k));
        return found ? producerColors[found] : producerColors["Other"];
    };

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
        <div className="flex flex-col flex-1 min-w-0 min-h-dvh md:h-full md:overflow-y-auto custom-scrollbar relative">
            <div className="relative z-10 flex flex-col min-h-full">
                {/* Hero Section */}
                <ViewHeader
                    subtitle="Command Center 2.0"
                    title="FORGING"
                    highlight="EXCELLENCE"
                    color="emerald"
                    isHero={true}
                >
                    <p className="text-slate-400 text-sm md:text-lg leading-relaxed max-w-2xl mx-auto font-medium">
                        The ultimate metallurgical database. Real-time edge retention, toughness, and chemical analysis for the world's most elite knife alloys.
                    </p>
                </ViewHeader>

                {/* Spotlight Global Search */}
                <div ref={searchContainerRef} className="relative group w-full max-w-2xl px-4 md:px-0 z-[100] mx-auto -mt-6">
                    <div className="absolute -inset-1 bg-gradient-to-r from-accent/30 to-indigo-500/30 rounded-2xl blur opacity-25 group-focus-within:opacity-100 transition duration-1000" />
                    <div className="relative bg-black/60 border border-white/10 rounded-2xl flex items-center px-6 py-5 backdrop-blur-3xl group-focus-within:border-accent/50 transition-all shadow-2xl">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-500 mr-5 group-focus-within:text-accent transition-colors">
                            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search steels, producers, or performance tiers..."
                            className="bg-transparent border-none outline-none text-white placeholder:text-slate-600 w-full font-bold text-xl"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            onFocus={handleSearchFocus}
                            data-tour="global-search"
                        />
                        {search && (
                            <button onClick={() => setSearch('')} className="p-2 hover:bg-white/10 rounded-lg transition-colors mr-2">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-500 hover:text-white transition-colors">
                                    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                                </svg>
                            </button>
                        )}
                        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-lg border border-white/10 ml-4 group-focus-within:border-accent/40 transition-colors">
                            <span className="text-[10px] font-black text-slate-500 group-focus-within:text-accent uppercase tracking-tighter">
                                {typeof window !== 'undefined' && /Mac/.test(window.navigator.platform) ? '⌘K' : 'Ctrl+K'}
                            </span>
                        </div>
                    </div>

                    {/* Spotlight Dropdown */}
                    {searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-3 bg-black/80 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-[110] animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="p-2">
                                {searchResults.map((result) => (
                                    <button
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
                                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1 flex items-center gap-2">
                                                    {result.producer}
                                                    {result.pm !== undefined && (
                                                        <>
                                                            <span className="w-1 h-1 rounded-full bg-slate-600" />
                                                            <span className={result.pm ? "text-accent" : ""}>{result.pm ? 'PM' : 'CONVENTIONAL'}</span>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="text-lg font-black text-white italic leading-none group-hover/item:text-accent transition-colors">{result.name}</div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => { setView('SEARCH'); if (resetFilters) resetFilters(); }} className="w-full py-3 bg-white/5 border-t border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hover:text-white hover:bg-white/10 transition-all">
                                View all results for "{search}"
                            </button>
                        </div>
                    )}
                </div>

                {/* Stats */}
                <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 w-full border-y border-white/5 py-8 md:py-12 mt-12">
                    {stats.map((stat, i) => (
                        <button key={i} onClick={() => { setView(stat.target); if (stat.target === 'SEARCH' && resetFilters) resetFilters(); }} className="flex flex-col items-center group transition-all" data-tour={`nav-${stat.target.toLowerCase()}`}>
                            <div className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1 group-hover:text-slate-400 transition-colors">{stat.label}</div>
                            <div className="text-4xl md:text-5xl font-black text-white font-display group-hover:text-accent transition-all group-hover:scale-110">{stat.value}</div>
                            <div className="h-0.5 w-0 bg-accent transition-all duration-300 group-hover:w-full mt-2" />
                        </button>
                    ))}
                </div>

                {/* Main Content */}
                <div className="px-6 md:px-12 lg:px-20 py-12 pb-24 grid grid-cols-1 xl:grid-cols-12 gap-8 md:gap-16 max-w-[1920px] mx-auto w-full">
                    {/* Left Column */}
                    <div className="xl:col-span-8 space-y-12">
                        {dashboardLayout.showMatrix && (
                            <section className="glass-panel p-6 md:p-10 rounded-[3rem] border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent relative group h-full flex flex-col min-h-[500px]">
                                <div className="flex items-center justify-between mb-8 md:mb-12">
                                    <div>
                                        <h3 className="text-xl md:text-2xl font-black text-white italic uppercase tracking-tighter">Performance Frontier</h3>
                                        <p className="text-[10px] md:text-xs text-slate-500 uppercase font-black tracking-widest mt-1">Real-time Visualization of the Elite Knife Alloys</p>
                                    </div>
                                    <button onClick={() => setView('MATRIX')} className="p-3 bg-white/5 rounded-2xl border border-white/10 text-slate-400 hover:text-accent hover:border-accent/40 hover:bg-accent/5 transition-all group">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10H3 M21 6H3 M21 14H3 M21 18H3" /></svg>
                                    </button>
                                </div>
                                {/* Matrix placeholders... omitted for brevity or simplified */}
                                <div className="flex-1 min-h-[400px] w-full bg-black/40 rounded-[2rem] border border-white/5" />
                            </section>
                        )}
                    </div>

                    {/* Right Column */}
                    <div className="xl:col-span-4 space-y-8">
                        {featuredSteel && dashboardLayout.showSpotlight && (
                            <section className="glass-panel p-10 rounded-[3rem] border-white/5 bg-gradient-to-br from-indigo-500/10 to-transparent relative overflow-hidden group h-full flex flex-col justify-between">
                                <div className="relative z-10 space-y-6">
                                    <div className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.3em]">Daily Spotlight</div>
                                    <h2 className="text-4xl font-display font-black text-white italic leading-none truncate group-hover:text-accent transition-colors cursor-pointer" onClick={() => setDetailSteel(featuredSteel)}>{featuredSteel.name}</h2>
                                    <p className="text-slate-400 text-sm leading-relaxed italic line-clamp-3">"{featuredSteel.desc}"</p>
                                </div>
                            </section>
                        )}
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default HomeView;
