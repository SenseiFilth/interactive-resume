"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AmbientVideo from "@/components/AmbientVideo";
import HeroSection from "@/components/HeroSection";
import TimelineSection from "@/components/TimelineSection";
import ExperienceSection from "@/components/ExperienceSection";
import ProjectsSection from "@/components/ProjectsSection";
import CurrentState from "@/components/CurrentState";
import RecruiterView from "@/components/RecruiterView";
import type { ViewMode } from "@/components/RecruiterToggle";

const FADE = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
  transition: { duration: 0.35, ease: "easeOut" as const },
};

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>("creative");

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  return (
    <>
      {/* ── Fixed ambient video background ────────────────────────────
          Sits behind everything. TimelineSection masks itself with a
          solid bg. All other sections use transparent/semi-transparent
          backgrounds so this bleeds through.
      ──────────────────────────────────────────────────────────────── */}
      {/* ── Ambient video — fades out in recruiter mode, never restarts ── */}
      <motion.div
        className="fixed inset-0 -z-10 overflow-hidden"
        animate={{ opacity: viewMode === "recruiter" ? 0 : 1 }}
        transition={{ duration: 1.1, ease: [0.4, 0, 0.15, 1] }}
      >
        <AmbientVideo />
        {/* Deep vignette keeps edges cinematic */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.75) 100%)",
          }}
        />
        {/* Subtle red tint overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(220,20,60,0.04) 0%, transparent 60%)",
          }}
        />
      </motion.div>

      <HeroSection viewMode={viewMode} onViewModeChange={handleViewModeChange} />

      <AnimatePresence mode="wait">
        {viewMode === "recruiter" ? (
          <motion.div key="recruiter" {...FADE}>
            <RecruiterView />
          </motion.div>
        ) : (
          <motion.div key="creative" {...FADE}>
            <TimelineSection />
            <ExperienceSection />
            <ProjectsSection />
            <CurrentState />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global footer */}
      <footer className="relative border-t border-white/[0.04] py-12 px-6">
        <div className="mx-auto max-w-4xl flex flex-col items-center gap-5">
          {/* Contact links */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <a
              href="mailto:brown.alexander10133@gmail.com"
              className="font-mono text-[10px] tracking-[0.3em] text-white/20 uppercase transition-colors duration-200 hover:text-crimson/70"
            >
              Email
            </a>
            <span className="text-white/10 text-xs">·</span>
            <a
              href="https://www.upwork.com/services/product/design-dynamic-personal-website-interactive-animated-high-end-design-2038279724912340969?ref=project_share"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] tracking-[0.3em] text-white/20 uppercase transition-colors duration-200 hover:text-crimson/70"
            >
              Upwork
            </a>
          </div>
          {/* Quote */}
          <p className="font-mono text-[10px] tracking-widest text-steel/25 uppercase">
            &ldquo;Inside, I am infinite&rdquo; &mdash; Miyamoto Musashi
          </p>
        </div>
      </footer>
    </>
  );
}
