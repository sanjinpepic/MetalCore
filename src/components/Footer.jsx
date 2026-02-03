import React from 'react';

const Footer = () => {
    return (
        <footer className="w-full py-12 px-6 md:px-12 border-t border-white/5 bg-black/50 backdrop-blur-3xl mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex flex-col items-center md:items-start space-y-2">
                    <div className="flex items-center gap-2 text-accent font-display font-black text-xl tracking-tighter italic">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <ellipse cx="12" cy="5" rx="9" ry="3" />
                            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                        </svg>
                        METALCORE
                    </div>
                    <p className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.4em] font-bold">
                        Metallurgy Core System v2.5
                    </p>
                </div>

                <div className="flex flex-col items-center md:items-end space-y-4">
                    <a
                        href="https://www.buymeacoffee.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent/40 rounded-2xl transition-all duration-300"
                    >
                        <div className="absolute inset-0 bg-accent/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                        <span className="text-[10px] font-black text-slate-400 group-hover:text-white uppercase tracking-[0.2em] transition-colors relative">
                            Support me
                        </span>
                        <div className="p-1.5 bg-accent/20 rounded-lg text-accent group-hover:bg-accent group-hover:text-black transition-all relative">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        </div>
                    </a>
                    <p className="text-[9px] text-slate-700 font-bold uppercase tracking-widest">
                        © {new Date().getFullYear()} MetalCore. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
