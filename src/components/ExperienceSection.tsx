"use client";

import { motion } from "framer-motion";
import { roles } from "@/data/content";
import RoleCard from "./RoleCard";

export default function ExperienceSection() {
  return (
    <section className="relative bg-black px-4 py-32">
      {/* Subtle ambient glow behind the section */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(220,20,60,0.025) 0%, transparent 65%)",
        }}
      />

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mx-auto mb-20 max-w-4xl"
      >
        <h2 className="text-xs font-mono tracking-[0.5em] text-crimson uppercase text-center sm:text-left">
          Experience
        </h2>
        <div className="mt-3 flex items-end justify-between gap-4">
          <p className="font-display text-3xl font-bold text-white sm:text-4xl text-center sm:text-left w-full sm:w-auto">
            Roles Played
          </p>
          <span className="hidden font-mono text-[10px] tracking-widest text-white/15 sm:block">
            Click any card to expand
          </span>
        </div>
      </motion.div>

      {/* Cards — vertical flow with breathing room */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col gap-4">
        {roles.map((role, i) => (
          <RoleCard key={role.id} role={role} index={i} />
        ))}
      </div>
    </section>
  );
}
