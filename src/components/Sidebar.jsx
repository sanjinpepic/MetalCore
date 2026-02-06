'use client'

import React, { useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { hapticFeedback } from '../hooks/useMobile';

const SIDEBAR_WIDTH = 288; // w-72 = 18rem = 288px

const Sidebar = ({
    view,
    setView,
    mobileMenuOpen,
    setMobileMenuOpen,
    producers,
    activeProducer,
    setActiveProducer,
    filters,
    setFilters,
    handleImportClick,
    fileInputRef,
    handleFileUpload,
    setShowSettings,
    aiOpen,
    setAiOpen,
    setSearch,
    trending,
    resetFilters
}) => {
    const sidebarX = useMotionValue(-SIDEBAR_WIDTH);
    const backdropOpacity = useTransform(sidebarX, [-SIDEBAR_WIDTH, 0], [0, 1]);
    const isDragging = useRef(false);
    const dragStartX = useRef(0);
    const dragStartSidebarX = useRef(0);
    const hasTriggeredHaptic = useRef(false);

    const defaultTrending = [
        { name: "MagnaCut", id: "crucible-1" },
        { name: "M390 Microclean", id: "bohler-1" },
        { name: "Vanax SuperClean", id: "uddeholm-6" },
        { name: "CPM Cru-Wear", id: "crucible-4" }
    ];

    const displayTrending = trending && trending.length > 0 ? trending : defaultTrending;

    const navItems = [
        {
            label: 'Dashboard', id: 'HOME', icon: (
                <><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>
            )
        },
        {
            label: 'Grade Library', id: 'SEARCH', icon: (
                <><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></>
            )
        },
        {
            label: 'Performance', id: 'MATRIX', icon: (
                <><line x1="21" y1="10" x2="3" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="21" y1="18" x2="3" y2="18" /></>
            )
        },
        {
            label: 'Knife Library', id: 'KNIVES', icon: (
                <><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" /><line x1="13" y1="19" x2="19" y2="13" /><line x1="16" y1="16" x2="20" y2="20" /><line x1="19" y1="21" x2="21" y2="19" /></>
            )
        },
        {
            label: 'Academy', id: 'EDUCATION', icon: (
                <><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5z" /><path d="M12 2v20" /></>
            )
        },
    ];

    // Animate sidebar when mobileMenuOpen changes (from button presses)
    useEffect(() => {
        if (typeof window === 'undefined' || window.innerWidth >= 768) return;

        const target = mobileMenuOpen ? 0 : -SIDEBAR_WIDTH;
        animate(sidebarX, target, {
            type: 'spring',
            damping: 30,
            stiffness: 300,
            mass: 0.5,
        });
    }, [mobileMenuOpen, sidebarX]);

    // Edge swipe to open - listen for touches starting near left edge
    useEffect(() => {
        if (typeof window === 'undefined' || window.innerWidth >= 768) return;

        let touchStartX = 0;
        let touchStartY = 0;
        let isEdgeSwipe = false;
        let isVerticalScroll = false;

        const handleTouchStart = (e) => {
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            isVerticalScroll = false;

            // Edge swipe: start within 30px of left edge when sidebar is closed
            if (touch.clientX < 30 && !mobileMenuOpen) {
                isEdgeSwipe = true;
                isDragging.current = true;
                dragStartX.current = touch.clientX;
                dragStartSidebarX.current = sidebarX.get();
                hasTriggeredHaptic.current = false;
            }
            // Swipe to close: touching the backdrop area (right of sidebar)
            else if (mobileMenuOpen && touch.clientX > SIDEBAR_WIDTH) {
                isDragging.current = true;
                dragStartX.current = touch.clientX;
                dragStartSidebarX.current = sidebarX.get();
                isEdgeSwipe = false;
                hasTriggeredHaptic.current = false;
            }
            // Swipe to close: touching within the sidebar and dragging left
            else if (mobileMenuOpen) {
                isDragging.current = true;
                dragStartX.current = touch.clientX;
                dragStartSidebarX.current = sidebarX.get();
                isEdgeSwipe = false;
                hasTriggeredHaptic.current = false;
            }
        };

        const handleTouchMove = (e) => {
            if (!isDragging.current) return;

            const touch = e.touches[0];
            const deltaX = touch.clientX - dragStartX.current;
            const deltaY = touch.clientY - touchStartY;

            // Determine if this is a vertical scroll (only check once)
            if (!isVerticalScroll && Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 10) {
                isVerticalScroll = true;
                isDragging.current = false;
                return;
            }

            if (isVerticalScroll) return;

            // Calculate new sidebar position
            let newX = dragStartSidebarX.current + deltaX;
            newX = Math.max(-SIDEBAR_WIDTH, Math.min(0, newX));

            sidebarX.set(newX);

            // Haptic feedback when crossing the halfway point
            const progress = (newX + SIDEBAR_WIDTH) / SIDEBAR_WIDTH;
            if (progress > 0.5 && !hasTriggeredHaptic.current) {
                hapticFeedback('light');
                hasTriggeredHaptic.current = true;
            } else if (progress < 0.5) {
                hasTriggeredHaptic.current = false;
            }

            // Prevent scroll while dragging sidebar
            if (Math.abs(deltaX) > 10) {
                e.preventDefault();
            }
        };

        const handleTouchEnd = (e) => {
            if (!isDragging.current) return;
            isDragging.current = false;

            const currentX = sidebarX.get();
            const progress = (currentX + SIDEBAR_WIDTH) / SIDEBAR_WIDTH;

            // Use velocity if available
            const touch = e.changedTouches[0];
            const deltaX = touch.clientX - dragStartX.current;
            const timeDelta = e.timeStamp - (e.touches?.[0]?.timeStamp || e.timeStamp);

            // Determine intent: open or close
            const shouldOpen = progress > 0.4 || (deltaX > 50 && isEdgeSwipe);
            const shouldClose = progress < 0.6 || deltaX < -50;

            if (isEdgeSwipe ? shouldOpen : !shouldClose) {
                // Snap open
                animate(sidebarX, 0, {
                    type: 'spring',
                    damping: 30,
                    stiffness: 300,
                    mass: 0.5,
                });
                setMobileMenuOpen(true);
                hapticFeedback('medium');
            } else {
                // Snap closed
                animate(sidebarX, -SIDEBAR_WIDTH, {
                    type: 'spring',
                    damping: 30,
                    stiffness: 300,
                    mass: 0.5,
                });
                setMobileMenuOpen(false);
                hapticFeedback('light');
            }

            isEdgeSwipe = false;
        };

        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [mobileMenuOpen, sidebarX, setMobileMenuOpen]);

    const handleNavClick = (viewId) => {
        hapticFeedback('medium');
        setView(viewId);
        setMobileMenuOpen(false);
    };

    return (
        <>
            {/* Mobile Backdrop - follows sidebar position */}
            <motion.div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden pointer-events-auto"
                style={{ opacity: backdropOpacity }}
                onClick={() => setMobileMenuOpen(false)}
                // Hide completely when sidebar is fully closed
                initial={false}
            />

            {/* Sidebar - finger-following on mobile, static on desktop */}
            <motion.aside
                style={{
                    x: typeof window !== 'undefined' && window.innerWidth < 768 ? sidebarX : 0,
                }}
                className="fixed md:relative w-72 md:w-80 glass-panel border-r border-white/5 flex flex-col z-[80] md:z-10 h-full will-change-transform md:!transform-none"
            >
                <div className="p-6 md:p-8 pb-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2 md:gap-3 text-accent font-display font-black text-lg md:text-xl tracking-tighter italic">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <ellipse cx="12" cy="5" rx="9" ry="3" />
                            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                        </svg>
                        METALCORE
                    </div>
                    <button onClick={() => { hapticFeedback('light'); setShowSettings(true); }} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-500 hover:text-accent transition-all border border-white/5 flex items-center justify-center w-10 h-10 md:w-auto md:h-auto">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
                            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 md:px-8 py-2 custom-scrollbar no-scrollbar scroll-smooth">
                    {/* Desktop Navigation - Hidden on Mobile */}
                    <div className="hidden md:flex flex-col gap-1.5 mt-4 md:mt-8">
                        {navItems.map(nav => (
                            <button
                                key={nav.id}
                                onClick={() => handleNavClick(nav.id)}
                                className={`w-full py-3.5 px-6 rounded-xl flex items-center gap-3.5 text-sm font-bold transition-all ${view === nav.id ? 'bg-accent text-black shadow-lg shadow-accent/10 scale-[1.02]' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0">
                                    {nav.icon}
                                </svg>
                                {nav.label}
                            </button>
                        ))}

                        <button
                            onClick={() => { hapticFeedback('light'); setAiOpen(!aiOpen); setMobileMenuOpen(false); }}
                            className={`w-full py-3.5 px-6 rounded-xl flex items-center gap-3.5 text-sm font-bold transition-all mt-2 ${aiOpen ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:bg-white/5 hover:text-indigo-400'}`}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0">
                                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                            </svg>
                            Ask Ferry
                        </button>
                    </div>

                    {/* Mobile Quick Actions */}
                    <div className="flex md:hidden flex-col gap-3 mt-4">
                        <button
                            onClick={() => { hapticFeedback('medium'); setAiOpen(!aiOpen); setMobileMenuOpen(false); }}
                            className={`w-full py-4 px-6 rounded-xl flex items-center gap-3.5 text-sm font-bold transition-all ${aiOpen ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:bg-white/5 hover:text-indigo-400 border border-white/5'}`}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0">
                                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                            </svg>
                            Ask Ferry AI
                        </button>
                    </div>

                    <div className="my-8 h-px bg-white/5 mx-4" />

                    {view === 'HOME' ? (
                        <section className="space-y-6">
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2.5 px-2">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-accent">
                                    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                                    <line x1="12" y1="7" x2="12" y2="13" />
                                    <line x1="9" y1="10" x2="15" y2="10" />
                                </svg>
                                {trending && trending.length > 0 ? 'Trending Now' : 'Popular Searches'}
                            </div>
                            <div className="space-y-2 px-1">
                                {displayTrending.map(steel => (
                                    <button
                                        key={steel.id}
                                        onClick={() => {
                                            hapticFeedback('light');
                                            setSearch(steel.name);
                                            setView('SEARCH');
                                            if (resetFilters) resetFilters();
                                        }}
                                        className="w-full text-left px-4 py-3 rounded-xl bg-white/5 border border-white/5 hover:border-accent/30 hover:bg-accent/5 transition-all flex items-center justify-between group"
                                    >
                                        <span className="text-xs font-bold text-slate-400 group-hover:text-white line-clamp-1">{steel.name}</span>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-600 group-hover:text-accent transform translate-x-1 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all">
                                            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                                        </svg>
                                    </button>
                                ))}
                            </div>

                            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20 mt-6">
                                <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Pro Tip</div>
                                <p className="text-[11px] text-slate-400 leading-relaxed italic">
                                    Use the <b>Performance Matrix</b> to find steels that break the toughness/edge retention trade-off.
                                </p>
                            </div>
                        </section>
                    ) : (
                        <>
                            <section className="space-y-4">
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2.5 px-2">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                                    </svg>
                                    Filter Producer
                                </div>
                                <div className="flex flex-wrap gap-2 px-1">
                                    {producers.map(p => (
                                        <button
                                            key={p}
                                            onClick={() => { hapticFeedback('light'); setActiveProducer(p); }}
                                            className={`text-[11px] uppercase font-black px-4 py-2.5 rounded-full border transition-all ${activeProducer === p ? 'bg-white text-black border-white shadow-lg shadow-white/10' : 'text-slate-500 border-white/5 hover:border-white/10 hover:text-slate-300 bg-white/5'}`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            <section className="mt-10 space-y-6">
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2.5 px-2">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                                        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34-9-3V5" />
                                    </svg>
                                    Alloy Minimums %
                                </div>
                                <div className="space-y-8 px-3">
                                    {[
                                        { id: 'minC', label: 'Carbon', icon: 'C' },
                                        { id: 'minCr', label: 'Chromium', icon: 'Cr' },
                                        { id: 'minV', label: 'Vanadium', icon: 'V' },
                                    ].map(f => (
                                        <div key={f.id} className="space-y-2.5">
                                            <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                                                <span className="flex items-center gap-2.5">
                                                    <span className="w-5 h-5 flex items-center justify-center bg-white/5 rounded border border-white/10 text-[9px] font-bold text-slate-500">{f.icon}</span>
                                                    {f.label}
                                                </span>
                                                <span className="text-accent font-bold text-sm">{filters[f.id]}%</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="10"
                                                step="0.1"
                                                value={filters[f.id]}
                                                onChange={e => setFilters({ ...filters, [f.id]: parseFloat(e.target.value) })}
                                                className="w-full accent-accent h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer hover:bg-slate-700 transition-colors"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </>
                    )}

                    {(view === 'SEARCH' || view === 'KNIVES') && (
                        <section className="mt-10 pt-6 border-t border-white/5">
                            <button onClick={() => { hapticFeedback('light'); handleImportClick(); }} className="w-full py-4 border border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-3 text-xs md:text-sm font-bold text-slate-500 hover:text-white hover:bg-white/5 transition-all group">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:text-accent transition-colors">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <path d="M12 18v-6" />
                                    <path d="m9 15 3-3 3 3" />
                                </svg>
                                Import Dataset
                            </button>
                            <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx,.csv" onChange={handleFileUpload} />
                        </section>
                    )}

                    <div className="pb-4" />
                </div>
            </motion.aside>
        </>
    );
};

export default Sidebar;
