import React, { useState } from 'react';

const ShareCard = React.forwardRef(({ steel, onGenerated, hideButton = false }, ref) => {
    const [generating, setGenerating] = useState(false);

    const generateImage = async () => {
        if (!steel) return;
        setGenerating(true);
        try {
            const W = 1080, H = 1080, PAD = 80;
            const canvas = document.createElement('canvas');
            canvas.width = W;
            canvas.height = H;
            const ctx = canvas.getContext('2d');

            // ── Background ────────────────────────────────────────────────────
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, W, H);

            const g1 = ctx.createRadialGradient(0, 0, 0, 0, 0, 600);
            g1.addColorStop(0, 'rgba(245,158,11,0.18)');
            g1.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g1;
            ctx.fillRect(0, 0, W, H);

            const g2 = ctx.createRadialGradient(W, H, 0, W, H, 600);
            g2.addColorStop(0, 'rgba(99,102,241,0.18)');
            g2.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g2;
            ctx.fillRect(0, 0, W, H);

            // Rounded rect helper (roundRect supported in Chrome 99+, Safari 15.4+, Firefox 112+)
            const rr = (x, y, w, h, r) => {
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, w, h, r);
                else ctx.rect(x, y, w, h);
                ctx.closePath();
            };

            const parent = Array.isArray(steel.parent) ? steel.parent[0] : steel.parent;
            const group = (parent || steel.producer || '').toUpperCase();

            // ── Header ────────────────────────────────────────────────────────
            ctx.textBaseline = 'alphabetic';

            // Group label
            ctx.fillStyle = '#f59e0b';
            ctx.font = '700 26px system-ui, sans-serif';
            ctx.fillText(group, PAD, PAD + 26);

            // Steel name — shrink font if too long
            let nameSize = 108;
            ctx.font = `italic 900 ${nameSize}px system-ui, sans-serif`;
            while (ctx.measureText(steel.name.toUpperCase()).width > W - PAD * 2 - 60 && nameSize > 54) {
                nameSize -= 4;
                ctx.font = `italic 900 ${nameSize}px system-ui, sans-serif`;
            }
            ctx.fillStyle = '#fff';
            ctx.fillText(steel.name.toUpperCase(), PAD, PAD + 26 + 22 + nameSize * 0.88);

            const afterName = PAD + 26 + 22 + nameSize * 0.88;

            // PM / Conventional badge
            const badgeLabel = (steel.pm ? 'Powder Metallurgy' : 'Conventional Alloy').toUpperCase();
            ctx.font = 'italic 800 18px system-ui, sans-serif';
            const badgeTextW = ctx.measureText(badgeLabel).width;
            const bx = PAD, by = afterName + 20, bw = badgeTextW + 48, bh = 40;
            ctx.fillStyle = 'rgba(255,255,255,0.05)';
            ctx.strokeStyle = 'rgba(255,255,255,0.12)';
            ctx.lineWidth = 1;
            rr(bx, by, bw, bh, 100); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#94a3b8';
            ctx.fillText(badgeLabel, bx + 24, by + 27);

            // METALCORE brand (top-right)
            ctx.font = 'italic 900 44px system-ui, sans-serif';
            ctx.fillStyle = '#f59e0b';
            const brandW = ctx.measureText('METALCORE').width;
            ctx.fillText('METALCORE', W - PAD - brandW, PAD + 44);
            ctx.font = '700 13px system-ui, sans-serif';
            ctx.fillStyle = '#334155';
            const subW = ctx.measureText('KNIFE STEEL DATABASE').width;
            ctx.fillText('KNIFE STEEL DATABASE', W - PAD - subW, PAD + 44 + 24);

            // ── Performance Bars ──────────────────────────────────────────────
            const bars = [
                { label: 'Edge Retention',      value: steel.edge,      color: '#f59e0b' },
                { label: 'Toughness',            value: steel.toughness, color: '#3b82f6' },
                { label: 'Corrosion Resistance', value: steel.corrosion, color: '#10b981' },
                { label: 'Ease of Sharpening',   value: steel.sharpen,   color: '#8b5cf6' },
            ];

            const barsStart = by + bh + 52;
            const barH = 14, barGap = 60, barTotalW = W - PAD * 2;

            bars.forEach(({ label, value, color }, i) => {
                const top = barsStart + i * barGap;
                const val = Math.min(value ?? 0, 10);

                ctx.fillStyle = '#94a3b8';
                ctx.font = '700 20px system-ui, sans-serif';
                ctx.fillText(label.toUpperCase(), PAD, top);

                ctx.fillStyle = '#fff';
                ctx.font = '900 24px system-ui, sans-serif';
                const numW = ctx.measureText(`${val}`).width;
                ctx.fillText(`${val}`, W - PAD - numW - 28, top);
                ctx.fillStyle = '#475569';
                ctx.font = '700 18px system-ui, sans-serif';
                ctx.fillText('/10', W - PAD - 26, top);

                const trackY = top + 10;
                ctx.fillStyle = 'rgba(255,255,255,0.06)';
                rr(PAD, trackY, barTotalW, barH, 100); ctx.fill();

                ctx.fillStyle = color;
                rr(PAD, trackY, (val / 10) * barTotalW, barH, 100); ctx.fill();
            });

            // ── Composition Grid ──────────────────────────────────────────────
            const gridTop = barsStart + bars.length * barGap + 24;
            const elements = [
                ['C', steel.C], ['Cr', steel.Cr], ['V', steel.V],
                ['Mo', steel.Mo], ['W', steel.W], ['Co', steel.Co],
            ];
            const cellGap = 14;
            const cellW = (W - PAD * 2 - cellGap * 5) / 6;
            const cellH = 92;

            elements.forEach(([el, val], i) => {
                const cx = PAD + i * (cellW + cellGap);
                ctx.fillStyle = 'rgba(255,255,255,0.03)';
                ctx.strokeStyle = 'rgba(255,255,255,0.07)';
                ctx.lineWidth = 1;
                rr(cx, gridTop, cellW, cellH, 16); ctx.fill(); ctx.stroke();

                ctx.fillStyle = '#475569';
                ctx.font = '900 13px system-ui, sans-serif';
                ctx.fillText(el, cx + 18, gridTop + 28);

                ctx.fillStyle = '#fff';
                ctx.font = '900 28px system-ui, sans-serif';
                ctx.fillText(`${val ?? 0}%`, cx + 18, gridTop + 70);
            });

            // ── Footer ────────────────────────────────────────────────────────
            const footerY = gridTop + cellH + 44;

            ctx.strokeStyle = 'rgba(255,255,255,0.08)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(PAD, footerY);
            ctx.lineTo(W - PAD, footerY);
            ctx.stroke();

            ctx.fillStyle = '#334155';
            ctx.font = '900 13px system-ui, sans-serif';
            ctx.fillText('OPTIMAL DEPLOYMENT', PAD, footerY + 34);

            // Word-wrap use_case
            ctx.fillStyle = '#64748b';
            ctx.font = 'italic 22px system-ui, sans-serif';
            const maxW = 680;
            const words = (steel.use_case || '').split(' ');
            let line = '"', lineY = footerY + 68;
            for (const word of words) {
                const test = line.length > 1 ? `${line} ${word}` : `${line}${word}`;
                if (ctx.measureText(test).width > maxW && line.length > 1) {
                    ctx.fillText(line, PAD, lineY);
                    line = word; lineY += 30;
                } else { line = test; }
            }
            ctx.fillText(line + '"', PAD, lineY);

            ctx.fillStyle = '#1e293b';
            ctx.font = 'italic 900 22px system-ui, sans-serif';
            const site = 'metalcre.vercel.app';
            ctx.fillText(site, W - PAD - ctx.measureText(site).width, H - PAD);

            // ── Export ────────────────────────────────────────────────────────
            const blob = await new Promise((resolve, reject) =>
                canvas.toBlob(b => b ? resolve(b) : reject(new Error('toBlob failed')), 'image/png')
            );
            onGenerated(blob);
        } catch (err) {
            console.error('Failed to generate card', err);
        } finally {
            setGenerating(false);
        }
    };

    React.useImperativeHandle(ref, () => ({ generateImage, isGenerating: generating }));

    if (!steel || hideButton) return null;

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
