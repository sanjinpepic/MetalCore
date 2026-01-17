'use client'

import { useEffect, useState } from 'react'

export default function PageLoader() {
    const [loading, setLoading] = useState(() => {
        // Only show loader if it hasn't been shown in this session
        if (typeof window !== 'undefined') {
            return !sessionStorage.getItem('metalcore_loader_shown')
        }
        return true
    })

    useEffect(() => {
        // If already shown, don't show again
        if (typeof window !== 'undefined' && sessionStorage.getItem('metalcore_loader_shown')) {
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

    if (!loading) return null

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
