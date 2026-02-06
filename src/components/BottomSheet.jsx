'use client'

import { motion, AnimatePresence, useMotionValue, useDragControls } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { hapticFeedback } from '../hooks/useMobile';

export default function BottomSheet({ isOpen, onClose, children, snapPoints = [0.4, 0.95] }) {
    const [snapPoint, setSnapPoint] = useState(snapPoints[0]);
    const y = useMotionValue(0);
    const dragControls = useDragControls();
    const contentRef = useRef(null);
    const touchStartY = useRef(0);

    // Calculate height based on snap point (percentage of viewport)
    const getHeight = (point) => {
        if (typeof window === 'undefined') return 0;
        return window.innerHeight * point;
    };

    // Get the maximum snap point for container height
    const maxSnapPoint = Math.max(...snapPoints);

    // Handle touch events to enable drag when at scroll top
    const handleTouchStart = (e) => {
        touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
        if (!contentRef.current) return;

        const scrollTop = contentRef.current.scrollTop;
        const touchY = e.touches[0].clientY;
        const deltaY = touchY - touchStartY.current;

        // If at top of scroll and user is swiping down, enable drag
        if (scrollTop === 0 && deltaY > 0) {
            dragControls.start(e);
        }
    };

    useEffect(() => {
        if (isOpen) {
            setSnapPoint(snapPoints[0]);
            hapticFeedback('light');

            // Prevent body scroll on mobile when modal is open
            if (typeof window !== 'undefined' && window.innerWidth < 768) {
                document.body.style.overflow = 'hidden';
            }
        } else {
            // Restore body scroll when modal closes
            document.body.style.overflow = '';
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen, snapPoints]);

    const handleDragEnd = (event, info) => {
        const threshold = 80;
        const velocity = info.velocity.y;
        const offset = info.offset.y;

        // Swipe down with velocity or significant distance
        if (velocity > 400 || offset > threshold) {
            // If at the smallest snap point, close. Otherwise go to smaller snap point
            const minSnapPoint = Math.min(...snapPoints);
            if (snapPoint === minSnapPoint) {
                onClose();
                hapticFeedback('medium');
            } else {
                setSnapPoint(minSnapPoint);
                hapticFeedback('light');
            }
            return;
        }

        // Swipe up with velocity -> expand to larger snap point
        if (velocity < -400 || offset < -threshold) {
            if (snapPoint !== maxSnapPoint) {
                setSnapPoint(maxSnapPoint);
                hapticFeedback('light');
            }
            return;
        }

        // Small drag -> snap back
        hapticFeedback('light');
    };

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <>
                    {/* Mobile Backdrop */}
                    <motion.div
                        key="mobile-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] md:hidden"
                    />

                    {/* Mobile Bottom Sheet */}
                    <motion.div
                        key="mobile-sheet"
                drag="y"
                dragControls={dragControls}
                dragListener={false}
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.15}
                dragMomentum={false}
                onDragEnd={handleDragEnd}
                initial={{ y: '100%' }}
                animate={{
                    y: `calc(100% - ${getHeight(snapPoint)}px)`,
                }}
                exit={{ y: '100%' }}
                transition={{
                    type: 'spring',
                    damping: 35,
                    stiffness: 400,
                    mass: 0.8,
                }}
                style={{ y }}
                className="fixed inset-x-0 bottom-0 z-[100] md:hidden"
            >
                <div className="bg-[#0a0a0b] rounded-t-3xl shadow-2xl border-t border-white/10 overflow-hidden flex flex-col"
                     style={{ height: `${getHeight(maxSnapPoint)}px` }}>

                    {/* Drag Handle */}
                    <div
                        onPointerDown={(e) => dragControls.start(e)}
                        className="flex justify-center pt-3 pb-2 shrink-0 cursor-grab active:cursor-grabbing touch-none"
                    >
                        <motion.div
                            className="w-12 h-1 rounded-full bg-white/20"
                            whileTap={{ scale: 1.1 }}
                            transition={{ duration: 0.1 }}
                        />
                    </div>

                    {/* Content */}
                    <div
                        ref={contentRef}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-safe overscroll-contain touch-pan-y"
                    >
                        {children}
                    </div>
                </div>
            </motion.div>

                    {/* Desktop Modal */}
                    <motion.div
                        key="desktop-modal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-6 hidden md:flex"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ type: 'spring', damping: 30, stiffness: 400, mass: 0.8 }}
                            onClick={(e) => e.stopPropagation()}
                            className="glass-panel w-full max-h-[90vh] max-w-7xl p-8 rounded-[2.5rem] border-white/10 shadow-2xl overflow-y-auto custom-scrollbar overscroll-contain touch-pan-y"
                        >
                            {children}
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
