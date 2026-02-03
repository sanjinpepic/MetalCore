import React from 'react';
import { useUser } from '../context/UserContext';

const PremiumGatedFeature = ({ children, featureName }) => {
    const { user, updateProfile } = useUser();

    if (!user.isPro) {
        return (
            <div className="glass-panel p-8 md:p-12 rounded-[3rem] border-white/10 bg-slate-950/40 backdrop-blur-3xl flex flex-col items-center text-center space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-accent">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                </div>

                <div className="p-4 bg-accent/20 rounded-full border border-accent/30 text-accent">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                </div>

                <div className="space-y-2 max-w-md">
                    <h3 className="text-2xl font-display font-black text-white italic uppercase tracking-tighter">
                        {featureName} is a Pro Feature
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Unlock advanced metallurgy simulators, predictive performance analysis, and unlimited knife tracking with MetalCore Pro.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                        onClick={() => updateProfile({ isPro: true })}
                        className="px-8 py-4 bg-accent hover:bg-accent-light text-black font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-xl shadow-accent/20"
                    >
                        Go Pro - $2.99/mo
                    </button>
                    <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-widest text-xs rounded-2xl transition-all border border-white/10">
                        View Pro Benefits
                    </button>
                </div>

                <p className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">
                    Secure payment via Stripe
                </p>
            </div>
        );
    }

    return children;
};

export default PremiumGatedFeature;
