import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { hapticFeedback } from '../hooks/useMobile';


const SettingsModal = ({ onClose }) => {
    const { unitSystem, setUnitSystem, dashboardLayout, setDashboardLayout } = useSettings();

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-[#0B0A08]/90 backdrop-blur-xl transition-colors" onClick={onClose}>
            <div className="glass-strong w-full md:max-w-lg p-8 rounded-3xl border border-white/10 shadow-plate-lg relative" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-white/5 border border-white/10 rounded-lg text-stone-400">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        </div>
                        <h3 className="font-display text-white uppercase tracking-tight text-sm md:text-base">Settings</h3>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full text-stone-500 hover:text-stone-300 transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-[10px] md:text-xs font-mono font-medium text-stone-500 uppercase tracking-[0.2em] block">Unit System</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => {
                                    hapticFeedback('light');
                                    setUnitSystem('metric');
                                }}
                                className={`p-4 rounded-xl font-mono text-[10px] md:text-xs font-medium uppercase tracking-[0.2em] transition-colors ${unitSystem === 'metric'
                                    ? 'bg-accent text-[#1A0C05] shadow-ember border border-accent'
                                    : 'bg-white/5 text-stone-400 border border-white/10 hover:bg-white/10 hover:text-stone-200'
                                    }`}
                            >
                                Metric (°C)
                            </button>
                            <button
                                onClick={() => {
                                    hapticFeedback('light');
                                    setUnitSystem('imperial');
                                }}
                                className={`p-4 rounded-xl font-mono text-[10px] md:text-xs font-medium uppercase tracking-[0.2em] transition-colors ${unitSystem === 'imperial'
                                    ? 'bg-accent text-[#1A0C05] shadow-ember border border-accent'
                                    : 'bg-white/5 text-stone-400 border border-white/10 hover:bg-white/10 hover:text-stone-200'
                                    }`}
                            >
                                Imperial (°F)
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3 pt-6 border-t border-white/5">
                        <label className="text-[10px] md:text-xs font-mono font-medium text-stone-500 uppercase tracking-[0.2em] block">Dashboard Layout</label>
                        <div className="grid grid-cols-1 gap-2">
                            {[
                                { id: 'showMatrix', label: 'Performance Matrix', icon: <path d="M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18" /> },
                                { id: 'showSpotlight', label: 'Daily Spotlight', icon: <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /> },
                                { id: 'showCategories', label: 'Steel Categories', icon: <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /> },
                                { id: 'showTrending', label: 'Active Workbench', icon: <path d="M14.5 17.5 3 6 3 3 6 3 17.5 14.5" /> },
                                { id: 'showProLab', label: 'Pro Lab Discovery', icon: <path d="M10 2v7.5M14 2v7.5M8.5 2h7M21 22H3l7-12.5M21 22l-7-12.5" /> }
                            ].map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        hapticFeedback('light');
                                        setDashboardLayout({ [item.id]: !dashboardLayout[item.id] });
                                    }}
                                    className={`w-full p-4 rounded-xl flex items-center justify-between group transition-colors ${dashboardLayout[item.id]
                                        ? 'bg-accent/[0.06] border-accent/25'
                                        : 'bg-white/[0.03] border-white/5 opacity-60'
                                        } border`}
                                >
                                    <div className="flex items-center gap-3">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={dashboardLayout[item.id] ? 'text-accent' : 'text-stone-500'}>
                                            {item.icon}
                                        </svg>
                                        <span className={`text-[11px] font-semibold uppercase tracking-[0.15em] ${dashboardLayout[item.id] ? 'text-bone' : 'text-stone-500'}`}>{item.label}</span>
                                    </div>
                                    <div className={`w-10 h-6 rounded-full relative transition-colors duration-300 ${dashboardLayout[item.id] ? 'bg-accent/90 shadow-ember-sm' : 'bg-white/10'
                                        }`}>
                                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-bone transition-colors duration-300 shadow-md ${dashboardLayout[item.id] ? 'left-5' : 'left-1'
                                            }`} />
                                    </div>


                                </button>
                            ))}
                        </div>
                    </div>



                    <button onClick={onClose} className="w-full py-4 bg-accent text-[#1A0C05] font-mono font-semibold uppercase tracking-[0.25em] rounded-xl text-xs md:text-sm hover:bg-accent/90 transition duration-300 shadow-ember active:scale-[0.98]">Save Settings</button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
