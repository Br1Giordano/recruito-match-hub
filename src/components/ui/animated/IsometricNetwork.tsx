import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { motion } from "framer-motion";

interface IsometricNetworkProps {
  className?: string;
}

// Tries to load public/lottie/isometric-network.json; falls back to a simple SVG with float animation
const IsometricNetwork: React.FC<IsometricNetworkProps> = ({ className }) => {
  const [data, setData] = useState<any | null>(null);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    fetch("/lottie/isometric-network.json")
      .then((r) => (r.ok ? r.json() : null))
      .then(setData)
      .catch(() => setData(null));
  }, []);

  if (!data) {
    // Fallback SVG
    return (
      <motion.div
        className={className}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 300 220" role="img" aria-label="Rete isometrica azienda–recruiter–candidato" className="w-full h-auto">
          <defs>
            <linearGradient id="node" x1="0" x2="1">
              <stop offset="0%" stopColor="hsl(var(--primary-start))" />
              <stop offset="100%" stopColor="hsl(var(--primary-end))" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="110" r="18" fill="url(#node)" />
          <circle cx="150" cy="40" r="18" fill="url(#node)" />
          <circle cx="150" cy="180" r="18" fill="url(#node)" />
          <circle cx="250" cy="110" r="18" fill="url(#node)" />

          <g stroke="hsl(var(--primary-start))" strokeOpacity=".25">
            <line x1="50" y1="110" x2="150" y2="40" />
            <line x1="50" y1="110" x2="150" y2="180" />
            <line x1="250" y1="110" x2="150" y2="40" />
            <line x1="250" y1="110" x2="150" y2="180" />
            <line x1="50" y1="110" x2="250" y2="110" />
          </g>
        </svg>
      </motion.div>
    );
  }

  return (
    <div className={className} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <Lottie
        autoplay={!hover}
        loop
        animationData={data}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default IsometricNetwork;
