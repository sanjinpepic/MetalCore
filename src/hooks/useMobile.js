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

export function hapticFeedback() {
    // Disabled - vibrations turned off
}
