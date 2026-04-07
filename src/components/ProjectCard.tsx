"use client";

import { motion } from "framer-motion";
import type { Project } from "@/data/content";

export default function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative overflow-hidden border border-white/[0.06] bg-white/[0.02] transition-all duration-300 hover:border-crimson/25 hover:-translate-y-[3px]"
    >
      {/* Top accent */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-crimson/15 to-transparent transition-all duration-500 group-hover:via-crimson/50" />

      {/* Hover glow — single layer, subtle */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(220,20,60,0.06)_0%,_transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative px-7 pt-7 pb-6 sm:px-8 sm:pt-8 sm:pb-7">
        <h3 className="text-2xl font-bold tracking-tight text-white text-center">
          {project.name}
        </h3>
        <p className="mt-1.5 text-sm text-crimson/50 text-center">{project.tagline}</p>

        <div className="mt-5 flex flex-col gap-0">
          {project.impacts.map((feature, i) => (
            <div
              key={i}
              className="flex items-center gap-3 border-t border-white/[0.04] py-2.5 first:border-t-0 first:pt-0"
            >
              <span className="h-[3px] w-[3px] shrink-0 rounded-full bg-crimson/60" />
              <span className="text-sm text-steel">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
