import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PerformanceMatrix = ({ steels, setDetailSteel, activeProducer, setActiveProducer, producers }) => {
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
        const found = Object.keys(producerColors).find(k => producer.includes(k));
        return found ? producerColors[found] : producerColors["Other"];
    };

    return (
        <div className="flex flex-col flex-1 min-w-0 p-4 md:p-12 pb-6 pt-20 md:pt-12 h-screen overflow-hidden">
            <div className="mb-4 md:mb-8 shrink-0">
                <h1 className="text-2xl md:text-5xl font-display font-black text-white tracking-tighter mb-2 md:mb-4 italic uppercase">Performance Matrix</h1>
                <p className="text-slate-500 text-[10px] md:text-sm">Visualizing the Toughness vs. Edge Retention trade-off (Larrin Plot).</p>
            </div>

            <div className="flex-1 glass-panel rounded-3xl md:rounded-[2.5rem] p-2 md:p-10 relative overflow-hidden mb-6 md:mb-8">
                {/* Quadrant Labels - Adjust for mobile */}
                <div className="absolute top-4 right-4 md:top-10 md:right-10 text-[8px] md:text-[10px] font-black text-accent/40 uppercase tracking-[0.2em] pointer-events-none">GOD TIER</div>
                <div className="absolute bottom-16 left-4 md:bottom-10 md:left-10 text-[8px] md:text-[10px] font-black text-slate-700 uppercase tracking-[0.2em] pointer-events-none">BUDGET</div>

                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 10, right: 10, bottom: 30, left: -10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis
                            type="number"
                            dataKey="edge"
                            name="Edge Retention"
                            stroke="#475569"
                            unit=""
                            domain={[0, 10]}
                            tick={{ fontSize: 10 }}
                            label={{ value: 'Edge', position: 'insideBottom', fill: '#64748b', fontSize: 10, dy: 10 }}
                        />
                        <YAxis
                            type="number"
                            dataKey="toughness"
                            name="Toughness"
                            stroke="#475569"
                            unit=""
                            domain={[0, 10]}
                            tick={{ fontSize: 10 }}
                            label={{ value: 'Toughness', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10, dx: 10 }}
                        />
                        <Tooltip
                            cursor={{ strokeDasharray: '3 3' }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    const color = getProducerColor(data.producer);
                                    return (
                                        <div className="glass-panel p-3 md:p-4 rounded-xl border border-white/10 shadow-2xl">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                                                <div className="text-[10px] font-bold uppercase" style={{ color: color }}>{data.producer}</div>
                                            </div>
                                            <div className="text-xs md:text-sm font-bold text-white mb-2">{data.name}</div>
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
                                            r={window.innerWidth < 768 ? 4 : 6}
                                            fill={color}
                                            className="cursor-pointer hover:r-8 transition-all hover:stroke-white hover:stroke-2"
                                        />
                                        <circle
                                            cx={cx}
                                            cy={cy}
                                            r={window.innerWidth < 768 ? 8 : 10}
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

            {/* Interactive Producer Legend at Bottom - Scrollable on Mobile */}
            <div className="flex flex-wrap md:justify-center gap-2 md:gap-3 pb-8 shrink-0 overflow-x-auto no-scrollbar max-w-full">
                {producers.map(prod => {
                    const isActive = activeProducer === prod;
                    const color = prod === "ALL" ? "#ffffff" : getProducerColor(prod);
                    return (
                        <button
                            key={prod}
                            onClick={() => setActiveProducer(prod)}
                            className={`flex items-center gap-2 bg-white/5 px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl border transition-all whitespace-nowrap ${isActive
                                ? "border-white/40 bg-white/10 shadow-lg shadow-white/5"
                                : "border-white/5 text-slate-500"
                                }`}
                        >
                            <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all ${isActive ? "scale-125 glow-white" : "opacity-40"}`} style={{ backgroundColor: color }} />
                            <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wider transition-colors ${isActive ? "text-white" : "text-slate-500"}`}>
                                {prod}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default PerformanceMatrix;
