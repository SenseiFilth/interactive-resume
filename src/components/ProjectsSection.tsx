"use client";

import { motion } from "framer-motion";
import { projects } from "@/data/content";
import ProjectCard from "./ProjectCard";

export default function ProjectsSection() {
  return (
    <section className="bg-black px-4 py-32">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto mb-20 text-center"
      >
        <h2 className="text-xs font-mono tracking-[0.5em] text-crimson uppercase">
          Projects
        </h2>
        <p className="font-display mt-3 text-3xl font-bold text-white sm:text-4xl">
          Systems Built
        </p>
      </motion.div>

      <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
