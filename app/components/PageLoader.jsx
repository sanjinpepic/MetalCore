'use client'

import { useEffect, useState } from 'react'

export default function PageLoader() {
    // Always start with true to match server render and prevent hydration errors
    const [loading, setLoading] = useState(true)
    const [exiting, setExiting] = useState(false)
    const [mounted, setMounted] = useState(false)

    const hideLoader = () => {
        setExiting(true)
        setTimeout(() => setLoading(false), 500)
    }

    useEffect(() => {
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

        // Show the splash only once per session
        if (typeof window !== 'undefined' && sessionStorage.getItem('metalcore_loader_shown')) {
            setLoading(false)
            return
        }

        if (typeof window !== 'undefined') {
            sessionStorage.setItem('metalcore_loader_shown', 'true')
        }

        const minDisplayTime = 500 // brief brand moment, never blocking real content
        const startTime = Date.now()

        const onReady = () => {
            const remaining = Math.max(0, minDisplayTime - (Date.now() - startTime))
            setTimeout(hideLoader, remaining)
        }

        if (typeof window !== 'undefined' && document.readyState === 'complete') {
            onReady()
        } else if (typeof window !== 'undefined') {
            window.addEventListener('load', onReady)
            return () => window.removeEventListener('load', onReady)
        }
    }, [])

    // Don't render on server to prevent hydration errors
    if (!mounted || !loading) return null

    return (
        <div
            aria-hidden="true"
            className={`fixed inset-0 z-[9999] bg-[#0B0A08] flex flex-col items-center justify-center transition-opacity duration-500 ease-snap ${exiting ? 'opacity-0' : 'opacity-100'}`}
        >
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="flex flex-col items-center">
                <h1 className="font-display text-3xl md:text-5xl uppercase tracking-tight text-white select-none">
                    Metal<span className="text-accent">Core</span>
                </h1>
                <div className="h-px w-40 md:w-56 bg-white/10 mt-6 rounded-full overflow-hidden">
                    <div
                        className="h-full w-1/4 bg-accent rounded-full"
                        style={{ animation: 'forge-sweep 1.4s cubic-bezier(0.65, 0, 0.35, 1) infinite' }}
                    />
                </div>
                <p className="text-[9px] text-stone-500 font-mono font-medium uppercase tracking-[0.35em] mt-5">
                    Forging Database
                </p>
            </div>
        </div>
    )
}
