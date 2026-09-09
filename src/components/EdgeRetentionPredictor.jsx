import React, { useMemo } from 'react';

const EdgeRetentionPredictor = ({ steel }) => {
    // A simplified but scientifically-inspired algorithm for edge retention (CATRA)
    // Primary factors: Carbon (C) for hardness potential, Vanadium (V) for hard carbides.
    const prediction = useMemo(() => {
        const c = steel.C || 0;
        const v = steel.V || 0;
        const cr = steel.Cr || 0;

        // Base score from Carbon
        let score = c * 15;
        // Vanadium is a huge multiplier for wear resistance
        score += v * 45;
        // Chromium adds some wear resistance but less than V
        score += cr * 2;

        // Normalize to a 1-100 scale for the UI
        const normalized = Math.min(100, Math.max(10, (score / 4.5)));

        let label = "Standard";
        let color = "text-stone-400";
        if (normalized > 85) { label = "Extreme"; color = "text-accent"; }
        else if (normalized > 70) { label = "Elite"; color = "text-accent-300"; }
        else if (normalized > 50) { label = "High"; color = "text-stone-200"; }

        return { score: Math.round(normalized), label, color };
    }, [steel]);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-[10px] font-mono font-medium text-stone-500 uppercase tracking-[0.2em] mb-1">Predicted Edge Life</div>
                    <div className={`text-2xl font-display uppercase tracking-tight ${prediction.color}`}>
                        {prediction.label}
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-mono font-bold text-white">{prediction.score}</div>
                    <div className="text-[8px] text-stone-600 font-mono font-medium uppercase tracking-[0.2em]">CATRA Index</div>
                </div>
            </div>

            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div
                    className="h-full bg-gradient-to-r from-[#C53A0C] via-[#FF5A1F] to-[#FFD9A8] shadow-ember-sm transition-colors duration-1000 ease-out-expo"
                    style={{ width: `${prediction.score}%` }}
                />
            </div>

            <p className="text-[10px] text-stone-500 leading-relaxed">
                *Algorithmic estimation based on {steel.C}% Carbon and {steel.V}% Vanadium content. Actual results vary by heat treat.
            </p>
        </div>
    );
};

export default EdgeRetentionPredictor;
