import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toPng } from 'html-to-image';
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
    const iterations = 80;
    const padding = mobile ? 2 : 4;

    for (let k = 0; k < iterations; k++) {
        for (let i = 0; i < nodes.length; i++) {
            const nodeA = nodes[i];

            // 1. Attraction to target (position above dot)
            const targetX = nodeA.cx;
            const targetY = nodeA.cy - 12;

            nodeA.x += (targetX - nodeA.x) * 0.1;
            nodeA.y += (targetY - nodeA.y) * 0.1;

            // 2. Repulsion from the point itself (avoid covering the dot)
            const pDx = nodeA.x - nodeA.cx;
            const pDy = nodeA.y - nodeA.cy;
            const pDist = Math.sqrt(pDx * pDx + pDy * pDy);
            if (pDist < 10) {
                const force = (10 - pDist) / 10;
                nodeA.y -= force * 2; // Push up away from point
            }

            // 3. Repulsion from other labels
            for (let j = 0; j < nodes.length; j++) {
                if (i === j) continue;
                const nodeB = nodes[j];

                const dx = nodeA.x - nodeB.x;
                const dy = nodeA.y - nodeB.y;
                const distX = Math.abs(dx);
                const distY = Math.abs(dy);

                const minW = (nodeA.width + nodeB.width) / 2 + padding;
                const minH = (nodeA.height + nodeB.height) / 2 + padding;

                if (distX < minW && distY < minH) {
                    const overlapX = minW - distX;
                    const overlapY = minH - distY;

                    // Push away
                    if (overlapX < overlapY * 1.2) {
                        const shift = (overlapX / 2) * 0.5;
                        const sign = dx >= 0 ? 1 : -1;
                        nodeA.x += shift * sign;
                        nodeB.x -= shift * sign;
                    } else {
                        const shift = (overlapY / 2) * 0.5;
                        const sign = dy >= 0 ? 1 : -1;
                        nodeA.y += shift * sign;
                        nodeB.y -= shift * sign;
                    }
                }
            }

            // 4. Boundary clamping (clamping the label within the chart area)
            const halfW = nodeA.width / 2;
            const halfH = nodeA.height / 2;

            nodeA.x = Math.max(margin.left + halfW, Math.min(margin.left + innerW - halfW, nodeA.x));
            nodeA.y = Math.max(margin.top + halfH, Math.min(margin.top + innerH - halfH, nodeA.y));
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
    const [labelDensity, setLabelDensity] = useState('super'); // 'all', 'super', 'none'
    const [isMobile, setIsMobile] = useState(false);

    // Chart dimensions for label collision calculation
    const [chartDimensions, setChartDimensions] = useState({ width: 0, height: 0 });
    const [isFullScreen, setIsFullScreen] = useState(false);
    const chartRef = useRef(null);
    const containerRef = useRef(null);
    const exportRef = useRef(null);

    const toggleFullScreen = () => {
        if (!containerRef.current) return;

        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const handleDownload = async () => {
        if (!exportRef.current) return;

        try {
            const dataUrl = await toPng(exportRef.current, {
                cacheBust: true,
                backgroundColor: '#000000',
                style: {
                    borderRadius: '0'
                }
            });
            const link = document.createElement('a');
            link.download = `MetalCore-Matrix-${xAxis}-${yAxis}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('oops, something went wrong!', err);
        }
    };

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
        "Crucible": "#FF5733",    // Vibrant Orange
        "Böhler": "#33FF57",      // Lime Green
        "Uddeholm": "#3357FF",    // Royal Blue
        "Carpenter": "#F333FF",   // Magenta
        "Hitachi": "#FF33A1",     // Hot Pink
        "Takefu": "#33FFF5",      // Cyan
        "Alleima": "#FFF533",     // Bright Yellow
        "Erasteel": "#FF8633",    // Deep Orange
        "Zapp": "#A133FF",        // Purple
        "Latrobe": "#E91E63",     // Pink
        "Niagara": "#00BCD4",     // Teal
        "Lohmann": "#8BC34A",     // Light Green
        "Damasteel": "#795548",   // Brown
        "Various": "#94a3b8",     // Slate
        "Other": "#ffffff"        // White
    };

    const getProducerColor = (producer) => {
        if (!producer) return producerColors["Other"];
        const found = Object.keys(producerColors).find(k => producer.includes(k));
        if (found) return producerColors[found];

        // Dynamic color generation for any other producer to ensure uniqueness
        let hash = 0;
        for (let i = 0; i < producer.length; i++) {
            hash = producer.charCodeAt(i) + ((hash << 5) - hash);
        }
        const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
        return "#" + "00000".substring(0, 6 - c.length) + c;
    };
    // Filter steels to show labels for: Top performers or hovered
    const labeledSteels = useMemo(() => {
        if (labelDensity === 'none' && !hoveredSteel) return [];
        if (labelDensity === 'all') return matrixSteels.map(s => s.name);

        // 'super' density: show top performers
        if (!hoveredSteel) {
            const sorted = [...matrixSteels].sort((a, b) => {
                const scoreA = (a[xAxis] || 0) + (a[yAxis] || 0);
                const scoreB = (b[xAxis] || 0) + (b[yAxis] || 0);
                return scoreB - scoreA;
            });

            // Show top 8 on mobile, top 18 on desktop to highlight 'Supersteels'
            return sorted.slice(0, isMobile ? 8 : 18).map(s => s.name);
        }

        // If hovered, show all labels so the hovered one is definitely there 
        // (the Scatter component handles the actual hover state visibility)
        return matrixSteels.map(s => s.name);
    }, [matrixSteels, hoveredSteel, isMobile, labelDensity, xAxis, yAxis]);


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
                                {['none', 'super', 'all'].map(d => (
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
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Y-Axis</span>
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
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">X-Axis</span>
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
                                    <div className="text-[10px] font-black text-slate-500 uppercase mb-1 flex items-center gap-2">
                                        {displaySteel.producer}
                                        {displaySteel.pm !== undefined && (
                                            <>
                                                <span className="w-1 h-1 rounded-full bg-slate-600" />
                                                <span className={displaySteel.pm ? "text-accent" : ""}>{displaySteel.pm ? 'PM' : 'CONVENTIONAL'}</span>
                                            </>
                                        )}
                                    </div>
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
                                        className={`flex-1 py-1 rounded-md text-[8px] font-black uppercase tracking-tight transition-all ${yAxis === key
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
                                        className={`flex-1 py-1 rounded-md text-[8px] font-black uppercase tracking-tight transition-all ${xAxis === key
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
                <div ref={isFullScreen ? exportRef : containerRef} className={`relative px-2 lg:px-12 py-2 lg:py-10 lg:flex-1 lg:flex lg:flex-col lg:min-h-0 ${isFullScreen ? 'bg-black !p-0' : ''}`}>
                    <div ref={isFullScreen ? containerRef : exportRef} className={`h-[50vh] lg:h-auto lg:flex-1 lg:min-h-0 glass-panel rounded-2xl lg:rounded-[3rem] p-1.5 lg:p-12 relative overflow-hidden group/chart border-white/10 hover:border-white/20 transition-colors ${isFullScreen ? 'border-none rounded-none' : ''}`}>
                        {/* Background Gradients */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[120px] pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/5 blur-[120px] pointer-events-none"></div>

                        {/* Fullscreen Toggle */}
                        <button
                            onClick={toggleFullScreen}
                            className="absolute top-4 right-4 z-50 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all backdrop-blur-md opacity-0 group-hover/chart:opacity-100 hidden lg:block"
                            title={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                        >
                            {isFullScreen ? (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <path d="M8 3v5H3M16 3v5h5M8 21v-5H3M16 21v-5h5" />
                                </svg>
                            ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <path d="M15 3h6v6M9 21H3v-6M21 15v6h-6M3 9V3h6" />
                                </svg>
                            )}
                        </button>

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
                                                                <div className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5" style={{ color: color }}>
                                                                    {data.producer}
                                                                    {data.pm !== undefined && (
                                                                        <>
                                                                            <span className="w-0.5 h-0.5 rounded-full bg-slate-600" />
                                                                            <span className={data.pm ? "text-accent" : "text-white/50"}>{data.pm ? 'PM' : 'CONV'}</span>
                                                                        </>
                                                                    )}
                                                                </div>
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

                    {/* Full-screen Control Bar (Wider & Thinner Dock) */}
                    {isFullScreen && (
                        <div className="absolute bottom-0 left-0 w-full bg-slate-950/80 backdrop-blur-3xl border-t border-white/10 p-3 flex flex-col gap-2 animate-in slide-in-from-bottom-full duration-700 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)] z-50">
                            <div className="flex items-center gap-6 px-4">
                                {/* Simple Search Module */}
                                <div className="relative w-80">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Search steels..."
                                        className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 pl-9 pr-3 text-white text-[10px] font-bold focus:outline-none focus:border-accent/40 transition-colors placeholder:text-slate-600"
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                {/* Labels Toggle Module */}
                                <div className="flex items-center gap-3 border-l border-white/5 pl-6 ml-2">
                                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Labels</span>
                                    <div className="flex gap-0.5 bg-black/40 p-0.5 rounded-lg border border-white/5">
                                        {['none', 'super', 'all'].map(d => (
                                            <button
                                                key={`fs-label-${d}`}
                                                onClick={() => setLabelDensity(d)}
                                                className={`px-2 py-1 rounded-md text-[8px] font-black uppercase transition-all ${labelDensity === d
                                                    ? 'bg-accent text-black shadow-sm'
                                                    : 'text-slate-500 hover:text-white'}`}
                                            >
                                                {d}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Axis Selection Module */}
                                <div className="flex items-center gap-8 flex-1 justify-center border-l border-white/5 ml-2 pl-6">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest shrink-0">Y-Axis</span>
                                        <div className="flex gap-1">
                                            {Object.keys(axisOptions).map(key => (
                                                <button
                                                    key={`fs-y-${key}`}
                                                    onClick={() => setYAxis(key)}
                                                    disabled={key === xAxis}
                                                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${yAxis === key
                                                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                                                        : 'bg-white/5 text-slate-500 hover:text-white'}`}
                                                >
                                                    {axisOptions[key].shortLabel}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[9px] font-black text-accent uppercase tracking-widest shrink-0">X-Axis</span>
                                        <div className="flex gap-1">
                                            {Object.keys(axisOptions).map(key => (
                                                <button
                                                    key={`fs-x-${key}`}
                                                    onClick={() => setXAxis(key)}
                                                    disabled={key === yAxis}
                                                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${xAxis === key
                                                        ? 'bg-accent text-black shadow-lg shadow-accent/20'
                                                        : 'bg-white/5 text-slate-500 hover:text-white'}`}
                                                >
                                                    {axisOptions[key].shortLabel}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Export Button Module */}
                                <div className="border-l border-white/5 pl-6">
                                    <button
                                        onClick={handleDownload}
                                        className="flex items-center gap-2 px-4 py-2 bg-accent text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-accent/20"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                                        </svg>
                                        Export PNG
                                    </button>
                                </div>
                            </div>

                            {/* Producer Legend Module */}
                            <div className="flex flex-wrap items-center justify-center gap-1.5 px-4 pt-1.5 border-t border-white/5">
                                {producers.map(prod => {
                                    const isActive = activeProducer === prod;
                                    const color = prod === "ALL" ? "#ffffff" : getProducerColor(prod);
                                    return (
                                        <button
                                            key={`fs-leg-${prod}`}
                                            onClick={() => setActiveProducer(isActive && prod !== 'ALL' ? 'ALL' : prod)}
                                            className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-all active:scale-95 ${isActive
                                                ? 'bg-accent/10 shadow-sm'
                                                : 'hover:bg-white/5'
                                                }`}
                                        >
                                            <div
                                                className="w-1.5 h-1.5 rounded-full shrink-0"
                                                style={{
                                                    backgroundColor: color,
                                                    boxShadow: isActive ? `0 0 8px ${color}` : 'none'
                                                }}
                                            />
                                            <span className={`text-[8px] font-black uppercase tracking-tight transition-colors ${isActive ? "text-white" : "text-slate-500"}`}>
                                                {prod}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
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
        </div >
    );
};

export default PerformanceMatrix;
