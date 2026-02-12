'use client';

import { useState, useEffect } from 'react';
import { useConsent } from '@/lib/hooks/use-consent';

export default function CookieConsent() {
    const { consent, hasConsented, updateConsent } = useConsent();
    const [showBanner, setShowBanner] = useState(false);
    const [showRevoke, setShowRevoke] = useState(false);

    useEffect(() => {
        // Show banner if no consent has been given yet
        if (!hasConsented) {
            setShowBanner(true);
        } else {
            setShowBanner(false);
        }
    }, [hasConsented]);

    const acceptCookies = () => {
        updateConsent('granted');
        setShowBanner(false);
    };

    const declineOptional = () => {
        updateConsent('denied'); // 'denied' typically means essential only in this context
        setShowBanner(false);
    };

    // If banner is not shown, we rely on the footer link to reopen settings
    if (!showBanner) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-slide-up">
            <div className="max-w-6xl mx-auto">
                <div className="glass-panel p-4 md:p-6 rounded-2xl border border-white/10 shadow-2xl">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        {/* Icon */}
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-emerald-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white mb-2">
                                Cookie Preferences
                            </h3>
                            <p className="text-sm text-gray-300 leading-relaxed">
                                We use cookies to enhance your experience, save your preferences, and analyze usage.
                                Essential cookies are required for the app to function. By clicking "Accept All", you
                                consent to our use of cookies.{' '}
                                <a
                                    href="/legal/privacy"
                                    className="text-emerald-400 hover:text-emerald-300 underline transition-colors"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Learn more
                                </a>
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <button
                                onClick={declineOptional}
                                className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all duration-200 hover:scale-105"
                            >
                                Essential Only
                            </button>
                            <button
                                onClick={acceptCookies}
                                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:scale-105"
                            >
                                Accept All
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
