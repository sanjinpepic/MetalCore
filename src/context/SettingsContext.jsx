'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

export const SettingsProvider = ({ children }) => {
    const [unitSystem, setUnitSystem] = useState('metric'); // 'metric' or 'imperial'

    // Load from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('metalcore_unit_system');
            if (saved && (saved === 'metric' || saved === 'imperial')) {
                setUnitSystem(saved);
            }
        }
    }, []);

    // Save to localStorage when changed
    const updateUnitSystem = (newSystem) => {
        if (newSystem === 'metric' || newSystem === 'imperial') {
            setUnitSystem(newSystem);
            if (typeof window !== 'undefined') {
                localStorage.setItem('metalcore_unit_system', newSystem);
            }
        }
    };

    const value = {
        unitSystem,
        setUnitSystem: updateUnitSystem,
        isMetric: unitSystem === 'metric',
        isImperial: unitSystem === 'imperial',
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};
