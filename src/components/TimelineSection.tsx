"use client";

import { useRef, useMemo, useCallback, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionValueEvent,
} from "framer-motion";
import { signalBlocks } from "@/data/content";

/* ══════════════════════════════════════════════════════════════════
   STAR FIELD — 3 depth layers
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
    // Detect mobile once at mount — halve star counts for GPU budget
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
    const scale = isMobile ? 0.5 : 1;

    let id = 0;
    function make(
      count: number,
      minSz: number, maxSz: number,
      minOp: number, maxOp: number,
      minDur: number, maxDur: number
    ): Star[] {
      return Array.from({ length: Math.round(count * scale) }, () => ({
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
      near: make(24, 1.8, 3.5, 0.55, 1.00, 3,  6),
      mid:  make(58, 0.9, 2.0, 0.22, 0.52, 6,  10),
      far:  make(92, 0.3, 0.9, 0.05, 0.18, 10, 16),
    };
  }, []);
}

/* ══════════════════════════════════════════════════════════════════
   LAYOUT — node % positions + line definitions
   ══════════════════════════════════════════════════════════════════ */
const NODE_POS = [
  { x: 26, y: 33 }, // 0 — Built to Deconstruct  (upper left)
  { x: 68, y: 23 }, // 1 — Creative Systems       (upper right)
  { x: 23, y: 67 }, // 2 — Real-World Systems     (lower left)
  { x: 69, y: 70 }, // 3 — Intelligent Systems    (lower right)
] as const;

// [fromIdx, toIdx, drawStart, drawEnd, isPrimary]
const LINES: readonly [number, number, number, number, boolean][] = [
  [0, 1, 0.14, 0.22, true ],
  [1, 2, 0.30, 0.38, true ],
  [2, 3, 0.46, 0.54, true ],
  [0, 2, 0.36, 0.44, false],
  [1, 3, 0.58, 0.65, false],
] as const;

/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   350vh outer → sticky 100vh viewport
   All 4 nodes sequence within the first ~65% of scroll progress.
   The remaining 35% is a "fully lit" resting phase where all nodes
   glow simultaneously before the section exits.
   scrollYProgress drives nodes/lines/content directly (no spring lag)
   camSpring (stiffness:150) used ONLY for camera drift
   ══════════════════════════════════════════════════════════════════ */
