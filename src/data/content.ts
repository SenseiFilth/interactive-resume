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
    title: "Built to Deconstruct",
    signals: [
      "First design concepts",
      "Discovering inspect element",
      "Reverse engineering live websites",
    ],
    detail:
      "Curiosity wasn't a phase — it was the operating system. Took apart everything to understand what made it work.",
    glitch: true,
  },
  {
    id: "creative",
    index: "02",
    title: "Creative Systems",
    signals: [
      "Graffiti and street art",
      "Graphic design",
      "Clothing brand",
      "Video editing / visual production",
    ],
    detail:
      "Art was never separate from systems. Every creative output was a design problem — structure, hierarchy, execution.",
  },
  {
    id: "realworld",
    index: "03",
    title: "Real-World Systems",
    signals: [
      "Baucom's: discipline",
      "IATSE 322: live production pressure",
      "Wild West: execution at scale",
    ],
    detail:
      "Every environment was a system to decode. From plant nurseries to concert stages — each role built a new layer of operational thinking.",
  },
  {
    id: "intelligent",
    index: "04",
    title: "Intelligent Systems",
    signals: [
      "Aether AI: LLM evaluation",
      "TruChain: ERP + compliance",
      "CUE.AI: AI production tools",
    ],
  },
];

export const roles: Role[] = [
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
    name: "Dynamic Portal",
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
  "Stripe API",
  "Claude API",
  "Vercel",
  "Git",
  "Figma",
];
