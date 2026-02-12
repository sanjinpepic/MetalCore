'use client'

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
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

    const lastProcessedRef = useRef(null);

    // Sync URL with navigation state
    useEffect(() => {
        if (!isInitialized || navigationStack.length === 0) return;

        const latestState = navigationStack[navigationStack.length - 1];
        if (lastProcessedRef.current === latestState) return;

        // Build URL for the latest state
        const params = new URLSearchParams();
        if (latestState.view && latestState.view !== 'HOME') {
            params.set('view', latestState.view);
        }
        if (latestState.detailSteel) {
            params.set('steel', latestState.detailSteel);
        }
        if (latestState.detailKnife) {
            params.set('knife', latestState.detailKnife);
        }
        if (latestState.compareSteels && latestState.view === 'COMPARE') {
            params.set('steels', latestState.compareSteels);
        }

        const url = params.toString() ? `?${params.toString()}` : '/';
        const isPopState = window.history.state?.navigationState === latestState;

        if (!isPopState) {
            // Only update history if this wasn't triggered by a popstate event
            // Note: We don't have an easy way to distinguish between push and replace here
            // without extra state, so we'll use a heuristic or just push.
            // Actually, keep it simple for now and just push if it's new.
            window.history.pushState(
                { navigationState: latestState, navigationStack: navigationStack },
                '',
                url
            );
        }

        lastProcessedRef.current = latestState;
    }, [isInitialized, navigationStack]);

    const navigate = useCallback((newState, replace = false) => {
        if (!isInitialized) return;

        setNavigationStack(prev => {
            const current = prev[prev.length - 1] || { view: 'HOME', detailSteel: null, detailKnife: null, compareSteels: null };
            const mergedState = { ...current, ...newState };
            return replace && prev.length > 0
                ? [...prev.slice(0, -1), mergedState]
                : [...prev, mergedState];
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
