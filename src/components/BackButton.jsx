'use client'

import { useNavigation } from '../context/NavigationContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function BackButton({ className = '' }) {
    const { goBack, canGoBack } = useNavigation();

    return (
        <AnimatePresence>
            {canGoBack && (
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onClick={goBack}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-zinc-300 hover:text-white ${className}`}
                    aria-label="Go back"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                    <span className="text-sm font-medium">Back</span>
                </motion.button>
            )}
        </AnimatePresence>
    );
}
