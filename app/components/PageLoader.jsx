'use client'

import { useEffect, useState } from 'react'
import { HomeSkeleton } from '../../src/components/Common/Skeleton.jsx'

export default function PageLoader() {
    // Always start with true to match server render and prevent hydration errors
    const [loading, setLoading] = useState(true)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        // Mark as mounted (client-side only)
        setMounted(true)

        // Register service worker for PWA
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').then((reg) => {
                    console.log('Service worker registered.', reg);
                }).catch((err) => {
                    console.warn('Service worker registration failed.', err);
                });
            });
        }

        // Check if loader has already been shown in this session
        if (typeof window !== 'undefined' && sessionStorage.getItem('metalcore_loader_shown')) {
            // Already shown, hide immediately
            setLoading(false)
            return
        }

        // Mark loader as shown to prevent multiple flashes
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('metalcore_loader_shown', 'true')
        }

        const minDisplayTime = 1200 // Slightly longer for the skeleton to be appreciated
        const startTime = Date.now()

        // Wait for page to load, then ensure minimum display time
        const hideLoader = () => {
            const elapsed = Date.now() - startTime
            const remaining = Math.max(0, minDisplayTime - elapsed)
            // Ensure loader shows for at least minDisplayTime
            setTimeout(() => {
                setLoading(false)
            }, remaining)
        }

        let timeoutId = null

        // Hide loader once DOM is ready and fonts are loaded
        if (typeof window !== 'undefined') {
            if (document.readyState === 'complete') {
                // Page already loaded, but still show for minimum time to give that cool effect
                hideLoader()
            } else {
                const handleLoad = () => {
                    hideLoader()
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

    // Don't render on server to prevent hydration errors
    // But once mounted, show loader if loading is true
    if (!mounted) return null
    if (!loading) return null

    return (
        <div id="loading" className="fixed inset-0 z-[9999] bg-black overflow-y-auto">
            {/* Background elements to match the HomeView */}
            <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-black">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative pt-24">
                <div className="flex flex-col items-center justify-center mb-12">
                    <div className="w-16 h-16 mb-6 relative">
                        <div className="absolute inset-0 skeleton rounded-full opacity-20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="animate-pulse">
                                <ellipse cx="12" cy="5" rx="9" ry="3" />
                                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">
                        Initializing MetalCore
                    </h2>
                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mt-2">
                        Forging Database Resources...
                    </p>
                </div>

                <HomeSkeleton />
            </div>
        </div>
    )
}
