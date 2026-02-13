'use client'

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Spotlight = ({ targetId, padding = 10, borderRadius = 12 }) => {
    const [rect, setRect] = useState(null);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateRect = () => {
            const element = document.getElementById(targetId) || document.querySelector(`[data-tour="${targetId}"]`);
            if (element) {
                const r = element.getBoundingClientRect();
                setRect({
                    x: r.left - padding,
                    y: r.top - padding,
                    width: r.width + (padding * 2),
                    height: r.height + (padding * 2)
                });
            }
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        updateRect();
        window.addEventListener('resize', updateRect);
        window.addEventListener('scroll', updateRect, true);

        // ResizeObserver to track element size changes
        const element = document.getElementById(targetId) || document.querySelector(`[data-tour="${targetId}"]`);
        if (element) {
            const resizeObserver = new ResizeObserver(updateRect);
            resizeObserver.observe(element);
            return () => {
                window.removeEventListener('resize', updateRect);
                window.removeEventListener('scroll', updateRect, true);
                resizeObserver.disconnect();
            };
        }

        return () => {
            window.removeEventListener('resize', updateRect);
            window.removeEventListener('scroll', updateRect, true);
        };
    }, [targetId, padding]);

    if (!rect) return null;

    // SVG Path to create a "donut" shape:
    // Outer rectangle (screen size) + Inner rectangle (highlight target)
    // The inner rectangle is drawn counter-clockwise to create the hole (fill-rule: evenodd)
    const path = `
        M 0 0
        H ${windowSize.width}
        V ${windowSize.height}
        H 0
        Z
        M ${rect.x} ${rect.y}
        a ${borderRadius} ${borderRadius} 0 0 1 ${borderRadius} -${borderRadius}
        h ${rect.width - 2 * borderRadius}
        a ${borderRadius} ${borderRadius} 0 0 1 ${borderRadius} ${borderRadius}
        v ${rect.height - 2 * borderRadius}
        a ${borderRadius} ${borderRadius} 0 0 1 -${borderRadius} ${borderRadius}
        h -${rect.width - 2 * borderRadius}
        a ${borderRadius} ${borderRadius} 0 0 1 -${borderRadius} -${borderRadius}
        z
    `;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[9998] pointer-events-none"
        >
            <svg width="100%" height="100%" className="w-full h-full">
                <defs>
                    <mask id="spotlight-mask">
                        <rect x="0" y="0" width="100%" height="100%" fill="white" />
                        <motion.rect
                            initial={false}
                            animate={{
                                x: rect.x,
                                y: rect.y,
                                width: rect.width,
                                height: rect.height,
                            }}
                            transition={{
                                type: "spring",
                                damping: 30,
                                stiffness: 200
                            }}
                            rx={borderRadius}
                            fill="black"
                        />
                    </mask>
                </defs>

                {/* Dark Overlay with cut-out */}
                <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="rgba(0, 0, 0, 0.7)"
                    mask="url(#spotlight-mask)"
                />

                {/* Glowing border around the cut-out */}
                <motion.rect
                    initial={false}
                    animate={{
                        x: rect.x,
                        y: rect.y,
                        width: rect.width,
                        height: rect.height,
                    }}
                    transition={{
                        type: "spring",
                        damping: 30,
                        stiffness: 200
                    }}
                    rx={borderRadius}
                    fill="none"
                    stroke="#f59e0b" // Accent color
                    strokeWidth="2"
                    className="drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                />
            </svg>
        </motion.div>
    );
};

export default Spotlight;
