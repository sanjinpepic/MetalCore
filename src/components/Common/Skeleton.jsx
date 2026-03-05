import React from 'react';

const Skeleton = ({ className, width, height, borderRadius = '12px' }) => {
    return (
        <div
            className={`skeleton ${className || ''}`}
            style={{
                width: width || '100%',
                height: height || '20px',
                borderRadius: borderRadius
            }}
        />
    );
};

export const HomeSkeleton = () => {
    return (
        <div className="flex flex-col flex-1 min-h-screen p-6 md:p-12 space-y-12 animate-in fade-in duration-500">
            {/* Hero Skeleton */}
            <div className="space-y-6 flex flex-col items-center text-center max-w-2xl mx-auto w-full">
                <Skeleton width="120px" height="24px" borderRadius="100px" />
                <Skeleton width="100%" height="80px" borderRadius="20px" />
                <Skeleton width="80%" height="40px" />
            </div>

            {/* Stats Skeleton */}
            <div className="flex justify-center gap-12 py-8 border-y border-white/5">
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex flex-col items-center space-y-2">
                        <Skeleton width="60px" height="12px" />
                        <Skeleton width="80px" height="48px" />
                    </div>
                ))}
            </div>

            {/* Main Content Skeleton */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 max-w-[1920px] mx-auto w-full">
                <div className="xl:col-span-8 flex flex-col space-y-6">
                    <Skeleton width="100%" height="500px" borderRadius="48px" />
                </div>
                <div className="xl:col-span-4 flex flex-col space-y-6">
                    <Skeleton width="100%" height="500px" borderRadius="48px" />
                </div>
            </div>
        </div>
    );
};

export default Skeleton;
