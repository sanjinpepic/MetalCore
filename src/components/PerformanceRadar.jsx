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
                fontWeight={500}
                style={{
                    letterSpacing,
                    textTransform: 'uppercase',
                    fontFamily: '"JetBrains Mono", monospace',
                }}
            >
                {payload.value}
            </text>
        </g>
    );
};

const HEAT_COLORS = ['#FF5A1F', '#FFD9A8', '#FF9D62', '#C53A0C'];

const PerformanceRadar = ({ items, colors = HEAT_COLORS, compact = false, noContainer = false, noTitle = false, cardView = false }) => {
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
                <h3 className="text-lg font-display text-white mb-8 uppercase tracking-tight flex items-center gap-3">
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
                        <PolarGrid stroke="#2E2822" strokeWidth={1} />
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={(props) => (
                                <CustomPolarAngleAxisTick
                                    {...props}
                                    fill="rgba(237,233,226,0.55)"
                                    fontSize={cardView ? 18 : (compact ? 9 : 11)}
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
                        {!compact && <Legend wrapperStyle={{ paddingTop: '40px', fontWeight: 600, fontSize: '11px' }} />}
                        <Tooltip
                            contentStyle={{ backgroundColor: '#12100D', borderColor: 'rgba(237,233,226,0.1)', borderRadius: '0.75rem', color: '#EDE9E2', padding: '1rem', fontFamily: 'JetBrains Mono, monospace' }}
                            itemStyle={{ color: '#EDE9E2', fontSize: '12px', fontWeight: 600 }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </>
    );

    if (noContainer) return radarContent;

    return (
        <div className={`glass-panel shadow-plate ${compact ? '' : 'p-6 md:p-10 rounded-3xl'}`}>
            {radarContent}
        </div>
    );
};

export default PerformanceRadar;
