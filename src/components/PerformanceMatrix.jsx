import React, { useState, useRef, useEffect, useMemo } from 'react';
import ViewHeader from './Common/ViewHeader';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toPng } from 'html-to-image';
import PerformanceRadar from './PerformanceRadar';
import { getProducerColor } from '../utils/producerColors';

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
    const mobileInfoRef = useRef(null);
    const [hasScrolledToSelection, setHasScrolledToSelection] = useState(false);

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
                backgroundColor: '#0B0A08',
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

    // Auto-scroll logic for mobile
    useEffect(() => {
        if (isMobile && selectedSteel && !hasScrolledToSelection && mobileInfoRef.current) {
            // Slight delay to allow the bar to animate in/render
            setTimeout(() => {
                const element = mobileInfoRef.current;
                if (!element) return;

                // On mobile, the scroll container is window/body
                const rect = element.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const elementTop = rect.top + scrollTop;

                // Offset calculation:
                // We want the element's top to be visible well above the bottom nav (~80px)
                // We'll aim to position the element near the top/middle of the viewport
                const offset = 140; // Pixels from top of viewport

                window.scrollTo({
                    top: elementTop - offset,
                    behavior: 'smooth'
                });

                setHasScrolledToSelection(true);
            }, 150);
        }
    }, [isMobile, selectedSteel, hasScrolledToSelection]);

    // Local search within the already filtered steels
    const matrixSteels = useMemo(() => {
        if (!searchTerm) return steels;
        return steels.filter(s =>
            (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (s.producer || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [steels, searchTerm]);

    // Calculate optimal label positions
    const labelOffsets = useMemo(() => {
        return solveLabelCollisions(matrixSteels, xAxis, yAxis, chartDimensions.width, chartDimensions.height, isMobile);
    }, [matrixSteels, xAxis, yAxis, chartDimensions, isMobile]);

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
        <div className="flex flex-col lg:flex-row flex-1 min-w-0 min-h-dvh lg:h-full bg-obsidian lg:overflow-hidden max-w-[100vw] overflow-x-hidden">

            {/* Left Sidebar: Controls & Details (Desktop Only) */}
            <aside className="hidden lg:flex flex-col w-[400px] border-r border-white/5 bg-slate-950 overflow-y-auto no-scrollbar">
                <div className="p-8 space-y-8">
                    {/* Header Section */}
                    <div>
                        <div className="text-[10px] font-mono font-medium text-accent-400 mb-3 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-6 h-px bg-accent/30"></span>
                            Analytics Engine
                        </div>
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
                            <span className="text-[10px] font-mono font-medium text-slate-500 uppercase tracking-widest">Labels</span>
                            <div className="flex gap-1">
                                {['none', 'super', 'all'].map(d => (
                                    <button
                                        key={d}
                                        onClick={() => setLabelDensity(d)}
                                        className={labelDensity === d ? 'px-2 py-1 rounded-md text-[9px] font-mono font-medium uppercase transition-all bg-accent text-[#1A0C05]' : 'px-2 py-1 rounded-md text-[9px] font-mono font-medium uppercase transition-all text-slate-500 hover:text-white'}
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
                            <span className="text-[10px] font-mono font-medium text-slate-500 uppercase tracking-widest">Y-Axis</span>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.keys(axisOptions).map(key => (
                                    <button
                                        key={`y-${key}`}
                                        onClick={() => setYAxis(key)}
                                        disabled={key === xAxis}
                                        className={yAxis === key
                                            ? 'px-3 py-2.5 rounded-xl text-[10px] font-mono font-medium uppercase tracking-wider transition-all text-left bg-accent text-[#1A0C05] shadow-ember-sm'
                                            : 'px-3 py-2.5 rounded-xl text-[10px] font-mono font-medium uppercase tracking-wider transition-all text-left bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10'}
                                    >
                                        {axisOptions[key].label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <span className="text-[10px] font-mono font-medium text-slate-500 uppercase tracking-widest">X-Axis</span>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.keys(axisOptions).map(key => (
                                    <button
                                        key={`x-${key}`}
                                        onClick={() => setXAxis(key)}
                                        disabled={key === yAxis}
                                        className={xAxis === key
                                            ? 'px-3 py-2.5 rounded-xl text-[10px] font-mono font-medium uppercase tracking-wider transition-all text-left bg-accent text-[#1A0C05] shadow-ember-sm'
                                            : 'px-3 py-2.5 rounded-xl text-[10px] font-mono font-medium uppercase tracking-wider transition-all text-left bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10'}
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
                                    <div className="text-[10px] font-mono font-medium text-slate-500 uppercase mb-1 flex items-center gap-2">
                                        {displaySteel.producer}
                                        {displaySteel.pm !== undefined && (
                                            <>
                                                <span className="w-1 h-1 rounded-full bg-slate-600" />
                                                <span className={displaySteel.pm ? "text-accent-400" : ""}>{displaySteel.pm ? 'PM' : 'CONVENTIONAL'}</span>
                                            </>
                                        )}
                                    </div>
                                    <h3 className="text-2xl font-display text-white uppercase tracking-tight">{displaySteel.name}</h3>
                                </div>
                                <button
                                    onClick={() => setDetailSteel(displaySteel)}
                                    className="p-3 bg-accent text-[#1A0C05] rounded-xl hover:scale-105 active:scale-95 transition-all shadow-ember-sm"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                        <path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                    </svg>
                                </button>
                            </div>

                            <PerformanceRadar items={[displaySteel]} compact={true} colors={[getProducerColor(displaySteel.producer)]} />

                            <div className="grid grid-cols-2 gap-4">
                                {Object.keys(axisOptions).map(key => (
                                    <div key={key} className={xAxis === key || yAxis === key ? 'p-3 rounded-2xl bg-black/40 border transition-all border-accent/40 bg-accent/5' : 'p-3 rounded-2xl bg-black/40 border transition-all border-white/5'}>
                                        <div className="text-[9px] font-mono font-medium text-slate-600 uppercase mb-1">{axisOptions[key].shortLabel}</div>
                                        <div className="text-xl font-mono font-semibold text-white">{displaySteel[key]}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Area */}
            <div className="flex flex-col flex-1 min-w-0 md:h-full md:overflow-y-auto custom-scrollbar bg-transparent relative pb-40 md:pb-0">
                {/* Desktop gradient overlay — matches sidebar and HomeView gradient spread */}
                <div className="hidden md:block absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-accent/10 to-transparent pointer-events-none" />

                <ViewHeader
                    subtitle="Material Science"
                    title="Performance"
                    highlight="Matrix"
                    color="rose"
                />

                {/* Sticky Axis Controls (Mobile Only) - Ultra Compact */}
                <div className="lg:hidden sticky top-0 z-30 bg-[#12100D]/95 backdrop-blur-xl border-b border-white/10 shadow-lg">
                    <div className="px-3 py-2 space-y-1.5">
                        {/* Y-Axis - Inline */}
                        <div className="flex items-center gap-2">
                            <span className="text-[8px] font-mono font-medium text-accent-400 uppercase w-3 shrink-0">Y</span>
                            <div className="flex gap-1 flex-1">
                                {Object.keys(axisOptions).map(key => (
                                    <button
                                        key={`y-${key}`}
                                        onClick={() => setYAxis(key)}
                                        disabled={key === xAxis}
                                        className={yAxis === key
                                            ? 'flex-1 py-1 rounded-md text-[8px] font-mono font-medium uppercase tracking-tight transition-all bg-accent text-[#1A0C05]'
                                            : key === xAxis
                                                ? 'flex-1 py-1 rounded-md text-[8px] font-mono font-medium uppercase tracking-tight transition-all bg-white/5 text-slate-600 opacity-30'
                                                : 'flex-1 py-1 rounded-md text-[8px] font-mono font-medium uppercase tracking-tight transition-all bg-white/5 text-slate-400 active:scale-95'}
                                    >
                                        {axisOptions[key].shortLabel}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* X-Axis - Inline */}
                        <div className="flex items-center gap-2">
                            <span className="text-[8px] font-mono font-medium text-accent-400 uppercase w-3 shrink-0">X</span>
                            <div className="flex gap-1 flex-1">
                                {Object.keys(axisOptions).map(key => (
                                    <button
                                        key={`x-${key}`}
                                        onClick={() => setXAxis(key)}
                                        disabled={key === yAxis}
                                        className={xAxis === key
                                            ? 'flex-1 py-1 rounded-md text-[8px] font-mono font-medium uppercase tracking-tight transition-all bg-accent text-[#1A0C05]'
                                            : key === yAxis
                                                ? 'flex-1 py-1 rounded-md text-[8px] font-mono font-medium uppercase tracking-tight transition-all bg-white/5 text-slate-600 opacity-30'
                                                : 'flex-1 py-1 rounded-md text-[8px] font-mono font-medium uppercase tracking-tight transition-all bg-white/5 text-slate-400 active:scale-95'}
                                    >
                                        {axisOptions[key].shortLabel}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chart Container */}
                <div ref={isFullScreen ? exportRef : containerRef} className={isFullScreen ? 'relative bg-obsidian !p-0' : 'relative px-2 lg:px-12 py-2 lg:py-10 lg:flex-1 lg:flex lg:flex-col lg:min-h-0'}>
                    <div ref={isFullScreen ? containerRef : exportRef} className={isFullScreen ? 'h-[50vh] lg:h-auto lg:flex-1 lg:min-h-0 glass-panel p-1.5 lg:p-12 relative overflow-hidden group/chart border-none rounded-none' : 'h-[50vh] lg:h-auto lg:flex-1 lg:min-h-0 glass-panel rounded-2xl lg:rounded-3xl p-1.5 lg:p-12 relative overflow-hidden group/chart border-white/10 hover:border-white/20 transition-colors'}>
                        {/* Background Gradients */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[120px] pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 blur-[120px] pointer-events-none"></div>

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

                        <div ref={chartRef} className="w-full h-full" onClick={(e) => { if (isMobile && e.target.tagName !== 'circle') setSelectedSteel(null); }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart margin={isMobile ? { top: 8, right: 8, bottom: 20, left: 0 } : { top: 20, right: 20, bottom: 40, left: 10 }}>
                                    <CartesianGrid strokeDasharray="6 6" stroke="#292420" vertical={true} strokeOpacity={0.5} />
                                    <XAxis
                                        type="number"
                                        dataKey={xAxis}
                                        name={axisOptions[xAxis].label}
                                        stroke="#3A332B"
                                        unit=""
                                        domain={[0, 10]}
                                        ticks={[0, 2, 4, 6, 8, 10]}
                                        tick={{ fontSize: isMobile ? 8 : 10, fill: 'rgba(237,233,226,0.4)', fontFamily: 'JetBrains Mono, monospace' }}
                                        label={{ value: `${axisOptions[xAxis].shortLabel} →`, position: 'insideBottom', fill: 'rgba(237,233,226,0.35)', fontSize: isMobile ? 9 : 11, fontFamily: 'JetBrains Mono, monospace', dy: isMobile ? 12 : 25, letterSpacing: '0.1em' }}
                                    />
                                    <YAxis
                                        type="number"
                                        dataKey={yAxis}
                                        name={axisOptions[yAxis].label}
                                        stroke="#3A332B"
                                        unit=""
                                        domain={[0, 10]}
                                        ticks={[0, 2, 4, 6, 8, 10]}
                                        tick={{ fontSize: isMobile ? 8 : 10, fill: 'rgba(237,233,226,0.4)', fontFamily: 'JetBrains Mono, monospace' }}
                                        label={{ value: `${axisOptions[yAxis].shortLabel} →`, angle: -90, position: 'insideLeft', fill: 'rgba(237,233,226,0.35)', fontSize: isMobile ? 9 : 11, fontFamily: 'JetBrains Mono, monospace', dx: isMobile ? -2 : 5, letterSpacing: '0.1em' }}
                                    />
                                    <Tooltip
                                        isAnimationActive={false}
                                        cursor={{ stroke: 'rgba(255, 90, 31, 0.4)', strokeWidth: 2, strokeDasharray: '5 5' }}
                                        active={isMobile ? false : undefined}
                                        content={({ active, payload }) => {
                                            if (isMobile) return null;
                                            if (active && payload && payload.length) {
                                                const data = payload[0].payload;
                                                const color = getProducerColor(data.producer);
                                                return (
                                                    <div className="glass-strong p-5 rounded-2xl border border-white/10 shadow-plate-lg min-w-[240px]">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                                                                <div className="text-[10px] font-mono font-medium uppercase tracking-[0.2em] flex items-center gap-1.5" style={{ color: color }}>
                                                                    {data.producer}
                                                                    {data.pm !== undefined && (
                                                                        <>
                                                                            <span className="w-0.5 h-0.5 rounded-full bg-slate-600" />
                                                                            <span className={data.pm ? "text-accent-400" : "text-white/50"}>{data.pm ? 'PM' : 'CONV'}</span>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-xl font-display text-white mb-4 uppercase tracking-tight">{data.name}</div>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            {Object.keys(axisOptions).map(key => (
                                                                <div key={key} className={xAxis === key || yAxis === key ? 'p-2.5 rounded-xl bg-white/5 border border-accent/30' : 'p-2.5 rounded-xl bg-white/5 border border-white/5'}>
                                                                    <div className={xAxis === key || yAxis === key ? 'text-[8px] uppercase font-mono font-medium mb-1 text-accent-400' : 'text-[8px] uppercase font-mono font-medium mb-1 text-slate-500'}>{axisOptions[key].shortLabel}</div>
                                                                    <div className="text-sm font-mono font-semibold text-white">{data[key]}</div>
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
                                                <g style={{ opacity: isDimmed ? 0.2 : 1, transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)' }}>
                                                    {showLine && showLabel && (
                                                        <line
                                                            x1={cx} y1={cy}
                                                            x2={labelX} y2={labelY - 2}
                                                            stroke={isHovered || isSelected ? "#EDE9E2" : "rgba(237,233,226,0.2)"}
                                                            strokeWidth={isHovered || isSelected ? 1.5 : 0.8}
                                                            strokeDasharray={isSelected ? "3 3" : "none"}
                                                        />
                                                    )}
                                                    {showLabel && (
                                                        <text
                                                            x={labelX} y={labelY}
                                                            textAnchor="middle"
                                                            fill={isHovered || isSelected ? "#EDE9E2" : "rgba(255,255,255,0.5)"}
                                                            fontSize={isMobile ? (isHovered || isSelected ? 9 : 7) : (isHovered || isSelected ? 12 : 10)}
                                                            fontFamily="'JetBrains Mono', monospace"
                                                            fontWeight="500"
                                                            style={{ pointerEvents: 'none', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                                                        >
                                                            {payload.name}
                                                        </text>
                                                    )}
                                                    <circle
                                                        cx={cx} cy={cy}
                                                        r={isSelected ? (isMobile ? 7 : 10) : isHovered ? (isMobile ? 6 : 8) : (isMobile ? 5 : 6)}
                                                        fill={color}
                                                        stroke={isSelected ? "#EDE9E2" : isHovered ? color : "none"}
                                                        strokeWidth={isSelected ? (isMobile ? 2 : 3) : 0}
                                                        className="cursor-pointer"
                                                        style={{ filter: isHovered || isSelected ? `drop-shadow(0 0 ${isMobile ? '6' : '10'}px ${color})` : 'none' }}
                                                    />
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
                                    <span className="text-[8px] font-mono font-medium text-slate-500 uppercase tracking-widest">Labels</span>
                                    <div className="flex gap-0.5 bg-black/40 p-0.5 rounded-lg border border-white/5">
                                        {['none', 'super', 'all'].map(d => (
                                            <button
                                                key={`fs-label-${d}`}
                                                onClick={() => setLabelDensity(d)}
                                                className={labelDensity === d
                                                    ? 'px-2 py-1 rounded-md text-[8px] font-mono font-medium uppercase transition-all bg-accent text-[#1A0C05] shadow-sm'
                                                    : 'px-2 py-1 rounded-md text-[8px] font-mono font-medium uppercase transition-all text-slate-500 hover:text-white'}
                                            >
                                                {d}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Axis Selection Module */}
                                <div className="flex items-center gap-8 flex-1 justify-center border-l border-white/5 ml-2 pl-6">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[9px] font-mono font-medium text-accent-400 uppercase tracking-widest shrink-0">Y-Axis</span>
                                        <div className="flex gap-1">
                                            {Object.keys(axisOptions).map(key => (
                                                <button
                                                    key={`fs-y-${key}`}
                                                    onClick={() => setYAxis(key)}
                                                    disabled={key === xAxis}
                                                    className={yAxis === key
                                                        ? 'px-3 py-1.5 rounded-lg text-[9px] font-mono font-medium uppercase transition-all bg-accent text-[#1A0C05] shadow-ember-sm'
                                                        : 'px-3 py-1.5 rounded-lg text-[9px] font-mono font-medium uppercase transition-all bg-white/5 text-slate-500 hover:text-white'}
                                                >
                                                    {axisOptions[key].shortLabel}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[9px] font-mono font-medium text-accent-400 uppercase tracking-widest shrink-0">X-Axis</span>
                                        <div className="flex gap-1">
                                            {Object.keys(axisOptions).map(key => (
                                                <button
                                                    key={`fs-x-${key}`}
                                                    onClick={() => setXAxis(key)}
                                                    disabled={key === yAxis}
                                                    className={xAxis === key
                                                        ? 'px-3 py-1.5 rounded-lg text-[9px] font-mono font-medium uppercase transition-all bg-accent text-[#1A0C05] shadow-ember-sm'
                                                        : 'px-3 py-1.5 rounded-lg text-[9px] font-mono font-medium uppercase transition-all bg-white/5 text-slate-500 hover:text-white'}
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
                                        className="flex items-center gap-2 px-4 py-2 bg-accent text-[#1A0C05] rounded-xl font-mono font-medium text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-ember-sm"
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
                                            className={isActive
                                                ? 'flex items-center gap-1.5 px-2 py-1 rounded-md transition-all active:scale-95 bg-accent/10 shadow-sm'
                                                : 'flex items-center gap-1.5 px-2 py-1 rounded-md transition-all active:scale-95 hover:bg-white/5'}
                                        >
                                            <div
                                                className="w-1.5 h-1.5 rounded-full shrink-0"
                                                style={{
                                                    backgroundColor: color,
                                                    boxShadow: isActive ? `0 0 8px ${color}` : 'none'
                                                }}
                                            />
                                            <span className={isActive ? "text-[8px] font-mono font-medium uppercase tracking-tight transition-colors text-white" : "text-[8px] font-mono font-medium uppercase tracking-tight transition-colors text-slate-500"}>
                                                {prod}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Mobile Selected Steel Info Bar */}
                    {isMobile && selectedSteel && (
                        <div
                            ref={mobileInfoRef}
                            className="lg:hidden px-3 pb-2 animate-in fade-in slide-in-from-bottom-2 duration-300"
                        >
                            <div className="bg-[#12100D]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-3 flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: getProducerColor(selectedSteel.producer) }} />
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-semibold text-white uppercase tracking-tight truncate">{selectedSteel.name}</div>
                                    <div className="flex gap-3 mt-0.5">
                                        <span className="text-[9px] text-slate-400 font-bold"><span className="text-accent-400">{axisOptions[yAxis].shortLabel}</span> {selectedSteel[yAxis]}</span>
                                        <span className="text-[9px] text-slate-400 font-bold"><span className="text-accent-400">{axisOptions[xAxis].shortLabel}</span> {selectedSteel[xAxis]}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setDetailSteel(selectedSteel)}
                                    className="p-2 bg-accent text-[#1A0C05] rounded-xl shrink-0 active:scale-95 !min-w-0 !min-h-0"
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
                </div>
            </div>

            {/* Background Texture Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('/textures/carbon-fibre.png')] mix-blend-overlay"></div>
        </div>
    );
};

export default PerformanceMatrix;
