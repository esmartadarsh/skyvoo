import React from "react";
import FlyingPlane from "@/assets/vectors/FlyingPlane.svg";

export default function LoadingBar({ progress = 0, label = true }) {
  // Clamp progress between 0 and 100 to prevent layout issues
  const safeProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="z-90 relative w-full h-10 overflow-hidden flex items-center">
      {/* Progress Fill */}
      <div
        className="h-3 bg-[#78080B] transition-all duration-500 ease-in-out"
        style={{ width: `${safeProgress}%` }}
      ></div>

      {/* Flying Plane */}
      <img
        src={FlyingPlane}
        alt="Plane"
        className="absolute top-0 transition-all duration-500 ease-in-out"
        style={{
          height: "100%", // matches bar height
          left: `calc(${safeProgress}% - 5px)`, // adjust offset for plane width
        }}
      />
    </div>
  );
}
