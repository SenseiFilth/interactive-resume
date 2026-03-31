"use client";

import { useState, useRef, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { signalBlocks } from "@/data/content";
import type { SignalBlock } from "@/data/content";

/* ══════════════════════════════════════════
   CONSTELLATION LAYOUT
   Primary node positions (% based)
   ══════════════════════════════════════════ */
const NODE_LAYOUT = [
  { x: 15, y: 12 },
  { x: 62, y: 28 },
  { x: 22, y: 52 },
  { x: 58, y: 72 },
];

/* ══════════════════════════════════════════
   FAUX / SECONDARY STAR NODES
   Three tiers: micro, small, medium
   Distributed asymmetrically for cosmic feel
   ══════════════════════════════════════════ */
interface FauxStar {
  x: number;
  y: number;
  size: "micro" | "small" | "medium";
  delay: number;
  duration: number;
}

const FAUX_STARS: FauxStar[] = [
  // Micro tier — barely visible twinkles
  { x: 8, y: 6, size: "micro", delay: 0, duration: 4.2 },
  { x: 35, y: 8, size: "micro", delay: 1.3, duration: 5.1 },
  { x: 78, y: 15, size: "micro", delay: 0.7, duration: 3.8 },
  { x: 45, y: 20, size: "micro", delay: 2.1, duration: 4.5 },
  { x: 88, y: 35, size: "micro", delay: 0.3, duration: 5.8 },
  { x: 5, y: 42, size: "micro", delay: 1.8, duration: 4.0 },
  { x: 72, y: 48, size: "micro", delay: 0.5, duration: 3.5 },
  { x: 40, y: 58, size: "micro", delay: 2.4, duration: 4.8 },
  { x: 85, y: 62, size: "micro", delay: 1.0, duration: 5.3 },
  { x: 12, y: 68, size: "micro", delay: 0.8, duration: 4.1 },
  { x: 92, y: 78, size: "micro", delay: 1.5, duration: 3.9 },
  { x: 30, y: 82, size: "micro", delay: 2.0, duration: 5.5 },
  { x: 68, y: 88, size: "micro", delay: 0.2, duration: 4.4 },
  { x: 50, y: 92, size: "micro", delay: 1.7, duration: 3.6 },
  // Small tier — soft glow dots
  { x: 42, y: 14, size: "small", delay: 0.9, duration: 6.2 },
  { x: 80, y: 25, size: "small", delay: 1.6, duration: 5.0 },
  { x: 10, y: 32, size: "small", delay: 0.4, duration: 7.1 },
  { x: 50, y: 42, size: "small", delay: 2.3, duration: 5.5 },
  { x: 75, y: 55, size: "small", delay: 0.6, duration: 6.8 },
  { x: 35, y: 70, size: "small", delay: 1.2, duration: 5.9 },
  { x: 82, y: 80, size: "small", delay: 1.9, duration: 6.4 },
  { x: 18, y: 85, size: "small", delay: 0.1, duration: 7.3 },
  // Medium tier — semi-visible anchors
  { x: 38, y: 35, size: "medium", delay: 1.4, duration: 8.0 },
  { x: 70, y: 40, size: "medium", delay: 0.8, duration: 7.5 },
  { x: 45, y: 62, size: "medium", delay: 2.2, duration: 6.5 },
  { x: 8, y: 55, size: "medium", delay: 1.1, duration: 7.8 },
  { x: 90, y: 50, size: "medium", delay: 0.3, duration: 8.2 },
];

const STAR_SIZES = {
  micro: { w: 1, glow: 0 },
  small: { w: 1.5, glow: 2 },
  medium: { w: 2, glow: 4 },
};

/* ══════════════════════════════════════════
   BACKGROUND STARFIELD
   Very faint, random, slow drift
   ══════════════════════════════════════════ */
function useStarfield(count: number) {
  return useMemo(() => {
    const stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        opacity: 0.08 + Math.random() * 0.18,
        size: 0.5 + Math.random() * 0.8,
        drift: (Math.random() - 0.5) * 8,
      });
    }
    return stars;
  }, [count]);
}

/* ══════════════════════════════════════════
   SVG CONSTELLATION LINES
   Bézier curves with gradient + shimmer
   ══════════════════════════════════════════ */
