'use client'

import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { hapticFeedback } from '../hooks/useMobile';

export default function BottomSheet({ isOpen, onClose, children, baseZIndex = 100 }) {
    const contentRef = useRef(null);
    const isDragging = useRef(false);
    const dragStartY = useRef(0);
    const dragStartSheetY = useRef(0);
    const touchStartY = useRef(0);
    const isVerticalScroll = useRef(false);
    const hasTriggeredHaptic = useRef(false);

    // Single snap point - fully expanded (85dvh)
    const SNAP_HEIGHT = 0.95;

    // Motion values for finger-following
    // sheetY: 0 = fully open position, positive = dragged down, window.innerHeight = fully closed
    const sheetY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight : 1000);
    const maxDrag = typeof window !== 'undefined' ? window.innerHeight * SNAP_HEIGHT : 800;

    // Backdrop opacity follows sheet position
    const backdropOpacity = useTransform(sheetY, [0, maxDrag], [1, 0]);

    // Improved spring configuration
    const springConfig = {
        type: 'spring',
        damping: 30,
        stiffness: 300,
        mass: 0.5,
    };

    useEffect(() => {
        if (isOpen) {
            hapticFeedback('light');
            // Animate sheet to open position
            animate(sheetY, 0, springConfig);

            // Prevent body scroll on mobile
            if (typeof window !== 'undefined' && window.innerWidth < 768) {
                document.body.style.overflow = 'hidden';
            }
        } else {
            // Animate sheet to closed position
            animate(sheetY, typeof window !== 'undefined' ? window.innerHeight : 1000, {
                duration: 0.25,
                ease: [0.22, 1, 0.36, 1],
            });
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Handle drag-to-close with finger-following
    useEffect(() => {
        if (!isOpen || typeof window === 'undefined' || window.innerWidth >= 768) return;

        let isDragActive = false;
        let isFromHandle = false;
        let startTouchY = 0;

        const handleTouchStart = (e) => {
            const touch = e.touches[0];
            startTouchY = touch.clientY;
            touchStartY.current = touch.clientY;
            isVerticalScroll.current = false;
            hasTriggeredHaptic.current = false;

            // Check if touching the drag handle (first child of sheet)
            const handle = contentRef.current?.parentElement?.querySelector('[data-drag-handle]');
            if (handle && handle.contains(e.target)) {
                isFromHandle = true;
                isDragActive = true;
                isDragging.current = true;
                dragStartY.current = touch.clientY;
                dragStartSheetY.current = sheetY.get();
                if (contentRef.current) {
                    contentRef.current.style.overflow = 'hidden';
                    contentRef.current.style.touchAction = 'none';
                }
                return;
            }

            isFromHandle = false;

            // Check if we're within the content area
            if (contentRef.current && contentRef.current.contains(e.target)) {
                dragStartY.current = touch.clientY;
                dragStartSheetY.current = sheetY.get();
                // We'll decide whether to start dragging in touchmove
                isDragActive = false;
            }
        };

        const handleTouchMove = (e) => {
            const touch = e.touches[0];
            const deltaY = touch.clientY - startTouchY;

            // If dragging from handle, always follow finger
            if (isFromHandle && isDragging.current) {
                const newY = dragStartSheetY.current + (touch.clientY - dragStartY.current);
                const clampedY = Math.max(-20, newY); // Small elastic at top
                sheetY.set(clampedY);

                // Haptic at halfway point
                const progress = clampedY / maxDrag;
                if (progress > 0.3 && !hasTriggeredHaptic.current) {
                    hapticFeedback('light');
                    hasTriggeredHaptic.current = true;
                }

                e.preventDefault();
                return;
            }

            // For content area: only start drag when at scroll top and swiping down
            if (contentRef.current && contentRef.current.contains(e.target)) {
                const scrollTop = contentRef.current.scrollTop;

                if (!isDragActive && scrollTop <= 0 && deltaY > 8) {
                    // Start dragging - user is at top and swiping down
                    isDragActive = true;
                    isDragging.current = true;
                    dragStartY.current = touch.clientY;
                    dragStartSheetY.current = sheetY.get();
                    contentRef.current.style.overflow = 'hidden';
                    contentRef.current.style.touchAction = 'none';
                }

                if (isDragActive && isDragging.current) {
                    const newY = dragStartSheetY.current + (touch.clientY - dragStartY.current);
                    const clampedY = Math.max(-20, newY);
                    sheetY.set(clampedY);

                    // Haptic at halfway
                    const progress = clampedY / maxDrag;
                    if (progress > 0.3 && !hasTriggeredHaptic.current) {
                        hapticFeedback('light');
                        hasTriggeredHaptic.current = true;
                    }

                    e.preventDefault();
                }
            }
        };

        const handleTouchEnd = () => {
            if (!isDragging.current) return;
            isDragging.current = false;

            if (contentRef.current) {
                contentRef.current.style.overflow = '';
                contentRef.current.style.touchAction = '';
            }

            const currentY = sheetY.get();
            const progress = currentY / maxDrag;

            // Close if dragged past 30% or if moving fast
            if (progress > 0.3) {
                // Close
                animate(sheetY, window.innerHeight, {
                    duration: 0.25,
                    ease: [0.22, 1, 0.36, 1],
                    onComplete: () => {
                        onClose();
                    }
                });
                hapticFeedback('medium');
            } else {
                // Snap back to open
                animate(sheetY, 0, springConfig);
                hapticFeedback('light');
            }

            isDragActive = false;
            isFromHandle = false;
        };

        // Attach to the sheet container
        const sheetEl = contentRef.current?.parentElement;
        if (!sheetEl) return;

        sheetEl.addEventListener('touchstart', handleTouchStart, { passive: true });
        sheetEl.addEventListener('touchmove', handleTouchMove, { passive: false });
        sheetEl.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            sheetEl.removeEventListener('touchstart', handleTouchStart);
            sheetEl.removeEventListener('touchmove', handleTouchMove);
            sheetEl.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isOpen, sheetY, maxDrag, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Mobile Backdrop - progressive glass follows sheet position */}
                    <motion.div
                        key="mobile-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="fixed inset-0 md:hidden"
                        style={{ zIndex: baseZIndex - 10 }}
                    >
                        <motion.div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            style={{ opacity: backdropOpacity }}
                            onClick={onClose}
                        />
                    </motion.div>

                    {/* Mobile Bottom Sheet - finger-following */}
                    <motion.div
                        key="mobile-sheet"
                        style={{ y: sheetY, zIndex: baseZIndex }}
                        initial={false}
                        className="fixed inset-x-0 bottom-0 md:hidden will-change-transform"
                    // Position: top of sheet at 5% from top (95vh height)
                    // The sheetY motion value moves it: 0 = open, positive = down
                    >
                        <div
                            className="bg-[#0a0a0b] rounded-t-3xl shadow-2xl border-t border-white/10 overflow-hidden flex flex-col"
                            style={{ height: `${SNAP_HEIGHT * 100}dvh` }}
                        >
                            {/* Drag Handle - always initiates drag */}
                            <div
                                data-drag-handle
                                className="flex justify-center pt-3 pb-2 shrink-0 cursor-grab active:cursor-grabbing touch-none"
                            >
                                <div className="w-12 h-1.5 rounded-full bg-white/20" />
                            </div>

                            {/* Single unified scroll container */}
                            <div
                                ref={contentRef}
                                className="flex-1 overflow-y-auto overscroll-contain px-6 pb-safe"
                                style={{
                                    WebkitOverflowScrolling: 'touch',
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
                        className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 hidden md:flex"
                        style={{ zIndex: baseZIndex }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={springConfig}
                            onClick={(e) => e.stopPropagation()}
                            className="glass-panel w-full max-h-[85vh] max-w-7xl p-8 rounded-[2.5rem] border-white/10 shadow-2xl overflow-y-auto custom-scrollbar will-change-transform"
                        >
                            {children}
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
