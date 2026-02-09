import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PerformanceRadar from './PerformanceRadar';

// Helper for collision detection
const solveLabelCollisions = (steels, xAxisKey, yAxisKey, width, height, mobile = false) => {
    // margins must match the chart
    const margin = mobile ? { top: 8, right: 8, bottom: 20, left: 0 } : { top: 20, right: 20, bottom: 40, left: 10 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    if (innerW <= 0 || innerH <= 0) return {};

    const nodes = steels.map(s => {
        const xVal = typeof s[xAxisKey] === 'number' ? s[xAxisKey] : 0;
        const yVal = typeof s[yAxisKey] === 'number' ? s[yAxisKey] : 0;

        // Exact mapping as per Recharts [0, 10] domain
        const cx = margin.left + (xVal / 10) * innerW;
        // Y is inverted (0 at bottom)
        const cy = margin.top + innerH - (yVal / 10) * innerH;

        return {
            id: s.name,
            cx,
            cy,
            x: cx,
            y: cy - 15, // Target initial position
            width: (s.name.length * 6) + 10, // Estimate text width (approx)
            height: 14 // Estimate text height
        };
    });

    // Simple relaxation to resolve overlaps
    const iterations = 50;
    for (let k = 0; k < iterations; k++) {
        for (let i = 0; i < nodes.length; i++) {
            const nodeA = nodes[i];

            // 1. Attraction to target (original position above dot)
            const targetX = nodeA.cx;
            const targetY = nodeA.cy - 12;

            // Stronger pull towards X center, weaker on Y to allow stacking
            nodeA.x += (targetX - nodeA.x) * 0.1;
            nodeA.y += (targetY - nodeA.y) * 0.05;

            // 2. Repulsion from other labels
            for (let j = 0; j < nodes.length; j++) {
                if (i === j) continue;
                const nodeB = nodes[j];

                // Check overlap
                const dx = nodeA.x - nodeB.x;
                const dy = nodeA.y - nodeB.y;
                const distX = Math.abs(dx);
                const distY = Math.abs(dy);

                // Minimum distance required
                const minW = (nodeA.width + nodeB.width) / 2 + 2; // + padding
                const minH = (nodeA.height + nodeB.height) / 2 + 2;

                if (distX < minW && distY < minH) {
                    // Overlap detected
                    const overlapX = minW - distX;
                    const overlapY = minH - distY;

                    // Resolve along the axis of least overlap
                    if (overlapX < overlapY * 1.5) { // Prefer X shift slightly if comparable
                        const shift = overlapX / 2;
                        const sign = dx > 0 ? 1 : -1;
                        nodeA.x += shift * sign * 0.5;
                        nodeB.x -= shift * sign * 0.5;
                    } else {
                        const shift = overlapY / 2;
                        const sign = dy > 0 ? 1 : -1;
                        nodeA.y += shift * sign * 0.5;
                        nodeB.y -= shift * sign * 0.5;
                    }
                }
            }
        }
    }

    // Convert to relative map
    const layout = {};
    nodes.forEach(n => {
        layout[n.id] = { x: n.x - n.cx, y: n.y - n.cy };
    });
    return layout;
};

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
    const [hoveredSteel, setHoveredSteel] = useState(null);
    const [selectedSteel, setSelectedSteel] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [labelDensity, setLabelDensity] = useState('high'); // 'all', 'high', 'none'
    const [isMobile, setIsMobile] = useState(false);

    // Chart dimensions for label collision calculation
    const [chartDimensions, setChartDimensions] = useState({ width: 0, height: 0 });
    const chartRef = useRef(null);

    useEffect(() => {
        if (!chartRef.current) return;

        const updateSize = () => {
            if (chartRef.current) {
                const { offsetWidth, offsetHeight } = chartRef.current;
                setChartDimensions({ width: offsetWidth, height: offsetHeight });
            }
        };

        const observer = new ResizeObserver(updateSize);
        observer.observe(chartRef.current);

        // Initial measure
        updateSize();

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 1024);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    // Local search within the already filtered steels
    const matrixSteels = useMemo(() => {
        if (!searchTerm) return steels;
        return steels.filter(s =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.producer.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [steels, searchTerm]);

    // Calculate optimal label positions
    const labelOffsets = useMemo(() => {
        return solveLabelCollisions(matrixSteels, xAxis, yAxis, chartDimensions.width, chartDimensions.height, isMobile);
    }, [matrixSteels, xAxis, yAxis, chartDimensions, isMobile]);

    const producerColors = {
        "Crucible": "#FF5733",
        "Böhler": "#33FF57",
        "Uddeholm": "#3357FF",
        "Carpenter": "#F333FF",
        "Hitachi": "#FF33A1",
        "Takefu": "#33FFF5",
        "Alleima": "#FFF533",
        "Erasteel": "#FF8633",
        "Zapp": "#A133FF",
        "Various": "#94a3b8",
        "Other": "#ffffff"
    };

    // Filter steels to show labels for: Top performers or hovered
    const labeledSteels = useMemo(() => {
        if (labelDensity === 'none' && !hoveredSteel) return [];
        if (labelDensity === 'all') return matrixSteels.map(s => s.name);

        // 'high' density or default — show only top performers on mobile
        if (!hoveredSteel && isMobile) {
            const sorted = [...matrixSteels].sort((a, b) => {
                const scoreA = (a[xAxis] || 0) + (a[yAxis] || 0);
                const scoreB = (b[xAxis] || 0) + (b[yAxis] || 0);
                return scoreB - scoreA;
            });
            return sorted.slice(0, 5).map(s => s.name);
        }

        // On desktop with 'high', maybe label more but not all? 
        // Let's stick to a subset unless hovered
        if (!hoveredSteel) {
            return matrixSteels.slice(0, 15).map(s => s.name);
        }

        return matrixSteels.map(s => s.name);
    }, [matrixSteels, hoveredSteel, isMobile, labelDensity]);

    const getProducerColor = (producer) => {
        const found = Object.keys(producerColors).find(k => producer.includes(k));
        return found ? producerColors[found] : producerColors["Other"];
    };

    const displaySteel = selectedSteel || steels.find(s => s.name === hoveredSteel) || null;

    return (
        <div className="flex flex-col lg:flex-row flex-1 min-w-0 min-h-dvh lg:h-full bg-black lg:overflow-hidden max-w-[100vw] overflow-x-hidden">

            {/* Left Sidebar: Controls & Details (Desktop Only) */}
            <aside className="hidden lg:flex flex-col w-[400px] border-r border-white/5 bg-slate-950 overflow-y-auto no-scrollbar">
                <div className="p-8 space-y-8">
                    {/* Header Section */}
                    <div>
                        <div className="text-[10px] font-black text-rose-400 mb-3 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-6 h-px bg-rose-500/30"></span>
                            Analytics Engine
                        </div>
                        <h1 className="text-4xl font-display font-black text-white tracking-tighter italic uppercase leading-tight">Performance <br /><span className="text-accent">Matrix</span></h1>
                    </div>

                    {/* Search & Density Section */}
                    <div className="space-y-4">
                        <div className="relative">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search matrix..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-xs font-bold focus:outline-none focus:border-accent/40 transition-colors"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Labels</span>
                            <div className="flex gap-1">
                                {['none', 'high', 'all'].map(d => (
                                    <button
                                        key={d}
                                        onClick={() => setLabelDensity(d)}
                                        className={`px-2 py-1 rounded-md text-[9px] font-black uppercase transition-all ${labelDensity === d ? 'bg-accent text-black' : 'text-slate-500 hover:text-white'}`}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Axis Controls */}
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Y-Axis Strategy</span>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.keys(axisOptions).map(key => (
                                    <button
                                        key={`y-${key}`}
                                        onClick={() => setYAxis(key)}
                                        disabled={key === xAxis}
                                        className={`px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all text-left ${yAxis === key
                                            ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                                            : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10'
                                            }`}
                                    >
                                        {axisOptions[key].label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">X-Axis Strategy</span>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.keys(axisOptions).map(key => (
                                    <button
                                        key={`x-${key}`}
                                        onClick={() => setXAxis(key)}
                                        disabled={key === yAxis}
                                        className={`px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all text-left ${xAxis === key
                                            ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                                            : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10'
                                            }`}
                                    >
                                        {axisOptions[key].label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Selection Details */}
                    {displaySteel && (
                        <div className="space-y-6 pt-6 border-t border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-[10px] font-black text-slate-500 uppercase mb-1">{displaySteel.producer}</div>
                                    <h3 className="text-2xl font-display font-black text-white italic uppercase tracking-tight">{displaySteel.name}</h3>
                                </div>
                                <button
                                    onClick={() => setDetailSteel(displaySteel)}
                                    className="p-3 bg-accent text-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-accent/20"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                        <path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                    </svg>
                                </button>
                            </div>

                            <PerformanceRadar items={[displaySteel]} compact={true} colors={[getProducerColor(displaySteel.producer)]} />

                            <div className="grid grid-cols-2 gap-4">
                                {Object.keys(axisOptions).map(key => (
                                    <div key={key} className={`p-3 rounded-2xl bg-black/40 border transition-all ${xAxis === key || yAxis === key ? 'border-accent/40 bg-accent/5' : 'border-white/5'}`}>
                                        <div className="text-[9px] font-black text-slate-600 uppercase mb-1">{axisOptions[key].shortLabel}</div>
                                        <div className="text-xl font-mono font-black text-white">{displaySteel[key]}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0 lg:min-h-0 lg:h-full lg:overflow-hidden relative bg-black">
                {/* Mobile Header (Hidden on LG) - Compact */}
                <header className="lg:hidden px-3 py-2 pt-safe shrink-0 bg-gradient-to-b from-rose-500/10 to-transparent">
                    <div className="text-[8px] font-black text-rose-400 uppercase tracking-widest flex items-center gap-1.5">
                        <span className="w-3 h-px bg-rose-500/30"></span>
                        Analytics
                    </div>
                    <h1 className="text-lg font-display font-black text-white tracking-tighter italic uppercase leading-none">Performance <span className="text-accent">Matrix</span></h1>
                </header>

                {/* Sticky Axis Controls (Mobile Only) - Ultra Compact */}
                <div className="lg:hidden sticky top-0 z-30 bg-black/95 backdrop-blur-xl border-b border-white/10 shadow-lg">
                    <div className="px-3 py-2 space-y-1.5">
                        {/* Y-Axis - Inline */}
                        <div className="flex items-center gap-2">
                            <span className="text-[8px] font-black text-rose-400 uppercase w-3 shrink-0">Y</span>
                            <div className="flex gap-1 flex-1">
                                {Object.keys(axisOptions).map(key => (
                                    <button
                                        key={`y-${key}`}
                                        onClick={() => setYAxis(key)}
                                        disabled={key === xAxis}
                                        className={`flex-1 py-1 rounded-md text-[8px] font-black uppercase tracking-tight transition-all ${
                                            yAxis === key
                                                ? 'bg-rose-500 text-white'
                                                : key === xAxis
                                                    ? 'bg-white/5 text-slate-600 opacity-30'
                                                    : 'bg-white/5 text-slate-400 active:scale-95'
                                        }`}
                                    >
                                        {axisOptions[key].shortLabel}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* X-Axis - Inline */}
                        <div className="flex items-center gap-2">
                            <span className="text-[8px] font-black text-rose-400 uppercase w-3 shrink-0">X</span>
                            <div className="flex gap-1 flex-1">
                                {Object.keys(axisOptions).map(key => (
                                    <button
                                        key={`x-${key}`}
                                        onClick={() => setXAxis(key)}
                                        disabled={key === yAxis}
                                        className={`flex-1 py-1 rounded-md text-[8px] font-black uppercase tracking-tight transition-all ${
                                            xAxis === key
                                                ? 'bg-rose-500 text-white'
                                                : key === yAxis
                                                    ? 'bg-white/5 text-slate-600 opacity-30'
                                                    : 'bg-white/5 text-slate-400 active:scale-95'
                                        }`}
                                    >
                                        {axisOptions[key].shortLabel}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chart Container */}
                <div className="px-2 lg:px-12 py-2 lg:py-10 lg:flex-1 lg:flex lg:flex-col lg:min-h-0">
                    <div className="h-[50vh] lg:h-auto lg:flex-1 lg:min-h-0 glass-panel rounded-2xl lg:rounded-[3rem] p-1.5 lg:p-12 relative overflow-hidden group/chart border-white/10 hover:border-white/20 transition-colors">
                        {/* Background Gradients */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[120px] pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/5 blur-[120px] pointer-events-none"></div>

                        {/* Quadrant Indicators - Desktop Only */}
                        <div className="hidden lg:flex absolute top-10 right-10 flex-col items-end opacity-20 pointer-events-none">
                            <div className="text-[10px] font-black text-accent uppercase tracking-[0.3em]">HIGH PERFORMANCE</div>
                            <div className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.1em]">ELITE ZONE</div>
                        </div>
                        <div className="hidden lg:flex absolute bottom-10 left-10 flex-col items-start opacity-20 pointer-events-none">
                            <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">UTILITY/VALUE</div>
                            <div className="text-[8px] font-bold text-slate-700 uppercase tracking-[0.1em]">BUDGET ZONE</div>
                        </div>

                        <div ref={chartRef} className="w-full h-full" onClick={(e) => { if (isMobile && e.target.tagName !== 'circle') setSelectedSteel(null); }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart margin={isMobile ? { top: 8, right: 8, bottom: 20, left: 0 } : { top: 20, right: 20, bottom: 40, left: 10 }}>
                                    <CartesianGrid strokeDasharray="6 6" stroke="#1e293b" vertical={true} strokeOpacity={0.5} />
                                    <XAxis
                                        type="number"
                                        dataKey={xAxis}
                                        name={axisOptions[xAxis].label}
                                        stroke="#334155"
                                        unit=""
                                        domain={[0, 10]}
                                        ticks={[0, 2, 4, 6, 8, 10]}
                                        tick={{ fontSize: isMobile ? 8 : 10, fontWeight: 'black', fill: '#475569' }}
                                        label={{ value: `${axisOptions[xAxis].shortLabel} →`, position: 'insideBottom', fill: '#64748b', fontSize: isMobile ? 9 : 11, fontWeight: 'black', dy: isMobile ? 12 : 25, letterSpacing: '0.1em' }}
                                    />
                                    <YAxis
                                        type="number"
                                        dataKey={yAxis}
                                        name={axisOptions[yAxis].label}
                                        stroke="#334155"
                                        unit=""
                                        domain={[0, 10]}
                                        ticks={[0, 2, 4, 6, 8, 10]}
                                        tick={{ fontSize: isMobile ? 8 : 10, fontWeight: 'black', fill: '#475569' }}
                                        label={{ value: `${axisOptions[yAxis].shortLabel} →`, angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: isMobile ? 9 : 11, fontWeight: 'black', dx: isMobile ? -2 : 5, letterSpacing: '0.1em' }}
                                    />
                                    <Tooltip
                                        isAnimationActive={false}
                                        cursor={{ stroke: 'rgba(245, 158, 11, 0.4)', strokeWidth: 2, strokeDasharray: '5 5' }}
                                        active={isMobile ? false : undefined}
                                        content={({ active, payload }) => {
                                            if (isMobile) return null;
                                            if (active && payload && payload.length) {
                                                const data = payload[0].payload;
                                                const color = getProducerColor(data.producer);
                                                return (
                                                    <div className="bg-black/95 p-5 rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl min-w-[240px]">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                                                                <div className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: color }}>{data.producer}</div>
                                                            </div>
                                                            <div className="text-[9px] font-black text-accent/40 uppercase">Interactive</div>
                                                        </div>
                                                        <div className="text-xl font-display font-black text-white mb-4 italic uppercase tracking-tight">{data.name}</div>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            {Object.keys(axisOptions).map(key => (
                                                                <div key={key} className={`p-2.5 rounded-xl bg-white/5 border ${xAxis === key || yAxis === key ? 'border-accent/30' : 'border-white/5'}`}>
                                                                    <div className={`text-[8px] uppercase font-black mb-1 ${xAxis === key || yAxis === key ? 'text-accent' : 'text-slate-500'}`}>{axisOptions[key].shortLabel}</div>
                                                                    <div className="text-sm font-mono font-black text-white">{data[key]}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Scatter
                                        name="Steels"
                                        data={matrixSteels}
                                        onClick={(data) => {
                                            if (selectedSteel?.name === data.name) {
                                                setSelectedSteel(null);
                                            } else {
                                                setSelectedSteel(data);
                                            }
                                        }}
                                        as="g"
                                        isAnimationActive={true}
                                        animationDuration={1000}
                                        onMouseEnter={(data) => setHoveredSteel(data.name)}
                                        onMouseLeave={() => setHoveredSteel(null)}
                                        shape={(props) => {
                                            const { cx, cy, payload } = props;
                                            const color = getProducerColor(payload.producer);
                                            const isHovered = hoveredSteel === payload.name;
                                            const isSelected = selectedSteel?.name === payload.name;
                                            const isDimmed = (hoveredSteel && !isHovered) || (selectedSteel && !isSelected && !isHovered);

                                            const offset = labelOffsets[payload.name] || { x: 0, y: -12 };
                                            const labelX = cx + offset.x;
                                            const labelY = cy + offset.y;
                                            const showLine = Math.abs(offset.x) > 4 || Math.abs(offset.y + 12) > 4 || isHovered || isSelected;

                                            const showLabel = labeledSteels.includes(payload.name) || isHovered || isSelected;

                                            return (
                                                <g style={{ opacity: isDimmed ? 0.2 : 1, transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                                                    {showLine && showLabel && (
                                                        <line
                                                            x1={cx} y1={cy}
                                                            x2={labelX} y2={labelY - 2}
                                                            stroke={isHovered || isSelected ? "#fff" : "rgba(255,255,255,0.2)"}
                                                            strokeWidth={isHovered || isSelected ? 1.5 : 0.8}
                                                            strokeDasharray={isSelected ? "3 3" : "none"}
                                                        />
                                                    )}
                                                    {showLabel && (
                                                        <text
                                                            x={labelX} y={labelY}
                                                            textAnchor="middle"
                                                            fill={isHovered || isSelected ? "#fff" : "rgba(255,255,255,0.5)"}
                                                            fontSize={isMobile ? (isHovered || isSelected ? 9 : 7) : (isHovered || isSelected ? 12 : 10)}
                                                            fontFamily="Inter, sans-serif"
                                                            fontWeight="900"
                                                            style={{ pointerEvents: 'none', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                                                        >
                                                            {payload.name}
                                                        </text>
                                                    )}
                                                    {/* Invisible larger touch target for mobile */}
                                                    {isMobile && (
                                                        <circle
                                                            cx={cx} cy={cy}
                                                            r={20}
                                                            fill="transparent"
                                                            className="cursor-pointer"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (selectedSteel?.name === payload.name) {
                                                                    setSelectedSteel(null);
                                                                } else {
                                                                    setSelectedSteel(payload);
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                    <circle
                                                        cx={cx} cy={cy}
                                                        r={isSelected ? (isMobile ? 7 : 10) : isHovered ? (isMobile ? 6 : 8) : (isMobile ? 5 : 6)}
                                                        fill={color}
                                                        stroke={isSelected ? "#fff" : isHovered ? color : "none"}
                                                        strokeWidth={isSelected ? (isMobile ? 2 : 3) : 0}
                                                        className="cursor-pointer"
                                                        style={{ filter: isHovered || isSelected ? `drop-shadow(0 0 ${isMobile ? '6' : '10'}px ${color})` : 'none' }}
                                                    />
                                                    {(isHovered || isSelected) && (
                                                        <circle
                                                            cx={cx} cy={cy}
                                                            r={isMobile ? 14 : 20}
                                                            fill={color}
                                                            fillOpacity={0.15}
                                                            className="animate-pulse"
                                                        />
                                                    )}
                                                </g>
                                            );
                                        }}
                                    />
                                </ScatterChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Mobile Selected Steel Info Bar */}
                {isMobile && selectedSteel && (
                    <div className="lg:hidden px-3 pb-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                        <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-3 flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: getProducerColor(selectedSteel.producer) }} />
                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-black text-white uppercase tracking-tight truncate">{selectedSteel.name}</div>
                                <div className="flex gap-3 mt-0.5">
                                    <span className="text-[9px] text-slate-400 font-bold"><span className="text-rose-400">{axisOptions[yAxis].shortLabel}</span> {selectedSteel[yAxis]}</span>
                                    <span className="text-[9px] text-slate-400 font-bold"><span className="text-accent">{axisOptions[xAxis].shortLabel}</span> {selectedSteel[xAxis]}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setDetailSteel(selectedSteel)}
                                className="p-2 bg-accent text-black rounded-xl shrink-0 active:scale-95 !min-w-0 !min-h-0"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setSelectedSteel(null)}
                                className="p-2 bg-white/10 text-slate-400 rounded-xl shrink-0 active:scale-95 !min-w-0 !min-h-0"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* Legend (Mobile Only) - Horizontal Scrollable Bar */}
                <div className="lg:hidden shrink-0 z-10">
                    <div className="px-3 pt-1 pb-24">
                        {/* Single row, horizontally scrollable */}
                        <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1">
                            {producers.map(prod => {
                                const isActive = activeProducer === prod;
                                const color = prod === "ALL" ? "#ffffff" : getProducerColor(prod);
                                // Abbreviate long names for mobile
                                const shortName = prod === "ALL" ? "ALL" : prod.slice(0, 4).toUpperCase();
                                return (
                                    <button
                                        key={prod}
                                        onClick={() => setActiveProducer(prod)}
                                        className={`flex items-center gap-1 px-1.5 py-1 rounded-md border transition-all active:scale-95 flex-shrink-0 ${isActive ? "border-accent bg-accent/10" : "border-white/10 bg-white/5"}`}
                                    >
                                        <div
                                            className="w-1.5 h-1.5 rounded-full"
                                            style={{
                                                backgroundColor: color,
                                                boxShadow: isActive ? `0 0 6px ${color}` : 'none'
                                            }}
                                        />
                                        <span className={`text-[7px] font-black tracking-wide transition-colors ${isActive ? "text-white" : "text-slate-500"}`}>
                                            {shortName}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>


            {/* Background Texture Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay"></div>
        </div>
    );
};

export default PerformanceMatrix;
