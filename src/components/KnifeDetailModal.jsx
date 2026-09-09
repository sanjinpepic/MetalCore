import React from 'react';
import BottomSheet from './BottomSheet';

const normalize = (val) => {
    if (typeof val !== 'string') return "";
    return val.toLowerCase()
        .replace(/cpm[- ]?/, "")
        .replace(/böhler |bohler /, "")
        .replace(/sandvik |alleima |alleima-/, "")
        .replace(/[ \-]/g, "")
        .trim();
};

const SectionLabel = ({ index, title }) => (
    <div className="flex items-center gap-3 mb-5">
        <span className="text-[9px] font-mono font-semibold text-accent/70 shrink-0">{index}</span>
        <h3 className="text-[10px] md:text-xs font-mono font-medium text-stone-300 uppercase tracking-[0.3em] whitespace-nowrap">{title}</h3>
        <div className="flex-1 h-px bg-white/5" />
    </div>
);

const KnifeDetailModal = ({ knife, onClose, onOpenSteel, allSteels = [] }) => {
    if (!knife) return null;

    return (
        <BottomSheet isOpen={!!knife} onClose={onClose} label={`${knife?.name ?? 'Knife'} details`}>
            <div className="relative max-w-4xl mx-auto">
                {/* Dossier Header */}
                <header className="relative pt-2 pb-8 border-b border-white/10">
                    <div className="absolute top-1 right-0 z-50">
                        <button
                            onClick={onClose}
                            aria-label="Close details"
                            className="w-10 h-10 flex items-center justify-center bg-black/40 hover:bg-white/10 rounded-full text-stone-500 hover:text-white transition-all duration-300 ease-snap border border-white/10 backdrop-blur-3xl group"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:rotate-90 transition-transform duration-300 ease-snap">
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="text-xs font-mono font-medium text-accent uppercase tracking-[0.3em] mb-3 pr-24">{knife.maker}</div>
                    <div className="flex items-center gap-4 flex-wrap pr-24 mb-4">
                        <h2 className="text-3xl md:text-5xl font-display text-white tracking-tight uppercase leading-none">{knife.name}</h2>
                    </div>
                    {knife.category && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[9px] font-mono font-medium text-stone-400 uppercase tracking-[0.25em]">
                            {knife.category}
                        </span>
                    )}
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-10 pt-10">
                    {/* 01/02 — Philosophy & Pull Quote */}
                    <div className="lg:col-span-7 space-y-12">
                        <section>
                            <SectionLabel index="01" title="Design Philosophy" />
                            <p className="text-stone-400 leading-relaxed text-sm font-medium">
                                {knife.description}
                            </p>
                        </section>

                        <section>
                            <SectionLabel index="02" title="The Buy-It Factor" />
                            <blockquote className="pl-6 border-l-2 border-accent">
                                <p className="text-stone-100 leading-relaxed text-base md:text-lg font-medium">
                                    {knife.whySpecial}
                                </p>
                            </blockquote>
                        </section>
                    </div>

                    {/* 03 — Steel Configurations ledger */}
                    <div className="lg:col-span-5">
                        <section>
                            <SectionLabel index="03" title="Steel Configurations" />
                            <div className="flex flex-col gap-2">
                                {knife.steels.map((steel, i) => {
                                    const steelName = typeof steel === 'string' ? steel : steel.name;
                                    const data = allSteels.find(s => normalize(s.name) === normalize(steelName));
                                    return (
                                        <button
                                            key={steelName}
                                            onClick={() => onOpenSteel(steelName)}
                                            className="w-full flex items-center gap-3.5 px-4 py-3.5 bg-white/[0.03] hover:bg-accent/[0.06] border border-white/[0.07] hover:border-accent/30 rounded-xl text-left transition-all duration-300 ease-snap group active:scale-[0.99]"
                                        >
                                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${data?.pm ? 'bg-accent shadow-ember-sm' : 'bg-stone-600'}`} />
                                            <span className="text-sm font-display text-white group-hover:text-accent uppercase tracking-tight transition-colors duration-300 truncate flex-1">{steelName}</span>
                                            {data && (
                                                <span className="hidden sm:flex items-center gap-2.5 font-mono text-[10px] text-stone-500 shrink-0">
                                                    <span><span className="text-stone-700">C</span> <span className="text-stone-300 font-semibold">{data.C}</span></span>
                                                    <span><span className="text-stone-700">Cr</span> <span className="text-stone-300 font-semibold">{data.Cr}</span></span>
                                                    {data.V > 0 && <span><span className="text-stone-700">V</span> <span className="text-stone-300 font-semibold">{data.V}</span></span>}
                                                </span>
                                            )}
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-stone-600 group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-300 shrink-0">
                                                <path d="M5 12h14" />
                                                <path d="m12 5 7 7-7 7" />
                                            </svg>
                                        </button>
                                    );
                                })}
                            </div>

                            {knife.link && (
                                <a
                                    href={knife.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-6 inline-flex items-center gap-2.5 text-[10px] font-mono font-medium text-stone-500 hover:text-accent transition-colors duration-300 ease-snap uppercase tracking-[0.25em]"
                                >
                                    Visit Manufacturer Page
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                        <polyline points="15 3 21 3 21 9" />
                                        <line x1="10" y1="14" x2="21" y2="3" />
                                    </svg>
                                </a>
                            )}
                        </section>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-stone-700 uppercase tracking-[0.4em] font-medium">
                    <span>{knife.maker}</span>
                    <span>Armory Registry</span>
                </div>
            </div>
        </BottomSheet>
    );
};

export default KnifeDetailModal;
