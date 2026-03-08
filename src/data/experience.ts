export interface BulletPoint {
  title: string;
  description: string;
}

export interface Role {
  section: string;
  company: string;
  logo?: string;
  role: string;
  dateRange: string;
  descriptions: string[];
}

export const bulletPoints: BulletPoint[] = [
  {
    title: "Philosophy Meets Political Communications",
    description:
      "Studied political science at Davidson College focusing on philosophy, communications, and media impact.",
  },
  {
    title: "Strategic Foundation",
    description:
      "Started my career as a strategist at Leo Burnett, crafting brand narratives for major clients.",
  },
  {
    title: "Transition to Tech",
    description:
      "Shifted my focus to technology and code, bridging strategic thinking with technical expertise.",
  },
  {
    title: "Technical Product Design Specialist",
    description:
      "Began as a design engineer at American Express. Grew to lead product design at high-growth enterprise startups. Designed complex software products like cybersecurity platforms.",
  },
  {
    title: "Empowering Creators in AI",
    description:
      "Created Unknown Arts, a newsletter for creative builders exploring AI design and the creative frontier. Also organized events fostering community connection and growth.",
  },
];

export const roles: Role[] = [
  // Product Design
  {
    section: "Product Design",
    company: "Sublime Security",
    logo: "/images/logos/career-sublime.svg",
    role: "Product Designer",
    dateRange: "Current",
    descriptions: [
      "Joined as the first product designer in March 2025. Now a senior staff IC on a 5-person product design team.",
    ],
  },
  {
    section: "Product Design",
    company: "JupiterOne",
    logo: "/images/logos/career-jupiterone.svg",
    role: "Principal Product Designer",
    dateRange: "2022\u20132023",
    descriptions: [
      "Designed a query interface that reduced new user time-to-value from 21 days to 1 day.",
      "Drove creation and adoption of a new design system across enterprise security platform.",
      "Informed product roadmap through cross-functional collaboration and design leadership.",
    ],
  },
  {
    section: "Product Design",
    company: "Signal Sciences",
    logo: "/images/logos/career-sigsci.svg",
    role: "Senior Product Designer",
    dateRange: "2019\u20132021",
    descriptions: [
      "Designed features for enterprise firewall rules management, rate limiting, and bot defense.",
      "Facilitated strong design, dev, and PM collaboration via workshops, systems diagramming, storyboarding, prototyping, and presentations.",
    ],
  },
  {
    section: "Product Design",
    company: "Tenable",
    logo: "/images/logos/career-tenable.svg",
    role: "Product Designer",
    dateRange: "2017\u20132018",
    descriptions: [
      "Designed enterprise SaaS features to improve Tenable\u2019s cyber risk platform: dashboard creation & management, data visualization templates, & team credential management.",
    ],
  },
  {
    section: "Product Design",
    company: "American Express",
    logo: "/images/logos/career-amex.svg",
    role: "Design Engineer",
    dateRange: "2013\u20132016",
    descriptions: [
      "Built UI for a multi-brand platform used by Amex, Walmart, and Target.",
      "Led prototyping in code to design flexible and robust responsive web UX",
    ],
  },
  // Writing & Community
  {
    section: "Writing & Community",
    company: "Unknown Arts",
    logo: "/images/logos/career-unknownarts.svg",
    role: "Founder & Writer",
    dateRange: "2022\u2013Present",
    descriptions: [
      "Created a newsletter on tech, creativity, and AI, growing to 7,000+ subscribers and ~40% open rate.",
      "Featured in top industry publications, reaching a global audience across 128 countries.",
      "Organized events fostering community connection and growth.",
    ],
  },
  // Brand
  {
    section: "Brand",
    company: "Leo Burnett",
    logo: "/images/logos/career-leoburnett.svg",
    role: "Brand Strategist",
    dateRange: "2012\u20132013",
    descriptions: [
      "Developed brand strategies using consumer research and cultural insights, creating high impact communications for clients like Allstate, MillerCoors, and Sprint.",
    ],
  },
];

/** Get unique sections in order */
export const sections = [...new Set(roles.map((r) => r.section))];

