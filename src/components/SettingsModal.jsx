import React from 'react';

const SettingsModal = ({ apiKey, setApiKey, aiModel, setAiModel, onClose }) => {
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl transition-all" onClick={onClose}>
            <div className="glass-panel w-full max-w-md p-8 rounded-[2rem] border border-white/10 shadow-2xl relative" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-white/5 rounded-lg">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
                                <circle cx="12" cy="12" r="3" />
                                <path d="M12 1v6m0 6v6" />
                                <path d="m4.93 4.93 4.24 4.24m5.66 5.66 4.24 4.24" />
                                <path d="M1 12h6m6 0h6" />
                                <path d="m4.93 19.07 4.24-4.24m5.66-5.66 4.24-4.24" />
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
                        <label className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest block">Gemini API Key</label>
                        <input
                            type="password"
                            placeholder="Paste your API key here..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs md:text-sm text-white outline-none focus:border-accent/50 transition-all font-mono shadow-xl"
                            value={apiKey}
                            onChange={e => {
                                setApiKey(e.target.value);
                                localStorage.setItem('metalcore_gemini_key', e.target.value);
                            }}
                        />
                        <p className="text-[9px] md:text-[10px] text-slate-500 leading-relaxed italic font-medium">
                            Get a free API key from the <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-accent underline hover:text-white transition-colors">Google AI Studio</a>. Keys are stored safely in local storage.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest block">Model Selection</label>
                            <div className="flex flex-wrap gap-2">
                                {["gemini-2.0-flash", "gemini-3-flash-preview", "gemini-3-pro-preview"].map(m => (
                                    <button
                                        key={m}
                                        onClick={() => {
                                            setAiModel(m);
                                            localStorage.setItem('metalcore_gemini_model', m);
                                        }}
                                        className={`text-[9px] md:text-[10px] px-2.5 py-1.5 rounded-md border transition-all font-bold uppercase tracking-tight ${aiModel === m ? 'bg-accent text-black border-accent' : 'bg-white/5 border-white/10 text-slate-500 hover:border-white/20'}`}
                                    >
                                        {m.replace('gemini-', '')}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <input
                            type="text"
                            placeholder="e.g. gemini-3-flash-preview"
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs md:text-sm text-white outline-none focus:border-accent/50 transition-all font-mono shadow-xl"
                            value={aiModel}
                            onChange={e => {
                                setAiModel(e.target.value);
                                localStorage.setItem('metalcore_gemini_model', e.target.value);
                            }}
                        />
                        <p className="text-[9px] md:text-[10px] text-slate-500 leading-relaxed italic font-medium">Specify the model ID. Large models offer deeper analysis but may be slower.</p>
                    </div>

                    <button onClick={onClose} className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.2em] rounded-xl text-xs md:text-sm hover:bg-accent transition-all shadow-xl active:scale-[0.98]">Save & Initialize</button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
