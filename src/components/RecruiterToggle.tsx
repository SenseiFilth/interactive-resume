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
      // Debounce: ignore clicks within 400ms of last
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
      className="relative inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.03] p-1"
    >
      {/* Sliding red indicator — layoutId only on this element */}
      <motion.div
        layoutId="mode-pill"
        className="absolute top-1 bottom-1 rounded-full bg-crimson/90"
        style={{ width: "calc(50% - 4px)" }}
        animate={{
          x: active === "creative" ? 4 : "calc(100% + 4px)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
      />

      {MODES.map((mode) => (
        <button
          key={mode.key}
          onClick={() => handleClick(mode.key)}
          className="relative z-10 cursor-pointer px-6 py-2 text-xs font-medium tracking-widest uppercase"
          style={{
            color: active === mode.key ? "#ffffff" : "#888888",
            minWidth: "140px",
            transition: "color 0.2s ease",
          }}
        >
          {mode.label}
        </button>
      ))}
    </motion.div>
  );
}
