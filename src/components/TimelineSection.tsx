"use client";

import { useRef, useMemo, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import { signalBlocks } from "@/data/content";

/* ══════════════════════════════════════════════════════════════════
   STAR FIELD — 3 depth layers, 174 total
   near: bright + animated twinkle
   mid:  medium glow, static
   far:  tiny + very dim, dense
   ══════════════════════════════════════════════════════════════════ */
interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  dur: number;
  delay: number;
}

function useStarLayers() {
  return useMemo(() => {
    let id = 0;
    function make(
      count: number,
      minSz: number,
      maxSz: number,
      minOp: number,
      maxOp: number,
      minDur: number,
      maxDur: number
    ): Star[] {
      return Array.from({ length: count }, () => ({
        id: id++,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: minSz + Math.random() * (maxSz - minSz),
        opacity: minOp + Math.random() * (maxOp - minOp),
        dur: minDur + Math.random() * (maxDur - minDur),
        delay: Math.random() * 5,
      }));
    }
    return {
      near: make(24, 1.8, 3.5,  0.55, 1.00, 3,  6),
      mid:  make(58, 0.9, 2.0,  0.22, 0.52, 6,  10),
      far:  make(92, 0.3, 0.9,  0.05, 0.18, 10, 16),
    };
  }, []);
}

/* ══════════════════════════════════════════════════════════════════
   LAYOUT
   ══════════════════════════════════════════════════════════════════ */
const NODE_POS = [
  { x: 26, y: 33 }, // 0 — Built to Deconstruct  (upper left)
  { x: 68, y: 23 }, // 1 — Creative Systems       (upper right)
  { x: 23, y: 67 }, // 2 — Real-World Systems     (lower left)
  { x: 69, y: 70 }, // 3 — Intelligent Systems    (lower right)
] as const;

// [fromIdx, toIdx, drawStart, drawEnd, isPrimary]
const LINES: readonly [number, number, number, number, boolean][] = [
  [0, 1, 0.26, 0.38, true ],
  [1, 2, 0.51, 0.63, true ],
  [2, 3, 0.76, 0.88, true ],
  [0, 2, 0.58, 0.68, false],
  [1, 3, 0.83, 0.93, false],
] as const;

/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   500vh outer container → sticky 100vh viewport
   scrollYProgress (0→1) drives node/content/line animations directly
   — no spring lag on core animations for real-time scroll sync
   A lighter spring is kept only for the camera parallax drift
   ══════════════════════════════════════════════════════════════════ */
