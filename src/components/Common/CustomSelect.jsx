'use client'

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomSelect = ({
    options,
    value,
    onChange,
    placeholder = 'Select Steel...',
    className = '',
    accentColor = 'indigo'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    const containerRef = useRef(null);
    const inputRef = useRef(null);
    const listRef = useRef(null);

    const selectedOption = useMemo(() =>
        options.find(opt => opt.id === value),
        [options, value]);

    const filteredOptions = useMemo(() =>
        options.filter(opt =>
            opt.name.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        [options, searchTerm]);

    // Reset highlight when filter changes
    useEffect(() => {
        setHighlightedIndex(filteredOptions.length > 0 ? 0 : -1);
    }, [searchTerm, filteredOptions.length]);

    // Handle clicks outside the component
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Ensure highlighted item is in view
    useEffect(() => {
        if (isOpen && highlightedIndex >= 0 && listRef.current) {
            const listElement = listRef.current;
            const highlightedEl = listElement.children[highlightedIndex];

            if (highlightedEl) {
                const listRect = listElement.getBoundingClientRect();
                const elRect = highlightedEl.getBoundingClientRect();

                if (elRect.bottom > listRect.bottom) {
                    listElement.scrollTop += elRect.bottom - listRect.bottom;
                } else if (elRect.top < listRect.top) {
                    listElement.scrollTop -= listRect.top - elRect.top;
                }
            }
        }
    }, [highlightedIndex, isOpen]);

    const handleMainButtonKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
            e.preventDefault();
            setIsOpen(true);
        }
    };

    const handleInputKeyDown = (e) => {
        if (!isOpen) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(prev =>
                    prev < filteredOptions.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0);
                break;
            case 'Enter':
                e.preventDefault();
                if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
                    onChange(filteredOptions[highlightedIndex]);
                    setIsOpen(false);
                }
                break;
            case 'Escape':
                e.preventDefault();
                setIsOpen(false);
                break;
            default:
                break;
        }
    };

    const colors = {
        indigo: {
            border: 'border-indigo-500/30',
            bg: 'bg-indigo-500/5',
            text: 'text-indigo-400',
            glow: 'shadow-[0_0_15px_rgba(99,102,241,0.1)]',
            accent: 'bg-indigo-500',
            highlight: 'bg-indigo-500/20'
        },
        emerald: {
            border: 'border-emerald-500/30',
            bg: 'bg-emerald-500/5',
            text: 'text-emerald-400',
            glow: 'shadow-[0_0_15px_rgba(16,185,129,0.1)]',
            accent: 'bg-emerald-500',
            highlight: 'bg-emerald-500/20'
        }
    };

    const activeColor = colors[accentColor] || colors.indigo;

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <button
                type="button"
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen) {
                        setSearchTerm('');
                        // Pre-highlight the currently selected option if it exists
                        const idx = filteredOptions.findIndex(opt => opt.id === value);
                        setHighlightedIndex(idx >= 0 ? idx : 0);
                    }
                }}
                onKeyDown={handleMainButtonKeyDown}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-label={selectedOption ? `Selected: ${selectedOption.name}` : placeholder}
                className={`w-full bg-white/5 border ${isOpen ? 'border-white/20' : 'border-white/10'} rounded-2xl px-5 py-4 flex items-center justify-between group transition-all hover:bg-white/[0.07] ${isOpen ? activeColor.glow : ''} focus:outline-none focus:ring-2 focus:ring-${accentColor}-500/50`}
            >
                <div className="flex flex-col items-start">
                    <span className="text-sm font-black text-white uppercase tracking-tight italic">
                        {selectedOption ? selectedOption.name : placeholder}
                    </span>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    className="text-slate-500 group-hover:text-white transition-colors"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </motion.div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute z-[100] top-full mt-3 w-full bg-[#0a0a0b] border border-white/10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-3xl"
                    >
                        <div className="p-3 border-b border-white/5">
                            <div className="relative">
                                <input
                                    ref={inputRef}
                                    autoFocus
                                    type="text"
                                    placeholder="Search steels..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={handleInputKeyDown}
                                    className="w-full bg-white/5 border border-white/5 rounded-xl px-10 py-3 text-xs font-black text-white uppercase tracking-widest outline-none focus:border-indigo-500/50 transition-all"
                                />
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div
                            ref={listRef}
                            role="listbox"
                            className="max-h-[300px] overflow-y-auto custom-scrollbar p-2 scroll-smooth"
                        >
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((opt, index) => {
                                    const isHighlighted = index === highlightedIndex;
                                    const isSelected = opt.id === value;

                                    return (
                                        <button
                                            key={opt.id}
                                            role="option"
                                            aria-selected={isSelected}
                                            onClick={() => {
                                                onChange(opt);
                                                setIsOpen(false);
                                            }}
                                            onMouseEnter={() => setHighlightedIndex(index)}
                                            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all group outline-none
                                                ${isSelected ? 'bg-white/5' : ''}
                                                ${isHighlighted && !isSelected ? activeColor.highlight : ''}
                                                ${!isSelected && !isHighlighted ? 'hover:bg-white/5' : ''}
                                            `}
                                        >
                                            <div className="flex flex-col items-start">
                                                <span className={`text-sm font-black uppercase italic tracking-tight 
                                                    ${isSelected ? activeColor.text : ''} 
                                                    ${isHighlighted && !isSelected ? 'text-white' : ''}
                                                    ${!isSelected && !isHighlighted ? 'text-slate-400 group-hover:text-white' : ''}
                                                `}>
                                                    {opt.name}
                                                </span>
                                                {opt.producer && (
                                                    <span className={`text-[9px] font-black uppercase tracking-widest ${isSelected ? activeColor.text + '/70' : 'text-slate-600'}`}>
                                                        {opt.producer}
                                                    </span>
                                                )}
                                            </div>
                                            {isSelected && (
                                                <motion.div layoutId="check" className={activeColor.text}>
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                </motion.div>
                                            )}
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="py-8 text-center">
                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">No specimens matched</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
};

export default CustomSelect;
