export interface SignalBlock {
  id: string;
  index: string;
  title: string;
  signals: string[];
  detail?: string;
  glitch?: boolean;
}

export interface Role {
  id: string;
  role: string;
  organization: string;
  timeframe: string;
  impact: string;
  tags: string[];
  details: string[];
  minimal?: boolean;
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  impacts: string[];
}

export const signalBlocks: SignalBlock[] = [
  {
    id: "deconstruct",
    index: "01",
    title: "Introduction to Systems",
    signals: [
      "Inspecting websites. Breaking interfaces. Learning that every visible thing had hidden structure beneath it.",
    ],
    detail: "Before I built systems, I learned how to question them.",
    glitch: true,
  },
  {
    id: "creative",
    index: "02",
    title: "Visual Systems",
    signals: [
      "Graffiti, graphic design, clothing, and motion taught me rhythm, hierarchy, identity, and composition.",
    ],
    detail: "Style became structure.",
  },
  {
    id: "realworld",
    index: "03",
    title: "Operational Systems",
    signals: [
      "Shop floors, crews, live shows, and field work taught me timing, preparation, execution, and pressure.",
    ],
    detail: "Execution became the test.",
  },
  {
    id: "intelligent",
    index: "04",
    title: "Intelligent Systems",
    signals: [
      "AI, automation, compliance tools, and production software turned the lesson into architecture.",
    ],
    detail: "What began as curiosity became a constellation of systems.",
  },
];

export const roles: Role[] = [
  {
    id: "local322",
    role: "Stagehand & Crew Lead",
    organization: "IATSE Local 322",
    timeframe: "2022–Present",
    impact: "High-stakes live production systems — lighting, audio, video. Real-time problem solving.",
    tags: ["Live Production", "Crew Lead", "Lighting", "Audio", "Video"],
    details: [
      "Executed large-scale events across arena, theater, and convention environments",
      "Participated in crew call coordination and real-time problem solving on-site",
      "Built and maintained lighting systems, audio rigs, and video infrastructure",
    ],
  },
  {
    id: "aether",
    role: "AI Model Evaluator",
    organization: "Aether AI Project",
    timeframe: "2024–2025",
    impact: "Trained and evaluated large language models. Improved AI reasoning, response quality, and multimodal outputs.",
    tags: ["LLM Evaluation", "AI Training", "Computer Vision", "RLHF"],
    details: [
      "Evaluated model outputs for reasoning accuracy, tone, and instruction-following",
      "Provided structured feedback used to improve multimodal and code generation tasks",
      "Performed computer vision validation across image-text alignment tasks",
    ],
  },
  {
    id: "wildwest",
    role: "Electronics Director",
    organization: "Wild West Lighting",
    timeframe: "2022–2024",
    impact: "Executed technical production across corporate, theatrical, and concert events.",
    tags: ["Technical Direction", "Electronics", "Theatrical", "Concert"],
    details: [
      "Directed electronics operations across shop, corporate, concert, and theatrical productions",
      "Maintained shop organization, equipment inventory, and system reliability",
      "Diagnosed and resolved electrical and control system failures",
    ],
  },
];

export const projects: Project[] = [
  {
    id: "cueai",
    name: "Creative Systems Consulting",
    tagline: "Creative systems for brands, websites, and digital products",
    impacts: [
    "AI-assisted strategy, design, and content development",
    "Premium websites, brand assets, and motion-driven interfaces",
    "Repeatable workflow from concept to client-ready execution",
    ],
  },
  {
    id: "truchain",
    name: "TruChain",
    tagline: "Compliance infrastructure for regulated operations",
    impacts: [
      "ERP + POS architecture with compliance-first workflows",
      "Real-time KPI dashboards and business intelligence logic",
      "Operational tools for inventory, sales, reporting, and traceability",
    ],
  },
  {
    id: "portal",
    name: "Client Acquisition Portals",
    tagline: "Premium web experiences built to turn attention into action",
    impacts: [
      "Interactive presentation systems for consultants and service brands",
      "Motion-driven UX designed around trust, clarity, and conversion",
      "High-end digital presence for offers, booking, and client intake",
    ],
  },
];

export const techStack = [
  "Next.js",
  "TypeScript",
  "React",
  "Tailwind CSS",
  "Supabase",
  "PostgreSQL",
  "Node.js",
  "Python",
  "Framer Motion",
  "Vercel",
  "Git",
  "Figma",
];
