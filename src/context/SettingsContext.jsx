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
    const [dashboardLayout, setDashboardLayout] = useState({
        showSpotlight: true,
        showMatrix: true,
        showTrending: true,
        showCategories: true,
        showProLab: true
    });

    // Load from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedUnit = localStorage.getItem('metalcore_unit_system');
            if (savedUnit && (savedUnit === 'metric' || savedUnit === 'imperial')) {
                setUnitSystem(savedUnit);
            }

            const savedLayout = localStorage.getItem('metalcore_dashboard_layout');
            if (savedLayout) {
                try {
                    setDashboardLayout(JSON.parse(savedLayout));
                } catch (e) {
                    console.error("Failed to parse dashboard layout");
                }
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

    const updateDashboardLayout = (newLayout) => {
        const updated = { ...dashboardLayout, ...newLayout };
        setDashboardLayout(updated);
        if (typeof window !== 'undefined') {
            localStorage.setItem('metalcore_dashboard_layout', JSON.stringify(updated));
        }
    };

    const value = {
        unitSystem,
        setUnitSystem: updateUnitSystem,
        isMetric: unitSystem === 'metric',
        isImperial: unitSystem === 'imperial',
        dashboardLayout,
        setDashboardLayout: updateDashboardLayout
    };


    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};
