import React from 'react';
import { TYPE, THEMES } from '../../utils/designTokens';

const ViewHeader = ({
    subtitle,
    title,
    highlight,
    color = 'amber',
    isHero = false,
    className = '',
    children
}) => {
    const theme = THEMES[color] || THEMES.amber;

    if (isHero) {
        return (
            <div className={`hero-condensed w-full bg-gradient-to-b ${theme.glow} to-transparent pb-12 overflow-clip ${className}`}>
                <div className="p-6 md:p-12 lg:p-20 pt-24 md:pt-24 flex flex-col items-center text-center max-w-7xl mx-auto w-full space-y-10">
                    <div className="space-y-6">
                        <div className={`forge-enter inline-flex items-center gap-2.5 px-4 py-1.5 bg-white/[0.04] rounded-full border ${theme.border}`} style={{ '--stagger': '0ms' }}>
                            <span className="relative flex h-1.5 w-1.5">
                                <span className={`animate-ember-pulse absolute inline-flex h-full w-full rounded-full ${theme.bg}`} />
                                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${theme.bg}`} />
                            </span>
                            <span className={`text-[10px] font-medium font-mono ${theme.text} uppercase tracking-[0.25em]`}>{subtitle}</span>
                        </div>

                        <h1 className="forge-enter text-[clamp(2.75rem,13vw,8rem)] font-display text-white uppercase tracking-tight leading-[0.9] text-balance" style={{ '--stagger': '90ms' }}>
                            {title}<br />
                            <span className={theme.text}>{highlight}</span>
                        </h1>

                        <div className="forge-enter" style={{ '--stagger': '180ms' }}>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <header className={`relative p-6 md:p-12 pb-4 md:pb-8 pt-20 md:pt-16 space-y-2 md:space-y-6 shrink-0 bg-gradient-to-b ${theme.glow} to-transparent ${className}`}>
            <div>
                <div className={`flex items-center gap-3 mb-1 md:mb-3 ${theme.text}`}>
                    <span className={`h-px w-6 bg-accent/40`}></span>
                    <span className={`text-[10px] md:text-[11px] font-mono font-medium uppercase tracking-[0.25em]`}>{subtitle}</span>
                </div>
                <h1 className={TYPE.pageTitle}>
                    {title} <br className="hidden md:block" />
                    <span className={theme.text}>{highlight}</span>
                </h1>
                {children}
            </div>
        </header>
    );
};

export default ViewHeader;
