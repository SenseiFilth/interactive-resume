"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Role } from "@/data/content";

export default function RoleCard({
  role,
  index,
}: {
  role: Role;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      {/* ── Gradient border wrapper ── */}
      <div
        className="relative rounded-none p-[1px] transition-all duration-500"
        style={{
          background: expanded
            ? "linear-gradient(135deg, rgba(220,20,60,0.3) 0%, rgba(220,20,60,0.05) 40%, transparent 70%)"
            : "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 50%, transparent 100%)",
        }}
      >
        {/* ── Base surface ── */}
        <div
          className="relative overflow-hidden"
          style={{ background: "rgb(6,6,6)" }}
        >
          {/* Inner glow layer — bleeds from top-left corner */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(ellipse at 0% 0%, rgba(220,20,60,0.06) 0%, transparent 60%)",
            }}
          />

          {/* Shimmer sweep on hover */}
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            whileHover={{ x: "200%", opacity: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" as const }}
            className="pointer-events-none absolute inset-0 z-10 -skew-x-12"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.025) 50%, transparent 100%)",
              width: "50%",
            }}
          />

          {/* ── Top edge accent line ── */}
          <div
            className="absolute inset-x-0 top-0 h-[1px] transition-all duration-500"
            style={{
              background: expanded
                ? "linear-gradient(90deg, rgba(220,20,60,0.6), rgba(220,20,60,0.2) 60%, transparent)"
                : "linear-gradient(90deg, rgba(220,20,60,0.0), rgba(220,20,60,0.12) 40%, transparent)",
            }}
          />

          <div className="px-7 pt-7 pb-6 sm:px-9 sm:pt-8 sm:pb-7">
            {/* ── Expand indicator — top right corner ── */}
            <div className="absolute top-5 right-5 pointer-events-none">
              <motion.span
                animate={{ rotate: expanded ? 45 : 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="block font-mono text-lg leading-none select-none"
                style={{ color: expanded ? "rgba(220,20,60,0.55)" : "rgba(255,255,255,0.15)" }}
              >
                +
              </motion.span>
            </div>

            {/* ── Header row ── */}
            <div className="flex flex-col items-center gap-2">
              <div className="min-w-0 flex-1 text-center">
                {/* Index watermark */}
                <span
                  className="mb-2 block font-mono text-[10px] tracking-[0.3em] transition-colors duration-300"
                  style={{
                    color: expanded ? "rgba(220,20,60,0.5)" : "rgba(255,255,255,0.12)",
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Organization — dominant anchor */}
                <h4 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {role.organization}
                </h4>

                {/* Role — secondary */}
                <p
                  className="mt-1 text-sm font-medium tracking-wide transition-colors duration-300"
                  style={{
                    color: expanded ? "rgba(220,20,60,0.7)" : "rgba(220,20,60,0.45)",
                  }}
                >
                  {role.role}
                </p>

                {/* Timeframe */}
                <span className="mt-2 block font-mono text-xs tracking-wider text-white/20">
                  {role.timeframe}
                </span>
              </div>
            </div>

            {/* ── Impact line ── */}
            <p className="mt-5 text-sm leading-relaxed text-white/40 text-center">
              {role.impact}
            </p>

            {/* ── Tags ── */}
            <div className="mt-4 flex flex-wrap gap-1.5 justify-center">
              {role.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-sm px-2 py-0.5 font-mono text-[9px] tracking-widest uppercase transition-colors duration-300"
                  style={{
                    color: expanded ? "rgba(220,20,60,0.6)" : "rgba(255,255,255,0.2)",
                    border: expanded
                      ? "1px solid rgba(220,20,60,0.18)"
                      : "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* ── Expandable details ── */}
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div
                    className="mt-6 border-t pt-5"
                    style={{ borderColor: "rgba(220,20,60,0.1)" }}
                  >
                    <p className="mb-3 font-mono text-[9px] tracking-[0.3em] uppercase" style={{ color: "rgba(220,20,60,0.4)" }}>
                      Details
                    </p>
                    <ul className="flex flex-col gap-2.5">
                      {role.details.map((detail, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.07, duration: 0.35 }}
                          className="flex items-start gap-3 text-sm leading-relaxed"
                          style={{ color: "rgba(255,255,255,0.45)" }}
                        >
                          <span
                            className="mt-[7px] h-[3px] w-[3px] shrink-0 rounded-full"
                            style={{ background: "rgba(220,20,60,0.5)" }}
                          />
                          {detail}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
