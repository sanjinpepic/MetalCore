import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request) {
    const { searchParams } = new URL(request.url);

    const name      = searchParams.get('name')      || 'Unknown';
    const producer  = searchParams.get('producer')  || '';
    const parent    = searchParams.get('parent')    || '';
    const pm        = searchParams.get('pm') === 'true';
    const edge      = parseFloat(searchParams.get('edge')      || 0);
    const toughness = parseFloat(searchParams.get('toughness') || 0);
    const corrosion = parseFloat(searchParams.get('corrosion') || 0);
    const sharpen   = parseFloat(searchParams.get('sharpen')   || 0);
    const C         = searchParams.get('C')  || '0';
    const Cr        = searchParams.get('Cr') || '0';
    const V         = searchParams.get('V')  || '0';
    const Mo        = searchParams.get('Mo') || '0';
    const W         = searchParams.get('W')  || '0';
    const Co        = searchParams.get('Co') || '0';
    const useCase   = searchParams.get('use_case') || '';

    const group = parent || producer;

    const bars = [
        { label: 'Edge Retention',     value: edge,      color: '#f59e0b' },
        { label: 'Toughness',          value: toughness, color: '#3b82f6' },
        { label: 'Corrosion Res.',      value: corrosion, color: '#10b981' },
        { label: 'Ease of Sharpening', value: sharpen,   color: '#8b5cf6' },
    ];

    const elements = [['C', C], ['Cr', Cr], ['V', V], ['Mo', Mo], ['W', W], ['Co', Co]];

    return new ImageResponse(
        (
            <div style={{
                width: '1080px', height: '1080px',
                background: '#000000',
                display: 'flex', flexDirection: 'column',
                padding: '80px',
                fontFamily: 'system-ui, sans-serif',
                position: 'relative',
            }}>
                {/* Background glow */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(circle at 0px 0px, rgba(245,158,11,0.18) 0%, transparent 55%), radial-gradient(circle at 1080px 1080px, rgba(99,102,241,0.18) 0%, transparent 55%)',
                }} />

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ color: '#f59e0b', fontSize: '26px', fontWeight: 900, letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: '12px' }}>
                            {group}
                        </span>
                        <span style={{ color: '#ffffff', fontSize: '108px', fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', lineHeight: 0.88, letterSpacing: '-0.04em', marginBottom: '20px' }}>
                            {name}
                        </span>
                        <div style={{ display: 'flex', padding: '10px 28px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '100px', width: 'fit-content' }}>
                            <span style={{ color: '#94a3b8', fontSize: '18px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.28em', fontStyle: 'italic' }}>
                                {pm ? 'Powder Metallurgy' : 'Conventional Alloy'}
                            </span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <span style={{ color: '#f59e0b', fontSize: '44px', fontWeight: 900, fontStyle: 'italic', letterSpacing: '-0.02em' }}>METALCORE</span>
                        <span style={{ color: '#334155', fontSize: '13px', fontWeight: 700, letterSpacing: '0.55em', textTransform: 'uppercase', marginTop: '6px' }}>Knife Steel Database</span>
                    </div>
                </div>

                {/* Performance Bars */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginTop: '52px', position: 'relative' }}>
                    {bars.map(({ label, value, color }) => (
                        <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: '#94a3b8', fontSize: '20px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em' }}>{label}</span>
                                <span style={{ color: '#ffffff', fontSize: '26px', fontWeight: 900 }}>{value}<span style={{ color: '#475569', fontSize: '18px' }}>/10</span></span>
                            </div>
                            <div style={{ width: '100%', height: '14px', background: 'rgba(255,255,255,0.06)', borderRadius: '100px', display: 'flex' }}>
                                <div style={{ width: `${(value / 10) * 100}%`, height: '100%', background: color, borderRadius: '100px' }} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Composition grid */}
                <div style={{ display: 'flex', gap: '14px', marginTop: '40px', position: 'relative' }}>
                    {elements.map(([el, val]) => (
                        <div key={el} style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '22px', padding: '22px 18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <span style={{ color: '#475569', fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em' }}>{el}</span>
                            <span style={{ color: '#ffffff', fontSize: '26px', fontWeight: 900 }}>{val}<span style={{ color: '#475569', fontSize: '16px' }}>%</span></span>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '32px', marginTop: 'auto', position: 'relative' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '680px' }}>
                        <span style={{ color: '#334155', fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '8px' }}>Optimal Deployment</span>
                        <span style={{ color: '#64748b', fontSize: '22px', fontStyle: 'italic', lineHeight: 1.4 }}>"{useCase}"</span>
                    </div>
                    <span style={{ color: '#1e293b', fontSize: '22px', fontWeight: 900, fontStyle: 'italic' }}>metalcre.vercel.app</span>
                </div>
            </div>
        ),
        { width: 1080, height: 1080 }
    );
}