function ConstellationLines() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      <defs>
        {/* Main connection gradient */}
        <linearGradient id="line-grad-01" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DC143C" stopOpacity="0.35" />
          <stop offset="50%" stopColor="#DC143C" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#DC143C" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="line-grad-02" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#DC143C" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#DC143C" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#DC143C" stopOpacity="0.3" />
        </linearGradient>
        {/* Shimmer filter */}
        <filter id="line-glow">
          <feGaussianBlur stdDeviation="0.3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Primary connections between main nodes ── */}
      {NODE_LAYOUT.slice(0, -1).map((from, i) => {
        const to = NODE_LAYOUT[i + 1];
        const midX = (from.x + to.x) / 2 + (i % 2 === 0 ? 12 : -12);
        const midY = (from.y + to.y) / 2;
        return (
          <motion.path
            key={`main-${i}`}
            d={`M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`}
            fill="none"
            stroke={`url(#line-grad-0${(i % 2) + 1})`}
            strokeWidth="0.15"
            filter="url(#line-glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.2, delay: i * 0.3, ease: "easeOut" as const }}
          />
        );
      })}

      {/* ── Secondary branches to faux medium nodes ── */}
      {FAUX_STARS.filter((s) => s.size === "medium").map((star, i) => {
        // Connect to nearest main node
        let nearest = NODE_LAYOUT[0];
        let minDist = Infinity;
        for (const node of NODE_LAYOUT) {
          const d = Math.hypot(node.x - star.x, node.y - star.y);
          if (d < minDist) { minDist = d; nearest = node; }
        }
        return (
          <motion.line
            key={`branch-${i}`}
            x1={nearest.x}
            y1={nearest.y}
            x2={star.x}
            y2={star.y}
            stroke="#DC143C"
            strokeOpacity="0.08"
            strokeWidth="0.08"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 + i * 0.15 }}
          />
        );
      })}

      {/* ── Faint cross-connections for density ── */}
      <motion.line
        x1={NODE_LAYOUT[0].x} y1={NODE_LAYOUT[0].y}
        x2={NODE_LAYOUT[2].x} y2={NODE_LAYOUT[2].y}
        stroke="#DC143C" strokeOpacity="0.04" strokeWidth="0.06"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        viewport={{ once: true }} transition={{ duration: 1, delay: 1.5 }}
      />
      <motion.line
        x1={NODE_LAYOUT[1].x} y1={NODE_LAYOUT[1].y}
        x2={NODE_LAYOUT[3].x} y2={NODE_LAYOUT[3].y}
        stroke="#DC143C" strokeOpacity="0.04" strokeWidth="0.06"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        viewport={{ once: true }} transition={{ duration: 1, delay: 1.8 }}
      />
    </svg>
  );
}

/* ══════════════════════════════════════════
   FAUX STAR COMPONENT
   Twinkle with randomized timing
   ══════════════════════════════════════════ */
