'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const ConsentContext = createContext({
    consent: null, // null = not yet decided, 'granted' = all, 'essential' = essential only
    hasConsented: false,
    updateConsent: (status) => { },
});

export function ConsentProvider({ children }) {
    const [consent, setConsent] = useState(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Check local storage on mount
        const storedConsent = localStorage.getItem('cookie-consent');
        if (storedConsent) {
            setConsent(storedConsent);
        }
    }, []);

    const updateConsent = (status) => {
        setConsent(status);
        localStorage.setItem('cookie-consent', status);

        // If we were using Google Analytics or other scripts, we would update them here
        // window.gtag('consent', 'update', { ... })
    };

    return (
        <ConsentContext.Provider
            value={{
                consent,
                hasConsented: consent !== null,
                updateConsent
            }}
        >
            {children}
        </ConsentContext.Provider>
    );
}

export function useConsent() {
    return useContext(ConsentContext);
}
