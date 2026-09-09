'use client'

import React, { useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion';
import { hapticFeedback } from '../hooks/useMobile';

const SIDEBAR_WIDTH = 288; // w-72 = 18rem = 288px

const CriteriaSummary = ({ activeProducer, filters, pmOnly, resetFilters, showImport, handleImportClick, fileInputRef, handleFileUpload }) => {
    const criteriaActive = (activeProducer && activeProducer !== 'ALL') || pmOnly || (filters && (filters.minC > 0 || filters.minCr > 0 || filters.minV > 0));

    return (
        <section className="space-y-4">
            <div className="text-[9px] font-mono font-medium text-stone-500 uppercase tracking-[0.3em] flex items-center gap-2.5 px-2">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                <span className="whitespace-nowrap">Active Criteria</span>
                <div className="flex-1 h-px bg-white/5" />
            </div>
            <div className="border-y border-white/[0.06]">
                {criteriaActive ? (
                    <div className="py-2 divide-y divide-white/[0.05]">
                        <div className="flex items-center justify-between gap-3 py-3">
                            <span className="text-[9px] font-mono font-medium text-stone-600 uppercase tracking-[0.25em] shrink-0">Producer</span>
                            <span className="text-[11px] font-bold text-stone-200 truncate">{activeProducer && activeProducer !== 'ALL' ? activeProducer : 'All Mills'}</span>
                        </div>
                        {filters && (
                            <>
                                <div className="flex items-center justify-between gap-3 py-3">
                                    <span className="text-[9px] font-mono font-medium text-stone-600 uppercase tracking-[0.25em] shrink-0">Carbon ≥</span>
                                    <span className={`text-[11px] font-bold font-mono ${filters.minC > 0 ? 'text-accent' : 'text-stone-500'}`}>{filters.minC > 0 ? `${filters.minC.toFixed(2)}%` : 'Any'}</span>
                                </div>
                                <div className="flex items-center justify-between gap-3 py-3">
                                    <span className="text-[9px] font-mono font-medium text-stone-600 uppercase tracking-[0.25em] shrink-0">Chromium ≥</span>
                                    <span className={`text-[11px] font-bold font-mono ${filters.minCr > 0 ? 'text-accent' : 'text-stone-500'}`}>{filters.minCr > 0 ? `${filters.minCr.toFixed(1)}%` : 'Any'}</span>
                                </div>
                                <div className="flex items-center justify-between gap-3 py-3">
                                    <span className="text-[9px] font-mono font-medium text-stone-600 uppercase tracking-[0.25em] shrink-0">Vanadium ≥</span>
                                    <span className={`text-[11px] font-bold font-mono ${filters.minV > 0 ? 'text-accent' : 'text-stone-500'}`}>{filters.minV > 0 ? `${filters.minV.toFixed(1)}%` : 'Any'}</span>
                                </div>
                            </>
                        )}
                        <div className="flex items-center justify-between gap-3 py-3">
                            <span className="text-[9px] font-mono font-medium text-stone-600 uppercase tracking-[0.25em] shrink-0">PM Route</span>
                            <span className={`text-[11px] font-bold font-mono ${pmOnly ? 'text-accent' : 'text-stone-500'}`}>{pmOnly ? 'On' : 'Off'}</span>
                        </div>
                        <button
                            onClick={() => { hapticFeedback('light'); resetFilters(); }}
                            className="w-full mt-3 py-2.5 rounded-xl border border-white/10 text-[9px] font-mono font-medium uppercase tracking-[0.25em] text-stone-500 hover:text-accent hover:border-accent/30 transition-colors duration-300"
                        >
                            Clear All Criteria
                        </button>
                    </div>
                ) : (
                    <p className="py-4 text-[11px] text-stone-500 leading-relaxed">
                        No criteria set. Filter producers, composition floor and PM route from the rail inside the library.
                    </p>
                )}
            </div>

            {showImport && (
                <div className="pt-4 mt-2 border-t border-white/5">
                    <button onClick={() => { hapticFeedback('light'); handleImportClick(); }} data-tour="import-dataset" className="w-full py-4 border border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-3 text-xs md:text-sm font-bold text-stone-500 hover:text-white hover:bg-white/5 transition-colors group">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:text-accent transition-colors">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <path d="M12 18v-6" />
                            <path d="m9 15 3-3 3 3" />
                        </svg>
                        Import Dataset
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx,.csv" onChange={handleFileUpload} />
                </div>
            )}
        </section>
    );
};

// Single ember accent — views differentiate by content, not hue
const VIEW_GRADIENTS = {
    HOME: 'rgba(255,90,31,0.07)',
    SEARCH: 'rgba(255,90,31,0.07)',
    MATRIX: 'rgba(255,90,31,0.07)',
    KNIVES: 'rgba(255,90,31,0.07)',
    EDUCATION: 'rgba(255,90,31,0.07)',
    PRO_LAB: 'rgba(255,90,31,0.07)',
    COMPARE: 'rgba(255,90,31,0.07)',
    PROFILE: 'rgba(255,90,31,0.07)',
};

const Sidebar = ({
    view,
    setView,
    mobileMenuOpen,
    setMobileMenuOpen,
    activeProducer,
    filters,
    pmOnly,
    handleImportClick,
    fileInputRef,
    handleFileUpload,
    setShowSettings,
    aiOpen,
    setAiOpen,
    setSearch,
    trending,
    resetFilters,
    openCommandPalette
}) => {
    const sidebarX = useMotionValue(-SIDEBAR_WIDTH);
    const backdropOpacity = useTransform(sidebarX, [-SIDEBAR_WIDTH, 0], [0, 1]);
    const isDragging = useRef(false);
    const dragStartX = useRef(0);
    const dragStartSidebarX = useRef(0);
    const hasTriggeredHaptic = useRef(false);
    const [isMobile, setIsMobile] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);

    useEffect(() => {
        setMounted(true);
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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
        {
            label: 'Pro Lab', id: 'PRO_LAB', icon: (
                <><path d="M10 2v7.5M14 2v7.5M8.5 2h7M21 22H3l7-12.5M21 22l-7-12.5" /><path d="M11 12h2" /></>
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

    // Reset sidebar position when crossing mobile/desktop breakpoint
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                sidebarX.set(0);
            } else if (!mobileMenuOpen) {
                sidebarX.set(-SIDEBAR_WIDTH);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [sidebarX, mobileMenuOpen]);

    // Unified swipe gesture handler: sidebar (right swipe) + AI panel (left swipe)
    useEffect(() => {
        if (typeof window === 'undefined' || window.innerWidth >= 768) return;

        let touchStartX = 0;
        let touchStartY = 0;
        let isOpenSwipe = false;
        let isVerticalScroll = false;
        let gestureDecided = false;
        let potentialSwipe = false;
        let isAiSwipe = false; // true when handling an AI open or close swipe

        // Check if touch target is inside a horizontally scrollable container
        const isInHorizontalScroller = (target) => {
            let el = target;
            while (el && el !== document.body) {
                const overflowX = window.getComputedStyle(el).overflowX;
                if ((overflowX === 'auto' || overflowX === 'scroll') && el.scrollWidth > el.clientWidth) {
                    return true;
                }
                el = el.parentElement;
            }
            return false;
        };

        const handleTouchStart = (e) => {
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            isVerticalScroll = false;
            gestureDecided = false;
            isOpenSwipe = false;
            isAiSwipe = false;

            if (!mobileMenuOpen && !aiOpen) {
                // Nothing open — could swipe right (sidebar) or left (AI)
                if (isInHorizontalScroller(e.target)) {
                    potentialSwipe = false;
                    return;
                }
                potentialSwipe = true;
                hasTriggeredHaptic.current = false;
            } else if (mobileMenuOpen) {
                // Sidebar open — handle close gesture (finger-following)
                isDragging.current = true;
                dragStartX.current = touch.clientX;
                dragStartSidebarX.current = sidebarX.get();
                hasTriggeredHaptic.current = false;
                gestureDecided = true;
            } else if (aiOpen) {
                // AI panel open — potential right swipe to close
                const tag = e.target.tagName;
                if (tag === 'INPUT' || tag === 'TEXTAREA' || isInHorizontalScroller(e.target)) {
                    potentialSwipe = false;
                    return;
                }
                potentialSwipe = true;
                hasTriggeredHaptic.current = false;
            }
        };

        const handleTouchMove = (e) => {
            const touch = e.touches[0];
            const deltaX = touch.clientX - touchStartX;
            const deltaY = touch.clientY - touchStartY;

            // Decide gesture direction
            if (potentialSwipe && !gestureDecided) {
                if (Math.abs(deltaX) > 12 || Math.abs(deltaY) > 12) {
                    gestureDecided = true;

                    if (!mobileMenuOpen && !aiOpen) {
                        // Nothing open — decide direction
                        if (deltaX > 12 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
                            // Right swipe → open sidebar (finger-following)
                            isOpenSwipe = true;
                            isDragging.current = true;
                            dragStartX.current = touch.clientX;
                            dragStartSidebarX.current = sidebarX.get();
                        } else if (deltaX < -12 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
                            // Left swipe → open AI
                            isAiSwipe = true;
                        } else {
                            potentialSwipe = false;
                        }
                    } else if (aiOpen) {
                        // AI open — right swipe to close
                        if (deltaX > 12 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
                            isAiSwipe = true;
                        } else {
                            potentialSwipe = false;
                        }
                    }
                }
                return;
            }

            if (!isDragging.current) return;

            // Vertical scroll detection for sidebar close gestures
            if (!isOpenSwipe && !isVerticalScroll && Math.abs(deltaY) > Math.abs(touch.clientX - dragStartX.current) && Math.abs(deltaY) > 10) {
                isVerticalScroll = true;
                isDragging.current = false;
                return;
            }

            if (isVerticalScroll) return;

            // Calculate new sidebar position (finger-following)
            const dragDelta = touch.clientX - dragStartX.current;
            let newX = dragStartSidebarX.current + dragDelta;
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
            if (Math.abs(dragDelta) > 10) {
                e.preventDefault();
            }
        };

        const handleTouchEnd = (e) => {
            potentialSwipe = false;

            // Handle AI panel swipes (open or close)
            if (isAiSwipe) {
                const touch = e.changedTouches[0];
                const deltaX = touch.clientX - touchStartX;

                if (!aiOpen && deltaX < -50) {
                    // Left swipe with enough distance → open AI
                    setAiOpen(true);
                    hapticFeedback('medium');
                } else if (aiOpen && deltaX > 50) {
                    // Right swipe with enough distance → close AI
                    setAiOpen(false);
                    hapticFeedback('light');
                }
                isAiSwipe = false;
                return;
            }

            // Handle sidebar swipes (open or close)
            if (!isDragging.current) return;
            isDragging.current = false;

            const currentX = sidebarX.get();
            const progress = (currentX + SIDEBAR_WIDTH) / SIDEBAR_WIDTH;

            const touch = e.changedTouches[0];
            const deltaX = touch.clientX - dragStartX.current;

            // Determine intent: open or close
            const shouldOpen = progress > 0.4 || (deltaX > 50 && isOpenSwipe);
            const shouldClose = progress < 0.6 || deltaX < -50;

            if (isOpenSwipe ? shouldOpen : !shouldClose) {
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

            isOpenSwipe = false;
        };

        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [mobileMenuOpen, aiOpen, sidebarX, setMobileMenuOpen, setAiOpen]);

    const handleNavClick = (viewId) => {
        hapticFeedback('medium');
        setView(viewId);
        setMobileMenuOpen(false);
    };

    return (
        <>
            {/* Mobile Backdrop - follows sidebar position */}
            <motion.div
                className={`fixed inset-0 bg-black/60 z-40 md:hidden ${mobileMenuOpen ? 'pointer-events-auto backdrop-blur-sm' : 'pointer-events-none'}`}
                style={{ opacity: backdropOpacity }}
                onClick={() => setMobileMenuOpen(false)}
                initial={false}
            />

            {/* Sidebar - fixed on both mobile and desktop for glass backdrop-filter to work */}
            <motion.aside
                style={{
                    // Default to hidden (sidebarX) until mounted and confirmed desktop
                    // This prevents the "flash of open sidebar" on mobile
                    x: !mounted || isMobile ? sidebarX : 0,
                }}
                className="glass-sidebar fixed left-0 top-0 w-72 md:w-80 flex flex-col z-[80] md:z-20 h-full overflow-hidden -translate-x-full md:translate-x-0"
            >
                {/* View-themed gradient tint — cross-fades in sync with main content */}
                <AnimatePresence>
                    <motion.div
                        key={view}
                        className="absolute inset-0 pointer-events-none z-0 hidden md:block"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                            background: `linear-gradient(to bottom, ${VIEW_GRADIENTS[view] || VIEW_GRADIENTS.HOME} 0%, transparent 500px)`,
                        }}
                    />
                </AnimatePresence>

                <div className="p-6 md:p-8 pb-4 flex items-center justify-between shrink-0 relative">
                    <div className="flex items-center gap-2.5 md:gap-3 text-white font-display text-lg md:text-xl uppercase tracking-tight">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF5A1F" strokeWidth="2.5">
                            <ellipse cx="12" cy="5" rx="9" ry="3" />
                            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                        </svg>
                        METAL<span className="text-accent">CORE</span>
                    </div>
                    <button
                        onClick={() => {
                            hapticFeedback('light');
                            setShowSettings(true);
                            setMobileMenuOpen(false);
                        }}
                        className="w-10 h-10 flex items-center justify-center hover:bg-white/5 rounded-lg text-stone-400 hover:text-accent transition-colors"
                        aria-label="Settings"
                        data-tour="nav-profile"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 md:px-8 py-2 custom-scrollbar no-scrollbar scroll-smooth relative">
                    {/* Command Trigger — ledger row */}
                    <div className="mt-4">
                        <button
                            onClick={() => { hapticFeedback('light'); openCommandPalette(); }}
                            className="w-full flex items-center gap-3.5 px-4 py-3 text-left border-l-2 border-transparent hover:border-accent/50 hover:bg-white/[0.04] transition-colors duration-300 ease-snap group"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-stone-600 group-hover:text-accent transition-colors shrink-0">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                            </svg>
                            <span className="text-[11px] font-mono font-medium uppercase tracking-[0.25em] text-stone-500 group-hover:text-stone-200 transition-colors flex-1">Search grades</span>
                            <kbd className="hidden md:flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono text-stone-600 shrink-0">
                                {typeof window !== 'undefined' && /Mac/.test(window.navigator.platform) ? '⌘K' : 'Ctrl+K'}
                            </kbd>
                        </button>
                    </div>

                                        {/* Desktop Navigation — Index Ledger */}
                    <div className="hidden md:block mt-4 md:mt-8">
                        <div className="flex items-center gap-2.5 px-2 mb-2">
                            <span className="text-[9px] font-mono font-semibold text-accent/70 shrink-0">00</span>
                            <span className="text-[9px] font-mono font-medium text-stone-500 uppercase tracking-[0.3em] whitespace-nowrap">Index</span>
                            <div className="flex-1 h-px bg-white/5" />
                        </div>
                        <div className="flex flex-col">
                            {navItems.map((nav, i) => {
                                const isSelected = view === nav.id;
                                return (
                                    <button
                                        key={nav.id}
                                        onClick={() => handleNavClick(nav.id)}
                                        data-tour={
                                            nav.id === 'SEARCH' ? 'nav-search' :
                                                nav.id === 'EDUCATION' ? 'nav-education' :
                                                    nav.id === 'MATRIX' ? 'nav-matrix' :
                                                        nav.id === 'KNIVES' ? 'nav-knives' : undefined
                                        }
                                        className={`relative w-full flex items-center gap-3.5 px-4 py-3 text-left transition-colors duration-300 ease-snap ${isSelected ? 'bg-accent/[0.07]' : 'hover:bg-white/[0.04]'}`}
                                    >
                                        {isSelected && (
                                            <motion.div
                                                layoutId="sidebar-rule"
                                                className="absolute left-0 top-0 h-full w-[2px] bg-accent shadow-ember-sm"
                                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <span className={`text-[9px] font-mono font-semibold w-5 shrink-0 ${isSelected ? 'text-accent' : 'text-stone-700'}`}>{String(i + 1).padStart(2, '0')}</span>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`shrink-0 ${isSelected ? 'text-accent' : 'text-stone-600'}`}>
                                            {nav.icon}
                                        </svg>
                                        <span className={`text-sm font-bold ${isSelected ? 'text-bone' : 'text-stone-500'}`}>{nav.label}</span>
                                    </button>
                                );
                            })}

                            <button
                                onClick={() => { hapticFeedback('light'); setAiOpen(!aiOpen); setMobileMenuOpen(false); }}
                                className={`relative w-full flex items-center gap-3.5 px-4 py-3 mt-1 border-t border-white/5 text-left transition-colors duration-300 ease-snap ${aiOpen ? 'bg-accent/[0.05] text-accent' : 'text-stone-500 hover:bg-white/[0.04] hover:text-accent'}`}
                            >
                                <span className="text-[9px] font-mono font-semibold w-5 shrink-0 text-stone-700">07</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0">
                                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 0 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                                </svg>
                                <span className="text-sm font-bold">Ask Ferry</span>
                                {aiOpen && <span className="ml-auto text-[8px] font-mono font-semibold text-accent uppercase tracking-[0.25em]">Live</span>}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Quick Actions */}
                    <div className="flex md:hidden flex-col gap-3 mt-4">
                        <button
                            onClick={() => handleNavClick('PRO_LAB')}
                            className="w-full py-4 px-6 rounded-xl flex items-center gap-3.5 text-sm font-bold transition-colors text-stone-500 hover:bg-white/5 hover:text-accent border border-white/5"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0">
                                <path d="M10 2v7.5M14 2v7.5M8.5 2h7M21 22H3l7-12.5M21 22l-7-12.5" />
                            </svg>
                            Pro Lab
                        </button>
                        <button
                            onClick={() => { hapticFeedback('medium'); setAiOpen(!aiOpen); setMobileMenuOpen(false); }}
                            className={`w-full py-4 px-6 rounded-xl flex items-center gap-3.5 text-sm font-bold transition-colors duration-300 ease-snap border ${aiOpen ? 'bg-accent/15 text-accent border-accent/30' : 'text-stone-500 hover:bg-white/[0.06] hover:text-accent border-white/5'}`}
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
                            <div className="flex items-center gap-2.5 px-2 mb-2">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-accent shrink-0">
                                    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                                    <line x1="12" y1="7" x2="12" y2="13" />
                                    <line x1="9" y1="10" x2="15" y2="10" />
                                </svg>
                                <span className="text-[9px] font-mono font-medium text-stone-500 uppercase tracking-[0.3em] whitespace-nowrap">{trending && trending.length > 0 ? 'Trending Now' : 'Popular Searches'}</span>
                                <div className="flex-1 h-px bg-white/5" />
                            </div>
                            <div className="flex flex-col">
                                {displayTrending.map((steel, i) => (
                                    <button
                                        key={steel.id}
                                        onClick={() => {
                                            hapticFeedback('light');
                                            setSearch(steel.name);
                                            setView('SEARCH');
                                            if (resetFilters) resetFilters();
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-300 ease-snap hover:bg-white/[0.04] group"
                                    >
                                        <span className="text-[9px] font-mono font-semibold w-5 shrink-0 text-stone-700 group-hover:text-accent/70 transition-colors">{String(i + 1).padStart(2, '0')}</span>
                                        <span className="text-xs font-bold text-stone-400 group-hover:text-white transition-colors truncate flex-1">{steel.name}</span>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-stone-600 group-hover:text-accent opacity-0 group-hover:opacity-100 transition-[opacity,transform,color] duration-300 ease-snap shrink-0">
                                            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                                        </svg>
                                    </button>
                                ))}
                            </div>

                            <div className="mt-6 pl-4 border-l-2 border-accent/50">
                                <div className="text-[9px] font-mono font-medium text-accent uppercase tracking-[0.25em] mb-2">Pro Tip</div>
                                <p className="text-[11px] text-stone-400 leading-relaxed">
                                    Use the <b>Performance Matrix</b> to find steels that break the toughness/edge retention trade-off.
                                </p>
                            </div>
                        </section>
                    ) : (
                        <CriteriaSummary
                            activeProducer={activeProducer}
                            filters={filters}
                            pmOnly={pmOnly}
                            resetFilters={resetFilters}
                            showImport={view === 'SEARCH' || view === 'KNIVES'}
                            handleImportClick={handleImportClick}
                            fileInputRef={fileInputRef}
                            handleFileUpload={handleFileUpload}
                        />
                    )}

                    <div className="pb-4" />
                </div>
            </motion.aside>
        </>
    );
};

export default Sidebar;
