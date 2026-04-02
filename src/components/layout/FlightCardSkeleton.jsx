import React from "react";

function SkeletonBlock({ className }) {
    return (
        <div className={`bg-gray-300/60 animate-pulse rounded ${className}`} />
    );
}

export default function FlightCardSkeleton() {
    return (
        <div className="rounded-2xl">
            <div className="py-6 bg-white rounded-xl shadow-sm">

                {/* Top strip */}
                <div className="py-3 px-4 mb-3">
                    <SkeletonBlock className="h-3 w-40" />
                </div>

                {/* Main Row */}
                <div className="py-3 px-4 flex items-center justify-between gap-4">

                    {/* Airline */}
                    <div className="flex items-center gap-3">
                        <SkeletonBlock className="w-10 h-10 rounded-full" />
                        <div>
                            <SkeletonBlock className="h-4 w-16 mb-2" />
                            <SkeletonBlock className="h-3 w-12" />
                        </div>
                    </div>

                    {/* Times */}
                    <div className="flex items-center gap-6 flex-1 justify-center">
                        <div className="text-center">
                            <SkeletonBlock className="h-5 w-12 mb-1" />
                            <SkeletonBlock className="h-3 w-8" />
                        </div>

                        <div className="flex flex-col items-center">
                            <SkeletonBlock className="h-3 w-10 mb-1" />
                            <SkeletonBlock className="h-1 w-16" />
                            <SkeletonBlock className="h-3 w-12 mt-1" />
                        </div>

                        <div className="text-center">
                            <SkeletonBlock className="h-5 w-12 mb-1" />
                            <SkeletonBlock className="h-3 w-8" />
                        </div>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                        <SkeletonBlock className="h-5 w-16 mb-2" />
                        <SkeletonBlock className="h-3 w-12" />
                    </div>

                    {/* Button */}
                    <SkeletonBlock className="h-8 w-28 rounded-full hidden md:block" />
                </div>

                {/* Bottom */}
                <div className="py-3 px-4 mt-4 flex justify-between items-center">
                    <SkeletonBlock className="h-4 w-32" />
                    <SkeletonBlock className="h-4 w-40" />
                </div>
            </div>
        </div>
    );
}