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
    imageDark?: string;
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
      headline: "Designing agentic workflows for security teams operating at machine speed.",
      proof: [
        "Agents for triage and detection engineering",
        "Automation patterns for trust and supervision",
        "AI-native operations made concrete through prototypes",
      ],
      assetNote: "Future slot: AI workflow demo, analyst console crop, or detection-rule motion loop.",
      image: "/images/career-moments/career-moment-sublime-light.png",
      imageDark: "/images/career-moments/career-moment-sublime-dark.png",
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
      headline: "Making a powerful security graph understandable enough for teams to adopt.",
      proof: [
        "Guided query experience for new users",
        "Reduced time-to-value for complex graph workflows",
        "Design-system leadership through platform growth",
      ],
      assetNote: "Future slot: query builder interaction, graph visualization, or onboarding flow.",
      image: "/images/career-moments/career-moment-j1-light.png",
      imageDark: "/images/career-moments/career-moment-j1-dark.png",
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
      headline: "Designing core platform workflows for high-volume security operations.",
      proof: [
        "Rules, rate limiting, and bot defense",
        "Patterns for operational security teams",
        "Customer signal translated into product direction",
      ],
      assetNote: "Future slot: workshop artifacts, roadmap storyboard, or WAF product graphic.",
      image: "/images/career-moments/career-moment-sigsci-light.png",
      imageDark: "/images/career-moments/career-moment-sigsci-dark.png",
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
      headline: "Turning vulnerability data into a clearer view of cybersecurity risk.",
      proof: [
        "Dashboards for vulnerability management",
        "Risk views across complex infrastructure",
        "Enterprise workflows for security teams at scale",
      ],
      assetNote: "Future slot: dashboard screenshot, data-viz template set, or cyber risk overview.",
      image: "/images/career-moments/career-moment-tenable-light.png",
      imageDark: "/images/career-moments/career-moment-tenable-dark.png",
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
      headline: "Building the design-engineering foundation for systems that work across brands.",
      proof: [
        "Responsive UI across major brand contexts",
        "Code prototypes for interaction decisions",
        "A bridge between design and implementation",
      ],
      assetNote: "Future slot: responsive prototype capture, multi-brand UI grid, or handoff artifact.",
      image: "/images/career-moments/career-moment-amex-light.png",
      imageDark: "/images/career-moments/career-moment-amex-dark.png",
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
      headline: "Learning how research and positioning shape decisions before an interface exists.",
      proof: [
        "Esurance strategy after the Allstate acquisition",
        "Positioning against Geico in a major category",
        "Research discipline behind product judgment",
      ],
      assetNote: "Future slot: brand strategy board, research synthesis, or campaign planning visual.",
      image: "/images/career-moments/career-moment-leo-light.png",
      imageDark: "/images/career-moments/career-moment-leo-dark.png",
    },
    descriptions: [
      "Developed brand strategies using consumer research and cultural insights, creating high impact communications for clients like Allstate, MillerCoors, and Sprint.",
    ],
  },
];
