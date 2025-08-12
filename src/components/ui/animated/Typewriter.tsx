import React, { useEffect, useMemo, useRef, useState } from "react";

interface TypewriterProps {
  words: string[];
  typingSpeed?: number; // ms per char
  deletingSpeed?: number; // ms per char
  pauseBetween?: number; // ms pause at end of word
  className?: string;
}

const Typewriter: React.FC<TypewriterProps> = ({
  words,
  typingSpeed = 60,
  deletingSpeed = 40,
  pauseBetween = 1200,
  className,
}) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [blink, setBlink] = useState(true);
  const mounted = useRef(true);

  const currentWord = useMemo(() => words[index % words.length] || "", [index, words]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setBlink((b) => !b), 500);
    return () => clearTimeout(timer);
  }, [blink]);

  useEffect(() => {
    if (!mounted.current) return;
    if (!deleting && subIndex === currentWord.length) {
      const pause = setTimeout(() => setDeleting(true), pauseBetween);
      return () => clearTimeout(pause);
    }
    if (deleting && subIndex === 0) {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((s) => s + (deleting ? -1 : 1));
    }, deleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [subIndex, deleting, currentWord, words.length, typingSpeed, deletingSpeed, pauseBetween]);

  return (
    <span className={className} aria-live="polite">
      {currentWord.substring(0, subIndex)}
      <span aria-hidden="true" className="inline-block w-[1ch]">
        {blink ? "|" : "\u00A0"}
      </span>
    </span>
  );
};

export default Typewriter;
