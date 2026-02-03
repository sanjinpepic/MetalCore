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
    const [isLoaded, setIsLoaded] = useState(false);

    // Load data from localStorage
    useEffect(() => {
        const savedUser = localStorage.getItem('metalcore_user');
        const savedFavorites = localStorage.getItem('metalcore_favorites');
        const savedKnives = localStorage.getItem('metalcore_my_knives');

        if (savedUser) setUser(JSON.parse(savedUser));
        if (savedFavorites) setFavoriteSteels(JSON.parse(savedFavorites));
        if (savedKnives) setMyKnives(JSON.parse(savedKnives));

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
        // Limit free users to 3 knives
        if (!user.isPro && myKnives.length >= 3) {
            return { error: 'PRO_REQUIRED' };
        }

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
