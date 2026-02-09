import React from 'react';
import { useSettings } from '../context/SettingsContext';

const SettingsModal = ({ onClose }) => {
    const { unitSystem, setUnitSystem } = useSettings();

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl transition-all" onClick={onClose}>
            <div className="glass-strong w-full md:max-w-lg p-8 rounded-[2rem] shadow-2xl relative" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-white/5 rounded-lg">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        </div>
                        <h3 className="font-display font-black text-white uppercase tracking-tighter italic text-sm md:text-base">Settings</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-500 transition-all">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest block">Unit System</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setUnitSystem('metric')}
                                className={`p-4 rounded-xl text-xs md:text-sm font-black uppercase tracking-wider transition-all ${
                                    unitSystem === 'metric'
                                        ? 'bg-accent text-black shadow-lg shadow-accent/20 border border-accent'
                                        : 'bg-white/5 text-slate-400 border border-white/10 hover:border-white/20'
                                }`}
                            >
                                Metric (°C)
                            </button>
                            <button
                                onClick={() => setUnitSystem('imperial')}
                                className={`p-4 rounded-xl text-xs md:text-sm font-black uppercase tracking-wider transition-all ${
                                    unitSystem === 'imperial'
                                        ? 'bg-accent text-black shadow-lg shadow-accent/20 border border-accent'
                                        : 'bg-white/5 text-slate-400 border border-white/10 hover:border-white/20'
                                }`}
                            >
                                Imperial (°F)
                            </button>
                        </div>
                        <p className="text-[9px] md:text-[10px] text-slate-500 leading-relaxed italic font-medium">
                            Choose your preferred temperature unit for heat treatment data.
                        </p>
                    </div>

                    <button onClick={onClose} className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.2em] rounded-xl text-xs md:text-sm hover:bg-accent transition-all duration-300 shadow-lg shadow-white/10 active:scale-[0.98]">Save Settings</button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
