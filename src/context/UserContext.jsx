'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        name: 'Steel Enthusiast',
        bio: 'Collector of fine blades and metallurgy geek.',
        themeColor: '#00f2ff', // Default accent
        avatar: '',
        isPro: false, // SaaS gating flag
    });

    const [favoriteSteels, setFavoriteSteels] = useState([]);
    const [myKnives, setMyKnives] = useState([]);
    const [savedComparisons, setSavedComparisons] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load data from localStorage
    useEffect(() => {
        const savedUser = localStorage.getItem('metalcore_user');
        const savedFavorites = localStorage.getItem('metalcore_favorites');
        const savedKnives = localStorage.getItem('metalcore_my_knives');
        const savedComps = localStorage.getItem('metalcore_saved_comparisons');

        if (savedUser) setUser(JSON.parse(savedUser));
        if (savedFavorites) setFavoriteSteels(JSON.parse(savedFavorites));
        if (savedKnives) setMyKnives(JSON.parse(savedKnives));
        if (savedComps) setSavedComparisons(JSON.parse(savedComps));

        setIsLoaded(true);
    }, []);

    // Save data to localStorage when state changes
    useEffect(() => {
        if (!isLoaded) return;
        localStorage.setItem('metalcore_user', JSON.stringify(user));
    }, [user, isLoaded]);

    useEffect(() => {
        if (!isLoaded) return;
        localStorage.setItem('metalcore_favorites', JSON.stringify(favoriteSteels));
    }, [favoriteSteels, isLoaded]);

    useEffect(() => {
        if (!isLoaded) return;
        localStorage.setItem('metalcore_my_knives', JSON.stringify(myKnives));
    }, [myKnives, isLoaded]);

    useEffect(() => {
        if (!isLoaded) return;
        localStorage.setItem('metalcore_saved_comparisons', JSON.stringify(savedComparisons));
    }, [savedComparisons, isLoaded]);

    const saveComparison = (name, steelIds) => {
        const entry = { id: Date.now().toString(), name, steelIds, createdAt: new Date().toISOString() };
        setSavedComparisons(prev => [entry, ...prev]);
    };

    const deleteComparison = (id) => {
        setSavedComparisons(prev => prev.filter(c => c.id !== id));
    };

    const toggleFavorite = (steelId) => {
        setFavoriteSteels(prev =>
            prev.includes(steelId)
                ? prev.filter(id => id !== steelId)
                : [...prev, steelId]
        );
    };

    const updateProfile = (newData) => {
        setUser(prev => ({ ...prev, ...newData }));
    };

    const addKnife = (knife) => {
        const newKnife = {
            ...knife,
            id: 'user-knife-' + Date.now(),
            addedAt: new Date().toISOString()
        };
        setMyKnives(prev => [...prev, newKnife]);
        return { success: true };
    };

    const removeKnife = (id) => {
        setMyKnives(prev => prev.filter(k => k.id !== id));
    };

    const updateKnife = (id, updates) => {
        setMyKnives(prev => prev.map(k => k.id === id ? { ...k, ...updates } : k));
    };

    return (
        <UserContext.Provider value={{
            user,
            updateProfile,
            favoriteSteels,
            toggleFavorite,
            myKnives,
            addKnife,
            removeKnife,
            updateKnife,
            savedComparisons,
            saveComparison,
            deleteComparison,
            isLoaded
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
