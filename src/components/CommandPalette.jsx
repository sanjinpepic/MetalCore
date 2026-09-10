'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { hapticFeedback } from '../hooks/useMobile';
import { parseCompositionString, scoreAlloyMatch } from '../lib/alloyMatch';

const VIEWS = [
    { id: 'HOME', label: 'Dashboard', type: 'nav', icon: <><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></> },
    { id: 'SEARCH', label: 'Grade Library', type: 'nav', icon: <><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></> },
    { id: 'MATRIX', label: 'Performance', type: 'nav', icon: <><line x1="21" y1="10" x2="3" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="21" y1="18" x2="3" y2="18" /></> },
    { id: 'KNIVES', label: 'Knife Library', type: 'nav', icon: <><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" /><line x1="13" y1="19" x2="19" y2="13" /><line x1="16" y1="16" x2="20" y2="20" /><line x1="19" y1="21" x2="21" y2="19" /></> },
    { id: 'EDUCATION', label: 'Academy', type: 'nav', icon: <><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5z" /><path d="M12 2v20" /></> },
    { id: 'COMPARE', label: 'Compare Steels', type: 'nav', icon: <><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /><path d="M12 11h4" /><path d="M12 16h4" /><path d="M8 11h.01" /><path d="M8 16h.01" /></> },
];

const ACTIONS = [
    { id: 'ai', label: 'Ask Ferry AI', type: 'action', icon: <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /> },
    { id: 'settings', label: 'Open Settings', type: 'action', icon: <><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></> },
];

export default function CommandPalette({ isOpen, onClose, steels = [], knives = [], onNavigate, onOpenSteel, onOpenKnife, onAction }) {
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef(null);
    const listRef = useRef(null);

    const normalize = (str) => {
        if (typeof str !== 'string') return '';
        return str.toLowerCase()
            .replace(/cpm[- ]?/, "")
            .replace(/böhler |bohler /, "")
            .replace(/sandvik |alleima |alleima-/, "")
            .replace(/[\s-]/g, "");
    };

    // Chemical filter parser — matches "El:op value" e.g. "C:>3", "Cr:~15", "Mo:4%"
    // Supported elements map to steel object keys
    const CHEM_ELEMENTS = { c: 'C', cr: 'Cr', v: 'V', mo: 'Mo', w: 'W', co: 'Co', n: 'N', nb: 'Nb' };
    const parseChemFilter = (raw) => {
        // Regex: element : optional-operator value optional-%
        const m = raw.trim().match(/^([a-zA-Z]{1,2})\s*:\s*(>=|<=|[><=~]?)\s*(\d+(?:\.\d+)?)%?$/);
        if (!m) return null;
        const elKey = CHEM_ELEMENTS[m[1].toLowerCase()];
        if (!elKey) return null;
        const op = m[2] || '~';   // default to approximate
        const val = parseFloat(m[3]);
        return { elKey, op, val };
    };

    const matchChem = (steelVal, op, val) => {
        if (steelVal == null) return false;
        switch (op) {
            case '>': return steelVal > val;
            case '<': return steelVal < val;
            case '>=': return steelVal >= val;
            case '<=': return steelVal <= val;
            case '=': return Math.abs(steelVal - val) < 0.01;
            case '~':  // ±25% of value, min band ±0.1
            default: {
                const band = Math.max(val * 0.25, 0.1);
                return Math.abs(steelVal - val) <= band;
            }
        }
    };

    const results = useMemo(() => {
        const queryNorm = normalize(query);

        if (!queryNorm) {
            return [
                ...VIEWS.map(v => ({ ...v, type: 'nav', category: 'Navigation' })),
                ...ACTIONS.map(a => ({ ...a, type: 'action', category: 'Quick Actions' })),
                ...steels.slice(0, 5).map(s => ({
                    type: 'steel',
                    label: s.name,
                    sublabel: s.producer,
                    data: s,
                    category: 'Featured Steels',
                    metalType: s.pm ? 'PM' : 'CONV'
                }))
            ].map((item, i) => ({ ...item, globalIndex: i }));
        }

        // --- Chemical composition filter ---
        const chemFilter = parseChemFilter(query.trim());
        if (chemFilter) {
            const { elKey, op, val } = chemFilter;
            const opLabel = op === '~' ? '≈' : op || '≈';
            const matched = steels
                .filter(s => matchChem(s[elKey], op, val))
                .sort((a, b) => Math.abs(a[elKey] - val) - Math.abs(b[elKey] - val))
                .slice(0, 12)
                .map((s, i) => ({
                    type: 'steel',
                    id: s.id,
                    label: s.name,
                    sublabel: `${s.parent ?? s.producer}  ·  ${elKey}: ${s[elKey]}%`,
                    data: s,
                    category: `${elKey} ${opLabel} ${val}%`,
                    metalType: s.pm ? 'PM' : 'CONV',
                    globalIndex: i
                }));
            return matched;
        }

        // --- Multi-element threshold filter — e.g. "C:>1 Cr:>13" ---
        // Any explicit comparison operator (>, <, >=, <=, =, ~) means threshold mode.
        if (/\b[a-zA-Z]{1,2}\s*[:=\-]?\s*(?:>=|<=|[><=~])\s*\d/.test(query)) {
            const tokenRe = /\b(nb|mo|cr|co|c|v|w|n)\s*[:=\-]?\s*(>=|<=|[><=~])\s*(\d+(?:\.\d+)?)\s*%?/gi;
            const terms = [];
            let tm;
            while ((tm = tokenRe.exec(query)) !== null) {
                const elKey = CHEM_ELEMENTS[tm[1].toLowerCase()];
                if (elKey) terms.push({ elKey, op: tm[2], val: parseFloat(tm[3]) });
            }
            if (terms.length > 0) {
                const matched = steels
                    .filter(s => terms.every(t => matchChem(s[t.elKey], t.op, t.val)))
                    .sort((a, b) =>
                        terms.reduce((acc, t) => acc + Math.abs(a[t.elKey] - t.val), 0) -
                        terms.reduce((acc, t) => acc + Math.abs(b[t.elKey] - t.val), 0)
                    )
                    .slice(0, 12)
                    .map((s, i) => ({
                        type: 'steel',
                        id: s.id,
                        label: s.name,
                        sublabel: `${s.parent ?? s.producer}  ·  ${terms.map(t => `${t.elKey} ${s[t.elKey]}%`).join(' · ')}`,
                        data: s,
                        category: terms.map(t => `${t.elKey} ${t.op === '~' ? '≈' : t.op}${t.val}%`).join(' + '),
                        metalType: s.pm ? 'PM' : 'CONV',
                        globalIndex: i
                    }));
                return matched;
            }
        }

        // --- Multi-element composition target — e.g. "C 1.42, Cr 4" or "C:1.42 Cr:4" ---
        // No comparison operators → treat entered values as a target alloy and
        // rank every steel by closeness (same scoring as the Target Match panel).
        const compQuery = parseCompositionString(query.trim());
        if (compQuery.matched.length > 0) {
            const target = compQuery.target;
            const scored = steels
                .map(s => ({ s, m: scoreAlloyMatch(s, target) }))
                .filter(x => x.m)
                .sort((a, b) => b.m.score - a.m.score)
                .slice(0, 12)
                .map((x, i) => ({
                    type: 'steel',
                    id: x.s.id,
                    label: x.s.name,
                    sublabel: `${x.m.score}% match  ·  ${x.m.deltas.map(d => `${d.el} ${d.delta > 0 ? '+' : ''}${d.delta}`).join(' · ')}`,
                    data: x.s,
                    category: compQuery.matched.length > 1
                        ? 'Composition Match'
                        : `${compQuery.matched[0]} ≈ ${target[compQuery.matched[0]]}%`,
                    metalType: x.s.pm ? 'PM' : 'CONV',
                    globalIndex: i
                }));
            return scored;
        }

        // --- Normal text search ---
        const searchResults = [
            ...VIEWS.filter(v => normalize(v.label).includes(queryNorm))
                .map(v => ({ ...v, type: 'nav', category: 'Navigation' })),
            ...ACTIONS.filter(a => normalize(a.label).includes(queryNorm))
                .map(a => ({ ...a, type: 'action', category: 'Quick Actions' })),
            ...steels.filter(s =>
                normalize(s.name).includes(queryNorm) ||
                normalize(s.producer).includes(queryNorm) ||
                (s.parent && normalize(Array.isArray(s.parent) ? s.parent[0] : s.parent).includes(queryNorm)) ||
                (queryNorm === 'pm' && s.pm) ||
                (queryNorm === 'conventional' || queryNorm === 'conv' && !s.pm)
            )
                .slice(0, 8)
                .map(s => ({
                    type: 'steel',
                    id: s.id,
                    label: s.name,
                    sublabel: s.parent ?? s.producer,
                    data: s,
                    category: 'Steels',
                    metalType: s.pm ? 'PM' : 'CONV'
                })),
            ...knives.filter(k => normalize(k.name).includes(queryNorm))
                .slice(0, 5)
                .map(k => ({ type: 'knife', id: k.id, label: k.name, sublabel: k.brand, data: k, category: 'Knives' }))
        ];

        return searchResults.map((item, i) => ({ ...item, globalIndex: i }));
    }, [query, steels, knives]);

    // Reset active index when results change
    useEffect(() => {
        setActiveIndex(0);
    }, [results.length, query]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setQuery("");
            setActiveIndex(0);
            setIsKeyboard(false);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Scroll active item into view - Only for keyboard navigation
    const [isKeyboard, setIsKeyboard] = useState(false);

    useEffect(() => {
        if (listRef.current && activeIndex >= 0) {
            const activeItem = listRef.current.querySelector(`[data-index="${activeIndex}"]`);
            if (activeItem) {
                activeItem.scrollIntoView({ block: 'nearest', behavior: 'auto' });
            }
        }
    }, [activeIndex]);

    const handleSelect = useCallback((item) => {
        if (!item) return;
        hapticFeedback('medium');

        // Log selection for debugging
        console.log('Command Selection:', item.type, item.id || item.label);

        if (item.type === 'nav') {
            onNavigate(item.id);
        } else if (item.type === 'steel') {
            onOpenSteel(item.data);
        } else if (item.type === 'knife') {
            onOpenKnife(item.data);
        } else if (item.type === 'action') {
            onAction(item.id);
        }

        onClose();
    }, [onClose, onNavigate, onOpenSteel, onOpenKnife, onAction]);

    const handleKeyDown = useCallback((e) => {
        setIsKeyboard(true);
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

    // Portal logic for global centering
    if (typeof window === 'undefined') return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop - High z-index to stay above everything.
                        Zero animation by design: this opens 100+ times a day —
                        speed IS the experience. */}
                    <motion.div
                        key="cmd-backdrop"
                        initial={false}
                        onClick={onClose}
                        className="fixed inset-0 bg-[#0B0A08]/70 backdrop-blur-md z-[9998]"
                        style={{ pointerEvents: 'auto' }}
                    />

                    {/* Palette Container - Viewport absolute centering */}
                    <div className="fixed inset-0 z-[9999] flex justify-center items-start pointer-events-none p-4 pt-[15vh]">
                        <motion.div
                            initial={false}
                            className="pointer-events-auto w-full max-w-xl bg-[#12100D]/95 rounded-2xl border border-white/10 shadow-plate-lg overflow-hidden flex flex-col max-h-[75vh]"
                        >
                            {/* Search Input */}
                            <div className="flex items-center gap-4 px-6 py-5 border-b border-white/5 bg-white/[0.02]">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-accent shrink-0">
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="m21 21-4.35-4.35" />
                                </svg>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Search steels, knives, views…  or try Cr:>15"
                                    className="flex-1 bg-transparent text-bone text-base font-semibold placeholder:text-stone-600 outline-none"
                                    autoComplete="off"
                                    autoCorrect="off"
                                    spellCheck={false}
                                />
                                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono font-medium text-stone-500">
                                    <span className="opacity-60">ESC</span>
                                </div>
                            </div>

                            {/* Results */}
                            <div ref={listRef} className="flex-1 overflow-y-auto overscroll-contain py-3 custom-scrollbar no-scrollbar" style={{ scrollbarWidth: 'none' }}>
                                {results.length === 0 ? (
                                    <div className="px-6 py-12 text-center">
                                        <div className="mb-4 inline-flex p-3 rounded-full bg-white/5 text-stone-600">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                                            </svg>
                                        </div>
                                        <p className="text-sm font-bold text-stone-400">No results for &quot;{query}&quot;</p>
                                        <p className="text-xs text-stone-600 mt-1">Search by name — or match by chemistry: <span className="text-stone-500">C 1.42 Cr 4 · Cr:&gt;15 · C:&gt;1 Cr:&gt;13</span></p>
                                    </div>
                                ) : (
                                    Object.entries(groupedResults).map(([category, items], gi) => (
                                        <div key={category} className="mb-2 last:mb-0">
                                            <div className="px-6 pt-4 pb-2 text-[9px] font-mono font-medium uppercase tracking-[0.3em] text-stone-500 flex items-center gap-2.5">
                                                <span className="text-accent/70 font-semibold shrink-0">{String(gi + 1).padStart(2, '0')}</span>
                                                <span className="whitespace-nowrap">{category}</span>
                                                <span className="text-stone-700">{String(items.length).padStart(2, '0')}</span>
                                                <div className="h-px flex-1 bg-white/5" />
                                            </div>
                                            <div>
                                                {items.map((item) => (
                                                    <button
                                                        key={`${item.type}-${item.id || item.label}`}
                                                        data-index={item.globalIndex}
                                                        onClick={() => handleSelect(item)}
                                                        onMouseMove={() => setIsKeyboard(false)}
                                                        onMouseEnter={() => {
                                                            if (!isKeyboard) setActiveIndex(item.globalIndex);
                                                        }}
                                                        className={`relative w-full flex items-center gap-3 px-6 py-2.5 text-left transition-colors duration-150 ${item.globalIndex === activeIndex
                                                            ? 'bg-accent/[0.07] text-white'
                                                            : 'text-stone-400 hover:bg-white/[0.04]'
                                                            }`}
                                                    >
                                                        {item.globalIndex === activeIndex && (
                                                            <span className="absolute left-0 top-0 h-full w-[2px] bg-accent" />
                                                        )}
                                                        <span className={`text-[9px] font-mono font-semibold w-6 shrink-0 ${item.globalIndex === activeIndex ? 'text-accent' : 'text-stone-700'}`}>{String(item.globalIndex + 1).padStart(2, '0')}</span>
                                                        {item.type === 'steel' && (
                                                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${item.data?.pm ? 'bg-accent shadow-ember-sm' : 'bg-stone-600'}`} />
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <div className={`text-sm font-bold truncate ${item.globalIndex === activeIndex ? 'text-accent' : ''}`}>{item.label}</div>
                                                            {item.sublabel && (
                                                                <div className="text-[11px] text-stone-500 font-medium truncate mt-0.5">{item.sublabel}</div>
                                                            )}
                                                        </div>
                                                        {item.type === 'steel' && item.metalType && (
                                                            <span className="text-[8px] font-mono font-medium tracking-[0.2em] text-stone-600 shrink-0">{item.metalType}</span>
                                                        )}
                                                        {item.globalIndex === activeIndex && (
                                                            <div className="flex items-center gap-1.5 text-accent opacity-60">
                                                                <span className="text-[10px] font-mono font-medium">ENTER</span>
                                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                                    <polyline points="9 10 4 15 9 20" /><path d="M20 4v7a4 4 0 0 1-4 4H4" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Footer Keys */}
                            <div className="flex items-center gap-4 px-6 py-3 border-t border-white/5 text-[9px] font-mono font-medium text-stone-600 uppercase tracking-[0.2em] bg-white/[0.01] flex-wrap">
                                <div className="flex items-center gap-2">
                                    <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-stone-400 font-mono text-[10px]">↑↓</span>
                                    <span>Navigate</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-stone-400 font-mono text-[10px]">↵</span>
                                    <span>Select</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-stone-400 font-mono text-[10px]">ESC</span>
                                    <span>Close</span>
                                </div>
                                <div className="ml-auto text-stone-700 normal-case tracking-normal font-medium">
                                    Chemical match: <span className="text-stone-500">C 1.42 Cr 4 · Cr:&gt;15 · C:&gt;1 Cr:&gt;13</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
