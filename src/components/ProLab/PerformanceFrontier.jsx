'use client'

import React, { useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip, ReferenceLine, LineChart, Line } from 'recharts';

const PerformanceFrontier = ({ steel, steels }) => {
    const benchmarks = useMemo(() => {
        // Select key benchmark steels for comparison
        const benchmarkNames = ['MagnaCut', 'M390', 'CPM 3V', 'Maxamet', 'AUS-8', 'LC200N', '14C28N'];
        return steels.filter(s => benchmarkNames.includes(s.name));
    }, [steels]);

    const chartData = useMemo(() => {
        return [...benchmarks, steel].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
    }, [benchmarks, steel]);

    // Simple Pareto Frontier estimation (highest of either)
    const frontierPoints = [
        { toughness: 10, edge: 4 },   // CPM 3V area
        { toughness: 8, edge: 8.5 },  // YXR7/ASP area (New Peak)
        { toughness: 7, edge: 8 },    // MagnaCut area
        { toughness: 4, edge: 10 },   // Maxamet/S110V area
    ].sort((a, b) => a.toughness - b.toughness);

    return (
        <div className="space-y-6 flex flex-col h-full">
            <div>
                <h3 className="text-xl font-black text-white italic uppercase tracking-tight">Performance Frontier</h3>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Pareto Analysis: Toughness vs Wear Resistance</p>
            </div>

            <div className="flex-1 min-h-[300px] bg-black/40 rounded-3xl border border-white/5 p-6 relative group">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis
                            type="number"
                            dataKey="toughness"
                            name="Toughness"
                            domain={[0, 10]}
                            tick={{ fill: '#475569', fontSize: 10, fontWeight: 'bold' }}
                            label={{ value: 'Toughness →', position: 'bottom', offset: 0, fill: '#475569', fontSize: 9, fontWeight: '900' }}
                        />
                        <YAxis
                            type="number"
                            dataKey="edge"
                            name="Edge Retention"
                            domain={[0, 10]}
                            tick={{ fill: '#475569', fontSize: 10, fontWeight: 'bold' }}
                            label={{ value: 'Wear Resistance →', angle: -90, position: 'insideLeft', fill: '#475569', fontSize: 9, fontWeight: '900' }}
                        />
                        <Tooltip
                            cursor={{ strokeDasharray: '3 3' }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    const isTarget = data.id === steel?.id;
                                    return (
                                        <div className="glass-panel p-3 border border-white/10 rounded-xl shadow-2xl backdrop-blur-3xl">
                                            <div className={`text-xs font-black uppercase tracking-widest mb-1 ${isTarget ? 'text-indigo-400' : 'text-slate-400'}`}>
                                                {data.name}
                                            </div>
                                            <div className="flex gap-4">
                                                <div>
                                                    <div className="text-[8px] text-slate-500 uppercase font-black">Tough</div>
                                                    <div className="text-sm font-black text-white">{data.toughness}</div>
                                                </div>
                                                <div>
                                                    <div className="text-[8px] text-slate-500 uppercase font-black">Wear</div>
                                                    <div className="text-sm font-black text-white">{data.edge}</div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />

                        {/* The Pareto Frontier Line (Visual Guide) */}
                        <Scatter
                            data={frontierPoints}
                            line={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }}
                            shape={() => null}
                            legendType="none"
                        />

                        <Scatter data={chartData} onClick={() => { }}>
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.id === steel?.id ? '#6366f1' : '#1e293b'}
                                    stroke={entry.id === steel?.id ? '#fff' : '#334155'}
                                    strokeWidth={entry.id === steel?.id ? 2 : 1}
                                    r={entry.id === steel?.id ? 10 : 6}
                                />
                            ))}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>

                <div className="absolute top-8 right-8 text-right pointer-events-none">
                    <div className="text-[8px] font-black text-indigo-500/50 uppercase tracking-[0.2em]">Efficiency Limit</div>
                    <div className="text-[10px] font-black text-white/20 uppercase italic mt-1">The Pareto Frontier</div>
                </div>
            </div>

            <div className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 flex items-start gap-4">
                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                        <line x1="12" y1="22.08" x2="12" y2="12" />
                    </svg>
                </div>
                <div>
                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Metallurgical Efficiency</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed italic">
                        {steel.name} is positioned <b>{Math.max(18 - steel.toughness - steel.edge, 0).toFixed(1)} units</b> away from the theoretical performance limit.
                        Its specific gravity of {steel.C}% Carbon suggests a focus on <b>{steel.edge > steel.toughness ? 'Secondary Carbide Volume' : 'Impact Stability'}</b>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PerformanceFrontier;
