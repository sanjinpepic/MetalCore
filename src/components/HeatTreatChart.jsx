import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const HeatTreatChart = ({ items, colors = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'], containerClass = "h-[300px] md:h-[400px]", compact = false, noContainer = false, noTitle = false }) => {
    // Transform data for Heat Treatment Line Chart
    // ht_curve format: "300:60,400:58,500:56" (Temp:HRC)
    const lineData = useMemo(() => {
        if (!items || items.length === 0) return [];

        const allTemps = new Set();
        items.forEach(s => {
            if (s.ht_curve) {
                s.ht_curve.split(',').forEach(p => {
                    const temp = parseFloat(p.split(':')[0]);
                    if (!isNaN(temp)) allTemps.add(temp);
                });
            }
        });

        if (allTemps.size === 0) return [];

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

    if (lineData.length === 0) return null;

    const chartContent = (
        <>
            {!noTitle && (
                <h3 className={`${compact ? 'text-sm mb-4' : 'text-lg mb-8'} font-black text-white uppercase tracking-widest flex items-center gap-3 italic`}>
                    <svg width={compact ? "16" : "20"} height={compact ? "16" : "20"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-orange-500">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                    Hitting Hardness Matrix
                </h3>
            )}
            <div className={containerClass}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineData} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis
                            dataKey="temp"
                            stroke="#475569"
                            fontSize={11}
                            fontWeight="bold"
                            tick={{ fill: '#94a3b8' }}
                            label={{ value: 'Tempering Temp (°C)', position: 'bottom', fill: '#64748b', fontSize: 11, fontWeight: 'bold', dy: 5 }}
                        />
                        <YAxis
                            domain={['auto', 'auto']}
                            stroke="#475569"
                            fontSize={10}
                            tick={{ fill: '#94a3b8' }}
                            label={{ value: 'Hardness (HRC)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11, fontWeight: 'bold', dx: 5 }}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0a0a0b', borderColor: '#334155', borderRadius: '1rem', padding: '1rem' }}
                            itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '25px', fontWeight: 'bold', fontSize: '11px' }} />
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
        </>
    );

    if (noContainer) return chartContent;

    return (
        <div className={`glass-panel rounded-[2.5rem] border-white/10 bg-black/40 shadow-2xl ${compact ? 'p-5 md:p-6' : 'p-6 md:p-10'}`}>
            {chartContent}
        </div>
    );
};

export default HeatTreatChart;
