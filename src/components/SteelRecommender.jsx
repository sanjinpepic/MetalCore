'use client'

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BottomSheet from './BottomSheet';
import { calculateRecommendations, metricLabels } from '../lib/recommendationEngine';
import { hapticFeedback } from '../hooks/useMobile';

const STEPS = [
    {
        key: 'useCase',
        title: "What's your primary use?",
        subtitle: 'This helps us prioritize the right performance metrics',
        options: [
            { id: 'edc', label: 'EDC Folders', desc: 'Daily carry, general cutting tasks', icon: 'M15.5 7.5l-1-4H9.5l-1 4m7 0H8.5m7 0l1.5 6H7l1.5-6m0 0h7M12 17.5v3m-3-3h6' },
            { id: 'kitchen', label: 'Kitchen', desc: 'Food preparation & slicing', icon: 'M3 17l6-6m0 0l4-4m-4 4l8 8m-8-8l-4-4m16 0a2 2 0 11-4 0 2 2 0 014 0z' },
            { id: 'outdoor', label: 'Outdoor', desc: 'Camping, survival, bushcraft', icon: 'M12 3l1.5 5.5L19 10l-4 3.5 1 5.5-4-2.5L8 19l1-5.5L5 10l5.5-1.5z' },
            { id: 'hard-use', label: 'Hard Use', desc: 'Batoning, prying, heavy tasks', icon: 'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z' },
        ],
    },
    {
        key: 'priority',
        title: 'What matters most?',
        subtitle: 'Choose the performance trait you value above all else',
        options: [
            { id: 'edge', label: 'Edge Retention', desc: 'Maximum cutting longevity, stays sharp longest', icon: 'M14.5 17.5L3 6V3h3l11.5 11.5M3 3l18 18' },
            { id: 'toughness', label: 'Toughness', desc: 'Chip resistance, survives impacts and abuse', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
            { id: 'balanced', label: 'Balanced', desc: 'Best all-around performer, no compromises', icon: 'M12 3v18m-9-9h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4' },
        ],
    },
    {
        key: 'maintenance',
        title: 'How do you feel about maintenance?',
        subtitle: 'This affects whether we recommend stainless or carbon steels',
        options: [
            { id: 'low', label: 'Low Maintenance', desc: 'Prefer stainless — less oiling and drying', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
            { id: 'dont-mind', label: "Don't Mind Care", desc: 'Carbon & tool steels OK — will maintain', icon: 'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z' },
        ],
    },
    {
        key: 'sharpenability',
        title: 'Sharpening preference?',
        subtitle: 'Easy sharpening trades some edge retention for convenience',
        options: [
            { id: 'easy', label: 'Easy to Sharpen', desc: 'Quick touch-ups, less equipment needed', icon: 'M4 14l8-8 8 8M4 10l8-8 8 8' },
            { id: 'maximum-edge', label: 'Maximum Edge', desc: 'Longest lasting edge — worth the effort', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
        ],
    },
];

const TOTAL_STEPS = STEPS.length;

const DISCORD_EASE = [0.22, 1, 0.36, 1];

const stepVariants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0, transition: { duration: 0.3, ease: DISCORD_EASE } },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -40 : 40, transition: { duration: 0.2, ease: DISCORD_EASE } }),
};

const resultVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const resultItemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: DISCORD_EASE } },
};

const RANK_STYLES = [
    'from-amber-500/15 to-transparent border-amber-500/30',
    'from-slate-300/10 to-transparent border-slate-400/20',
    'from-orange-700/10 to-transparent border-orange-600/20',
    'from-white/5 to-transparent border-white/10',
    'from-white/5 to-transparent border-white/10',
];

