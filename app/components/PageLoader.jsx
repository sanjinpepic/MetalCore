'use client'

import { useEffect, useState } from 'react'

export default function PageLoader() {
    // Always start with true to match server render and prevent hydration errors
    const [loading, setLoading] = useState(true)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        // Mark as mounted (client-side only)
        setMounted(true)

        // Check if loader has already been shown in this session
        if (typeof window !== 'undefined' && sessionStorage.getItem('metalcore_loader_shown')) {
            // Already shown, hide immediately
            setLoading(false)
            return
        }

        // Mark loader as shown immediately to prevent multiple flashes
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('metalcore_loader_shown', 'true')
        }

        // Wait for page to load, similar to original HTML behavior
        const hideLoader = () => {
            setLoading(false)
        }

        let timeoutId = null

        // Hide loader once DOM is ready and fonts are loaded
        if (typeof window !== 'undefined') {
            if (document.readyState === 'complete') {
                // Add slight delay for smooth transition
                timeoutId = setTimeout(hideLoader, 100)
            } else {
                const handleLoad = () => {
                    timeoutId = setTimeout(hideLoader, 100)
                }
                window.addEventListener('load', handleLoad)
                
                // Cleanup function
                return () => {
                    window.removeEventListener('load', handleLoad)
                    if (timeoutId) clearTimeout(timeoutId)
                }
            }
        }

        // Cleanup timeout if component unmounts
        return () => {
            if (timeoutId) clearTimeout(timeoutId)
        }
    }, [])

    // Don't render on server or if already hidden to prevent hydration errors
    if (!mounted || !loading) return null

    return (
        <div id="loading" style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: '#050505',
            color: '#94a3b8',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            transition: 'opacity 0.5s ease-out'
        }}>
            <div className="spinner"></div>
            <h2 style={{ 
                fontSize: '1.25rem', 
                fontWeight: 'bold', 
                color: 'white', 
                marginBottom: '0.5rem' 
            }}>
                Initialize MetalCore
            </h2>
            <p style={{ 
                fontSize: '0.75rem', 
                color: '#64748b', 
                fontFamily: 'JetBrains Mono, monospace' 
            }}>
                Loading resources...
            </p>
        </div>
    )
}
