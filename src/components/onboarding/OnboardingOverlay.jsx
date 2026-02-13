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

    useEffect(() => {
        if (currentStepData && isActive) {
            const targetEl = document.getElementById(currentStepData.target) || document.querySelector(`[data-tour="${currentStepData.target}"]`);

            if (targetEl) {
                const rect = targetEl.getBoundingClientRect();
                const position = currentStepData.position || 'bottom';

                let style = {};
                const gap = 20;

                switch (position) {
                    case 'bottom':
                        style = {
                            top: rect.bottom + gap,
                            left: rect.left + (rect.width / 2),
                            transform: 'translateX(-50%)'
                        };
                        break;
                    case 'top':
                        style = {
                            bottom: window.innerHeight - rect.top + gap,
                            left: rect.left + (rect.width / 2),
                            transform: 'translateX(-50%)'
                        };
                        break;
                    case 'right':
                        style = {
                            top: rect.top + (rect.height / 2),
                            left: rect.right + gap,
                            transform: 'translateY(-50%)'
                        };
                        break;
                    case 'left':
                        style = {
                            top: rect.top + (rect.height / 2),
                            right: window.innerWidth - rect.left + gap,
                            transform: 'translateY(-50%)'
                        };
                        break;
                    default: // center or fallback
                        style = {
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)'
                        };
                }

                // Boundary checks (basic)
                // If 'right' pushes it off screen, flip to 'left', etc.
                // For now, let's just apply the calculated style. 
                // In a real app, use floating-ui or similar for robust positioning.

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
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="w-full max-w-4xl bg-[#0a0a0c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative"
                    >
                        {/* Decorative Gradient Blob */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                        <div className="p-8 md:p-12 relative z-10">
                            <div className="text-center mb-10">
                                <span className="inline-block py-1 px-3 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-black uppercase tracking-widest mb-4">
                                    Welcome to MetalCore
                                </span>
                                <h2 className="text-3xl md:text-5xl font-display font-black text-white italic mb-4">
                                    How well do you know <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-white">Knife Steel?</span>
                                </h2>
                                <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base">
                                    Select your experience level to customize your onboarding tour. We'll highlight the features that matter most to you.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Newbie Card */}
                                <button
                                    onClick={() => startTour('newbie')}
                                    className="group relative p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-accent/40 hover:bg-white/10 transition-all text-left flex flex-col h-full"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Map size={24} strokeWidth={2.5} />
                                    </div>
                                    <h3 className="text-lg font-black text-white italic mb-2">The Explorer</h3>
                                    <p className="text-xs text-slate-400 leading-relaxed mb-4 flex-1">
                                        Active in the EDC world but new to metallurgy. Help me understand steel compositions and what makes a knife "good".
                                    </p>
                                    <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        Start Tour <ChevronRight size={12} />
                                    </div>
                                </button>

                                {/* Enthusiast Card */}
                                <button
                                    onClick={() => startTour('enthusiast')}
                                    className="group relative p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-accent/40 hover:bg-white/10 transition-all text-left flex flex-col h-full"
                                >
                                    <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform relative z-10">
                                        <Flame size={24} strokeWidth={2.5} />
                                    </div>
                                    <h3 className="text-lg font-black text-white italic mb-2 relative z-10">The Enthusiast</h3>
                                    <p className="text-xs text-slate-400 leading-relaxed mb-4 flex-1 relative z-10">
                                        I know my M390 from my D2. Show me the comparison tools, performance charts, and advanced search filters.
                                    </p>
                                    <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
                                        Start Tour <ChevronRight size={12} />
                                    </div>
                                </button>

                                {/* Expert Card */}
                                <button
                                    onClick={() => startTour('expert')}
                                    className="group relative p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-accent/40 hover:bg-white/10 transition-all text-left flex flex-col h-full"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <FlaskConical size={24} strokeWidth={2.5} />
                                    </div>
                                    <h3 className="text-lg font-black text-white italic mb-2">The Metallurgist</h3>
                                    <p className="text-xs text-slate-400 leading-relaxed mb-4 flex-1">
                                        I need raw data. Heat treatment protocols, crystalline structure analysis, and proprietary alloy mapping.
                                    </p>
                                    <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        Start Tour <ChevronRight size={12} />
                                    </div>
                                </button>
                            </div>

                            <button
                                onClick={skipTour}
                                className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="mt-8 text-center">
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
                        className="z-[9999] w-80 pointer-events-auto"
                    >
                        <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#0a0a0c]/90 shadow-2xl relative">
                            {/* Arrow/Tail (Simplified, could add real SVG arrow later) */}

                            <div className="flex justify-between items-start mb-3">
                                <span className="text-[10px] font-black text-accent uppercase tracking-widest">
                                    Step {currentStepIndex + 1} of {totalSteps}
                                </span>
                                <button onClick={skipTour} className="text-slate-500 hover:text-white">
                                    <X size={14} />
                                </button>
                            </div>

                            <h3 className="text-xl font-display font-black text-white italic mb-2">
                                {currentStepData.title}
                            </h3>
                            <p className="text-sm text-slate-400 leading-relaxed mb-6">
                                {currentStepData.content}
                            </p>

                            <div className="flex items-center justify-between">
                                <div className="flex gap-1">
                                    {Array.from({ length: totalSteps }).map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`h-1 rounded-full transition-all duration-300 ${idx === currentStepIndex ? 'w-6 bg-accent' : 'w-2 bg-white/10'}`}
                                        />
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    {currentStepIndex > 0 && (
                                        <button
                                            onClick={prevStep}
                                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                                        >
                                            <ChevronLeft size={16} />
                                        </button>
                                    )}
                                    <button
                                        onClick={nextStep}
                                        className="px-4 py-2 rounded-lg bg-accent hover:bg-accent/90 text-black text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-colors"
                                    >
                                        {currentStepIndex === totalSteps - 1 ? 'Finish' : 'Next'}
                                        {currentStepIndex === totalSteps - 1 ? <CheckCircle2 size={14} /> : <ChevronRight size={14} />}
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
