'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useConsent } from '@/lib/hooks/use-consent';

const OnboardingContext = createContext();

export const useOnboarding = () => {
    const context = useContext(OnboardingContext);
    if (!context) {
        throw new Error('useOnboarding must be used within an OnboardingProvider');
    }
    return context;
};

// Tour Steps Definitions
const TOUR_STEPS = {
    newbie: [
        {
            target: 'global-search',
            title: 'Global Search',
            content: 'Start here! Search for any steel grade (e.g., "MagnaCut") or producer to instantly see its composition and properties.',
            position: 'bottom'
        },
        {
            target: 'nav-search',
            title: 'Grade Library',
            content: 'Browse our extensive database of over 500+ steel grades with detailed charts and datasheets.',
            position: 'right'
        },
        {
            target: 'nav-education',
            title: 'Academy',
            content: 'New to metallurgy? The Academy is packed with articles and guides to help you understand the science behind the steel.',
            position: 'right'
        }
    ],
    newbie_mobile: [
        {
            target: 'global-search',
            title: 'Global Search',
            content: 'Start here! Search for any steel grade (e.g., "MagnaCut") or producer to instantly see its composition and properties.',
            position: 'bottom'
        },
        {
            target: 'mobile-nav-search',
            title: 'Grade Library',
            content: 'Browse our database of 500+ steel grades with detailed charts and datasheets.',
            position: 'top'
        },
        {
            target: 'mobile-nav-education',
            title: 'Academy',
            content: 'New to metallurgy? Learn the science behind the steel with our guides.',
            position: 'top'
        }
    ],
    enthusiast: [
        {
            target: 'nav-matrix',
            title: 'Performance Matrix',
            content: 'Visualise the trade-offs. The Graph View lets you compare Edge Retention vs Toughness vs Corrosion Resistance in real-time.',
            position: 'right'
        },
        {
            target: 'nav-knives',
            title: 'Knife Library',
            content: 'See how different steels are used in actual production knives. Filter by brand, blade shape, and lock type.',
            position: 'right'
        },
        {
            target: 'nav-compare',
            title: 'Compare Tool',
            content: 'Diff tool for alloys. Select multiple steels to overlay their composition graphs and spot the differences.',
            position: 'right'
        }
    ],
    enthusiast_mobile: [
        {
            target: 'mobile-nav-matrix',
            title: 'Performance Matrix',
            content: 'Visualize trade-offs between Edge Retention, Toughness, and Corrosion Resistance.',
            position: 'top'
        },
        {
            target: 'mobile-nav-knives',
            title: 'Knife Library',
            content: 'See how different steels are used in production knives. Filter by brand and shape.',
            position: 'top'
        },
        {
            target: 'mobile-nav-home',
            title: 'Workbench',
            content: 'Compare tool for alloys. Build your custom comparisons on the home screen.',
            position: 'top'
        }
    ],
    expert: [
        {
            target: 'import-dataset',
            title: 'Import Data',
            content: 'Bring your own data. Import .csv or .xlsx files to analyze your custom alloys against our standard library.',
            position: 'right'
        },
        {
            target: 'nav-profile',
            title: 'Pro Profile',
            content: 'Manage your saved alloys, custom comparisons, and export your research data.',
            position: 'right'
        }
    ],
    expert_mobile: [
        {
            target: 'mobile-nav-home',
            title: 'Workbench',
            content: 'Import your own data and manage custom alloys. Everything accessible from here.',
            position: 'top'
        },
        {
            target: 'global-search',
            title: 'Pro Search',
            content: 'Advanced search with filters to find exactly what you need in our database.',
            position: 'bottom'
        }
    ]
};

export const OnboardingProvider = ({ children }) => {
    // State
    const [isActive, setIsActive] = useState(false);
    const [knowledgeLevel, setKnowledgeLevel] = useState(null); // 'newbie' | 'enthusiast' | 'expert' | null
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [showWelcome, setShowWelcome] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    
    // Get consent state
    const { hasConsented } = useConsent();

    // Detect mobile on mount and when window resizes
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Persist completion state
    useEffect(() => {
        const hasCompletedParams = localStorage.getItem('metalcore_onboarding_completed');
        if (!hasCompletedParams && hasConsented) {
            // Only show welcome modal if cookies have been accepted
            // Delay slightly to let the app load
            const timer = setTimeout(() => setShowWelcome(true), 300);
            return () => clearTimeout(timer);
        }
    }, [hasConsented]);

    const startTour = (level) => {
        setKnowledgeLevel(level);
        setShowWelcome(false);
        setIsActive(true);
        setCurrentStepIndex(0);
    };

    const nextStep = useCallback(() => {
        if (!knowledgeLevel) return;

        const stepsKey = isMobile ? `${knowledgeLevel}_mobile` : knowledgeLevel;
        const currentSteps = TOUR_STEPS[stepsKey] || TOUR_STEPS[knowledgeLevel];
        if (currentStepIndex < currentSteps.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
        } else {
            completeTour();
        }
    }, [knowledgeLevel, currentStepIndex, isMobile]);

    const prevStep = useCallback(() => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(prev => prev - 1);
        }
    }, [currentStepIndex]);

    const completeTour = () => {
        setIsActive(false);
        setShowWelcome(false);
        localStorage.setItem('metalcore_onboarding_completed', 'true');
    };

    const skipTour = () => {
        completeTour();
    };

    // Derived state for the active step - use mobile-specific steps if available
    const currentStepData = (isActive && knowledgeLevel)
        ? (() => {
            const stepsKey = isMobile ? `${knowledgeLevel}_mobile` : knowledgeLevel;
            const steps = TOUR_STEPS[stepsKey] || TOUR_STEPS[knowledgeLevel];
            return steps ? steps[currentStepIndex] : null;
        })()
        : null;

    const getTotalSteps = () => {
        if (!knowledgeLevel) return 0;
        const stepsKey = isMobile ? `${knowledgeLevel}_mobile` : knowledgeLevel;
        const steps = TOUR_STEPS[stepsKey] || TOUR_STEPS[knowledgeLevel];
        return steps ? steps.length : 0;
    };

    return (
        <OnboardingContext.Provider value={{
            isActive,
            showWelcome,
            setShowWelcome,
            knowledgeLevel,
            currentStepIndex,
            currentStepData,
            totalSteps: getTotalSteps(),
            startTour,
            nextStep,
            prevStep,
            skipTour,
            completeTour
        }}>
            {children}
        </OnboardingContext.Provider>
    );
};
