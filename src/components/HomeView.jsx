import React, { useMemo, useRef } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip } from 'recharts';

const HomeView = ({ setView, steels, setDetailSteel, search, setSearch, compareList, toggleCompare, producers, incrementTrending }) => {
    const searchContainerRef = useRef(null);

    // Robust Search Matching (Forgiving hyphens and spaces)
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

    // Producer Color Logic (Parity with PerformanceMatrix)
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

    // Pick a random "Featured Steel"
    const featuredSteel = useMemo(() => {
        if (!steels || steels.length === 0) return null;
        const seed = new Date().getHours();
        return steels[seed % steels.length];
    }, [steels]);

    // Mini-Matrix Data (Only "Elite" steels)
    const eliteSteels = useMemo(() => {
        return steels
            .filter(s => s.edge >= 6.5 && s.toughness >= 6)
            .sort((a, b) => (b.edge + b.toughness) - (a.edge + a.toughness))
            .slice(0, 20);
    }, [steels]);

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
            setView('SEARCH');
        }
    };

    const handleSearchFocus = () => {
        // On mobile, scroll the search bar to the top of the viewport
        if (searchContainerRef.current && window.innerWidth < 768) {
            setTimeout(() => {
                searchContainerRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 300); // Delay to allow keyboard to appear
        }
    };

    return (
        <div className="flex flex-col flex-1 min-w-0 h-screen overflow-y-auto custom-scrollbar bg-black relative isolate">
            {/* Background Decorations */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-accent/5 rounded-full blur-[200px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/2" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/20 via-slate-950/20 to-black" />
            </div>

            {/* Content Layer */}
            <div className="relative z-10 flex flex-col min-h-full">

                {/* Hero Section - Centered Immersive */}
                <div className="p-6 md:p-12 lg:p-20 pt-24 md:pt-24 flex flex-col items-center text-center max-w-7xl mx-auto w-full space-y-10">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 rounded-full border border-accent/20 backdrop-blur-md">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                            </span>
                            <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Command Center 2.0</span>
                        </div>

                        <h1 className="text-6xl md:text-8xl xl:text-9xl font-display font-black text-white tracking-tighter italic leading-[0.8]">
                            FORGING<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-white to-slate-500">EXCELLENCE</span>
                        </h1>

                        <p className="text-slate-400 text-sm md:text-lg leading-relaxed max-w-2xl mx-auto font-medium">
                            The ultimate metallurgical database. Real-time edge retention, toughness, and chemical analysis for the world's most elite knife alloys.
                        </p>
                    </div>

                    {/* Spotlight Global Search */}
                    <div ref={searchContainerRef} className="relative group w-full max-w-2xl px-4 md:px-0 z-[100]">
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
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch('')}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors mr-2"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-500 hover:text-white transition-colors">
                                        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                                    </svg>
                                </button>
                            )}
                            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-lg border border-white/10 ml-4 group-focus-within:border-accent/40 transition-colors">
                                <span className="text-[10px] font-black text-slate-500 group-focus-within:text-accent uppercase tracking-tighter">Enter</span>
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
                                                setDetailSteel(result);
                                                setSearch('');
                                                incrementTrending(result.id);
                                            }}
                                            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors rounded-xl group/item"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-2 h-10 rounded-full" style={{ backgroundColor: getProducerColor(result.producer) }} />
                                                <div className="text-left">
                                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">{result.producer}</div>
                                                    <div className="text-lg font-black text-white italic leading-none group-hover/item:text-accent transition-colors">{result.name}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="hidden md:flex items-center gap-4">
                                                    <div className="text-center">
                                                        <div className="text-[8px] font-black text-slate-600 uppercase tracking-tighter mb-0.5">Edge</div>
                                                        <div className="text-xs font-mono font-bold text-slate-300">{result.edge}</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-[8px] font-black text-slate-600 uppercase tracking-tighter mb-0.5">Tough</div>
                                                        <div className="text-xs font-mono font-bold text-slate-300">{result.toughness}</div>
                                                    </div>
                                                </div>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-700 group-hover/item:text-accent group-hover/item:translate-x-1 transition-all">
                                                    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                                                </svg>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setView('SEARCH')}
                                    className="w-full py-3 bg-white/5 border-t border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hover:text-white hover:bg-white/10 transition-all"
                                >
                                    View all results for "{search}"
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Stats Horizontal - Integrated into flow */}
                    <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 w-full border-y border-white/5 py-8 md:py-12">
                        {stats.map((stat, i) => (
                            <button
                                key={i}
                                onClick={() => setView(stat.target)}
                                className="flex flex-col items-center group transition-all"
                            >
                                <div className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1 group-hover:text-slate-400 transition-colors">{stat.label}</div>
                                <div className="text-4xl md:text-5xl font-black text-white font-display group-hover:text-accent transition-all group-hover:scale-110">{stat.value}</div>
                                <div className="h-0.5 w-0 bg-accent transition-all duration-300 group-hover:w-full mt-2" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Dashboard Main Grid - Immersive Layout */}
                <div className="px-6 md:px-12 lg:px-20 pb-24 grid grid-cols-1 xl:grid-cols-12 gap-8 md:gap-16 max-w-[1800px] mx-auto w-full">

                    {/* Left/Main Column: Performance Matrix (8 cols) */}
                    <div className="xl:col-span-8 space-y-12">
                        <section className="glass-panel p-6 md:p-10 rounded-[3rem] border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent relative group">
                            <div className="flex items-center justify-between mb-8 md:mb-12">
                                <div>
                                    <h3 className="text-xl md:text-2xl font-black text-white italic uppercase tracking-tighter">Performance Frontier</h3>
                                    <p className="text-[10px] md:text-xs text-slate-500 uppercase font-black tracking-widest mt-1">Real-time Visualization of the Top 20 Elite Alloys</p>
                                </div>
                                <button
                                    onClick={() => setView('MATRIX')}
                                    className="p-3 bg-white/5 rounded-2xl border border-white/10 text-slate-400 hover:text-accent hover:border-accent/40 hover:bg-accent/5 transition-all group"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10H3 M21 6H3 M21 14H3 M21 18H3" /></svg>
                                </button>
                            </div>

                            <div className="h-[350px] md:h-[450px] w-full bg-black/40 rounded-[2rem] border border-white/5 overflow-hidden relative group-hover:border-white/10 transition-colors">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ScatterChart margin={{ top: 30, right: 30, bottom: 30, left: 30 }}>
                                        <XAxis
                                            type="number"
                                            dataKey="edge"
                                            domain={[7, 10]}
                                            tick={false}
                                            axisLine={false}
                                            label={{ value: 'Edge Retention →', position: 'bottom', fill: '#64748b', fontSize: 12, fontWeight: 'bold' }}
                                        />
                                        <YAxis
                                            type="number"
                                            dataKey="toughness"
                                            domain={[6, 10]}
                                            tick={false}
                                            axisLine={false}
                                            label={{ value: 'Toughness →', angle: -90, position: 'left', fill: '#64748b', fontSize: 12, fontWeight: 'bold' }}
                                        />
                                        <Tooltip
                                            cursor={{ strokeDasharray: '3 3' }}
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    const data = payload[0].payload;
                                                    const color = getProducerColor(data.producer);
                                                    return (
                                                        <div className="glass-panel p-4 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-3xl min-w-[200px]">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                                                                <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: color }}>{data.producer}</div>
                                                            </div>
                                                            <div className="text-lg font-black text-white mb-3 italic uppercase">{data.name}</div>
                                                            <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-3">
                                                                <div>
                                                                    <div className="text-[9px] text-slate-500 uppercase font-black mb-1 tracking-widest">Edge</div>
                                                                    <div className="text-sm font-mono font-bold text-white">{data.edge}</div>
                                                                </div>
                                                                <div>
                                                                    <div className="text-[9px] text-slate-500 uppercase font-black mb-1 tracking-widest">Toughness</div>
                                                                    <div className="text-sm font-mono font-bold text-white">{data.toughness}</div>
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
                                            onClick={(data) => {
                                                setDetailSteel(data);
                                                incrementTrending(data.id);
                                            }}
                                            shape={(props) => {
                                                const { cx, cy, payload } = props;
                                                const color = getProducerColor(payload.producer);
                                                return (
                                                    <g className="cursor-pointer group/node">
                                                        <circle cx={cx} cy={cy} r={7} fill={color} className="transition-all duration-300 group-hover/node:stroke-white group-hover/node:stroke-2" />
                                                        <circle cx={cx} cy={cy} r={14} fill={color} fillOpacity={0.1} />
                                                    </g>
                                                );
                                            }}
                                        />
                                    </ScatterChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Producer Legend - Integrated Legend for the homepage */}
                            <div className="mt-8 flex flex-wrap justify-center gap-3">
                                {activeProducers.map(prod => (
                                    <div key={prod} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/5 hover:border-white/10 transition-colors">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: producerColors[prod] }} />
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{prod}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Spotlight & Workbench (4 cols) */}
                    <div className="xl:col-span-4 space-y-8">
                        {/* Daily Spotlight - Elevated prominence */}
                        {featuredSteel && (
                            <section className="glass-panel p-8 rounded-[3rem] border-white/5 bg-gradient-to-br from-indigo-500/10 to-transparent relative overflow-hidden group">
                                <div className="relative z-10 space-y-8">
                                    <div className="flex items-center justify-between">
                                        <div className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.3em]">Daily Spotlight</div>
                                        <div className="p-2 bg-black/40 rounded-xl border border-white/10 text-accent">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">{featuredSteel.producer}</div>
                                        <h2 className="text-4xl font-display font-black text-white italic leading-none truncate group-hover:text-accent transition-colors cursor-pointer" onClick={() => {
                                            setDetailSteel(featuredSteel);
                                            incrementTrending(featuredSteel.id);
                                        }}>{featuredSteel.name}</h2>
                                    </div>

                                    <p className="text-slate-400 text-sm leading-relaxed italic line-clamp-3">"{featuredSteel.desc}"</p>

                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { label: 'Edge', val: featuredSteel.edge, col: 'bg-accent' },
                                            { label: 'Toughness', val: featuredSteel.toughness, col: 'bg-indigo-400' }
                                        ].map(m => (
                                            <div key={m.label} className="bg-black/40 p-4 rounded-2xl border border-white/5">
                                                <div className="flex justify-between items-end mb-2">
                                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{m.label}</span>
                                                    <span className="text-sm font-mono font-bold text-white">{m.val}</span>
                                                </div>
                                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                    <div className={`h-full ${m.col}`} style={{ width: `${m.val * 10}%` }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => {
                                            setDetailSteel(featuredSteel);
                                            incrementTrending(featuredSteel.id);
                                        }}
                                        className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.2em] transition-all group-hover:border-accent/30"
                                    >
                                        Inspect technical sheet
                                    </button>
                                </div>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-accent/40 transition-colors" />
                            </section>
                        )}

                        {/* Active Workbench */}
                        <section className={`glass-panel p-8 rounded-[3rem] border transition-all duration-500 ${compareList.length > 0 ? 'border-indigo-500/20 bg-indigo-500/5' : 'border-white/5 bg-white/[0.02]'}`}>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">Workbench</h3>
                                {compareList.length > 0 && (
                                    <button
                                        onClick={() => setView('COMPARE')}
                                        className="text-[9px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors"
                                    >
                                        Run analysis
                                    </button>
                                )}
                            </div>

                            {compareList.length > 0 ? (
                                <>
                                    <div className="space-y-3 mb-4">
                                        {compareList.map(s => (
                                            <div key={s.id} className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5 group">
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{s.producer}</span>
                                                    <span className="text-xs font-black text-white italic">{s.name}</span>
                                                </div>
                                                <button
                                                    onClick={(e) => toggleCompare(s, e)}
                                                    className="p-1.5 text-slate-600 hover:text-red-400 transition-colors"
                                                >
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => setView('SEARCH')}
                                        className="w-full py-2.5 text-[9px] font-black text-slate-500 hover:text-indigo-400 uppercase tracking-widest transition-colors border-t border-white/5 pt-4"
                                    >
                                        + Add more grades
                                    </button>
                                </>
                            ) : (
                                <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10 relative opacity-40">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500">
                                            <path d="M21 7V3h-4M3 17v4h4M21 17v4h-4M3 7V3h4" />
                                            <path d="M12 12h.01" />
                                        </svg>
                                        <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl animate-pulse" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-white uppercase tracking-widest mb-1 opacity-40">Select grades from the library to begin comparison</div>
                                        <p className="text-[9px] text-slate-500 uppercase tracking-tighter leading-tight max-w-[150px] mb-4"></p>
                                        <button
                                            onClick={() => setView('SEARCH')}
                                            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent/30 rounded-xl text-[9px] font-black text-slate-400 hover:text-white uppercase tracking-widest transition-all"
                                        >
                                            Browse Grade Library
                                        </button>
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* System Status Card */}
                        <div className="p-8 rounded-[3rem] border border-white/10 bg-black/40 flex items-center justify-between group hover:border-accent/20 transition-all">
                            <div>
                                <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Platform Sync</div>
                                <div className="text-2xl font-black text-white font-display uppercase italic">Stable <span className="text-accent underline decoration-accent/40 decoration-2 underline-offset-4 tracking-[0.1em] ml-1">LATEST</span></div>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-600 group-hover:text-accent transition-colors">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m12 14 4-4" /><path d="M3.34 19a10 10 0 1 1 17.32 0" /></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeView;
