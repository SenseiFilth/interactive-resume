"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const CTA_URL =
  "https://www.upwork.com/freelancers/~012c48ad6ef84c61fc";

const STATUS_MODULES = [
  {
    index: "01",
    label: "UX & Web Design",
    value: "Freelance — Premium digital interfaces",
    status: "ACTIVE",
  },
  {
    index: "02",
    label: "Software + AI",
    value: "System development & AI tooling",
    status: "ACTIVE",
  },
  {
    index: "03",
    label: "Live Production",
    value: "Lighting / AV / Events",
    status: "ACTIVE",
  },
] as const;

export default function CurrentState() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const panelY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const buttonY = useTransform(scrollYProgress, [0, 1], [20, -20]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-4 py-32"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(220,20,60,0.04)_0%,_transparent_60%)]" />

      <div className="relative z-10 mx-auto w-full max-w-xl">

        {/* Section label */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 font-mono text-[9px] tracking-[0.55em] text-crimson uppercase text-center"
        >
          Current State
        </motion.p>

        {/* System readout panel */}
        <motion.div style={{ y: panelY }}>

          {/* Panel header bar */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mb-px flex items-center justify-between px-4 py-2"
            style={{
              background: "rgba(220,20,60,0.06)",
              borderTop: "1px solid rgba(220,20,60,0.25)",
              borderLeft: "1px solid rgba(220,20,60,0.12)",
              borderRight: "1px solid rgba(220,20,60,0.12)",
            }}
          >
            <span className="font-mono text-[8px] tracking-[0.45em] text-crimson/60 uppercase">
              System Status
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[8px] tracking-widest text-white/25 uppercase">
              <span
                className="inline-block rounded-full"
                style={{
                  width: "5px",
                  height: "5px",
                  background: "rgba(74,222,128,0.85)",
                  boxShadow: "0 0 6px rgba(74,222,128,0.6)",
                }}
              />
              All systems operational
            </span>
          </motion.div>

          {/* Status rows */}
          <div
            style={{
              border: "1px solid rgba(220,20,60,0.10)",
              borderTop: "none",
            }}
          >
            {STATUS_MODULES.map((mod, i) => (
              <motion.div
                key={mod.index}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.12 + i * 0.1 }}
                className="group relative flex items-center justify-between gap-4 px-4 py-4 transition-colors duration-300"
                style={{
                  borderBottom:
                    i < STATUS_MODULES.length - 1
                      ? "1px solid rgba(255,255,255,0.04)"
                      : "none",
                  cursor: "default",
                }}
              >
                {/* Hover line accent */}
                <div
                  className="pointer-events-none absolute left-0 top-0 bottom-0 w-[2px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "linear-gradient(to bottom, transparent, rgba(220,20,60,0.7), transparent)",
                  }}
                />
                {/* Hover bg wash */}
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: "rgba(220,20,60,0.03)" }} />

                {/* Left: index + label + value */}
                <div className="relative flex items-baseline gap-3 min-w-0">
                  <span
                    className="shrink-0 font-mono text-[8px] tracking-[0.3em]"
                    style={{ color: "rgba(220,20,60,0.45)" }}
                  >
                    {mod.index}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold tracking-[0.08em] text-white/90 leading-none mb-1">
                      {mod.label}
                    </p>
                    <p className="font-mono text-[9px] tracking-wide text-white/35 leading-none">
                      {mod.value}
                    </p>
                  </div>
                </div>

                {/* Right: status badge */}
                <span
                  className="shrink-0 font-mono text-[7px] tracking-[0.35em] uppercase px-2 py-1"
                  style={{
                    color: "rgba(74,222,128,0.75)",
                    border: "1px solid rgba(74,222,128,0.18)",
                    background: "rgba(74,222,128,0.04)",
                  }}
                >
                  {mod.status}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Panel footer — mission statement */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="px-4 py-3"
            style={{
              background: "rgba(255,255,255,0.02)",
              borderLeft: "1px solid rgba(220,20,60,0.10)",
              borderRight: "1px solid rgba(220,20,60,0.10)",
              borderBottom: "1px solid rgba(220,20,60,0.10)",
            }}
          >
            <p className="font-mono text-[9px] leading-relaxed tracking-wide text-white/28 italic">
              Designing and building systems across web, software, AI tools, and live production environments.
            </p>
          </motion.div>

        </motion.div>

        {/* CTA */}
        <motion.div
          style={{ y: buttonY }}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="mt-10 flex justify-center"
        >
          <a
            href={CTA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 overflow-hidden border border-crimson/50 bg-crimson/10 px-10 py-4 text-sm font-semibold tracking-widest text-white uppercase transition-all duration-300 hover:border-crimson hover:bg-crimson/20"
          >
            <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <span className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(220,20,60,0.12)_0%,_transparent_70%)]" />
            </span>
            <span className="relative z-10">Start a Project</span>
            <svg
              className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </motion.div>

      </div>
    </section>
  );
}
