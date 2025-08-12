import React from "react";

interface ClientLogosMarqueeProps {
  logos: string[];
}

const ClientLogosMarquee: React.FC<ClientLogosMarqueeProps> = ({ logos }) => {
  if (!logos || logos.length === 0) return null;

  // Duplicate for seamless loop
  const all = [...logos, ...logos];

  return (
    <section aria-label="Clienti" className="py-12">
      <div className="container-startup overflow-hidden">
        <div className="marquee flex items-center gap-10 opacity-80 hover:opacity-100">
          {all.map((src, i) => (
            <img
              key={`${src}-${i}`}
              src={src}
              alt="Logo cliente Recruito"
              className="h-10 w-auto object-contain grayscale hover:grayscale-0 transition"
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientLogosMarquee;
