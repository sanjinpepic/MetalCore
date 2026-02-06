'use client'

import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { hapticFeedback } from '../hooks/useMobile';

export default function BottomSheet({ isOpen, onClose, children }) {
    const dragControls = useDragControls();
    const contentRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    // Single snap point - fully expanded (95vh)
    const SNAP_HEIGHT = 0.95;

    useEffect(() => {
        if (isOpen) {
            hapticFeedback('light');
            // Prevent body scroll on mobile when modal is open
            if (typeof window !== 'undefined' && window.innerWidth < 768) {
                document.body.style.overflow = 'hidden';
            }
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleDragStart = () => {
        if (!contentRef.current) return;

        // Only allow dragging if we're at the top of the scroll container
        const isAtTop = contentRef.current.scrollTop <= 0;

        if (isAtTop) {
            setIsDragging(true);
            // Prevent scroll while dragging
            contentRef.current.style.overflow = 'hidden';
        }
    };

    const handleDragEnd = (event, info) => {
        setIsDragging(false);

        if (contentRef.current) {
            contentRef.current.style.overflow = '';
        }

        const threshold = 150;
        const velocity = info.velocity.y;
        const offset = info.offset.y;

        // Close if dragged down significantly or with velocity
        if (velocity > 500 || offset > threshold) {
            onClose();
            hapticFeedback('medium');
        } else {
            // Snap back
            hapticFeedback('light');
        }
    };

    // Improved spring configuration for native feel
    const springConfig = {
        type: 'spring',
        damping: 30,
        stiffness: 300,
        mass: 0.5,
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
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] md:hidden"
                    />

                    {/* Mobile Bottom Sheet */}
                    <motion.div
                        key="mobile-sheet"
                        drag="y"
                        dragControls={dragControls}
                        dragListener={false}
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={{ top: 0, bottom: 0.2 }}
                        dragMomentum={false}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        initial={{ y: '100%' }}
                        animate={{ y: `${(1 - SNAP_HEIGHT) * 100}%` }}
                        exit={{
                            y: '100%',
                            transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] }
                        }}
                        transition={springConfig}
                        className="fixed inset-x-0 bottom-0 z-[100] md:hidden"
                    >
                        <div
                            className="bg-[#0a0a0b] rounded-t-3xl shadow-2xl border-t border-white/10 overflow-hidden flex flex-col will-change-transform"
                            style={{ height: `${SNAP_HEIGHT * 100}vh` }}
                        >
                            {/* Drag Handle */}
                            <div
                                onPointerDown={(e) => {
                                    // Always allow drag from handle
                                    setIsDragging(true);
                                    if (contentRef.current) {
                                        contentRef.current.style.overflow = 'hidden';
                                    }
                                    dragControls.start(e);
                                }}
                                className="flex justify-center pt-3 pb-2 shrink-0 cursor-grab active:cursor-grabbing touch-none"
                            >
                                <motion.div
                                    className="w-12 h-1.5 rounded-full bg-white/20"
                                    whileTap={{ scale: 1.2, backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                                    transition={{ duration: 0.1 }}
                                />
                            </div>

                            {/* Single unified scroll container - no nested scrolling */}
                            <div
                                ref={contentRef}
                                className="flex-1 overflow-y-auto overscroll-contain touch-pan-y px-6 pb-safe"
                                style={{
                                    WebkitOverflowScrolling: 'touch',
                                    // Hide scrollbar on mobile for cleaner look
                                    scrollbarWidth: 'none',
                                    msOverflowStyle: 'none',
                                }}
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
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-6 hidden md:flex"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={springConfig}
                            onClick={(e) => e.stopPropagation()}
                            className="glass-panel w-full max-h-[90vh] max-w-7xl p-8 rounded-[2.5rem] border-white/10 shadow-2xl overflow-y-auto custom-scrollbar will-change-transform"
                        >
                            {children}
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
