'use client'

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function PullToRefresh({ onRefresh, children }) {
    const [pullDistance, setPullDistance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [canPull, setCanPull] = useState(false);
    const startY = useRef(0);
    const currentY = useRef(0);
    const containerRef = useRef(null);

    const maxPullDistance = 100;
    const triggerDistance = 70;

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleTouchStart = (e) => {
            // Only allow pull to refresh when at the top of the page
            const scrollTop = containerRef.current?.scrollTop || window.scrollY;
            if (scrollTop === 0) {
                startY.current = e.touches[0].clientY;
                setCanPull(true);
            }
        };

        const handleTouchMove = (e) => {
            if (!canPull || isRefreshing) return;

            currentY.current = e.touches[0].clientY;
            const distance = currentY.current - startY.current;

            if (distance > 0 && distance < maxPullDistance) {
                setPullDistance(distance);
                // Prevent default scrolling when pulling
                if (distance > 10) {
                    e.preventDefault();
                }
            }
        };

        const handleTouchEnd = async () => {
            if (!canPull || isRefreshing) return;

            if (pullDistance >= triggerDistance) {
                setIsRefreshing(true);
                setPullDistance(triggerDistance);

                try {
                    await onRefresh?.();
                } finally {
                    setTimeout(() => {
                        setIsRefreshing(false);
                        setPullDistance(0);
                    }, 500);
                }
            } else {
                setPullDistance(0);
            }

            setCanPull(false);
        };

        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [canPull, isRefreshing, pullDistance, onRefresh]);

    const rotationDegree = (pullDistance / maxPullDistance) * 360;
    const opacity = Math.min(pullDistance / triggerDistance, 1);

    return (
        <div ref={containerRef} className="relative w-full h-full overflow-auto">
            {/* Pull indicator */}
            <motion.div
                className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center pointer-events-none"
                animate={{
                    height: pullDistance,
                    opacity: opacity,
                }}
                transition={{ duration: 0 }}
            >
                <motion.div
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/20 backdrop-blur-sm border border-accent/40"
                    animate={{
                        rotate: isRefreshing ? 360 : rotationDegree,
                    }}
                    transition={{
                        rotate: isRefreshing
                            ? { duration: 1, repeat: Infinity, ease: 'linear' }
                            : { duration: 0 }
                    }}
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-accent"
                    >
                        <polyline points="23 4 23 10 17 10" />
                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                    </svg>
                </motion.div>
            </motion.div>

            {/* Content */}
            <motion.div
                animate={{
                    marginTop: isRefreshing ? triggerDistance : pullDistance,
                }}
                transition={{ duration: 0.2 }}
            >
                {children}
            </motion.div>
        </div>
    );
}
