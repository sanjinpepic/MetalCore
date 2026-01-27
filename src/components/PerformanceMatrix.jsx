import React, { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PerformanceMatrix = ({ steels, setDetailSteel, activeProducer, setActiveProducer, producers }) => {
    // Axis configuration
    const axisOptions = {
        edge: { label: 'Edge Retention', shortLabel: 'Edge' },
        toughness: { label: 'Toughness', shortLabel: 'Tough' },
        corrosion: { label: 'Corrosion Resistance', shortLabel: 'Corrosion' },
        sharpen: { label: 'Ease of Sharpening', shortLabel: 'Sharpen' }
    };

    const [xAxis, setXAxis] = useState('edge');
    const [yAxis, setYAxis] = useState('toughness');

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
        <div className="flex flex-col flex-1 min-w-0 h-screen overflow-y-auto md:overflow-hidden bg-black custom-scrollbar">
            <div className="px-4 md:px-12 pt-16 md:pt-12 shrink-0">
                <div className="mb-6 md:mb-8 shrink-0">
                    <h1 className="text-2xl md:text-5xl font-display font-black text-white tracking-tighter mb-2 md:mb-4 italic uppercase leading-none">Performance Matrix</h1>
                    <p className="text-slate-500 text-sm md:text-lg leading-relaxed">Visualizing the Toughness vs. Edge Retention trade-off.</p>
                </div>
            </div>

            <div className="flex-1 px-4 md:px-12 pb-0 md:pb-6 flex flex-col min-h-0">
                {/* Axis Selectors */}
                <div className="flex flex-col md:flex-row gap-3 md:gap-6 mb-4 md:mb-6 px-2">
                    {/* Y-Axis Selector */}
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Y-Axis:</span>
                        <div className="flex gap-2 flex-wrap">
                            {Object.keys(axisOptions).map(key => (
                                <button
                                    key={`y-${key}`}
                                    onClick={() => setYAxis(key)}
                                    disabled={key === xAxis}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${yAxis === key
                                        ? 'bg-accent text-black border border-accent'
                                        : key === xAxis
                                            ? 'bg-white/5 text-slate-700 border border-white/5 cursor-not-allowed'
                                            : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white hover:border-accent/30'
                                        }`}
                                >
                                    {axisOptions[key].shortLabel}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* X-Axis Selector */}
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">X-Axis:</span>
                        <div className="flex gap-2 flex-wrap">
                            {Object.keys(axisOptions).map(key => (
                                <button
                                    key={`x-${key}`}
                                    onClick={() => setXAxis(key)}
                                    disabled={key === yAxis}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${xAxis === key
                                        ? 'bg-accent text-black border border-accent'
                                        : key === yAxis
                                            ? 'bg-white/5 text-slate-700 border border-white/5 cursor-not-allowed'
                                            : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white hover:border-accent/30'
                                        }`}
                                >
                                    {axisOptions[key].shortLabel}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="h-[540px] md:h-full glass-panel rounded-2xl md:rounded-[2.5rem] p-2 md:p-10 relative overflow-hidden mb-0 md:mb-10">
                    {/* Quadrant Labels */}
                    <div className="absolute top-6 right-8 md:top-10 md:right-10 text-[10px] font-black text-accent/40 uppercase tracking-[0.2em] pointer-events-none">ELITE</div>
                    <div className="absolute bottom-20 left-8 md:bottom-10 md:left-10 text-[10px] font-black text-slate-700 uppercase tracking-[0.2em] pointer-events-none">BUDGET</div>

                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={true} />
                            <XAxis
                                type="number"
                                dataKey={xAxis}
                                name={axisOptions[xAxis].label}
                                stroke="#475569"
                                unit=""
                                domain={[0, 10]}
                                ticks={[0, 2, 4, 6, 8, 10]}
                                tick={{ fontSize: 10, fontWeight: 'bold' }}
                                label={{ value: `${axisOptions[xAxis].label} →`, position: 'insideBottom', fill: '#64748b', fontSize: 11, fontWeight: 'bold', dy: 20 }}
                            />
                            <YAxis
                                type="number"
                                dataKey={yAxis}
                                name={axisOptions[yAxis].label}
                                stroke="#475569"
                                unit=""
                                domain={[0, 10]}
                                ticks={[0, 2, 4, 6, 8, 10]}
                                tick={{ fontSize: 10, fontWeight: 'bold' }}
                                label={{ value: `${axisOptions[yAxis].label} →`, angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11, fontWeight: 'bold', dx: 5 }}
                            />
                            <Tooltip
                                cursor={{ strokeDasharray: '3 3' }}
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0].payload;
                                        const color = getProducerColor(data.producer);
                                        return (
                                            <div className="glass-panel p-3 md:p-4 rounded-xl border border-white/10 shadow-2xl backdrop-blur-3xl min-w-[200px]">
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                                                    <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: color }}>{data.producer}</div>
                                                </div>
                                                <div className="text-base md:text-lg font-black text-white mb-3 italic uppercase">{data.name}</div>
                                                <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-3">
                                                    <div className={xAxis === 'edge' || yAxis === 'edge' ? 'bg-accent/10 p-2 rounded-lg border border-accent/20' : ''}>
                                                        <div className={`text-[9px] uppercase font-black mb-1 ${xAxis === 'edge' || yAxis === 'edge' ? 'text-accent' : 'text-slate-500'}`}>Edge</div>
                                                        <div className="text-sm font-mono font-bold text-white">{data.edge}</div>
                                                    </div>
                                                    <div className={xAxis === 'toughness' || yAxis === 'toughness' ? 'bg-accent/10 p-2 rounded-lg border border-accent/20' : ''}>
                                                        <div className={`text-[9px] uppercase font-black mb-1 ${xAxis === 'toughness' || yAxis === 'toughness' ? 'text-accent' : 'text-slate-500'}`}>Tough</div>
                                                        <div className="text-sm font-mono font-bold text-white">{data.toughness}</div>
                                                    </div>
                                                    <div className={xAxis === 'corrosion' || yAxis === 'corrosion' ? 'bg-accent/10 p-2 rounded-lg border border-accent/20' : ''}>
                                                        <div className={`text-[9px] uppercase font-black mb-1 ${xAxis === 'corrosion' || yAxis === 'corrosion' ? 'text-accent' : 'text-slate-500'}`}>Corr</div>
                                                        <div className="text-sm font-mono font-bold text-white">{data.corrosion}</div>
                                                    </div>
                                                    <div className={xAxis === 'sharpen' || yAxis === 'sharpen' ? 'bg-accent/10 p-2 rounded-lg border border-accent/20' : ''}>
                                                        <div className={`text-[9px] uppercase font-black mb-1 ${xAxis === 'sharpen' || yAxis === 'sharpen' ? 'text-accent' : 'text-slate-500'}`}>Sharp</div>
                                                        <div className="text-sm font-mono font-bold text-white">{data.sharpen}</div>
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
                                                r={window.innerWidth < 768 ? 6 : 8}
                                                fill={color}
                                                className="cursor-pointer hover:r-10 transition-all hover:stroke-white hover:stroke-2"
                                            />
                                            <circle
                                                cx={cx}
                                                cy={cy}
                                                r={window.innerWidth < 768 ? 12 : 16}
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

            {/* Interactive Producer Legend at Bottom */}
            <div className="sticky bottom-0 z-20 px-4 md:px-12 pt-2 pb-10 md:py-4 bg-black/80 backdrop-blur-md border-t border-white/5 md:border-none md:bg-transparent md:backdrop-blur-none shrink-0 overflow-x-auto no-scrollbar max-w-full">
                <div className="flex flex-nowrap md:flex-wrap md:justify-center gap-2 md:gap-3 pb-2">
                    {producers.map(prod => {
                        const isActive = activeProducer === prod;
                        const color = prod === "ALL" ? "#ffffff" : getProducerColor(prod);
                        return (
                            <button
                                key={prod}
                                onClick={() => setActiveProducer(prod)}
                                className={`flex items-center gap-2 md:gap-3 bg-white/5 px-2.5 md:px-4 py-1.5 md:py-2.5 rounded-lg md:rounded-xl border transition-all whitespace-nowrap active:scale-95 ${isActive
                                    ? "border-white/40 bg-white/10 shadow-lg shadow-white/5"
                                    : "border-white/5 text-slate-500"
                                    }`}
                            >
                                <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all ${isActive ? "scale-125 glow-white" : "opacity-40"}`} style={{ backgroundColor: color }} />
                                <span className={`text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors ${isActive ? "text-white" : "text-slate-500"}`}>
                                    {prod}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PerformanceMatrix;
