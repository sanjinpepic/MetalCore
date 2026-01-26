import React from 'react';

const KnifeDetailModal = ({ knife, onClose, onOpenSteel }) => {
    if (!knife) return null;

    // Helper to extract clean name for matching
    const cleanImage = knife.image?.replace('file:///', '') || '';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 bg-black/80 backdrop-blur-md" onClick={onClose}>
            <div className="relative w-full h-full md:h-auto md:max-w-5xl md:min-h-[700px] bg-[#0a0a0b] md:border md:border-white/10 md:rounded-3xl shadow-2xl overflow-y-auto custom-scrollbar flex flex-col md:flex-row md:items-stretch max-h-screen md:max-h-[90vh] animate-in fade-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>

                {/* Image Section */}
                <div className="w-full md:w-1/2 min-h-[40vh] bg-white/5 relative group shrink-0">
                    {cleanImage ? (
                        <img
                            src={cleanImage}
                            alt={knife.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/10">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
                                <line x1="13" y1="19" x2="19" y2="13" />
                                <line x1="16" y1="16" x2="20" y2="20" />
                                <line x1="19" y1="21" x2="21" y2="19" />
                            </svg>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#0a0a0b]" />

                    <button
                        onClick={onClose}
                        className="absolute top-6 left-6 p-3 bg-black/50 hover:bg-black/80 rounded-full text-white/70 hover:text-white transition-all backdrop-blur-md md:hidden border border-white/10 z-50"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                        </svg>
                    </button>

                    <div className="absolute bottom-6 left-8 md:hidden">
                        <div className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] mb-1.5">{knife.maker}</div>
                        <h2 className="text-2xl font-black font-display text-white italic tracking-tight leading-none uppercase">{knife.name}</h2>
                    </div>
                </div>

                {/* Content Section */}
                <div className="w-full md:w-1/2 p-6 md:p-10 relative">
                    <div className="hidden md:block absolute top-6 right-6 z-50">
                        <button
                            onClick={onClose}
                            className="p-2.5 bg-black/40 hover:bg-white/10 rounded-full text-slate-500 hover:text-white transition-all border border-white/10 backdrop-blur-3xl group"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:rotate-90 transition-transform">
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="mb-10 hidden md:block">
                        <div className="text-xs font-bold text-accent uppercase tracking-widest mb-2">{knife.maker}</div>
                        <h2 className="text-3xl md:text-5xl font-black font-display text-white mb-4 italic tracking-tight uppercase leading-none">{knife.name}</h2>
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">
                            {knife.category}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="md:hidden flex">
                            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                {knife.category}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs md:text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-3">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-500">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                </svg>
                                Design Philosophy
                            </h3>
                            <p className="text-slate-400 leading-relaxed text-xs md:text-sm font-medium italic">
                                {knife.description}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xs md:text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-3">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-accent">
                                    <path d="M12 2v20" />
                                    <path d="M2 12h20" />
                                    <path d="m4.93 4.93 14.14 14.14" />
                                    <path d="m19.07 4.93-14.14 14.14" />
                                </svg>
                                The "Buy It" Factor
                            </h3>
                            <div className="p-6 md:p-8 bg-white/5 border border-white/10 rounded-[2rem] shadow-xl">
                                <p className="text-slate-200 leading-relaxed text-sm md:text-base font-bold italic">
                                    "{knife.whySpecial}"
                                </p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs md:text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-3">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-blue-400">
                                    <line x1="6" y1="3" x2="6" y2="15" />
                                    <circle cx="18" cy="6" r="3" />
                                    <circle cx="6" cy="18" r="3" />
                                    <path d="M18 9a9 9 0 0 1-9 9" />
                                </svg>
                                Available Steels
                            </h3>
                            <div className="flex flex-wrap gap-2 md:gap-3 pb-8 md:pb-0">
                                {knife.steels.map(steelName => (
                                    <button
                                        key={steelName}
                                        onClick={() => onOpenSteel(steelName)}
                                        className="px-4 py-2.5 bg-white/5 hover:bg-accent hover:text-black border border-white/10 rounded-xl text-xs font-bold text-slate-300 transition-all group flex items-center gap-2.5 active:scale-95"
                                    >
                                        {steelName}
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all">
                                            <path d="M5 12h14" />
                                            <path d="m12 5 7 7-7 7" />
                                        </svg>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {knife.link && (
                            <div className="pt-8 border-t border-white/10 text-center md:text-left pb-16 md:pb-0">
                                <a
                                    href={knife.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2.5 text-[10px] md:text-xs font-bold text-slate-500 hover:text-accent transition-colors uppercase tracking-[0.2em]"
                                >
                                    Visit Manufacturer Page
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                        <polyline points="15 3 21 3 21 9" />
                                        <line x1="10" y1="14" x2="21" y2="3" />
                                    </svg>
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KnifeDetailModal;
