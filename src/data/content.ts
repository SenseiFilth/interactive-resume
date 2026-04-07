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
    title: "System Deconstruction",
    signals: [
      "Inspect element as the first tool",
      "Reverse-engineering live websites",
      "Breaking interfaces to see structure",
    ],
    detail: "Curiosity wasn't passive — it was investigative.",
    glitch: true,
  },
  {
    id: "creative",
    index: "02",
    title: "Creative Systems Thinking",
    signals: [
      "Graffiti → spatial composition",
      "Graphic design → visual hierarchy",
      "Clothing brand → identity systems",
      "Video → sequencing + narrative",
    ],
    detail: "Not art vs. systems — art as systems.",
  },
  {
    id: "realworld",
    index: "03",
    title: "Real-World Operations",
    signals: [
      "Baucom's → discipline + physical workflow",
      "IATSE 322 → live production timing",
      "Field work → execution under pressure",
    ],
    detail: "Every environment revealed operational structure.",
  },
  {
    id: "intelligent",
    index: "04",
    title: "Intelligent Systems Design",
    signals: [
      "Aether AI → LLM evaluation frameworks",
      "TruChain → ERP + compliance infrastructure",
      "CUE.AI → AI-assisted production tooling",
    ],
    detail: "Shift from participant → architect.",
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
      "Led crew call coordination and real-time problem solving under live show pressure",
      "Operated and maintained lighting systems, audio rigs, and video infrastructure",
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
      "Directed electronics operations across corporate galas, concerts, and theatrical productions",
      "Maintained shop organization, equipment inventory, and system reliability",
      "Diagnosed and resolved complex electrical and control system failures on-site",
    ],
  },
  {
    id: "baucoms",
    role: "Shipping & Physical Logistics",
    organization: "Baucom's Nursery",
    timeframe: "2018–2019",
    impact: "Built operational discipline through high-volume physical systems under demanding conditions.",
    tags: ["Logistics", "Operations", "Physical Systems"],
    details: [
      "Managed inbound shipping containers and inventory staging",
      "Operated under tight seasonal deadlines with zero tolerance for delays",
      "Developed systems-level thinking through repetition and high-volume output",
    ],
  },
];

export const projects: Project[] = [
  {
    id: "cueai",
    name: "CUE.AI",
    tagline: "AI-powered live event production platform",
    impacts: [
      "AI-assisted show planning",
      "Automated technical documentation",
      "Reduced production errors & delays",
    ],
  },
  {
    id: "truchain",
    name: "TruChain / TruAlliance",
    tagline: "Enterprise compliance & business intelligence",
    impacts: [
      "ERP/POS with compliance integration",
      "Real-time KPI + business intelligence",
      "Regulatory workflow optimization",
    ],
  },
  {
    id: "portal",
    name: "Client Acquisition Portals",
    tagline: "Premium interactive acquisition platform",
    impacts: [
      "Interactive client acquisition system",
      "Motion-driven UX",
      "High-conversion presentation layer",
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
