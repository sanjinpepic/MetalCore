'use client'

import { useState, useRef } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { hapticFeedback } from '../hooks/useMobile';

export default function MobileBottomNav({ view, setView, setAiOpen }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const dragControls = useDragControls();
    const startY = useRef(0);

    const navItems = [
        { id: 'HOME', icon: HomeIcon, label: 'Home' },
        { id: 'SEARCH', icon: SearchIcon, label: 'Search' },
        { id: 'MATRIX', icon: GridIcon, label: 'Matrix' },
        { id: 'KNIVES', icon: KnifeIcon, label: 'Knives' },
        { id: 'EDUCATION', icon: BookIcon, label: 'Learn' },
    ];

    const handleDragStart = (event, info) => {
        startY.current = info.point.y;
    };

    const handleDragEnd = (event, info) => {
        const dragDistance = startY.current - info.point.y;

        // Swipe up to expand
        if (dragDistance > 30 && !isExpanded) {
            setIsExpanded(true);
            hapticFeedback('light');
        }
        // Swipe down to collapse
        else if (dragDistance < -30 && isExpanded) {
            setIsExpanded(false);
            hapticFeedback('light');
        }
    };

    const handleNavClick = (viewId) => {
        setView(viewId);
        setIsExpanded(false);
        hapticFeedback('medium');
    };

    return (
        <motion.div
            className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10"
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            {/* Drag Handle */}
            <div
                onPointerDown={(e) => dragControls.start(e)}
                className="w-full flex justify-center pt-2 pb-1 cursor-grab active:cursor-grabbing touch-none"
            >
                <div className="w-12 h-1 rounded-full bg-white/20" />
            </div>

            {/* Main Nav Bar */}
            <div className="px-2 pb-safe">
                <div className="flex items-center justify-around py-2">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleNavClick(item.id)}
                            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                                view === item.id
                                    ? 'text-accent bg-accent/10'
                                    : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="text-[10px] font-bold">{item.label}</span>
                        </button>
                    ))}
                </div>

                {/* Expanded Menu */}
                <motion.div
                    initial={false}
                    animate={{
                        height: isExpanded ? 'auto' : 0,
                        opacity: isExpanded ? 1 : 0,
                    }}
                    className="overflow-hidden"
                >
                    <div className="grid grid-cols-4 gap-2 pt-2 pb-4 border-t border-white/5">
                        <button
                            onClick={() => { handleNavClick('COMPARE'); }}
                            className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300"
                        >
                            <CompareIcon className="w-5 h-5" />
                            <span className="text-xs font-medium">Compare</span>
                        </button>
                        <button
                            onClick={() => { handleNavClick('PROFILE'); }}
                            className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300"
                        >
                            <UserIcon className="w-5 h-5" />
                            <span className="text-xs font-medium">Profile</span>
                        </button>
                        <button
                            onClick={() => { handleNavClick('PRO_LAB'); }}
                            className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300"
                        >
                            <FlaskIcon className="w-5 h-5" />
                            <span className="text-xs font-medium">Pro Lab</span>
                        </button>
                        <button
                            onClick={() => {
                                setAiOpen(true);
                                setIsExpanded(false);
                                hapticFeedback('medium');
                            }}
                            className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/30 text-accent hover:from-accent/30 hover:to-accent/20"
                        >
                            <SparklesIcon className="w-5 h-5" />
                            <span className="text-xs font-medium">Ferry AI</span>
                        </button>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

// Icon Components
function HomeIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        </svg>
    );
}

function SearchIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
        </svg>
    );
}

function GridIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
        </svg>
    );
}

function KnifeIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
            <line x1="13" y1="19" x2="19" y2="13" />
            <line x1="16" y1="16" x2="20" y2="20" />
            <line x1="19" y1="21" x2="21" y2="19" />
        </svg>
    );
}

function BookIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
    );
}

function CompareIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="5 9 2 12 5 15" />
            <polyline points="9 5 12 2 15 5" />
            <polyline points="15 19 12 22 9 19" />
            <polyline points="19 9 22 12 19 15" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <line x1="12" y1="2" x2="12" y2="22" />
        </svg>
    );
}

function UserIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}

function FlaskIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 3h6v7.5L21 21H3L9 10.5V3z" />
            <path d="M7.5 3h9" />
        </svg>
    );
}

function SparklesIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" />
            <path d="M19 17v4" />
            <path d="M3 5h4" />
            <path d="M17 19h4" />
        </svg>
    );
}
