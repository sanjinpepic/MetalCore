import React from 'react';

const AIAnalystPanel = ({ aiOpen, setAiOpen, aiChat, isAiLoading, aiQuery, setAiQuery, askAi }) => {
    return (
        <div className={`fixed top-0 right-0 h-full w-full md:w-[400px] glass-panel border-l border-white/10 z-[110] transition-transform duration-500 ease-in-out ${aiOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex flex-col h-full bg-black/95 backdrop-blur-3xl">
                <header className="p-4 md:p-6 border-b border-white/5 flex items-center justify-between pt-16 md:pt-6 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 md:p-2 bg-indigo-500/10 rounded-lg md:rounded-xl">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-indigo-400">
                                <rect x="3" y="11" width="18" height="10" rx="2" />
                                <circle cx="12" cy="5" r="2" />
                                <path d="M12 7v4" />
                            </svg>
                        </div>
                        <h3 className="font-display font-black text-white uppercase tracking-tighter italic text-sm md:text-base">Ferry - AI Analyst</h3>
                    </div>
                    <button onClick={() => setAiOpen(false)} className="p-2 hover:bg-white/5 bg-white/5 rounded-full text-slate-500 hover:text-white transition-all border border-white/5">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar">
                    {aiChat.length === 0 && (
                        <div className="text-center py-24 space-y-4">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-indigo-500/20 mx-auto">
                                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                            </svg>
                            <p className="text-slate-500 text-sm md:text-base px-10 leading-relaxed font-medium">Hello, my name is Ferry! Ask me anything about blade steels, use cases, or chemistry. I can also trigger comparisons automatically.</p>
                        </div>
                    )}
                    {aiChat.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[90%] p-4 md:p-5 rounded-2xl text-sm md:text-base leading-relaxed ${msg.role === 'user' ? 'bg-accent text-black font-bold rounded-tr-none' : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none font-medium'}`}>
                                {msg.isReport && (
                                    <div className="text-[9px] font-black text-indigo-400 mb-2 uppercase tracking-widest flex items-center gap-2">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
                                            <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
                                        </svg>
                                        Analytical Report
                                    </div>
                                )}
                                <div className="prose prose-invert prose-slate max-w-none">
                                    {msg.content.split('\n').map((line, j) => <p key={j} className="mb-3 last:mb-0">{line}</p>)}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isAiLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none flex items-center gap-4">
                                <div className="flex gap-1">
                                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                </div>
                                <span className="text-xs md:text-sm text-slate-500 font-bold italic tracking-tighter">Analyzing...</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 md:p-8 border-t border-white/5 bg-black/40">
                    <div className="relative">
                        <textarea
                            placeholder="Ask about a steel..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pr-12 text-sm md:text-base text-white outline-none focus:border-indigo-500/50 transition-all resize-none h-32 md:h-36 font-medium placeholder:text-slate-600"
                            value={aiQuery}
                            onChange={e => setAiQuery(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), askAi())}
                        />
                        <button
                            onClick={() => askAi()}
                            disabled={isAiLoading || !aiQuery.trim()}
                            className="absolute bottom-5 right-5 p-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-400 disabled:opacity-50 disabled:grayscale transition-all shadow-lg shadow-indigo-500/40 active:scale-95"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="22" y1="2" x2="11" y2="13" />
                                <polygon points="22 2 15 22 11 13 2 9 22 2" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIAnalystPanel;
