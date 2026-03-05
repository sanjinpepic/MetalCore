import React, { useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const CustomPolarAngleAxisTick = ({ payload, x, y, cx, cy, index, orientation, radius, ...rest }) => {
    const { fill, fontSize, fontWeight, letterSpacing, cardView } = rest;

    const dx = x - cx;
    const dy = y - cy;
    const angleRad = Math.atan2(dy, dx);

    // Determining offset based on view - significantly more for cardView
    const offset = cardView ? 80 : 30;
    const nx = x + Math.cos(angleRad) * offset;
    const ny = y + Math.sin(angleRad) * offset;

    let rotation = 0;
    // Rotate Right and Left labels to be vertical
    if (index === 1) rotation = 90;
    if (index === 3) rotation = -90;

    return (
        <g transform={`translate(${nx},${ny}) rotate(${rotation})`}>
            <text
                x={0}
                y={0}
                textAnchor="middle"
                dominantBaseline="central"
                fill={fill}
                fontSize={fontSize}
                fontWeight={900}
                style={{
                    letterSpacing,
                    textTransform: 'uppercase',
                    // Using a bold display font stack
                    fontFamily: '"Inter", "Outfit", "system-ui", sans-serif',
                }}
            >
                {payload.value}
            </text>
        </g>
    );
};

const PerformanceRadar = ({ items, colors = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'], compact = false, noContainer = false, noTitle = false, cardView = false }) => {
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

    const radarContent = (
        <>
            {!noTitle && !compact && (
                <h3 className="text-lg font-black text-white mb-8 uppercase tracking-widest flex items-center gap-3 italic">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-accent">
                        <circle cx="12" cy="12" r="10" />
                        <path d="m16.24 7.76-2.12 2.12" />
                    </svg>
                    Performance Radar
                </h3>
            )}
            <div className={cardView ? "h-[500px] w-full" : (compact ? "h-[250px]" : "h-[450px] md:h-[550px]")}>
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius={cardView ? "60%" : (compact ? "65%" : "70%")} data={radarData}>
                        <PolarGrid stroke="#334155" strokeWidth={1} />
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={(props) => (
                                <CustomPolarAngleAxisTick
                                    {...props}
                                    fill={cardView ? '#94a3b8' : '#94a3b8'}
                                    fontSize={cardView ? 18 : (compact ? 9 : 11)}
                                    fontWeight="black"
                                    letterSpacing={cardView ? '0.2em' : '0.05em'}
                                />
                            )}
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
                                strokeWidth={cardView ? 6 : (compact ? 3 : 4)}
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
        </>
    );

    if (noContainer) return radarContent;

    return (
        <div className={`glass - panel border - white / 10 bg - black / 40 shadow - 2xl ${compact ? '' : 'p-6 md:p-10 rounded-[2.5rem]'} `}>
            {radarContent}
        </div>
    );
};

export default PerformanceRadar;
