import React, { useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const CompareView = ({ items, setView, toggleCompare, clearCompare, generateReport, isAiLoading }) => {
    // Transform data for Radar Chart
    // Expected format: [{ subject: 'Edge', SteelA: 5, SteelB: 8 }, ...]
    const radarData = useMemo(() => {
        if (!items || items.length === 0) return [];
        const metrics = [
            { key: 'edge', label: 'Edge Retention' },
            { key: 'toughness', label: 'Toughness' },
            { key: 'corrosion', label: 'Corrosion' },
            { key: 'sharpen', label: 'Sharpening' }
        ];

        return metrics.map(m => {
            const point = { subject: m.label, fullMark: 10 };
            items.forEach(item => {
                point[item.id] = item[m.key] || 0;
            });
            return point;
        });
    }, [items]);

    // Transform data for Composition Bar Chart (Elements on X-axis)
    // Expected format: [{ element: 'C', SteelA: 1.5, SteelB: 0.8 }, ...]
    const compositionData = useMemo(() => {
        if (!items || items.length === 0) return [];
        const elements = ['C', 'Cr', 'V', 'Mo', 'W', 'Co'];

        return elements.map(el => {
            const point = { element: el };
            items.forEach(item => {
                point[item.id] = item[el] || 0;
            });
            return point;
        });
    }, [items]);

    // Transform data for Heat Treatment Line Chart
    // ht_curve format: "300:60,400:58,500:56" (Temp:HRC)
    const lineData = useMemo(() => {
        const allTemps = new Set();
        items.forEach(s => {
            if (s.ht_curve) {
                s.ht_curve.split(',').forEach(p => {
                    const temp = parseFloat(p.split(':')[0]);
                    if (!isNaN(temp)) allTemps.add(temp);
                });
            }
        });

        return Array.from(allTemps).sort((a, b) => a - b).map(t => {
            const entry = { temp: t };
            items.forEach(s => {
                if (s.ht_curve) {
                    const point = s.ht_curve.split(',').find(p => parseFloat(p.split(':')[0]) === t);
                    if (point) {
                        entry[s.id] = parseFloat(point.split(':')[1]);
                    }
                }
            });
            return entry;
        });
    }, [items]);

    const colors = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'];

    if (!items || items.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-950 text-slate-500">
                <div className="text-center">
                    <p className="mb-4">No items selected for comparison.</p>
                    <button onClick={() => setView('SEARCH')} className="px-4 py-2 bg-accent text-black rounded-lg font-bold">
                        Back to Library
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col flex-1 min-w-0 h-screen overflow-y-auto custom-scrollbar bg-slate-950">
            <header className="p-6 md:p-12 flex items-center justify-between sticky top-0 bg-slate-950/90 backdrop-blur-xl z-[90] border-b border-white/10 pt-24 md:pt-12">
                <div className="flex items-center gap-4 md:gap-6 shrink-0">
                    <button onClick={() => setView('SEARCH')} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all border border-white/5 group">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:-translate-x-1 transition-transform">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                    </button>
                    <div>
                        <div className="text-[10px] md:text-xs font-bold text-accent uppercase tracking-[0.2em] mb-1">Analysis</div>
                        <h2 className="text-lg md:text-4xl font-display font-black text-white italic tracking-tight uppercase leading-none">SIDE-BY-SIDE</h2>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={generateReport}
                        disabled={isAiLoading}
                        className="flex items-center gap-2.5 px-6 md:px-7 py-3 md:py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl md:rounded-2xl font-black transition-all shadow-lg text-xs md:text-sm"
                    >
                        {isAiLoading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="hidden xs:block">
                                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                            </svg>
                        )}
                        <span className="hidden sm:inline">Generate Analytical Report</span>
                        <span className="sm:hidden uppercase tracking-widest">Report</span>
                    </button>

                    <button
                        onClick={() => { clearCompare(); setView('SEARCH'); }}
                        className="p-3 md:px-6 md:py-4 bg-white/5 hover:bg-red-500/10 text-slate-500 hover:text-red-400 border border-white/10 rounded-xl md:rounded-2xl transition-all"
                        title="Clear All"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                    </button>
                </div>
            </header>

            <div className="p-6 md:p-12 space-y-12">
                {/* Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {items.map((s, i) => (
                        <div key={s.id} className="glass-panel p-6 md:p-8 rounded-[2rem] relative group border-white/10 hover:border-accent/40 transition-all border-t-4 shadow-2xl" style={{ borderTopColor: colors[i % colors.length] }}>
                            <button onClick={() => toggleCompare(s)} className="absolute top-4 right-4 p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-all opacity-0 group-hover:opacity-100 border border-white/5">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <path d="M18 6 6 18" />
                                    <path d="m6 6 12 12" />
                                </svg>
                            </button>
                            <div className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">{s.producer}</div>
                            <h3 className="text-xl md:text-3xl font-black text-white mb-5 uppercase tracking-tighter italic leading-none">{s.name}</h3>
                            <div className="grid grid-cols-3 gap-2.5">
                                {['C', 'Cr', 'V', 'Mo', 'W', 'Co'].map(el => (
                                    <div key={el} className="bg-black/40 rounded-xl p-2.5 text-center border border-white/5">
                                        <div className="text-[9px] text-slate-600 uppercase font-black mb-1.5">{el}</div>
                                        <div className="text-sm font-mono font-black text-slate-200">{s[el] || 0}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 pb-20">
                    {/* Radar Chart */}
                    <div className="glass-panel p-6 md:p-10 rounded-[2.5rem] border-white/10 bg-black/40 shadow-2xl">
                        <h3 className="text-lg font-black text-white mb-8 uppercase tracking-widest flex items-center gap-3 italic">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-accent">
                                <circle cx="12" cy="12" r="10" />
                                <path d="m16.24 7.76-2.12 2.12" />
                            </svg>
                            Performance Radar
                        </h3>
                        <div className="h-[450px] md:h-[550px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                    <PolarGrid stroke="#334155" strokeWidth={1} />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'bold', letterSpacing: '0.05em' }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                                    {items.map((s, i) => (
                                        <Radar
                                            key={s.id}
                                            name={s.name}
                                            dataKey={s.id}
                                            stroke={colors[i % colors.length]}
                                            fill={colors[i % colors.length]}
                                            fillOpacity={0.15}
                                            strokeWidth={4}
                                        />
                                    ))}
                                    <Legend wrapperStyle={{ paddingTop: '40px', fontWeight: 'bold', fontSize: '11px' }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0a0a0b', borderColor: '#334155', borderRadius: '1rem', color: '#fff', padding: '1rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
                                        itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Bar Chart (Composition) */}
                    <div className="glass-panel p-6 md:p-10 rounded-[2.5rem] border-white/10 bg-black/40 shadow-2xl">
                        <h3 className="text-lg font-black text-white mb-8 uppercase tracking-widest flex items-center gap-3 italic">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-blue-500">
                                <path d="M3 3v18h18" />
                                <path d="m19 9-5 5-4-4-3 3" />
                            </svg>
                            Composition Analysis
                        </h3>
                        <div className="h-[450px] md:h-[550px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={compositionData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis dataKey="element" stroke="#475569" fontSize={11} fontWeight="bold" tick={{ fill: '#94a3b8' }} dy={10} />
                                    <YAxis stroke="#475569" fontSize={10} tick={{ fill: '#94a3b8' }} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        contentStyle={{ backgroundColor: '#0a0a0b', borderColor: '#334155', borderRadius: '1rem', padding: '1rem' }}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: '40px', fontWeight: 'bold', fontSize: '11px' }} />
                                    {items.map((s, i) => (
                                        <Bar
                                            key={s.id}
                                            dataKey={s.id}
                                            name={s.name}
                                            fill={colors[i % colors.length]}
                                            radius={[6, 6, 0, 0]}
                                        />
                                    ))}
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Line Chart (Heat Treatment) */}
                    {lineData.length > 0 && (
                        <div className="col-span-1 lg:col-span-2 glass-panel p-6 md:p-10 rounded-[2.5rem] border-white/10 bg-black/40 shadow-2xl">
                            <h3 className="text-lg font-black text-white mb-8 uppercase tracking-widest flex items-center gap-3 italic">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-orange-500">
                                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                                </svg>
                                Hitting Hardness Matrix
                            </h3>
                            <div className="h-[450px] md:h-[600px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={lineData} margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                        <XAxis dataKey="temp" stroke="#475569" fontSize={11} fontWeight="bold" tick={{ fill: '#94a3b8' }} label={{ value: 'Tempering Temp (°F)', position: 'bottom', fill: '#64748b', fontSize: 11, fontWeight: 'bold', dy: 25 }} />
                                        <YAxis domain={['auto', 'auto']} stroke="#475569" fontSize={10} tick={{ fill: '#94a3b8' }} label={{ value: 'Hardness (HRC)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11, fontWeight: 'bold', dx: 5 }} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0a0a0b', borderColor: '#334155', borderRadius: '1rem', padding: '1rem' }}
                                        />
                                        <Legend wrapperStyle={{ paddingTop: '40px', fontWeight: 'bold', fontSize: '11px' }} />
                                        {items.map((s, i) => (
                                            <Line
                                                key={s.id}
                                                type="monotone"
                                                dataKey={s.id}
                                                name={s.name}
                                                stroke={colors[i % colors.length]}
                                                strokeWidth={5}
                                                dot={{ r: 6, strokeWidth: 2, stroke: '#000' }}
                                                activeDot={{ r: 10, strokeWidth: 0 }}
                                                connectNulls
                                            />
                                        ))}
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompareView;