export default function TimelineSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springMX = useSpring(mouseX, { stiffness: 30, damping: 20 });
  const springMY = useSpring(mouseY, { stiffness: 30, damping: 20 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Spring ONLY for camera — keeps scene drift smooth without lagging nodes
  const camSpring = useSpring(scrollYProgress, { stiffness: 150, damping: 35 });

  const stars = useStarLayers();

  // ── Camera drift ────────────────────────────────────────────────────────
  const camScrollX = useTransform(camSpring, [0, 1], ["-2.5%", "2.5%"]);
  const camScrollY = useTransform(camSpring, [0, 1], ["0%",    "-2%"  ]);
  const camMouseX  = useTransform(springMX,  [0, 1], ["-2%",   "2%"  ]);
  const camMouseY  = useTransform(springMY,  [0, 1], ["-1.5%", "1.5%"]);

  // ── Star depth parallax ──────────────────────────────────────────────────
  const nearY = useTransform(camSpring, [0, 1], ["0%", "-14%"]);
  const midY  = useTransform(camSpring, [0, 1], ["0%", "-6%" ]);
  const farY  = useTransform(camSpring, [0, 1], ["0%", "-2%" ]);

  // ── Header fades as user traverses ──────────────────────────────────────
  const headerOp = useTransform(scrollYProgress, [0, 0.03, 0.09], [1, 1, 0]);

  // ── Node opacity: ghost → full glow → SUSTAINED ──────────────────────────
  // All 4 nodes complete their entry by ~0.65 scroll progress.
  // Each holds at 0.65 opacity so the full constellation stays lit.
  //
  // With 350vh total: n3 fully visible at 0.56 × 350 = 196vh (~2 screens)
  // Remaining 154vh is the "all nodes lit" finale before section exits.
  const n0 = useTransform(scrollYProgress,
    [0.00, 0.05, 0.13, 0.20, 1.00],
    [0.12, 1.00, 1.00, 0.65, 0.65]);
  const n1 = useTransform(scrollYProgress,
    [0.00, 0.18, 0.26, 0.33, 0.40, 1.00],
    [0.06, 0.06, 1.00, 1.00, 0.65, 0.65]);
  const n2 = useTransform(scrollYProgress,
    [0.00, 0.30, 0.38, 0.44, 0.52, 1.00],
    [0.08, 0.08, 1.00, 1.00, 0.65, 0.65]);
  const n3 = useTransform(scrollYProgress,
    [0.00, 0.46, 0.51, 0.57, 0.65, 1.00],
    [0.10, 0.10, 1.00, 1.00, 0.65, 0.65]);

  // ── Node scale ───────────────────────────────────────────────────────────
  const s0 = useTransform(scrollYProgress,
    [0.00, 0.05, 0.13, 0.20, 1.00],
    [0.45, 1.35, 1.00, 0.75, 0.75]);
  const s1 = useTransform(scrollYProgress,
    [0.18, 0.26, 0.33, 0.40, 1.00],
    [0.45, 1.35, 1.00, 0.75, 0.75]);
  const s2 = useTransform(scrollYProgress,
    [0.30, 0.38, 0.44, 0.52, 1.00],
    [0.45, 1.35, 1.00, 0.75, 0.75]);
  const s3 = useTransform(scrollYProgress,
    [0.00, 0.46, 0.51, 0.59, 1.00],
    [0.45, 0.45, 1.35, 1.00, 1.00]);

  // ── Constellation lines ───────────────────────────────────────────────────
  const l01 = useTransform(scrollYProgress, [0.14, 0.22], [0, 1]);
  const l12 = useTransform(scrollYProgress, [0.30, 0.38], [0, 1]);
  const l23 = useTransform(scrollYProgress, [0.46, 0.54], [0, 1]);
  const l02 = useTransform(scrollYProgress, [0.36, 0.44], [0, 1]);
  const l13 = useTransform(scrollYProgress, [0.58, 0.65], [0, 1]);
  const linePaths = [l01, l12, l23, l02, l13];

  const scrollCueOp = useTransform(scrollYProgress, [0, 0.03, 0.08], [1, 1, 0]);

  const nodeOpacity = [n0, n1, n2, n3];
  const nodeScale   = [s0, s1, s2, s3];

  // ── Active card tracking — drives the unified bottom readout ─────────────
  // Switch thresholds match each node's content appearance point.
  // This drives a single centered card at the bottom of the viewport
  // instead of the side-panels, which collide on small screens.
  const [mobileCard, setMobileCard] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if      (v < 0.17) setMobileCard(0); // n0 card
    else if (v < 0.38) setMobileCard(1); // n1 card — matches c1 window end
    else if (v < 0.54) setMobileCard(2); // n2 card — matches c2 start (l12 end)
    else               setMobileCard(3); // n3 card — matches c3 start (l23 end)
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const r = e.currentTarget.getBoundingClientRect();
      mouseX.set(e.clientX / r.width);
      mouseY.set(e.clientY / r.height);
    },
    [mouseX, mouseY]
  );

  return (
    // 350vh total. Nodes 0-3 all fully lit by ~65% progress (≈227vh).
    // Remaining ~123vh is a "full constellation" resting phase.
    <div ref={containerRef} className="relative" style={{ height: "350vh" }}>

      {/* Sticky viewport — transparent so the ambient video bleeds through.
          Stars and the red network video share the same visual language:
          points of light on dark. No hard edge, no black block. */}
      <div
        className="sticky top-0 h-screen bg-transparent"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)",
        }}
        onMouseMove={handleMouseMove}
      >
        {/* ── Section label — fades as you traverse ── */}
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

        {/* ── Scroll camera ── */}
        <motion.div
          className="absolute inset-0"
          style={{ x: camScrollX, y: camScrollY }}
        >
          {/* ── Mouse camera ── */}
          <motion.div
            className="absolute inset-0"
            style={{ x: camMouseX, y: camMouseY }}
          >

            {/* Far stars */}
            <motion.div className="pointer-events-none absolute inset-0" style={{ y: farY }}>
              {stars.far.map((s) => (
                <div
                  key={s.id}
                  className="absolute rounded-full bg-white"
                  style={{
                    left: `${s.x}%`, top: `${s.y}%`,
                    width: `${s.size}px`, height: `${s.size}px`,
                    opacity: s.opacity,
                  }}
                />
              ))}
            </motion.div>

            {/* Mid stars */}
            <motion.div className="pointer-events-none absolute inset-0" style={{ y: midY }}>
              {stars.mid.map((s) => (
                <div
                  key={s.id}
                  className="absolute rounded-full bg-white"
                  style={{
                    left: `${s.x}%`, top: `${s.y}%`,
                    width: `${s.size}px`, height: `${s.size}px`,
                    opacity: s.opacity,
                  }}
                />
              ))}
            </motion.div>

            {/* Near stars — animated twinkle */}
            <motion.div className="pointer-events-none absolute inset-0" style={{ y: nearY }}>
              {stars.near.map((s) => (
                <motion.div
                  key={s.id}
                  className="absolute rounded-full bg-white"
                  style={{
                    left: `${s.x}%`, top: `${s.y}%`,
                    width: `${s.size}px`, height: `${s.size}px`,
                    boxShadow: `0 0 ${s.size * 2.5}px rgba(255,255,255,${(s.opacity * 0.6).toFixed(2)})`,
                  }}
                  animate={{ opacity: [s.opacity, s.opacity * 0.2, s.opacity] }}
                  transition={{
                    duration: s.dur, delay: s.delay,
                    repeat: Infinity, ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>

            {/* Atmospheric glow */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 45% 45%, rgba(220,20,60,0.045) 0%, transparent 65%)",
              }}
            />

            {/* ── Constellation lines ── */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              style={{ zIndex: 10 }}
            >
              {LINES.map((line, i) => {
                const a = NODE_POS[line[0]];
                const b = NODE_POS[line[1]];
                const isPrimary = line[4];
                return (
                  <motion.path
                    key={i}
                    d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`}
                    fill="none"
                    stroke={isPrimary ? "rgba(220,20,60,0.65)" : "rgba(220,20,60,0.22)"}
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

            {/* ── Nodes — zero-size anchors ── */}
            {signalBlocks.map((block, i) => {
              const pos    = NODE_POS[i];
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
                      position: "absolute",
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
                        width:  "80px",
                        height: "80px",
                        left:   "-40px",
                        top:    "-40px",
                        background:
                          "radial-gradient(circle, rgba(220,20,60,0.30) 0%, transparent 70%)",
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
                      animate={{ scale: [1, 2.5, 1], opacity: [0.7, 0, 0.7] }}
                      transition={{
                        duration: 2.8 + i * 0.5, repeat: Infinity,
                        ease: "easeOut", delay: i * 0.7,
                      }}
                    />

                    {/* Pulse ring — secondary */}
                    <motion.div
                      className="absolute rounded-full pointer-events-none"
                      style={{
                        width:  "18px",
                        height: "18px",
                        left:   "-9px",
                        top:    "-9px",
                        border: "1px solid rgba(220,20,60,0.25)",
                      }}
                      animate={{ scale: [1, 1.75, 1], opacity: [0.4, 0, 0.4] }}
                      transition={{
                        duration: 2.2 + i * 0.4, repeat: Infinity,
                        ease: "easeOut", delay: i * 0.7 + 1.3,
                      }}
                    />

                    {/* Core dot */}
                    <div
                      className="absolute rounded-full bg-crimson pointer-events-none"
                      style={{
                        width:  "8px",
                        height: "8px",
                        left:   "-4px",
                        top:    "-4px",
                        boxShadow:
                          "0 0 10px rgba(220,20,60,0.95), 0 0 28px rgba(220,20,60,0.4)",
                      }}
                    />


                  </motion.div>
                </div>
              );
            })}

          </motion.div>
        </motion.div>

        {/* ══════════════════════════════════════════════════════════════
            SIGNAL READOUT — all screens
            Text projected INTO the constellation. No box, no border.
            Unified layout: mobile and desktop share the same strip,
            scaled up via responsive classes on desktop.
            ══════════════════════════════════════════════════════════ */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-40"
          style={{ height: "clamp(280px, 36vh, 400px)" }}
        >
          {/* Shallow atmospheric fade — readability without burying text */}
          <div
            className="absolute inset-x-0 bottom-0"
            style={{
              height: "55%",
              background:
                "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.28) 60%, transparent 100%)",
            }}
          />

          {/* Content — vertically centered in the strip */}
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {signalBlocks.map((block, i) =>
                i !== mobileCard ? null : (
                  <motion.div
                    key={block.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{    opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="flex flex-col items-center text-center w-full px-8 sm:px-0 sm:max-w-[480px]"
                  >
                    {/* Index */}
                    <motion.p
                      initial={{ opacity: 0, letterSpacing: "0.15em" }}
                      animate={{ opacity: 1, letterSpacing: "0.55em" }}
                      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      className="font-mono text-[8px] sm:text-[9px] text-crimson/60 uppercase mb-2 sm:mb-3"
                    >
                      {block.index}
                    </motion.p>

                    {/* Title */}
                    <motion.p
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                      className={`text-[20px] sm:text-[30px] font-bold tracking-tight text-white leading-tight${
                        block.glitch ? " glitch-text" : ""
                      }`}
                    >
                      {block.title}
                    </motion.p>

                    {/* Separator — draws outward */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className="my-3 sm:my-4 origin-center"
                      style={{
                        width:      "32px",
                        height:     "1px",
                        background: "linear-gradient(90deg, transparent, rgba(220,20,60,0.65), transparent)",
                      }}
                    />

                    {/* Signals — staggered */}
                    <div className="flex flex-col items-center gap-1.5 sm:gap-2">
                      {block.signals.map((sig, j) => (
                        <motion.p
                          key={j}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.24 + j * 0.09, duration: 0.32 }}
                          className="text-[11px] sm:text-[12px] tracking-wider text-white/45 leading-relaxed"
                        >
                          {sig}
                        </motion.p>
                      ))}
                    </div>

                    {/* Detail */}
                    {block.detail && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.45 }}
                        className="mt-3 text-[9px] sm:text-[10px] italic text-white/25 tracking-wide max-w-[260px] sm:max-w-[340px] leading-relaxed"
                      >
                        {block.detail}
                      </motion.p>
                    )}
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </div>
        </div>
        {/* end signal readout */}

        {/* ── Scroll cue — fades at section start, top-left to avoid readout ── */}
        <motion.div
          className="pointer-events-none absolute top-8 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-2 select-none"
          style={{ opacity: scrollCueOp }}
        >
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="h-7 w-[1px] bg-gradient-to-b from-crimson/40 to-transparent"
          />
          <span className="font-mono text-[9px] tracking-[0.45em] text-white/20 uppercase">
            Scroll to traverse
          </span>
        </motion.div>

      </div>
    </div>
  );
}