export default function SteelRecommender({ steels, onClose, onSelectSteel }) {
    const [step, setStep] = useState(0);
    const [direction, setDirection] = useState(1);
    const [answers, setAnswers] = useState({});
    const [results, setResults] = useState(null);

    const handleSelect = useCallback((key, value) => {
        hapticFeedback('medium');
        const newAnswers = { ...answers, [key]: value };
        setAnswers(newAnswers);
        setDirection(1);

        if (step === TOTAL_STEPS - 1) {
            // Last step — calculate results
            const recs = calculateRecommendations(steels, newAnswers);
            setResults(recs);
            setTimeout(() => setStep(TOTAL_STEPS), 250);
        } else {
            setTimeout(() => setStep(s => s + 1), 250);
        }
    }, [answers, step, steels]);

    const handleBack = useCallback(() => {
        hapticFeedback('light');
        setDirection(-1);
        if (results) {
            setResults(null);
            setStep(TOTAL_STEPS - 1);
        } else {
            setStep(s => Math.max(0, s - 1));
        }
    }, [results]);

    const handleRestart = useCallback(() => {
        hapticFeedback('medium');
        setDirection(-1);
        setAnswers({});
        setResults(null);
        setStep(0);
    }, []);

    const showResults = step === TOTAL_STEPS && results;

    return (
        <BottomSheet isOpen={true} onClose={onClose}>
            {/* Header */}
            <div className="px-5 pt-2 pb-3 md:px-8 md:pt-8 md:pb-4">
                <div className="flex items-center justify-between mb-4">
                    {step > 0 ? (
                        <button onClick={handleBack} className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm font-bold">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
                            Back
                        </button>
                    ) : <div />}
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>

                {/* Progress dots */}
                {!showResults && (
                    <div className="flex items-center gap-2 mb-1">
                        {STEPS.map((_, i) => (
                            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < step ? 'bg-accent' : i === step ? 'bg-accent/60' : 'bg-white/10'}`} />
                        ))}
                    </div>
                )}
            </div>

            {/* Content — no nested scroll, BottomSheet handles scrolling */}
            <div className="px-5 pb-8 md:px-8 md:pb-10">
                <AnimatePresence mode="wait" custom={direction}>
                    {!showResults ? (
                        <motion.div
                            key={step}
                            custom={direction}
                            variants={stepVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                        >
                            <StepView
                                step={STEPS[step]}
                                selected={answers[STEPS[step].key]}
                                onSelect={(val) => handleSelect(STEPS[step].key, val)}
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="results"
                            custom={direction}
                            variants={stepVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                        >
                            <ResultsView
                                results={results}
                                onSelectSteel={onSelectSteel}
                                onRestart={handleRestart}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </BottomSheet>
    );
}

function StepView({ step, selected, onSelect }) {
    return (
        <div>
            <div className="mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-display font-black text-white italic uppercase tracking-tighter leading-tight">{step.title}</h2>
                <p className="text-slate-500 text-xs md:text-sm mt-1.5 font-medium italic">{step.subtitle}</p>
            </div>

            <div className={`grid gap-3 md:gap-4 ${step.options.length === 4 ? 'grid-cols-2' : step.options.length === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'}`}>
                {step.options.map(opt => {
                    const isSelected = selected === opt.id;
                    return (
                        <motion.button
                            key={opt.id}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => onSelect(opt.id)}
                            className={`text-left p-5 md:p-6 rounded-2xl border transition-all duration-200 group ${isSelected
                                ? 'border-accent bg-accent/10 shadow-lg shadow-accent/10'
                                : 'border-white/5 bg-white/[0.03] hover:border-white/15 hover:bg-white/[0.06]'
                            }`}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 border transition-colors ${isSelected ? 'bg-accent/20 border-accent/30' : 'bg-white/5 border-white/10 group-hover:border-white/20'}`}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-colors ${isSelected ? 'text-accent' : 'text-slate-400 group-hover:text-slate-300'}`}>
                                    <path d={opt.icon} />
                                </svg>
                            </div>
                            <h3 className={`font-display font-black italic uppercase tracking-tight text-sm md:text-base mb-1 transition-colors ${isSelected ? 'text-accent' : 'text-white'}`}>{opt.label}</h3>
                            <p className="text-slate-500 text-[11px] md:text-xs font-medium leading-relaxed">{opt.desc}</p>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}

function ResultsView({ results, onSelectSteel, onRestart }) {
    return (
        <div>
            <div className="mb-6 md:mb-8">
                <div className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-1.5 flex items-center gap-2">
                    <span className="w-5 h-px bg-accent/40"></span>
                    Your Matches
                </div>
                <h2 className="text-xl md:text-2xl font-display font-black text-white italic uppercase tracking-tighter leading-tight">Top Steel Recommendations</h2>
                <p className="text-slate-500 text-xs md:text-sm mt-1.5 font-medium italic">Based on your preferences, ranked by compatibility</p>
            </div>

            <motion.div
                className="space-y-3"
                variants={resultVariants}
                initial="hidden"
                animate="show"
            >
                {results.map((steel, i) => (
                    <motion.button
                        key={steel.id}
                        variants={resultItemVariants}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            hapticFeedback('medium');
                            onSelectSteel(steel);
                        }}
                        className={`w-full text-left p-4 md:p-5 rounded-2xl border bg-gradient-to-r transition-all hover:scale-[1.01] ${RANK_STYLES[i] || RANK_STYLES[4]}`}
                    >
                        <div className="flex items-start gap-4">
                            {/* Rank badge */}
                            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 font-display font-black italic text-lg ${i === 0 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-white/5 text-slate-500 border border-white/10'}`}>
                                {i + 1}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-3 mb-1">
                                    <h3 className="font-display font-black text-white italic uppercase tracking-tight text-base md:text-lg truncate">{steel.name}</h3>
                                    <span className={`text-sm md:text-base font-display font-black italic shrink-0 ${i === 0 ? 'text-amber-400' : 'text-accent'}`}>{steel.matchScore}%</span>
                                </div>
                                <p className="text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-2">{steel.producer}</p>

                                {/* Top metrics */}
                                <div className="flex flex-wrap gap-2">
                                    {steel.topMetrics.map(m => (
                                        <span key={m.metric} className="text-[10px] md:text-[11px] font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                                            {metricLabels[m.metric]}: {m.value.toFixed(1)}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Arrow */}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-600 shrink-0 mt-1">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </div>
                    </motion.button>
                ))}
            </motion.div>

            {/* Actions */}
            <div className="flex gap-3 mt-8">
                <button
                    onClick={onRestart}
                    className="flex-1 py-3 rounded-2xl border border-white/10 text-slate-400 text-sm font-bold hover:bg-white/5 hover:text-white transition-all"
                >
                    Start Over
                </button>
            </div>
        </div>
    );
}
