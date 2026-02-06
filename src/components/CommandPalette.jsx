'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { hapticFeedback } from '../hooks/useMobile';

const VIEWS = [
    { id: 'HOME', label: 'Dashboard', type: 'nav', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
    { id: 'SEARCH', label: 'Grade Library', type: 'nav', icon: 'M21 12c0 1.66-4 3-9 3s-9-1.34-9-3M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5' },
    { id: 'MATRIX', label: 'Performance Matrix', type: 'nav', icon: 'M3 3h18v18H3z' },
    { id: 'KNIVES', label: 'Knife Library', type: 'nav', icon: 'M14.5 17.5 3 6 3 3 6 3 17.5 14.5' },
    { id: 'EDUCATION', label: 'Academy', type: 'nav', icon: 'M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5z' },
    { id: 'COMPARE', label: 'Compare Steels', type: 'nav', icon: 'M12 2v20M2 12h20' },
    { id: 'PROFILE', label: 'Profile', type: 'nav', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' },
    { id: 'PRO_LAB', label: 'Pro Lab', type: 'nav', icon: 'M9 3h6v7.5L21 21H3L9 10.5V3z' },
];

const ACTIONS = [
    { id: 'ai', label: 'Ask Ferry AI', type: 'action', icon: 'm12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z' },
    { id: 'settings', label: 'Open Settings', type: 'action', icon: 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z' },
];

export default function CommandPalette({ isOpen, onClose, steels = [], knives = [], onNavigate, onOpenSteel, onOpenKnife, onAction }) {
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef(null);
    const listRef = useRef(null);

    const normalize = (str) => str.toLowerCase().replace(/[\s-]/g, '');

    const results = useMemo(() => {
        if (!query.trim()) {
            // Show views + actions when empty
            return [
                ...VIEWS.map(v => ({ ...v, category: 'Navigate' })),
                ...ACTIONS.map(a => ({ ...a, category: 'Actions' })),
            ];
        }

        const q = normalize(query);
        const items = [];

        // Search steels
        const matchedSteels = steels
            .filter(s => normalize(s.name).includes(q) || normalize(s.producer).includes(q))
            .slice(0, 6)
            .map(s => ({
                id: s.id,
                label: s.name,
                sublabel: s.producer,
                type: 'steel',
                category: 'Steels',
                data: s,
            }));
        items.push(...matchedSteels);

        // Search knives
        const matchedKnives = knives
            .filter(k => normalize(k.name).includes(q) || normalize(k.maker).includes(q))
            .slice(0, 4)
            .map(k => ({
                id: k.id,
                label: k.name,
                sublabel: k.maker,
                type: 'knife',
                category: 'Knives',
                data: k,
            }));
        items.push(...matchedKnives);

        // Search views
        const matchedViews = VIEWS.filter(v => normalize(v.label).includes(q));
        items.push(...matchedViews.map(v => ({ ...v, category: 'Navigate' })));

        // Search actions
        const matchedActions = ACTIONS.filter(a => normalize(a.label).includes(q));
        items.push(...matchedActions.map(a => ({ ...a, category: 'Actions' })));

        return items;
    }, [query, steels, knives]);

    // Reset active index when results change
    useEffect(() => {
        setActiveIndex(0);
    }, [results.length, query]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setActiveIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    // Scroll active item into view
    useEffect(() => {
        if (!listRef.current) return;
        const activeItem = listRef.current.children[activeIndex];
        if (activeItem) {
            activeItem.scrollIntoView({ block: 'nearest' });
        }
    }, [activeIndex]);

    const handleSelect = useCallback((item) => {
        hapticFeedback('medium');
        onClose();

        if (item.type === 'nav') {
            onNavigate(item.id);
        } else if (item.type === 'steel') {
            onOpenSteel(item.data);
        } else if (item.type === 'knife') {
            onOpenKnife(item.data);
        } else if (item.type === 'action') {
            onAction(item.id);
        }
    }, [onClose, onNavigate, onOpenSteel, onOpenKnife, onAction]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex(i => Math.min(i + 1, results.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex(i => Math.max(i - 1, 0));
        } else if (e.key === 'Enter' && results[activeIndex]) {
            e.preventDefault();
            handleSelect(results[activeIndex]);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            onClose();
        }
    }, [results, activeIndex, handleSelect, onClose]);

    // Group results by category for display
    const groupedResults = useMemo(() => {
        const groups = {};
        results.forEach((item, idx) => {
            const cat = item.category || 'Results';
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push({ ...item, globalIndex: idx });
        });
        return groups;
    }, [results]);

    const getIcon = (item) => {
        if (item.type === 'steel') {
            return (
                <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-[10px] font-black shrink-0">
                    Fe
                </div>
            );
        }
        if (item.type === 'knife') {
            return (
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400">
                        <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
                    </svg>
                </div>
            );
        }
        return (
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
                    <path d={item.icon || ''} />
                </svg>
            </div>
        );
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="cmd-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
                    />

                    {/* Palette */}
                    <motion.div
                        key="cmd-palette"
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed top-[15%] left-1/2 -translate-x-1/2 w-[90vw] max-w-xl z-[201] rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0b] shadow-2xl shadow-black/50"
                    >
                        {/* Search Input */}
                        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-500 shrink-0">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                            </svg>
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Search steels, knives, or jump to..."
                                className="flex-1 bg-transparent text-white text-sm font-medium placeholder:text-slate-500 outline-none"
                                autoComplete="off"
                                autoCorrect="off"
                                spellCheck={false}
                            />
                            <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-slate-500">
                                ESC
                            </kbd>
                        </div>

                        {/* Results */}
                        <div ref={listRef} className="max-h-[50vh] overflow-y-auto overscroll-contain py-2" style={{ scrollbarWidth: 'none' }}>
                            {results.length === 0 ? (
                                <div className="px-5 py-8 text-center">
                                    <p className="text-sm text-slate-500 italic">No results for "{query}"</p>
                                </div>
                            ) : (
                                Object.entries(groupedResults).map(([category, items]) => (
                                    <div key={category}>
                                        <div className="px-5 pt-3 pb-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                                            {category}
                                        </div>
                                        {items.map((item) => (
                                            <button
                                                key={`${item.type}-${item.id}`}
                                                onClick={() => handleSelect(item)}
                                                onMouseEnter={() => setActiveIndex(item.globalIndex)}
                                                className={`w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors ${
                                                    item.globalIndex === activeIndex
                                                        ? 'bg-white/5 text-white'
                                                        : 'text-slate-400 hover:bg-white/[0.03]'
                                                }`}
                                            >
                                                {getIcon(item)}
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-bold truncate">{item.label}</div>
                                                    {item.sublabel && (
                                                        <div className="text-[11px] text-slate-500 truncate">{item.sublabel}</div>
                                                    )}
                                                </div>
                                                {item.globalIndex === activeIndex && (
                                                    <kbd className="hidden sm:flex items-center px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-slate-500">
                                                        ↵
                                                    </kbd>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center gap-4 px-5 py-2.5 border-t border-white/5 text-[10px] text-slate-600">
                            <span className="flex items-center gap-1.5">
                                <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10 font-mono">↑↓</kbd>
                                navigate
                            </span>
                            <span className="flex items-center gap-1.5">
                                <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10 font-mono">↵</kbd>
                                select
                            </span>
                            <span className="flex items-center gap-1.5">
                                <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10 font-mono">esc</kbd>
                                close
                            </span>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
