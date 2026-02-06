'use client'

import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { useState, useEffect } from 'react';
import { hapticFeedback } from '../hooks/useMobile';

export default function BottomSheet({ isOpen, onClose, children, snapPoints = [0.4, 0.95] }) {
    const [snapPoint, setSnapPoint] = useState(snapPoints[0]);
    const y = useMotionValue(0);

    // Calculate height based on snap point (percentage of viewport)
    const getHeight = (point) => {
        if (typeof window === 'undefined') return 0;
        return window.innerHeight * point;
    };

    useEffect(() => {
        if (isOpen) {
            setSnapPoint(snapPoints[0]);
            hapticFeedback('light');
        }
    }, [isOpen, snapPoints]);

    const handleDragEnd = (event, info) => {
        const threshold = 100;
        const velocity = info.velocity.y;
        const offset = info.offset.y;

        // Swipe down with velocity or significant distance -> close
        if (velocity > 500 || offset > threshold) {
            onClose();
            hapticFeedback('medium');
            return;
        }

        // Swipe up with velocity -> expand to next snap point
        if (velocity < -500 || offset < -threshold) {
            const currentIndex = snapPoints.indexOf(snapPoint);
            if (currentIndex < snapPoints.length - 1) {
                setSnapPoint(snapPoints[currentIndex + 1]);
                hapticFeedback('light');
            }
            return;
        }

        // Small drag -> snap back
        hapticFeedback('light');
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] md:hidden"
            />

            {/* Bottom Sheet */}
            <motion.div
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                initial={{ y: '100%' }}
                animate={{
                    y: `calc(100% - ${getHeight(snapPoint)}px)`,
                }}
                exit={{ y: '100%' }}
                transition={{
                    type: 'spring',
                    damping: 30,
                    stiffness: 300,
                }}
                style={{ y }}
                className="fixed inset-x-0 bottom-0 z-[100] md:hidden"
            >
                <div className="bg-[#0a0a0b] rounded-t-3xl shadow-2xl border-t border-white/10 overflow-hidden flex flex-col"
                     style={{ height: `${getHeight(snapPoints[snapPoints.length - 1])}px` }}>

                    {/* Drag Handle */}
                    <div className="flex justify-center pt-3 pb-2 shrink-0">
                        <div className="w-12 h-1 rounded-full bg-white/20" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-safe">
                        {children}
                    </div>
                </div>
            </motion.div>

            {/* Desktop Modal (unchanged) */}
            <div className="hidden md:block">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-6"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                        className="glass-panel w-full max-h-[90vh] max-w-7xl p-8 rounded-[2.5rem] border-white/10 shadow-2xl overflow-y-auto custom-scrollbar"
                    >
                        {children}
                    </motion.div>
                </motion.div>
            </div>
        </>
    );
}
