'use client'

import React, { useEffect, useState } from 'react'; // Added React import
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding } from '../../context/OnboardingContext';
import Spotlight from './Spotlight';
import { X, ChevronRight, ChevronLeft, Map, Flame, FlaskConical, CheckCircle2 } from 'lucide-react';

const OnboardingOverlay = () => {
    const {
        isActive,
        showWelcome,
        currentStepData,
        currentStepIndex,
        totalSteps,
        startTour,
        nextStep,
        prevStep,
        skipTour,
        knowledgeLevel
    } = useOnboarding();

    // Prevent scrolling when active
    useEffect(() => {
        if (isActive || showWelcome) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isActive, showWelcome]);

    // Calculate tooltip position
    const [tooltipStyle, setTooltipStyle] = useState({});
    const tooltipRef = React.useRef(null);

    useEffect(() => {
        if (currentStepData && isActive) {
            const targetEl = document.getElementById(currentStepData.target) || document.querySelector(`[data-tour="${currentStepData.target}"]`);

            if (targetEl) {
                const rect = targetEl.getBoundingClientRect();
                let position = currentStepData.position || 'bottom';

                const gap = 20;
                const isMobileView = window.innerWidth < 768;
                // Match the Tailwind widths: w-64 (256px) on mobile, w-72 (288px) on sm+, w-80 (320px) on md+
                const effectiveTooltipWidth = window.innerWidth < 640 ? 256 : (window.innerWidth < 768 ? 288 : 320);
                const tooltipHeight = isMobileView ? 140 : 260; // Estimated height on mobile, more conservative now
                const screenPadding = 16; // padding from screen edge

                let style = {};

                // Check if target is in viewport
                const isTargetVisible = rect.top >= -rect.height && rect.left >= -rect.width && 
                                       rect.bottom <= window.innerHeight + rect.height && 
                                       rect.right <= window.innerWidth + rect.width;

                if (!isTargetVisible) {
                    // If target is off-screen, center the tooltip
                    // Calculate position to ensure tooltip fits on screen
                    const minTop = tooltipHeight / 2 + screenPadding;
                    const maxTop = window.innerHeight - (tooltipHeight / 2) - screenPadding;
                    const topPosition = Math.max(minTop, Math.min(window.innerHeight / 2, maxTop));
                    
                    const minLeft = effectiveTooltipWidth / 2 + screenPadding;
                    const maxLeft = window.innerWidth - (effectiveTooltipWidth / 2) - screenPadding;
                    const leftPosition = Math.max(minLeft, Math.min(window.innerWidth / 2, maxLeft));
                    
                    style = {
                        top: topPosition,
                        left: leftPosition,
                        transform: 'translate(-50%, -50%)'
                    };
                } else {
                    // Calculate available space on all sides
                    const spaceLeft = rect.left;
                    const spaceRight = window.innerWidth - rect.right;
                    const spaceTop = rect.top;
                    const spaceBottom = window.innerHeight - rect.bottom;

                    // On mobile with bottom nav, check if target is in the bottom nav
                    const isInBottomNav = isMobileView && rect.bottom > window.innerHeight - 100;
                    
                    // On mobile, prefer top/bottom positioning over left/right
                    const preferVertical = isMobileView;
                    
                    // Determine best vertical position: prefer the side with more space
                    const shouldPositionBelow = spaceBottom > spaceTop;

                    // Calculate positions based on space availability
                    let leftPosition, topPosition;

                    // For mobile, prefer vertical (top/bottom) positioning
                    const hasLeftSpace = spaceLeft > effectiveTooltipWidth + gap;
                    const hasRightSpace = spaceRight > effectiveTooltipWidth + gap;
                    const hasTopSpace = spaceTop > tooltipHeight + gap;
                    const hasBottomSpace = spaceBottom > tooltipHeight + gap;

                    // Horizontal positioning
                    if (!preferVertical && hasLeftSpace) {
                        // Position on the LEFT
                        leftPosition = rect.left - effectiveTooltipWidth - gap;
                    } else if (!preferVertical && hasRightSpace) {
                        // Position on the RIGHT
                        leftPosition = rect.right + gap;
                    } else {
                        // Top/bottom positioning: fit tooltip within screen bounds
                        if (isMobileView) {
                            // On mobile, position with padding from edges, centered if possible
                            const minLeft = screenPadding;
                            const maxLeft = window.innerWidth - effectiveTooltipWidth - screenPadding;
                            const targetCenterLeft = rect.left + (rect.width / 2) - (effectiveTooltipWidth / 2);
                            leftPosition = Math.max(minLeft, Math.min(targetCenterLeft, maxLeft));
                            
                            // For search bar at top, prefer positioning below with extra gap
                            const isSearchBar = currentStepData?.target === 'global-search' || currentStepData?.target === 'mobile-nav-search';
                            const extraGapForSearch = isSearchBar ? 30 : gap; // Extra space for search bar
                            
                            if (isSearchBar) {
                                // Always position below search bar on mobile with good spacing
                                topPosition = rect.bottom + extraGapForSearch;
                            } else if (hasTopSpace) {
                                topPosition = rect.top - tooltipHeight - gap;
                            } else {
                                topPosition = rect.bottom + gap;
                            }
                        } else {
                            // Desktop: try to center horizontally
                            const minLeft = screenPadding + (effectiveTooltipWidth / 2);
                            const maxLeft = window.innerWidth - screenPadding - (effectiveTooltipWidth / 2);
                            leftPosition = Math.max(minLeft, Math.min(rect.left + (rect.width / 2), maxLeft));
                            topPosition = shouldPositionBelow ? rect.bottom + gap : rect.top - tooltipHeight - gap;
                        }
                    }

                    // Vertical positioning
                    if (!isMobileView) {
                        if (shouldPositionBelow && hasBottomSpace) {
                            topPosition = rect.bottom + gap;
                        } else if (hasTopSpace) {
                            topPosition = rect.top - tooltipHeight - gap;
                        } else {
                            // Not enough space above or below, center vertically
                            const minTop = screenPadding;
                            const maxTop = window.innerHeight - tooltipHeight - screenPadding;
                            topPosition = Math.max(minTop, Math.min(rect.top + (rect.height / 2), maxTop));
                        }
                    }

                    // Determine the correct transform based on positioning
                    let transform = 'translate(0, 0)';
                    
                    // Check if we're positioned on the side (left/right) - either left or right positioning
                    const isPositionedOnSide = !isMobileView && (hasLeftSpace || hasRightSpace);
                    
                    if (isPositionedOnSide) {
                        // Side positioning: center vertically
                        topPosition = rect.top + (rect.height / 2);
                        const minTop = (tooltipHeight / 2) + screenPadding;
                        const maxTop = window.innerHeight - (tooltipHeight / 2) - screenPadding;
                        topPosition = Math.max(minTop, Math.min(topPosition, maxTop));
                        transform = 'translateY(-50%)';
                        
                        // For side positioning, clamp left to ensure no right cutoff
                        const minLeft = screenPadding;
                        const maxLeft = window.innerWidth - effectiveTooltipWidth - screenPadding;
                        leftPosition = Math.max(minLeft, Math.min(leftPosition, maxLeft));
                    } else if (!isMobileView) {
                        // Desktop top/bottom positioning with centered transform
                        transform = 'translate(-50%, 0)';
                    } else {
                        // Mobile: no transform, use direct positioning
                        transform = 'translate(0, 0)';
                    }

                    // Clamp vertical position for all cases
                    topPosition = Math.max(screenPadding, Math.min(topPosition, window.innerHeight - tooltipHeight - screenPadding));

                    style = {
                        top: topPosition,
                        left: leftPosition,
                        transform: transform
                    };

                    if (isInBottomNav && position === 'top') {
                        // For mobile nav items, position tooltip above with proper spacing
                        // Ensure the ENTIRE tooltip fits on screen with strict bounds checking
                        const minTop = screenPadding;
                        const maxTop = window.innerHeight - tooltipHeight - screenPadding;
                        
                        // Position higher to avoid covering nav bar
                        let navTopPosition = rect.top - tooltipHeight - gap - 10;
                        navTopPosition = Math.max(minTop, Math.min(navTopPosition, maxTop));
                        
                        // Horizontal positioning - position more to the LEFT, not centered
                        // Try to position left of center, only shift right if hitting left edge
                        let navLeftPosition = Math.max(
                            screenPadding,  // Don't go off left edge
                            rect.left - 50  // Position 50px to the left of button
                        );
                        
                        // Ensure right edge doesn't go off screen
                        const rightEdge = navLeftPosition + effectiveTooltipWidth;
                        if (rightEdge > window.innerWidth - screenPadding) {
                            navLeftPosition = window.innerWidth - effectiveTooltipWidth - screenPadding;
                        }
                        
                        style = {
                            top: navTopPosition,
                            left: navLeftPosition,
                            transform: 'translate(0, 0)'
                        };
                    }
                }

                setTooltipStyle(style);

                // Scroll target into view
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [currentStepData, isActive]);


    return (
        <AnimatePresence>
            {/* Welcome / Level Selection Modal */}
            {showWelcome && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="w-full max-w-2xl md:max-w-4xl bg-[#0a0a0c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative my-8"
                    >
                        {/* Decorative Gradient Blob */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                        <div className="p-4 sm:p-6 md:p-8 lg:p-12 relative z-10">
                            <div className="text-center mb-8 md:mb-10">
                                <span className="inline-block py-1 px-3 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] sm:text-xs font-black uppercase tracking-widest mb-3 md:mb-4">
                                    Welcome to MetalCore
                                </span>
                                <h2 className="text-lg md:text-3xl lg:text-5xl font-display font-black text-white italic mb-3 md:mb-4">
                                    How well do you know <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-white">Knife Steel?</span>
                                </h2>
                                <p className="text-slate-400 max-w-xl mx-auto text-xs md:text-sm lg:text-base px-2">
                                    Select your experience level to customize your onboarding tour. We'll highlight the features that matter most to you.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                                {/* Newbie Card */}
                                <button
                                    onClick={() => startTour('newbie')}
                                    className="group relative p-4 md:p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-accent/40 hover:bg-white/10 transition-all text-left flex flex-col h-full"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Map size={24} strokeWidth={2.5} />
                                    </div>
                                    <h3 className="text-base md:text-lg font-black text-white italic mb-2">The Explorer</h3>
                                    <p className="text-[11px] md:text-xs text-slate-400 leading-relaxed mb-4 flex-1">
                                        Active in the EDC world but new to metallurgy. Help me understand steel compositions and what makes a knife "good".
                                    </p>
                                    <div className="text-[9px] md:text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        Start Tour <ChevronRight size={12} />
                                    </div>
                                </button>

                                {/* Enthusiast Card */}
                                <button
                                    onClick={() => startTour('enthusiast')}
                                    className="group relative p-4 md:p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-accent/40 hover:bg-white/10 transition-all text-left flex flex-col h-full"
                                >
                                    <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform relative z-10">
                                        <Flame size={24} strokeWidth={2.5} />
                                    </div>
                                    <h3 className="text-base md:text-lg font-black text-white italic mb-2 relative z-10">The Enthusiast</h3>
                                    <p className="text-[11px] md:text-xs text-slate-400 leading-relaxed mb-4 flex-1 relative z-10">
                                        I know my M390 from my D2. Show me the comparison tools, performance charts, and advanced search filters.
                                    </p>
                                    <div className="text-[9px] md:text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
                                        Start Tour <ChevronRight size={12} />
                                    </div>
                                </button>

                                {/* Expert Card */}
                                <button
                                    onClick={() => startTour('expert')}
                                    className="group relative p-4 md:p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-accent/40 hover:bg-white/10 transition-all text-left flex flex-col h-full"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <FlaskConical size={24} strokeWidth={2.5} />
                                    </div>
                                    <h3 className="text-base md:text-lg font-black text-white italic mb-2">The Metallurgist</h3>
                                    <p className="text-[11px] md:text-xs text-slate-400 leading-relaxed mb-4 flex-1">
                                        I need raw data. Heat treatment protocols, crystalline structure analysis, and proprietary alloy mapping.
                                    </p>
                                    <div className="text-[9px] md:text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        Start Tour <ChevronRight size={12} />
                                    </div>
                                </button>
                            </div>

                            <button
                                onClick={skipTour}
                                className="absolute top-4 right-4 md:top-6 md:right-6 p-2 text-slate-500 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="mt-6 md:mt-8 text-center">
                                <button
                                    onClick={skipTour}
                                    className="text-xs font-bold text-slate-600 hover:text-slate-400 transition-colors"
                                >
                                    Skip onboarding for now
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {/* Active Tour Overlay */}
            {isActive && currentStepData && (
                <>
                    <Spotlight targetId={currentStepData.target} />

                    {/* Tooltip Content */}
                    <motion.div
                        key={currentStepIndex}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                        style={{ position: 'fixed', ...tooltipStyle }}
                        className="z-[9999] w-64 sm:w-72 md:w-80 pointer-events-auto"
                        ref={tooltipRef}
                    >
                        <div className="glass-panel p-2 sm:p-4 md:p-6 rounded-2xl border border-white/10 bg-[#0a0a0c]/90 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                            {/* Arrow/Tail (Simplified, could add real SVG arrow later) */}

                            <div className="flex justify-between items-start mb-1 sm:mb-3">
                                <span className="text-[6px] sm:text-[8px] md:text-[10px] font-black text-accent uppercase tracking-widest">
                                    Step {currentStepIndex + 1} of {totalSteps}
                                </span>
                                <button onClick={skipTour} className="text-slate-500 hover:text-white">
                                    <X size={14} />
                                </button>
                            </div>

                            <h3 className="text-xs sm:text-lg md:text-xl font-display font-black text-white italic mb-1 sm:mb-2">
                                {currentStepData.title}
                            </h3>
                            <p className="text-[10px] sm:text-xs md:text-sm text-slate-400 leading-relaxed mb-3 sm:mb-6">
                                {currentStepData.content}
                            </p>

                            <div className="flex items-center justify-between gap-1">
                                <div className="flex gap-1">
                                    {Array.from({ length: totalSteps }).map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`h-0.5 sm:h-1 rounded-full transition-all duration-300 ${idx === currentStepIndex ? 'w-4 sm:w-6 bg-accent' : 'w-1 sm:w-2 bg-white/10'}`}
                                        />
                                    ))}
                                </div>
                                <div className="flex gap-1">
                                    {currentStepIndex > 0 && (
                                        <button
                                            onClick={prevStep}
                                            className="p-1 sm:p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                                        >
                                            <ChevronLeft size={14} />
                                        </button>
                                    )}
                                    <button
                                        onClick={nextStep}
                                        className="px-3 sm:px-4 py-1 sm:py-2 rounded-lg bg-accent hover:bg-accent/90 text-black text-[10px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-1 sm:gap-2 transition-colors"
                                    >
                                        {currentStepIndex === totalSteps - 1 ? 'Finish' : 'Next'}
                                        {currentStepIndex === totalSteps - 1 ? <CheckCircle2 size={12} /> : <ChevronRight size={12} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default OnboardingOverlay;
