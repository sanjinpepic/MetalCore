import React, { useMemo } from 'react';

const HomeView = ({ setView, steels, setDetailSteel }) => {
    // Pick a random "Featured Steel" just for variety (stabilized by useMemo based on date/hour if needed, or just random)
    const featuredSteel = useMemo(() => {
        if (!steels || steels.length === 0) return null;
        // Simple seeded random based on current hour to rotate occasionally
        const seed = new Date().getHours();
        return steels[seed % steels.length];
    }, [steels]);

    const stats = [
        { label: 'Steel Grades', value: steels.length, icon: 'database' },
        { label: 'Producers', value: new Set(steels.map(s => s.producer)).size, icon: 'factory' },
        { label: 'Properties', value: '4', icon: 'chart-bar' }, // Edge, Toughness, Corrosion, Sharpen
    ];

    return (
        <div className="flex flex-col flex-1 min-w-0 h-screen overflow-y-auto custom-scrollbar bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">

            {/* Hero Section */}
            <div className="p-6 md:p-16 pt-24 md:pt-24 space-y-4 md:space-y-6 max-w-5xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 rounded-full border border-accent/20">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                    </span>
                    <span className="text-base font-bold text-accent uppercase tracking-widest">System Online</span>
                </div>

                <h1 className="text-4xl md:text-7xl font-display font-black text-white tracking-tighter italic leading-[0.9] md:leading-none">
                    ADVANCED<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-400 to-slate-700 pr-2">METALLURGY</span><br />
                    DATABASE
                </h1>

                <p className="text-slate-400 text-sm md:text-xl max-w-2xl leading-relaxed">
                    The definitive resource for knife enthusiasts. Analyze chemical composition, compare performance metrics, and discover the perfect steel for your next blade.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                        onClick={() => setView('SEARCH')}
                        className="px-6 md:px-8 py-3.5 md:py-4 bg-white text-black rounded-xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2 group text-sm md:text-base"
                    >
                        Browse Library
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform">
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setView('MATRIX')}
                        className="px-6 md:px-8 py-3.5 md:py-4 bg-white/5 text-white border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-all text-sm md:text-base"
                    >
                        View Matrix
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 px-6 md:px-16 mb-12 md:mb-16 max-w-6xl">
                {stats.map((stat, i) => (
                    <div key={i} className="glass-panel p-5 md:p-6 rounded-2xl border-white/5">
                        <div className="text-2xl md:text-3xl font-black text-white mb-1 font-display">{stat.value}</div>
                        <div className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
                    </div>
                ))}
                <div className="glass-panel p-5 md:p-6 rounded-2xl border-white/5 bg-gradient-to-br from-accent/20 to-transparent border-accent/20">
                    <div className="text-2xl md:text-3xl font-black text-accent mb-1 font-display">2.0</div>
                    <div className="text-[10px] md:text-xs font-bold text-accent/80 uppercase tracking-widest">Version</div>
                </div>
            </div>

            {/* Feature Section */}
            {featuredSteel && (
                <div className="px-6 md:px-16 pb-16">
                    <div className="text-base font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-4">
                        <span className="h-px w-8 bg-slate-800"></span>
                        Featured Alloy
                        <span className="h-px flex-1 bg-slate-800"></span>
                    </div>

                    <div className="glass-panel p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] border-white/5 flex flex-col lg:flex-row gap-8 md:gap-12 group hover:border-white/10 transition-all relative overflow-hidden">
                        <div className="lg:w-1/2 relative z-10">
                            <div className="text-accent font-bold uppercase tracking-widest text-[10px] md:text-xs mb-2">{featuredSteel.producer}</div>
                            <h2 className="text-3xl md:text-5xl font-black text-white italic mb-3 md:mb-4">{featuredSteel.name}</h2>
                            <p className="text-slate-400 text-sm md:text-lg mb-6 leading-relaxed italic">"{featuredSteel.desc}"</p>

                            <button
                                onClick={() => setDetailSteel(featuredSteel)}
                                className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-white border-b border-accent pb-1 hover:text-accent transition-colors"
                            >
                                View Data Sheet
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                    <polyline points="15 3 21 3 21 9" />
                                    <line x1="10" y1="14" x2="21" y2="3" />
                                </svg>
                            </button>
                        </div>

                        <div className="lg:w-1/2 grid grid-cols-2 gap-3 md:gap-4 relative z-10">
                            {['edge', 'toughness', 'corrosion', 'sharpen'].map(metric => (
                                <div key={metric} className="bg-black/40 rounded-xl md:rounded-2xl p-4 md:p-5 border border-white/5">
                                    <div className="text-[10px] md:text-xs text-slate-500 uppercase font-black mb-2">{metric}</div>
                                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-accent"
                                            style={{ width: `${(featuredSteel[metric] / 10) * 100}%` }}
                                        />
                                    </div>
                                    <div className="text-right text-xs md:text-sm font-mono font-bold text-white mt-2">{featuredSteel[metric]}/10</div>
                                </div>
                            ))}
                        </div>

                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomeView;
