'use client'

import { motion } from 'framer-motion';

// Shimmer animation component
function Shimmer({ className = '' }) {
    return (
        <div className={`relative overflow-hidden bg-white/[0.03] rounded ${className}`}>
            <motion.div
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent"
                animate={{ translateX: ['−100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
        </div>
    );
}

// Steel card skeleton - matches SearchView card layout
export function SteelCardSkeleton() {
    return (
        <div className="glass-panel rounded-2xl md:rounded-3xl p-6 md:p-8 border border-white/5">
            <div className="flex justify-between items-start mb-4 md:mb-6">
                <div className="space-y-2.5 flex-1">
                    <Shimmer className="h-3 w-20 rounded-full" />
                    <Shimmer className="h-5 w-32 rounded-lg" />
                    <Shimmer className="h-3 w-48 rounded-full mt-2" />
                </div>
                <Shimmer className="w-10 h-10 rounded-full shrink-0" />
            </div>
            <div className="grid grid-cols-3 gap-2 md:gap-3">
                {[...Array(6)].map((_, i) => (
                    <Shimmer key={i} className="h-14 rounded-xl" />
                ))}
            </div>
        </div>
    );
}

// Grid of steel card skeletons
export function SteelGridSkeleton({ count = 8 }) {
    return (
        <div className="p-6 md:p-12 pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 pb-32 items-start">
            {[...Array(count)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                    <SteelCardSkeleton />
                </motion.div>
            ))}
        </div>
    );
}

// Knife card skeleton
export function KnifeCardSkeleton() {
    return (
        <div className="glass-panel rounded-2xl md:rounded-3xl overflow-hidden border border-white/5">
            <Shimmer className="w-full h-48 rounded-none" />
            <div className="p-5 space-y-3">
                <Shimmer className="h-3 w-16 rounded-full" />
                <Shimmer className="h-5 w-28 rounded-lg" />
                <div className="flex gap-2 pt-2">
                    <Shimmer className="h-7 w-16 rounded-full" />
                    <Shimmer className="h-7 w-16 rounded-full" />
                    <Shimmer className="h-7 w-16 rounded-full" />
                </div>
            </div>
        </div>
    );
}

// Detail modal skeleton
export function DetailSkeleton() {
    return (
        <div className="space-y-6 py-4">
            <div className="space-y-3">
                <Shimmer className="h-3 w-24 rounded-full" />
                <Shimmer className="h-8 w-48 rounded-lg" />
                <Shimmer className="h-4 w-full rounded-lg" />
                <Shimmer className="h-4 w-3/4 rounded-lg" />
            </div>
            <div className="grid grid-cols-3 gap-3">
                {[...Array(6)].map((_, i) => (
                    <Shimmer key={i} className="h-16 rounded-xl" />
                ))}
            </div>
            <Shimmer className="h-48 w-full rounded-2xl" />
            <div className="space-y-2">
                <Shimmer className="h-4 w-full rounded-lg" />
                <Shimmer className="h-4 w-5/6 rounded-lg" />
                <Shimmer className="h-4 w-2/3 rounded-lg" />
            </div>
        </div>
    );
}

// Home view hero skeleton
export function HeroSkeleton() {
    return (
        <div className="p-6 md:p-12 lg:p-20 space-y-6">
            <Shimmer className="h-3 w-24 rounded-full" />
            <Shimmer className="h-16 w-80 rounded-xl" />
            <Shimmer className="h-4 w-96 rounded-lg" />
            <Shimmer className="h-14 w-full max-w-2xl rounded-2xl mt-4" />
        </div>
    );
}
