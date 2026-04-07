import { roles, projects, techStack } from "@/data/content";

const CONTACT_EMAIL = "brown.alexander10133@gmail.com";
const UPWORK_URL = "https://www.upwork.com/services/product/design-dynamic-personal-website-interactive-animated-high-end-design-2038279724912340969?ref=project_share";

export default function RecruiterView() {
  return (
    <div className="min-h-screen bg-black px-6 py-20">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="border-b border-white/[0.07] pb-8 text-center">
          <h1 className="text-4xl font-bold text-white">Alexander McKinnon-Brown</h1>
          <p className="mt-2 text-sm text-steel">
            Live Production &bull; Full-Stack Developer &bull; AI Consultant
          </p>
          {/* Contact row */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-mono text-[11px] tracking-wide text-white/30 transition-colors duration-200 hover:text-crimson/80"
            >
              {CONTACT_EMAIL}
            </a>
            <span className="text-white/10 hidden sm:inline">·</span>
            <a
              href={UPWORK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] tracking-wide text-white/30 transition-colors duration-200 hover:text-crimson/80"
            >
              Upwork ↗
            </a>
          </div>
        </div>

        {/* Technical Stack */}
        <div className="mt-10 text-center">
          <h2 className="text-xs font-mono tracking-[0.3em] text-crimson uppercase">
            Technical Stack
          </h2>
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="border border-white/[0.08] px-3 py-1 text-xs text-steel"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="mt-10">
          <h2 className="text-xs font-mono tracking-[0.3em] text-crimson uppercase">
            Experience
          </h2>
          <div className="mt-4 flex flex-col gap-4">
            {roles.map((role) => (
              <div key={role.id} className="border-l-2 border-crimson/20 pl-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white">{role.role}</p>
                    <p className="text-sm text-steel">{role.organization}</p>
                  </div>
                  <span className="shrink-0 text-xs font-mono text-steel/60">
                    {role.timeframe}
                  </span>
                </div>
                <p className="mt-1 text-sm text-steel/80">{role.impact}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="mt-10">
          <h2 className="text-xs font-mono tracking-[0.3em] text-crimson uppercase">
            Projects
          </h2>
          <div className="mt-4 flex flex-col gap-4">
            {projects.map((project) => (
              <div key={project.id} className="border-l-2 border-crimson/20 pl-4">
                <p className="font-semibold text-white">{project.name}</p>
                <p className="text-sm text-crimson/60">{project.tagline}</p>
                <ul className="mt-2 flex flex-col gap-1">
                  {project.impacts.map((impact, i) => (
                    <li
                      key={i}
                      className="text-sm text-steel/80 before:mr-2 before:content-['·']"
                    >
                      {impact}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="/resume.pdf"
            download="Alexander_McKinnon-Brown_Resume.pdf"
            className="inline-flex items-center gap-2 border border-crimson/50 bg-crimson/10 px-6 py-3 text-xs font-medium tracking-widest text-white uppercase transition-all duration-200 hover:border-crimson hover:bg-crimson/20"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Resume PDF
          </a>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex items-center gap-2 border border-white/[0.08] px-6 py-3 text-xs font-medium tracking-widest text-steel uppercase transition-all duration-200 hover:border-white/20 hover:text-white"
          >
            Say Hello ↗
          </a>
        </div>

      </div>
    </div>
  );
}
