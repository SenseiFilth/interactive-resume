"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const CTA_URL =
  "https://www.upwork.com/services/product/design-dynamic-personal-website-interactive-animated-high-end-design-2038279724912340969?ref=project_share";

export default function CurrentState() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax: heading moves slower than scroll, button moves even slower — creates depth layers
  const headingY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const subtitleY = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const buttonY = useTransform(scrollYProgress, [0, 1], [20, -20]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-4 py-32"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(220,20,60,0.04)_0%,_transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xs font-mono tracking-[0.5em] text-crimson uppercase"
        >
          Current State
        </motion.p>

        {/* Heading with parallax depth — 3 lines on all screens */}
        <motion.h2
          style={{ y: headingY }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-8 font-bold leading-tight tracking-[0.04em] text-white"
        >
          <span className="block text-3xl sm:text-4xl md:text-5xl">Let&rsquo;s build</span>
          <span className="block text-3xl sm:text-4xl md:text-5xl">something special</span>
        </motion.h2>

        {/* Subtitle with parallax — matching hero subtitle style */}
        <motion.p
          style={{ y: subtitleY }}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-xs tracking-[0.4em] text-steel uppercase sm:text-sm"
        >
          Premium UX Design &amp; Technical Production for Digital and Live Environments
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-10 h-[1px] w-24 origin-center bg-gradient-to-r from-transparent via-crimson/40 to-transparent"
        />

        {/* CTA with parallax depth */}
        <motion.div
          style={{ y: buttonY }}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10"
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
