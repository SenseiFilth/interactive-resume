"use client";

import { useRef, useCallback } from "react";
import { motion } from "framer-motion";

const MODES = [
  { key: "creative", label: "Creative Mode" },
  { key: "recruiter", label: "Recruiter Mode" },
] as const;

export type ViewMode = (typeof MODES)[number]["key"];

export default function RecruiterToggle({
  active,
  onChange,
}: {
  active: ViewMode;
  onChange: (mode: ViewMode) => void;
}) {
  const lastClickRef = useRef(0);

  const handleClick = useCallback(
    (mode: ViewMode) => {
      const now = Date.now();
      if (now - lastClickRef.current < 400) return;
      if (mode === active) return;
      lastClickRef.current = now;
      onChange(mode);
    },
    [active, onChange]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4, duration: 0.5 }}
      className="relative inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.03] p-1 overflow-hidden"
    >
      {/* Sliding fill — positioned via `left` so it stays strictly within
          the rounded container and never bleeds at the edges.
          overflow-hidden on the parent clips any sub-pixel overshoot. */}
      <motion.div
        className="absolute top-1 bottom-1 rounded-full bg-crimson/90"
        style={{ width: "calc(50% - 4px)" }}
        animate={{
          left: active === "creative" ? "4px" : "calc(50%)",
        }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
      />

      {MODES.map((mode) => (
        <button
          key={mode.key}
          onClick={() => handleClick(mode.key)}
          className="relative z-10 cursor-pointer px-6 py-2 text-xs font-medium tracking-widest uppercase"
          style={{
            color: active === mode.key ? "#ffffff" : "#888888",
            minWidth: "140px",
            transition: "color 0.22s ease",
          }}
        >
          {mode.label}
        </button>
      ))}
    </motion.div>
  );
}