function FauxStarNode({ star }: { star: FauxStar }) {
  const s = STAR_SIZES[star.size];
  return (
    <motion.div
      className="absolute"
      style={{
        left: `${star.x}%`,
        top: `${star.y}%`,
        width: s.w,
        height: s.w,
      }}
      animate={{
        opacity: [0.15, 0.5, 0.15],
        scale: [1, 1.3, 1],
      }}
      transition={{
        duration: star.duration,
        repeat: Infinity,
        delay: star.delay,
        ease: "easeInOut",
      }}
    >
      <div
        className="h-full w-full rounded-full bg-white"
        style={{
          boxShadow: s.glow > 0
            ? `0 0 ${s.glow}px rgba(220,20,60,0.3), 0 0 ${s.glow * 2}px rgba(220,20,60,0.1)`
            : "none",
        }}
      />
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   PRIMARY CONSTELLATION NODE
   ══════════════════════════════════════════ */
function ConstellationNode({
  block,
  index,
}: {
  block: SignalBlock;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pos = NODE_LAYOUT[index];

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Subtle parallax — nodes move slightly slower than background
  const y = useTransform(scrollYProgress, [0, 1], [10, -10]);

  // Info panel opens to the right for left nodes, left for right nodes
  const panelSide = pos.x < 50 ? "left-10" : "right-10";
  const panelAlign = pos.x < 50 ? "left-0" : "right-0";

  return (
    <motion.div
      ref={ref}
      className="absolute"
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        y,
        zIndex: 10,
      }}
    >
      <div
        className="group relative cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Outer breathing glow */}
        <motion.div
          animate={{
            scale: [1, 2, 1],
            opacity: [0.12, 0, 0.12],
          }}
          transition={{
            duration: 4 + index * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.8,
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(220,20,60,0.4) 0%, transparent 70%)",
          }}
        />

        {/* Secondary glow ring */}
        <motion.div
          animate={{
            scale: hovered ? 1.5 : 1,
            opacity: hovered ? 0.25 : 0.1,
          }}
          transition={{ duration: 0.4 }}
          className="absolute top-1/2 left-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-crimson/20"
        />

        {/* Core dot */}
        <motion.div
          animate={{
            scale: hovered ? 1.6 : 1,
            boxShadow: hovered
              ? "0 0 16px rgba(220,20,60,0.5), 0 0 32px rgba(220,20,60,0.2)"
              : "0 0 6px rgba(220,20,60,0.3), 0 0 12px rgba(220,20,60,0.1)",
          }}
          transition={{ duration: 0.3 }}
          className="relative z-10 h-2 w-2 rounded-full bg-crimson"
        />

        {/* Label — always visible */}
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 + index * 0.15, duration: 0.5 }}
          className={`absolute top-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] font-semibold tracking-wider text-white/40 uppercase ${panelSide}`}
        >
          {block.title}
        </motion.span>

        {/* ── Hover Info Panel ── */}
        <motion.div
          initial={false}
          animate={{
            opacity: hovered ? 1 : 0,
            y: hovered ? 0 : 4,
            scale: hovered ? 1 : 0.97,
            pointerEvents: hovered ? ("auto" as const) : ("none" as const),
          }}
          transition={{ duration: 0.2, ease: "easeOut" as const }}
          className={`absolute top-6 z-30 w-52 sm:w-60 ${panelAlign}`}
        >
          <div
            className="border border-white/[0.06] px-4 py-4"
            style={{
              background: "rgba(0,0,0,0.85)",
              backdropFilter: "blur(12px)",
            }}
          >
            <h3
              className={`text-xs font-bold tracking-wide text-white uppercase ${
                block.glitch ? "glitch-text" : ""
              }`}
            >
              {block.title}
            </h3>

            <ul className="mt-2.5 flex flex-col gap-1.5">
              {block.signals.map((signal, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-[11px] leading-snug text-steel"
                >
                  <span className="h-[2px] w-[2px] shrink-0 rounded-full bg-crimson/50" />
                  {signal}
                </li>
              ))}
            </ul>

            {block.detail && (
              <p className="mt-2.5 border-t border-white/[0.04] pt-2 text-[10px] leading-relaxed text-steel/40">
                {block.detail}
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   MAIN SECTION
   ══════════════════════════════════════════ */
export default function TimelineSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const starfield = useStarfield(60);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  // Background starfield drifts at different rate than nodes
  const starfieldY = useTransform(scrollYProgress, [0, 1], [0, -20]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-black px-4"
      style={{ paddingTop: "8rem", paddingBottom: "8rem" }}
    >
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative z-20 mx-auto mb-8 text-center"
      >
        <h2 className="text-xs font-mono tracking-[0.5em] text-crimson uppercase">
          Signal Map
        </h2>
        <p className="mt-3 text-3xl font-bold text-white sm:text-4xl">
          System Origins
        </p>
      </motion.div>

      {/* ── Constellation container ── */}
      <div className="relative mx-auto" style={{ maxWidth: "72rem", height: "36rem" }}>

        {/* Background starfield layer */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ y: starfieldY }}
        >
          {starfield.map((star, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: star.size,
                height: star.size,
                opacity: star.opacity,
              }}
            />
          ))}
        </motion.div>

        {/* Subtle cosmic radial gradient */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 40% 40%, rgba(220,20,60,0.03) 0%, transparent 60%)",
          }}
        />

        {/* SVG constellation lines */}
        <ConstellationLines />

        {/* Faux secondary star nodes */}
        {FAUX_STARS.map((star, i) => (
          <FauxStarNode key={i} star={star} />
        ))}

        {/* Primary constellation nodes */}
        {signalBlocks.map((block, i) => (
          <ConstellationNode key={block.id} block={block} index={i} />
        ))}
      </div>
    </section>
  );
}
