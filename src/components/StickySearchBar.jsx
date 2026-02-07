'use client'

import { motion } from 'framer-motion';

export default function StickySearchBar({ value, onChange, placeholder = "Search...", onFocus, onBlur }) {

    return (
        <motion.div
            className="sticky top-0 z-40 px-4 pb-3 pt-safe bg-black/80 backdrop-blur-xl"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 20 }}
        >
            <div className="relative max-w-2xl mx-auto">
                {/* Search Icon */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none z-10">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                </div>

                {/* Input - glass effect on the input itself */}
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    className="w-full h-12 pl-12 pr-12 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all text-sm font-medium shadow-lg shadow-black/20"
                />

                {/* Clear Button */}
                {value && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={() => onChange('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-400 hover:text-white transition-all z-10"
                        style={{ minWidth: 0, minHeight: 0 }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
}
