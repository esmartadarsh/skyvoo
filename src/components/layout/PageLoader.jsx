import React from "react";

export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">

      <div className="flex flex-col items-center gap-6">

        {/* Animated Logo / Circle */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-slate-900 border-t-transparent animate-spin"></div>
        </div>

        {/* Text */}
        <div className="text-center">
          <p className="text-slate-500 text-sm">
            Please wait a moment...
          </p>
        </div>

      </div>
    </div>
  );
}