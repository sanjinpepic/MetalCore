import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import PerformanceRadar from './PerformanceRadar';

const ShareCard = React.forwardRef(({ steel, onGenerated, hideButton = false }, ref) => {
    const cardRef = useRef(null);
    const [generating, setGenerating] = useState(false);

    const generateImage = async () => {
        if (!cardRef.current) return;
        setGenerating(true);
        try {
            // Double rAF ensures two full paint cycles complete before capture —
            // critical on mobile where the browser may not have painted yet.
            await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
            const dataUrl = await toPng(cardRef.current, {
                quality: 1,
                // Cap at 2× — larger values can exceed iOS Safari's canvas size limit
                pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
                backgroundColor: '#000000',
                cacheBust: true,
            });
            onGenerated(dataUrl);
        } catch (err) {
            console.error('Failed to generate image', err);
        } finally {
            setGenerating(false);
        }
    };

    React.useImperativeHandle(ref, () => ({
        generateImage,
        isGenerating: generating
    }));

    if (!steel) return null;

    return (
        <div className="flex flex-col items-center">
            {/* Action Button */}
            {!hideButton && (
                <button
                    onClick={generateImage}
                    disabled={generating}
                    className="w-full py-4 bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-black font-black uppercase text-xs tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-accent/20 active:scale-[0.98] flex items-center justify-center gap-3 mb-6"
                >
                    {generating ? (
                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                    )}
                    {generating ? 'Generating Card...' : 'Generate Performance Card'}
                </button>
            )}

            {/* The Actual Card — must stay near the viewport origin so mobile browsers paint it */}
            <div className="fixed top-0 left-0 opacity-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }}>
                <div
                    ref={cardRef}
                    className="w-[1080px] h-[1080px] bg-black p-20 flex flex-col justify-between relative overflow-hidden font-sans"
                    style={{ backgroundImage: 'radial-gradient(circle at 0px 0px, rgba(245, 158, 11, 0.15) 0%, transparent 50%), radial-gradient(circle at 1080px 1080px, rgba(99, 102, 241, 0.15) 0%, transparent 50%)' }}
                >
                    {/* MetalCore Branding Overlay */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{
                            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                            backgroundSize: '100px 100px'
                        }}
                    />

                    {/* Header */}
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <div className="text-2xl font-black text-accent uppercase tracking-[0.4em] mb-4">
                                {steel.parent ?? steel.producer}
                            </div>
                            <h1 className="text-9xl font-black text-white italic uppercase tracking-tighter leading-none mb-4">
                                {steel.name}
                            </h1>
                            <div className="px-6 py-2 bg-white/5 border border-white/10 rounded-full inline-block">
                                <span className="text-xl font-black text-slate-400 uppercase tracking-widest italic">
                                    {steel.pm ? 'Powder Metallurgy Grade' : 'Conventional Alloy'}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="text-accent font-black text-4xl tracking-tighter italic">METALCORE</div>
                            <div className="text-slate-600 font-bold text-sm tracking-[0.5em] uppercase mt-1 text-right">System v2.5</div>
                        </div>
                    </div>

                    {/* Performance Profile */}
                    <div className="relative z-10 flex-1 flex items-center justify-between gap-10">
                        <div className="w-[550px] transform scale-125">
                            <PerformanceRadar items={[steel]} compact={true} noContainer={true} noTitle={true} cardView={true} />
                        </div>

                        <div className="w-[400px] space-y-12">
                            <div>
                                <div className="text-xl font-black text-emerald-500 uppercase tracking-[0.3em] mb-6">Strengths</div>
                                <div className="space-y-6">
                                    {steel.pros?.slice(0, 3).map((p, i) => (
                                        <div key={i} className="flex items-start gap-4">
                                            <div className="w-3 h-3 rounded-full bg-emerald-500 mt-2 shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                                            <span className="text-2xl text-slate-200 font-bold italic leading-tight">{p}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Composition Quick-View */}
                            <div className="grid grid-cols-2 gap-4">
                                {['C', 'Cr', 'V', 'Mo'].map(el => (
                                    <div key={el} className="bg-white/[0.03] border border-white/5 rounded-3xl p-6">
                                        <div className="text-sm font-black text-slate-500 uppercase tracking-widest mb-1">{el}</div>
                                        <div className="text-3xl font-mono font-black text-white">{steel[el] || 0}%</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="relative z-10 pt-10 border-t border-white/10 flex justify-between items-end">
                        <div className="max-w-2xl">
                            <div className="text-xs font-black text-slate-600 uppercase tracking-widest mb-2">Optimal Deployment</div>
                            <p className="text-2xl text-slate-400 font-medium italic leading-relaxed line-clamp-2">
                                "{steel.use_case}"
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Access At</div>
                            <div className="text-2xl font-black text-white italic tracking-tight">metalcre.vercel.app</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default ShareCard;