export default function TimelineSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tracking
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springMX = useSpring(mouseX, { stiffness: 30, damping: 20 });
  const springMY = useSpring(mouseY, { stiffness: 30, damping: 20 });

  // Raw scroll progress — used directly for node/line/content so they
  // are perfectly in sync with the user's scroll position (no lag)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Lighter spring ONLY for camera parallax — keeps the scene drift smooth
  const camSpring = useSpring(scrollYProgress, { stiffness: 150, damping: 35 });

  const stars = useStarLayers();

  // ── Camera drift (scroll) ────────────────────────────────────────────────
  const camScrollX = useTransform(camSpring, [0, 1], ["-2.5%", "2.5%"]);
  const camScrollY = useTransform(camSpring, [0, 1], ["0%",    "-2%"  ]);

  // ── Camera drift (mouse) ─────────────────────────────────────────────────
  const camMouseX = useTransform(springMX, [0, 1], ["-2%",   "2%"   ]);
  const camMouseY = useTransform(springMY, [0, 1], ["-1.5%", "1.5%" ]);

  // ── Star layer depth parallax ────────────────────────────────────────────
  const nearY = useTransform(camSpring, [0, 1], ["0%", "-14%"]);
  const midY  = useTransform(camSpring, [0, 1], ["0%", "-6%" ]);
  const farY  = useTransform(camSpring, [0, 1], ["0%", "-2%" ]);

  // ── Header fade — disappears as you move into the experience ─────────────
  // Using scrollYProgress directly = instant response, no lag
  const headerOp = useTransform(scrollYProgress, [0, 0.04, 0.12], [1, 1, 0]);

  // ── Node visibility: ghost → active → depart ─────────────────────────────
  // Direct scrollYProgress = perfectly in sync with scroll, no spring lag
  // Thresholds slightly tightened vs. previous version for snappier feel
  const n0 = useTransform(scrollYProgress,
    [0.00, 0.06, 0.17, 0.26, 0.30],
    [0.12, 1.00, 1.00, 0.30, 0.20]);
  const n1 = useTransform(scrollYProgress,
    [0.00, 0.24, 0.32, 0.44, 0.52, 0.55],
    [0.06, 0.06, 1.00, 1.00, 0.30, 0.20]);
  const n2 = useTransform(scrollYProgress,
    [0.00, 0.49, 0.57, 0.69, 0.77, 0.80],
    [0.03, 0.03, 1.00, 1.00, 0.30, 0.20]);
  const n3 = useTransform(scrollYProgress,
    [0.00, 0.74, 0.82, 0.94, 1.00],
    [0.01, 0.01, 1.00, 1.00, 1.00]);

  // ── Node scale: pop on arrival, settle, shrink on departure ─────────────
  const s0 = useTransform(scrollYProgress,
    [0.00, 0.06, 0.15, 0.26, 0.30],
    [0.45, 1.35, 1.00, 0.78, 0.60]);
  const s1 = useTransform(scrollYProgress,
    [0.24, 0.32, 0.41, 0.52, 0.55],
    [0.45, 1.35, 1.00, 0.78, 0.60]);
  const s2 = useTransform(scrollYProgress,
    [0.49, 0.57, 0.66, 0.77, 0.80],
    [0.45, 1.35, 1.00, 0.78, 0.60]);
  const s3 = useTransform(scrollYProgress,
    [0.74, 0.82, 0.91, 1.00],
    [0.45, 1.35, 1.00, 1.00]);

  // ── Content panel visibility ─────────────────────────────────────────────
  const c0 = useTransform(scrollYProgress, [0.08, 0.14, 0.23, 0.27], [0, 1, 1, 0]);
  const c1 = useTransform(scrollYProgress, [0.33, 0.39, 0.48, 0.52], [0, 1, 1, 0]);
  const c2 = useTransform(scrollYProgress, [0.58, 0.64, 0.73, 0.77], [0, 1, 1, 0]);
  const c3 = useTransform(scrollYProgress, [0.83, 0.89, 1.00],       [0, 1, 1  ]);

  // ── Constellation line pathLength (draws AFTER node arrives) ────────────
  const l01 = useTransform(scrollYProgress, [0.26, 0.38], [0, 1]);
  const l12 = useTransform(scrollYProgress, [0.51, 0.63], [0, 1]);
  const l23 = useTransform(scrollYProgress, [0.76, 0.88], [0, 1]);
  const l02 = useTransform(scrollYProgress, [0.58, 0.68], [0, 1]);
  const l13 = useTransform(scrollYProgress, [0.83, 0.93], [0, 1]);
  const linePaths = [l01, l12, l23, l02, l13];

  // ── Scroll cue ───────────────────────────────────────────────────────────
  const scrollCueOp = useTransform(scrollYProgress, [0, 0.04, 0.10], [1, 1, 0]);

  const nodeOpacity = [n0, n1, n2, n3];
  const nodeScale   = [s0, s1, s2, s3];
  const contentOp   = [c0, c1, c2, c3];

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const r = e.currentTarget.getBoundingClientRect();
      mouseX.set(e.clientX / r.width);
      mouseY.set(e.clientY / r.height);
    },
    [mouseX, mouseY]
  );

  return (
    <div ref={containerRef} className="relative" style={{ height: "500vh" }}>

      {/* Sticky viewport */}
      <div
        className="sticky top-0 h-screen overflow-hidden bg-black"
        onMouseMove={handleMouseMove}
      >
        {/* ── Section label — centered, fades out as you traverse ── */}
        <motion.div
          style={{ opacity: headerOp }}
          className="pointer-events-none absolute top-8 left-0 right-0 z-30 flex flex-col items-center select-none"
        >
          <p className="font-mono text-[10px] tracking-[0.45em] text-crimson/60 uppercase">
            Signal Map
          </p>
          <p className="mt-0.5 font-mono text-[9px] tracking-[0.3em] text-white/20 uppercase">
            Origin Story
          </p>
        </motion.div>

        {/* ── Scroll camera: scene drifts with scroll ── */}
        <motion.div
          className="absolute inset-0"
          style={{ x: camScrollX, y: camScrollY }}
        >
          {/* ── Mouse camera: scene drifts with cursor ── */}
          <motion.div
            className="absolute inset-0"
            style={{ x: camMouseX, y: camMouseY }}
          >

            {/* ── Far star layer — dense, dim, barely moves ── */}
            <motion.div
              className="pointer-events-none absolute inset-0"
              style={{ y: farY }}
            >
              {stars.far.map((s) => (
                <div
                  key={s.id}
                  className="absolute rounded-full bg-white"
                  style={{
                    left:    `${s.x}%`,
                    top:     `${s.y}%`,
                    width:   `${s.size}px`,
                    height:  `${s.size}px`,
                    opacity: s.opacity,
                  }}
                />
              ))}
            </motion.div>

            {/* ── Mid star layer ── */}
            <motion.div
              className="pointer-events-none absolute inset-0"
              style={{ y: midY }}
            >
              {stars.mid.map((s) => (
                <div
                  key={s.id}
                  className="absolute rounded-full bg-white"
                  style={{
                    left:    `${s.x}%`,
                    top:     `${s.y}%`,
                    width:   `${s.size}px`,
                    height:  `${s.size}px`,
                    opacity: s.opacity,
                  }}
                />
              ))}
            </motion.div>

            {/* ── Near star layer — bright, large, animated twinkle ── */}
            <motion.div
              className="pointer-events-none absolute inset-0"
              style={{ y: nearY }}
            >
              {stars.near.map((s) => (
                <motion.div
                  key={s.id}
                  className="absolute rounded-full bg-white"
                  style={{
                    left:   `${s.x}%`,
                    top:    `${s.y}%`,
                    width:  `${s.size}px`,
                    height: `${s.size}px`,
                    boxShadow: `0 0 ${s.size * 2.5}px rgba(255,255,255,${(s.opacity * 0.6).toFixed(2)})`,
                  }}
                  animate={{ opacity: [s.opacity, s.opacity * 0.2, s.opacity] }}
                  transition={{
                    duration: s.dur,
                    delay:    s.delay,
                    repeat:   Infinity,
                    ease:     "easeInOut",
                  }}
                />
              ))}
            </motion.div>

            {/* ── Atmospheric glow ── */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 45% 45%, rgba(220,20,60,0.045) 0%, transparent 65%)",
              }}
            />

            {/* ── Constellation lines — pathLength tied directly to scroll ── */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              style={{ zIndex: 10 }}
            >
              {LINES.map((line, i) => {
                const from      = line[0];
                const to        = line[1];
                const isPrimary = line[4];
                const a = NODE_POS[from];
                const b = NODE_POS[to];
                return (
                  <motion.path
                    key={i}
                    d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`}
                    fill="none"
                    stroke={
                      isPrimary
                        ? "rgba(220,20,60,0.65)"
                        : "rgba(220,20,60,0.22)"
                    }
                    strokeWidth={isPrimary ? "0.20" : "0.09"}
                    strokeLinecap="round"
                    style={{
                      pathLength: linePaths[i],
                      filter: isPrimary
                        ? "drop-shadow(0 0 1.5px rgba(220,20,60,0.55))"
                        : "none",
                    }}
                  />
                );
              })}
            </svg>

            {/* ── Nodes — zero-size anchor at each % position ── */}
            {signalBlocks.map((block, i) => {
              const pos    = NODE_POS[i];
              const isLeft = pos.x < 50;

              return (
                <div
                  key={block.id}
                  className="absolute"
                  style={{
                    left:     `${pos.x}%`,
                    top:      `${pos.y}%`,
                    width:    0,
                    height:   0,
                    overflow: "visible",
                    zIndex:   20,
                  }}
                >
                  <motion.div
                    style={{
                      position: "absolute" as const,
                      width:    0,
                      height:   0,
                      overflow: "visible",
                      opacity:  nodeOpacity[i],
                      scale:    nodeScale[i],
                    }}
                  >
                    {/* Outer glow blob */}
                    <div
                      className="absolute rounded-full pointer-events-none"
                      style={{
                        width:  "68px",
                        height: "68px",
                        left:   "-34px",
                        top:    "-34px",
                        background:
                          "radial-gradient(circle, rgba(220,20,60,0.28) 0%, transparent 70%)",
                      }}
                    />

                    {/* Pulse ring — primary */}
                    <motion.div
                      className="absolute rounded-full pointer-events-none"
                      style={{
                        width:  "18px",
                        height: "18px",
                        left:   "-9px",
                        top:    "-9px",
                        border: "1px solid rgba(220,20,60,0.55)",
                      }}
                      animate={{
                        scale:   [1, 2.5, 1],
                        opacity: [0.7, 0, 0.7],
                      }}
                      transition={{
                        duration: 2.8 + i * 0.5,
                        repeat:   Infinity,
                        ease:     "easeOut",
                        delay:    i * 0.7,
                      }}
                    />

                    {/* Pulse ring — secondary (offset phase) */}
                    <motion.div
                      className="absolute rounded-full pointer-events-none"
                      style={{
                        width:  "18px",
                        height: "18px",
                        left:   "-9px",
                        top:    "-9px",
                        border: "1px solid rgba(220,20,60,0.25)",
                      }}
                      animate={{
                        scale:   [1, 1.75, 1],
                        opacity: [0.4, 0, 0.4],
                      }}
                      transition={{
                        duration: 2.2 + i * 0.4,
                        repeat:   Infinity,
                        ease:     "easeOut",
                        delay:    i * 0.7 + 1.3,
                      }}
                    />

                    {/* Core dot */}
                    <div
                      className="absolute rounded-full bg-crimson"
                      style={{
                        width:  "8px",
                        height: "8px",
                        left:   "-4px",
                        top:    "-4px",
                        boxShadow:
                          "0 0 10px rgba(220,20,60,0.95), 0 0 28px rgba(220,20,60,0.4)",
                      }}
                    />

                    {/* Content panel */}
                    <motion.div
                      className="absolute w-36 sm:w-52 pointer-events-none"
                      style={{
                        ...(isLeft ? { left: "14px" } : { right: "14px" }),
                        top:     "0px",
                        y:       "-50%",
                        opacity: contentOp[i],
                      }}
                    >
                      <div
                        style={{
                          background:     "rgba(0,0,0,0.85)",
                          backdropFilter: "blur(18px)",
                          padding:        "12px 14px",
                          border:         "1px solid rgba(220,20,60,0.14)",
                          borderLeft: isLeft
                            ? "2px solid rgba(220,20,60,0.6)"
                            : "1px solid rgba(220,20,60,0.14)",
                          borderRight: !isLeft
                            ? "2px solid rgba(220,20,60,0.6)"
                            : "1px solid rgba(220,20,60,0.14)",
                        }}
                      >
                        <p className="font-mono text-[8px] tracking-[0.4em] text-crimson/55 uppercase mb-1">
                          {block.index}
                        </p>
                        <p
                          className={`text-[11px] font-bold tracking-wide text-white leading-snug${
                            block.glitch ? " glitch-text" : ""
                          }`}
                        >
                          {block.title}
                        </p>
                        <ul className="mt-2 flex flex-col gap-1.5">
                          {block.signals.map((sig, j) => (
                            <li
                              key={j}
                              className="flex items-start gap-1.5 text-[9px] leading-tight text-white/40"
                            >
                              <span
                                className="mt-[4px] shrink-0 rounded-full bg-crimson/50"
                                style={{ width: "2px", height: "2px" }}
                              />
                              {sig}
                            </li>
                          ))}
                        </ul>
                        {block.detail && (
                          <p
                            className="mt-2 text-[8px] leading-relaxed italic text-white/22"
                            style={{
                              borderTop:  "1px solid rgba(220,20,60,0.08)",
                              paddingTop: "8px",
                            }}
                          >
                            {block.detail}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              );
            })}

          </motion.div>
        </motion.div>

        {/* ── Scroll cue ── */}
        <motion.div
          className="pointer-events-none absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-2 select-none"
          style={{ opacity: scrollCueOp }}
        >
          <span className="font-mono text-[9px] tracking-[0.45em] text-white/25 uppercase">
            Scroll to traverse
          </span>
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="h-7 w-[1px] bg-gradient-to-b from-crimson/40 to-transparent"
          />
        </motion.div>

        {/* ── Node progress dots (bottom-right) ── */}
        <div className="pointer-events-none absolute bottom-8 right-8 z-30 flex flex-col gap-3">
          {signalBlocks.map((_, i) => (
            <motion.div
              key={i}
              className="rounded-full"
              style={{
                width:      "4px",
                height:     "4px",
                background: "rgba(220,20,60,0.85)",
                opacity:    nodeOpacity[i],
              }}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
