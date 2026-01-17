'use client'

import { useEffect, useState } from 'react'

export default function PageLoader() {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Wait for page to load, similar to original HTML behavior
        const hideLoader = () => {
            setLoading(false)
        }

        // Hide loader once DOM is ready and fonts are loaded
        if (document.readyState === 'complete') {
            // Add slight delay for smooth transition
            setTimeout(hideLoader, 100)
        } else {
            window.addEventListener('load', () => {
                setTimeout(hideLoader, 100)
            })
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
