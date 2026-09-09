import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSettings } from '../context/SettingsContext';
import { convertTemperature, getTemperatureUnit } from '../utils/temperature';

const HEAT_COLORS = ['#FF5A1F', '#FFD9A8', '#FF9D62', '#C53A0C'];

const HeatTreatChart = ({ items, colors = HEAT_COLORS, containerClass = "h-[300px] md:h-[400px]", compact = false, noContainer = false, noTitle = false }) => {
    const { unitSystem } = useSettings();

    // Transform data for Heat Treatment Line Chart
    // ht_curve format: "300:60,400:58,500:56" (Temp in Celsius:HRC)
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

        return Array.from(allTemps).sort((a, b) => a - b).map(tempCelsius => {
            // Convert temperature based on user preference
            const displayTemp = convertTemperature(tempCelsius, unitSystem);
            const entry = { temp: displayTemp };
            items.forEach(s => {
                if (s.ht_curve) {
                    const point = s.ht_curve.split(',').find(p => parseFloat(p.split(':')[0]) === tempCelsius);
                    if (point) {
                        entry[s.id] = parseFloat(point.split(':')[1]);
                    }
                }
            });
            return entry;
        });
    }, [items, unitSystem]);

    if (lineData.length === 0) {
        return (
            <div className={`glass-gradient rounded-3xl shadow-plate ${compact ? 'p-5 md:p-6' : 'p-6 md:p-10'}`}>
                {!noTitle && (
                    <h3 className={`${compact ? 'text-sm mb-4' : 'text-lg mb-8'} font-display text-white uppercase tracking-tight flex items-center gap-3`}>
                        <svg width={compact ? "16" : "20"} height={compact ? "16" : "20"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-accent">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </svg>
                        Hitting Hardness Matrix
                    </h3>
                )}
                <p className={`${compact ? 'text-xs' : 'text-sm'} text-stone-400 font-mono`}>
                    No heat treatment data available for {items?.length === 1 ? items[0].name : 'these steels'}.
                </p>
            </div>
        );
    }

    const chartContent = (
        <>
            {!noTitle && (
                <h3 className={`${compact ? 'text-sm mb-4' : 'text-lg mb-8'} font-display text-white uppercase tracking-tight flex items-center gap-3`}>
                    <svg width={compact ? "16" : "20"} height={compact ? "16" : "20"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-accent">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                    Hitting Hardness Matrix
                </h3>
            )}
            <div className={containerClass}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineData} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#292420" />
                        <XAxis
                            dataKey="temp"
                            stroke="#3A332B"
                            fontSize={11}
                            tick={{ fill: 'rgba(237,233,226,0.45)', fontFamily: 'JetBrains Mono, monospace', fontSize: 10 }}
                            label={{ value: `Tempering Temp (${getTemperatureUnit(unitSystem)})`, position: 'bottom', fill: '#6E685D', fontSize: 10, dy: 5 }}
                        />
                        <YAxis
                            domain={['auto', 'auto']}
                            stroke="#3A332B"
                            fontSize={10}
                            tick={{ fill: 'rgba(237,233,226,0.45)', fontFamily: 'JetBrains Mono, monospace', fontSize: 10 }}
                            label={{ value: 'Hardness (HRC)', angle: -90, position: 'insideLeft', fill: '#6E685D', fontSize: 10, dx: 5 }}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#12100D', borderColor: 'rgba(237,233,226,0.1)', borderRadius: '0.75rem', padding: '1rem', fontFamily: 'JetBrains Mono, monospace' }}
                            itemStyle={{ color: '#EDE9E2', fontSize: '12px', fontWeight: 600 }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '25px', fontWeight: 600, fontSize: '11px' }} />
                        {items.map((s, i) => (
                            <Line
                                key={s.id}
                                type="monotone"
                                dataKey={s.id}
                                name={s.name}
                                stroke={colors[i % colors.length]}
                                strokeWidth={4}
                                dot={{ r: 6, strokeWidth: 2, stroke: '#0B0A08' }}
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
        <div className={`glass-gradient rounded-3xl shadow-plate ${compact ? 'p-5 md:p-6' : 'p-6 md:p-10'}`}>
            {chartContent}
        </div>
    );
};

export default HeatTreatChart;
