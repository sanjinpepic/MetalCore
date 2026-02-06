'use client'

import { useSwipeable } from 'react-swipeable';
import { useNavigation } from '../context/NavigationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function GestureHandler({ children, viewKey }) {
    const { goBack, canGoBack } = useNavigation();
    const [swipeProgress, setSwipeProgress] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);

    const handlers = useSwipeable({
        onSwipeStart: (eventData) => {
            if (eventData.dir === 'Right' && canGoBack) {
                setIsSwiping(true);
            }
        },
        onSwiping: (eventData) => {
            if (eventData.dir === 'Right' && canGoBack && isSwiping) {
                // Calculate swipe progress (0 to 1)
                const progress = Math.min(eventData.deltaX / 300, 1);
                setSwipeProgress(progress);
            }
        },
        onSwiped: (eventData) => {
            if (eventData.dir === 'Right' && canGoBack && swipeProgress > 0.3) {
                goBack();
            }
            setIsSwiping(false);
            setSwipeProgress(0);
        },
        trackMouse: false,
        trackTouch: true,
        delta: 10,
        preventScrollOnSwipe: false,
        rotationAngle: 0,
    });

    // Prevent swipe when scrolling vertically
    useEffect(() => {
        if (typeof window === 'undefined') return;

        let touchStartY = 0;
        let touchStartX = 0;

        const handleTouchStart = (e) => {
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
        };

        const handleTouchMove = (e) => {
            const touchY = e.touches[0].clientY;
            const touchX = e.touches[0].clientX;
            const deltaY = Math.abs(touchY - touchStartY);
            const deltaX = Math.abs(touchX - touchStartX);

            // If vertical scroll is more significant, don't swipe
            if (deltaY > deltaX && deltaY > 10) {
                setIsSwiping(false);
                setSwipeProgress(0);
            }
        };

        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchmove', handleTouchMove, { passive: true });

        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
        };
    }, []);

    return (
        <div {...handlers} className="relative w-full h-full">
            {/* Swipe indicator */}
            {isSwiping && swipeProgress > 0 && (
                <motion.div
                    className="fixed left-0 top-1/2 -translate-y-1/2 z-50 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: swipeProgress }}
                >
                    <div
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-accent/20 backdrop-blur-sm border border-accent/40"
                        style={{
                            transform: `translateX(${swipeProgress * 60}px)`,
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </div>
                </motion.div>
            )}

            {/* Content with swipe transform */}
            <motion.div
                className="w-full h-full"
                animate={{
                    x: isSwiping ? swipeProgress * 100 : 0,
                    opacity: isSwiping ? 1 - (swipeProgress * 0.3) : 1,
                }}
                transition={{
                    type: 'tween',
                    duration: 0,
                }}
            >
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={viewKey}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{
                            duration: 0.2,
                            ease: 'easeOut',
                        }}
                        className="w-full h-full"
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
