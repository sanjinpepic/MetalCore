'use client'

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function StickySearchBar({ value, onChange, placeholder = "Search...", onFocus, onBlur }) {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.div
            className="sticky top-0 z-40"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 20 }}
        >
            <motion.div
                animate={{
                    backgroundColor: isScrolled ? 'rgba(5, 5, 5, 0.95)' : 'rgba(5, 5, 5, 0)',
                }}
                className="backdrop-blur-xl px-4 py-3 pt-safe border-b transition-all"
                style={{
                    borderColor: isScrolled ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                }}
            >
                <div className="relative max-w-2xl mx-auto">
                    {/* Search Icon */}
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                    </div>

                    {/* Input */}
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        placeholder={placeholder}
                        className="w-full h-12 pl-12 pr-12 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all text-sm font-medium"
                    />

                    {/* Clear Button */}
                    {value && (
                        <motion.button
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            onClick={() => onChange('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-400 hover:text-white transition-all"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </motion.button>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}
