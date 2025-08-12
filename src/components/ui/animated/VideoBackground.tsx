import { useEffect, useState } from "react";

interface VideoBackgroundProps {
  src: string;
  poster?: string;
  className?: string;
}

const VideoBackground = ({ src, poster, className }: VideoBackgroundProps) => {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    const set = () => setReduced(m.matches);
    set();
    m.addEventListener?.('change', set);
    return () => m.removeEventListener?.('change', set);
  }, []);

  if (reduced) return null; // Respect user preference

  return (
    <div className={`absolute inset-0 -z-10 overflow-hidden ${className ?? ''}`} aria-hidden>
      <video
        className="h-full w-full object-cover"
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
    </div>
  );
};

export default VideoBackground;
