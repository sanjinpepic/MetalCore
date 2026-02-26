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
            <div className={`w-full bg-gradient-to-b ${theme.glow} to-transparent pb-12 ${className}`}>
                <div className="p-6 md:p-12 lg:p-20 pt-24 md:pt-24 flex flex-col items-center text-center max-w-7xl mx-auto w-full space-y-10">
                    <div className="space-y-6">
                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 ${theme.bg}/10 rounded-full border ${theme.border} backdrop-blur-md`}>
                            <span className="relative flex h-2 w-2">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${theme.bg} opacity-75`} />
                                <span className={`relative inline-flex rounded-full h-2 w-2 ${theme.bg}`} />
                            </span>
                            <span className={`text-[10px] font-black ${theme.text} uppercase tracking-[0.2em]`}>{subtitle}</span>
                        </div>

                        <h1 className="text-6xl md:text-8xl xl:text-9xl font-display font-black text-white tracking-tighter italic leading-[0.8] uppercase pr-2 md:pr-4">
                            {title}<br />
                            <span className={`text-transparent bg-clip-text bg-gradient-to-r from-${theme.id}-400 via-white to-slate-500 pr-2 md:pr-6`}>{highlight}</span>
                        </h1>

                        {children}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <header className={`relative p-6 md:p-12 pb-4 md:pb-8 pt-20 md:pt-16 space-y-2 md:space-y-6 shrink-0 bg-gradient-to-b ${theme.glow} to-transparent ${className}`}>
            <div>
                <div className={`text-[10px] md:text-xs font-black ${theme.text} mb-1 md:mb-3 uppercase tracking-widest flex items-center gap-2`}>
                    <span className={`w-6 h-px bg-${theme.id}-500/30`}></span>
                    {subtitle}
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
