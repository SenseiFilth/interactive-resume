"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import RecruiterToggle, { type ViewMode } from "./RecruiterToggle";

const FONT_CLASSES = [
  "font-cloister",
  "font-drips",
  "font-rush",
  "font-ryga",
  "font-strike",
];

const NAME = "Alex";
const LETTERS = NAME.split("");

/* Fixed letter widths to prevent layout shift during font swap */
const LETTER_WIDTHS: Record<string, string> = {
  A: "w-[6rem] sm:w-[9rem] md:w-[12rem]",
  l: "w-[3.5rem] sm:w-[5rem] md:w-[7rem]",
  e: "w-[5rem] sm:w-[7.5rem] md:w-[10rem]",
  x: "w-[5.5rem] sm:w-[8rem] md:w-[10.5rem]",
};

function getRandomFonts(count: number): string[] {
  const shuffled = [...FONT_CLASSES].sort(() => Math.random() - 0.5);
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(shuffled[i % shuffled.length]);
  }
  for (let i = 1; i < result.length; i++) {
    if (result[i] === result[i - 1]) {
      const alt = FONT_CLASSES.filter((f) => f !== result[i]);
      result[i] = alt[Math.floor(Math.random() * alt.length)];
    }
  }
  return result;
}

const BASE_FONT = ""; // clean Inter / system font

export default function HeroSection({
  viewMode,
  onViewModeChange,
}: {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}) {
  const [letterFonts, setLetterFonts] = useState<string[]>(
    LETTERS.map(() => BASE_FONT)
  );
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  // Ref so scroll handler always sees latest viewMode without re-registering
  const viewModeRef = useRef(viewMode);
  useEffect(() => { viewModeRef.current = viewMode; }, [viewMode]);

  // When switching to recruiter mode, reset fonts immediately
  useEffect(() => {
    if (viewMode === "recruiter") {
      setLetterFonts(LETTERS.map(() => BASE_FONT));
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    }
  }, [viewMode]);

  const handleScroll = useCallback(() => {
    // Disabled in recruiter mode — prevents toggle interference
    if (viewModeRef.current === "recruiter") return;

    // Throttle via rAF to prevent excessive re-renders
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      setLetterFonts(getRandomFonts(LETTERS.length));
      rafRef.current = null;
    });

    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      setLetterFonts(LETTERS.map(() => BASE_FONT));
    }, 350);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);

  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden bg-black">
      {/* Radial red glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(220,20,60,0.05)_0%,_transparent_70%)]" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Name — fixed-width letter containers prevent layout shift */}
        <div className="red-pulse flex items-center">
          {LETTERS.map((letter, i) => (
            <span
              key={i}
              className={`relative inline-flex items-center justify-center ${LETTER_WIDTHS[letter] || ""}`}
            >
              <span
                className={`inline-block text-center text-[8rem] font-bold leading-none text-white will-change-[font-family] sm:text-[12rem] md:text-[16rem] ${letterFonts[i]}`}
                style={{ transition: "font-family 0.15s ease" }}
              >
                {letter}
              </span>
            </span>
          ))}

          {/* Blinking cursor */}
          <motion.span
            animate={{ opacity: [1, 1, 0, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, times: [0, 0.45, 0.5, 1] }}
            className="ml-1 inline-block h-[6rem] w-[3px] self-center rounded-full sm:h-[9rem] md:h-[12rem]"
            style={{
              background: "linear-gradient(to bottom, #ffffff, rgba(220,20,60,0.6))",
            }}
          />
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-6 text-sm tracking-[0.4em] text-steel uppercase"
        >
          Curiosity &rarr; Adaptation &rarr; Systems &rarr; Builder
        </motion.p>

        {/* Toggle */}
        <div className="mt-10">
          <RecruiterToggle active={viewMode} onChange={onViewModeChange} />
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="absolute -bottom-24 flex flex-col items-center gap-2"
        >
          <span className="text-xs tracking-widest text-steel/50 uppercase">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="h-6 w-[1px] bg-gradient-to-b from-crimson/60 to-transparent"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
