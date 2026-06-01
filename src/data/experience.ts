export interface Role {
  slug: string;
  company: string;
  url?: string;
  logo?: string;
  role: string;
  dateRange: string;
  summary?: string;
  moment?: {
    label: string;
    headline: string;
    proof: string[];
    assetNote: string;
    image?: string;
    video?: string;
  };
  projects?: string[];
  descriptions: string[];
}

export const roles: Role[] = [
  {
    slug: "sublime-security",
    company: "Sublime Security",
    url: "https://sublime.security",
    logo: "/images/logos/career-sublime.svg",
    role: "Staff Product Designer",
    dateRange: "2025–Now",
    summary: "Designing AI tools for email threat detection. I built a multi-agent system that automates analyst workflows — pairing a triage agent with a detection engineering agent that continuously writes new detection rules in Sublime's custom DSL.",
    moment: {
      label: "AI security workflows",
      headline: "Designing agentic tools for high-stakes email threat detection.",
      proof: [
        "Multi-agent analyst and detection engineering workflows",
        "Security features for urgent, operational threat scenarios",
        "Internal prototyping platform used daily by the design team",
      ],
      assetNote: "Future slot: AI workflow demo, analyst console crop, or detection-rule motion loop.",
      image: "/images/brand/thumbnail-career.jpg",
    },
    descriptions: [
      "Designed a multi-agent system pairing an analyst agent with a detection engineering agent — automating threat triage and continuously generating new detection rules in Sublime's custom DSL.",
      "Shipped security features for high-stakes scenarios: Email Bomb protection, vendor impersonation and compromise, and automated threat detection.",
      "Built an internal prototyping platform with Claude Code — sole designer and engineer. Now used daily by the full design team.",
    ],
  },
  {
    slug: "jupiterone",
    company: "JupiterOne",
    url: "https://www.jupiterone.com",
    logo: "/images/logos/career-jupiterone.svg",
    role: "Lead Product Designer",
    dateRange: "2022–2023",
    summary: "Led design for an enterprise security graph platform. The defining project was a query interface that cut new user time-to-value from 21 days to 1 — turning a blank text box into a guided, approachable experience.",
    moment: {
      label: "Graph security UX",
      headline: "Turning a powerful graph query language into a guided product experience.",
      proof: [
        "Reduced new user time-to-value from 21 days to 1",
        "Led enterprise security graph product design",
        "Drove design-system adoption across the platform",
      ],
      assetNote: "Future slot: query builder interaction, graph visualization, or onboarding flow.",
      image: "/images/projects/query/thumbnail-query-light-wide.png",
    },
    projects: ["query-language"],
    descriptions: [
      "Designed a query interface that reduced new user time-to-value from 21 days to 1 day.",
      "Drove creation and adoption of a new design system across enterprise security platform.",
      "Informed product roadmap through cross-functional collaboration and design leadership.",
    ],
  },
  {
    slug: "signal-sciences-fastly",
    company: "Signal Sciences / Fastly",
    url: "https://www.fastly.com",
    logo: "/images/logos/career-sigsci.svg",
    role: "Senior Product Designer",
    dateRange: "2019–2021",
    summary: "Designed security features across firewall rules, rate limiting, and bot defense. I also ran customer advisory workshops that turned scattered feedback into a shared product vision — work that shaped the roadmap well past my time there.",
    moment: {
      label: "Security product strategy",
      headline: "Shaping platform expansion through systems design and customer advisory work.",
      proof: [
        "Firewall, rate-limiting, and bot-defense product work",
        "Customer workshops translated scattered needs into roadmap direction",
        "Storyboards and systems diagrams aligned product, design, and engineering",
      ],
      assetNote: "Future slot: workshop artifacts, roadmap storyboard, or WAF product graphic.",
      image: "/images/projects/vision/vision-hero.png",
    },
    projects: ["expansion", "vision"],
    descriptions: [
      "Designed features for enterprise firewall rules management, rate limiting, and bot defense.",
      "Facilitated strong design, dev, and PM collaboration via workshops, systems diagramming, storyboarding, prototyping, and presentations.",
    ],
  },
  {
    slug: "tenable",
    company: "Tenable",
    url: "https://www.tenable.com",
    logo: "/images/logos/career-tenable.svg",
    role: "Product Designer",
    dateRange: "2017–2018",
    summary: "Designed dashboards, data visualization templates, and credential management features for Tenable's enterprise cyber risk platform.",
    moment: {
      label: "Cyber risk dashboards",
      headline: "Making dense enterprise security data easier to scan, manage, and act on.",
      proof: [
        "Dashboard creation and management patterns",
        "Reusable data visualization templates",
        "Credential-management workflows for enterprise teams",
      ],
      assetNote: "Future slot: dashboard screenshot, data-viz template set, or cyber risk overview.",
      image: "/images/brand/thumbnail-career.jpg",
    },
    descriptions: [
      "Designed enterprise SaaS features to improve Tenable's cyber risk platform: dashboard creation & management, data visualization templates, & team credential management.",
    ],
  },
  {
    slug: "american-express",
    company: "American Express",
    url: "https://www.americanexpress.com",
    logo: "/images/logos/career-amex.svg",
    role: "Design Engineer",
    dateRange: "2013–2016",
    summary: "Built UI for a multi-brand platform used by Amex, Walmart, and Target. This is where I learned to prototype in code — building things that were flexible enough to work across very different brand contexts.",
    moment: {
      label: "Design engineering",
      headline: "Building flexible responsive UI across major consumer brand contexts.",
      proof: [
        "Multi-brand platform work for Amex, Walmart, and Target",
        "Code prototypes for responsive product direction",
        "Reusable UI patterns that bridged design and engineering",
      ],
      assetNote: "Future slot: responsive prototype capture, multi-brand UI grid, or handoff artifact.",
      image: "/images/brand/thumbnail-career.jpg",
    },
    descriptions: [
      "Built UI for a multi-brand platform used by Amex, Walmart, and Target.",
      "Led prototyping in code to design flexible and robust responsive web UX.",
    ],
  },
  {
    slug: "leo-burnett",
    company: "Leo Burnett",
    url: "https://leoburnett.com",
    logo: "/images/logos/career-leoburnett.svg",
    role: "Brand Strategist",
    dateRange: "2012–2013",
    summary: "Developed brand strategies for Allstate, MillerCoors, and Sprint using consumer research and cultural insight. My first job — where I learned that good design starts with understanding people, not products.",
    moment: {
      label: "Research-led strategy",
      headline: "Starting with people, culture, and the strategic frame before the product takes shape.",
      proof: [
        "Consumer research and cultural insight for national brands",
        "Strategy work across Allstate, MillerCoors, and Sprint",
        "Foundation for the research-first product design practice that followed",
      ],
      assetNote: "Future slot: brand strategy board, research synthesis, or campaign planning visual.",
      image: "/images/brand/thumbnail-career.jpg",
    },
    descriptions: [
      "Developed brand strategies using consumer research and cultural insights, creating high impact communications for clients like Allstate, MillerCoors, and Sprint.",
    ],
  },
];
