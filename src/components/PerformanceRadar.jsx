import React, { useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const PerformanceRadar = ({ items, colors = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'], compact = false }) => {
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

    return (
        <div className={`glass-panel border-white/10 bg-black/40 shadow-2xl ${compact ? '' : 'p-6 md:p-10 rounded-[2.5rem]'}`}>
            {!compact && (
                <h3 className="text-lg font-black text-white mb-8 uppercase tracking-widest flex items-center gap-3 italic">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-accent">
                        <circle cx="12" cy="12" r="10" />
                        <path d="m16.24 7.76-2.12 2.12" />
                    </svg>
                    Performance Radar
                </h3>
            )}
            <div className={compact ? "h-[250px]" : "h-[450px] md:h-[550px]"}>
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius={compact ? "70%" : "80%"} data={radarData}>
                        <PolarGrid stroke="#334155" strokeWidth={1} />
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: '#94a3b8', fontSize: compact ? 9 : 11, fontWeight: 'bold', letterSpacing: '0.05em' }}
                        />
                        <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                        {items.map((s, i) => (
                            <Radar
                                key={s.id}
                                name={s.name}
                                dataKey={s.id}
                                stroke={colors[i % colors.length]}
                                fill={colors[i % colors.length]}
                                fillOpacity={0.15}
                                strokeWidth={compact ? 3 : 4}
                            />
                        ))}
                        {!compact && <Legend wrapperStyle={{ paddingTop: '40px', fontWeight: 'bold', fontSize: '11px' }} />}
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0a0a0b', borderColor: '#334155', borderRadius: '1rem', color: '#fff', padding: '1rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
                            itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PerformanceRadar;
