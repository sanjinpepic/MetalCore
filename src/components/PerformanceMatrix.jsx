import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PerformanceMatrix = ({ steels, setDetailSteel }) => {
    const producerColors = {
        "Crucible": "#FF5733", // Vibrant Orange
        "Böhler": "#33FF57",   // Neon Green
        "Uddeholm": "#3357FF", // Royal Blue
        "Carpenter": "#F333FF", // Electric Purple
        "Hitachi": "#FF33A1",  // Pink
        "Takefu": "#33FFF5",   // Cyan
        "Alleima": "#FFF533",  // Yellow
        "Erasteel": "#FF8633", // Soft Orange
        "Zapp": "#A133FF",     // Indigo
        "Various": "#94a3b8",  // Slate
        "Other": "#ffffff"      // White
    };

    const getProducerColor = (producer) => {
        // Simple match or fallback
        const found = Object.keys(producerColors).find(k => producer.includes(k));
        return found ? producerColors[found] : producerColors["Other"];
    };

    const uniqueProducers = Array.from(new Set(steels.map(s => s.producer))).sort();

    return (
        <div className="flex flex-col flex-1 min-w-0 p-4 md:p-12 pb-6 pt-16 md:pt-12">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl md:text-5xl font-display font-black text-white tracking-tighter mb-4 italic uppercase">Performance Matrix</h1>
                    <p className="text-slate-500 text-sm">Visualizing the Toughness vs. Edge Retention trade-off (Larrin Plot).</p>
                </div>

                {/* Producer Legend */}
                <div className="flex flex-wrap gap-3 max-w-xl">
                    {uniqueProducers.map(prod => (
                        <div key={prod} className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getProducerColor(prod) }} />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{prod}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 glass-panel rounded-[2.5rem] p-4 md:p-10 relative overflow-hidden">
                {/* Quadrant Labels */}
                <div className="absolute top-10 right-10 text-[10px] font-black text-accent/40 uppercase tracking-[0.2em]">GOD TIER (High Both)</div>
                <div className="absolute bottom-10 left-10 text-[10px] font-black text-slate-700 uppercase tracking-[0.2em]">BUDGET (Balanced Low)</div>

                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis type="number" dataKey="edge" name="Edge Retention" stroke="#475569" unit="" domain={[0, 10]} label={{ value: 'Edge Retention', position: 'insideBottom', fill: '#64748b', fontSize: 10, dy: 20 }} />
                        <YAxis type="number" dataKey="toughness" name="Toughness" stroke="#475569" unit="" domain={[0, 10]} label={{ value: 'Toughness', angle: -90, position: 'left', fill: '#64748b', fontSize: 10, dx: -10 }} />
                        <Tooltip
                            cursor={{ strokeDasharray: '3 3' }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    const color = getProducerColor(data.producer);
                                    return (
                                        <div className="glass-panel p-4 rounded-xl border border-white/10 shadow-2xl">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                                                <div className="text-[10px] font-bold uppercase" style={{ color: color }}>{data.producer}</div>
                                            </div>
                                            <div className="text-sm font-bold text-white mb-2">{data.name}</div>
                                            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-2">
                                                <div>
                                                    <div className="text-[8px] text-slate-500 uppercase">Edge</div>
                                                    <div className="text-xs font-mono text-white">{data.edge}</div>
                                                </div>
                                                <div>
                                                    <div className="text-[8px] text-slate-500 uppercase">Toughness</div>
                                                    <div className="text-xs font-mono text-white">{data.toughness}</div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Scatter
                            name="Steels"
                            data={steels}
                            onClick={(data) => setDetailSteel(data)}
                            shape={(props) => {
                                const { cx, cy, payload } = props;
                                const color = getProducerColor(payload.producer);
                                return (
                                    <g>
                                        <circle
                                            cx={cx}
                                            cy={cy}
                                            r={6}
                                            fill={color}
                                            className="cursor-pointer hover:r-8 transition-all hover:stroke-white hover:stroke-2"
                                        />
                                        <circle
                                            cx={cx}
                                            cy={cy}
                                            r={10}
                                            fill={color}
                                            fillOpacity={0.1}
                                            className="animate-pulse"
                                        />
                                    </g>
                                );
                            }}
                        />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PerformanceMatrix;
