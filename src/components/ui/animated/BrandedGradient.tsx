import React from "react";

interface BrandedGradientProps {
  position?: "fixed" | "absolute";
  className?: string;
}

const BrandedGradient = ({ position = "absolute", className }: BrandedGradientProps) => {
  return (
    <div className={`${position} inset-0 -z-10 overflow-hidden ${className ?? ''}`} aria-hidden>
      {/* Animated brand gradient */}
      <div className="animated-gradient absolute inset-0" />

      {/* Subtle brand blobs */}
      <div className="absolute -top-16 -left-20 w-72 h-72 rounded-full bg-primary-start/20 blur-3xl animate-float-slow motion-reduce:animate-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-primary-end/20 blur-3xl animate-float-slow [animation-delay:3s] motion-reduce:animate-none" />
    </div>
  );
};

export default BrandedGradient;
