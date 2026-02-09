'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { hapticFeedback } from '../hooks/useMobile';

const NavigationContext = createContext();

export function NavigationProvider({ children }) {
    const [navigationStack, setNavigationStack] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize from URL on mount
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const initFromUrl = () => {
            const params = new URLSearchParams(window.location.search);
            const view = params.get('view') || 'HOME';
            const steelId = params.get('steel');
            const knifeId = params.get('knife');
            const compareSteels = params.get('steels') || null;

            const initialState = {
                view,
                detailSteel: steelId || null,
                detailKnife: knifeId || null,
                compareSteels,
            };

            setNavigationStack([initialState]);
            setIsInitialized(true);
        };

        initFromUrl();

        // Handle browser back/forward
        const handlePopState = (event) => {
            if (event.state && event.state.navigationState) {
                setNavigationStack(event.state.navigationStack || [event.state.navigationState]);
            } else {
                // If no state, go to home
                setNavigationStack([{ view: 'HOME', detailSteel: null, detailKnife: null, compareSteels: null }]);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const navigate = useCallback((newState, replace = false) => {
        if (!isInitialized) return;

        setNavigationStack(prev => {
            const current = prev[prev.length - 1] || { view: 'HOME', detailSteel: null, detailKnife: null, compareSteels: null };
            const mergedState = { ...current, ...newState };

            // Build URL
            const params = new URLSearchParams();
            if (mergedState.view && mergedState.view !== 'HOME') {
                params.set('view', mergedState.view);
            }
            if (mergedState.detailSteel) {
                params.set('steel', mergedState.detailSteel);
            }
            if (mergedState.detailKnife) {
                params.set('knife', mergedState.detailKnife);
            }
            if (mergedState.compareSteels && mergedState.view === 'COMPARE') {
                params.set('steels', mergedState.compareSteels);
            }

            const url = params.toString() ? `?${params.toString()}` : '/';

            if (replace && prev.length > 0) {
                // Replace current state
                window.history.replaceState(
                    { navigationState: mergedState, navigationStack: [...prev.slice(0, -1), mergedState] },
                    '',
                    url
                );
                return [...prev.slice(0, -1), mergedState];
            } else {
                // Push new state
                window.history.pushState(
                    { navigationState: mergedState, navigationStack: [...prev, mergedState] },
                    '',
                    url
                );
                return [...prev, mergedState];
            }
        });
    }, [isInitialized]);

    const goBack = useCallback(() => {
        // Add haptic feedback before navigating back
        hapticFeedback('light');

        if (navigationStack.length > 1) {
            window.history.back();
        } else {
            // If at root, close app or go to home
            if (window.history.length > 1) {
                window.history.back();
            }
        }
    }, [navigationStack]);

    const canGoBack = navigationStack.length > 1;

    const currentState = navigationStack[navigationStack.length - 1] || {
        view: 'HOME',
        detailSteel: null,
        detailKnife: null,
        compareSteels: null,
    };

    return (
        <NavigationContext.Provider value={{
            currentState,
            navigate,
            goBack,
            canGoBack,
            navigationStack,
        }}>
            {children}
        </NavigationContext.Provider>
    );
}

export function useNavigation() {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error('useNavigation must be used within NavigationProvider');
    }
    return context;
}
