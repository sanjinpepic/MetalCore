'use client'

import { useState, useEffect } from 'react';

export function useMobile() {
    const [isMobile, setIsMobile] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const checkMobile = () => {
            const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            const narrow = window.innerWidth < 768;
            setIsMobile(mobile || narrow);
        };

        const checkStandalone = () => {
            const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches
                || window.navigator.standalone
                || document.referrer.includes('android-app://');
            setIsStandalone(isInStandaloneMode);
        };

        checkMobile();
        checkStandalone();

        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return { isMobile, isStandalone };
}

export function hapticFeedback(type = 'light') {
    if (typeof window === 'undefined') return;

    try {
        if (navigator.vibrate) {
            const patterns = {
                light: [10],
                medium: [20],
                heavy: [30],
                success: [10, 50, 10],
                error: [50, 100, 50],
            };
            navigator.vibrate(patterns[type] || patterns.light);
        }
    } catch (error) {
        // Vibration API not supported, fail silently
    }
}
