import React, { useState } from 'react';

const ShareCard = React.forwardRef(({ steel, onGenerated, hideButton = false }, ref) => {
    const [generating, setGenerating] = useState(false);

    const generateImage = async () => {
        if (!steel) return;
        setGenerating(true);
        try {
            const parent = Array.isArray(steel.parent) ? steel.parent[0] : steel.parent;
            const params = new URLSearchParams({
                name:      steel.name,
                producer:  steel.producer,
                parent:    parent || '',
                pm:        steel.pm ? 'true' : 'false',
                edge:      steel.edge      ?? 0,
                toughness: steel.toughness ?? 0,
                corrosion: steel.corrosion ?? 0,
                sharpen:   steel.sharpen   ?? 0,
                C:         steel.C  ?? 0,
                Cr:        steel.Cr ?? 0,
                V:         steel.V  ?? 0,
                Mo:        steel.Mo ?? 0,
                W:         steel.W  ?? 0,
                Co:        steel.Co ?? 0,
                use_case:  steel.use_case || '',
            });

            const res = await fetch(`/api/steel-card?${params}`);
            if (!res.ok) throw new Error(`API error ${res.status}`);

            const blob = await res.blob();
            const dataUrl = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });

            onGenerated(dataUrl);
        } catch (err) {
            console.error('Failed to generate card', err);
        } finally {
            setGenerating(false);
        }
    };

    React.useImperativeHandle(ref, () => ({ generateImage, isGenerating: generating }));

    if (!steel) return null;

    if (hideButton) return null;

    return (
        <button
            onClick={generateImage}
            disabled={generating}
            className="w-full py-4 bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-black font-black uppercase text-xs tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-accent/20 active:scale-[0.98] flex items-center justify-center gap-3"
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
    );
});

export default ShareCard;
