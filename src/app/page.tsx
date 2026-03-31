"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  // Single stable callback — no duplicate state anywhere
  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  return (
    <>
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
    </>
  );
}
