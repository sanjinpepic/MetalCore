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
    const containerRef = useRef(null);

    const selectedOption = useMemo(() =>
        options.find(opt => opt.id === value),
        [options, value]);

    const filteredOptions = useMemo(() =>
        options.filter(opt =>
            opt.name.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        [options, searchTerm]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const colors = {
        indigo: {
            border: 'border-indigo-500/30',
            bg: 'bg-indigo-500/5',
            text: 'text-indigo-400',
            glow: 'shadow-[0_0_15px_rgba(99,102,241,0.1)]',
            accent: 'bg-indigo-500'
        },
        emerald: {
            border: 'border-emerald-500/30',
            bg: 'bg-emerald-500/5',
            text: 'text-emerald-400',
            glow: 'shadow-[0_0_15px_rgba(16,185,129,0.1)]',
            accent: 'bg-emerald-500'
        }
    };

    const activeColor = colors[accentColor] || colors.indigo;

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <button
                type="button"
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen) setSearchTerm('');
                }}
                className={`w-full bg-white/5 border ${isOpen ? 'border-white/20' : 'border-white/10'} rounded-2xl px-5 py-4 flex items-center justify-between group transition-all hover:bg-white/[0.07] ${isOpen ? activeColor.glow : ''}`}
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
                                    autoFocus
                                    type="text"
                                    placeholder="Search steels..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-white/5 border border-white/5 rounded-xl px-10 py-3 text-xs font-black text-white uppercase tracking-widest outline-none focus:border-indigo-500/50 transition-all"
                                />
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-2">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((opt) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => {
                                            onChange(opt);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all group ${opt.id === value ? 'bg-white/5' : 'hover:bg-white/5'}`}
                                    >
                                        <div className="flex flex-col items-start">
                                            <span className={`text-sm font-black uppercase italic tracking-tight ${opt.id === value ? activeColor.text : 'text-slate-400 group-hover:text-white'}`}>
                                                {opt.name}
                                            </span>
                                            {opt.producer && (
                                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
                                                    {opt.producer}
                                                </span>
                                            )}
                                        </div>
                                        {opt.id === value && (
                                            <motion.div layoutId="check" className={activeColor.text}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            </motion.div>
                                        )}
                                    </button>
                                ))
                            ) : (
                                <div className="py-8 text-center">
                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">No specimens matched</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomSelect;
