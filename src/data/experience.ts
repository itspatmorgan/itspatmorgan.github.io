export interface Role {
  company: string;
  url?: string;
  logo?: string;
  role: string;
  dateRange: string;
  summary?: string;
  projects?: string[];
  descriptions: string[];
}

export const roles: Role[] = [
  {
    company: "Sublime Security",
    url: "https://sublime.security",
    logo: "/images/logos/career-sublime.svg",
    role: "Staff Product Designer",
    dateRange: "2025–Now",
    summary: "Designing AI tools for email threat detection. I built a multi-agent system that automates analyst workflows — pairing a triage agent with a detection engineering agent that continuously writes new detection rules in Sublime's custom DSL.",
    descriptions: [
      "Designed a multi-agent system pairing an analyst agent with a detection engineering agent — automating threat triage and continuously generating new detection rules in Sublime's custom DSL.",
      "Shipped security features for high-stakes scenarios: Email Bomb protection, vendor impersonation and compromise, and automated threat detection.",
      "Built an internal prototyping platform with Claude Code — sole designer and engineer. Now used daily by the full design team.",
    ],
  },
  {
    company: "JupiterOne",
    url: "https://www.jupiterone.com",
    logo: "/images/logos/career-jupiterone.svg",
    role: "Lead Product Designer",
    dateRange: "2022–2023",
    summary: "Led design for an enterprise security graph platform. The defining project was a query interface that cut new user time-to-value from 21 days to 1 — turning a blank text box into a guided, approachable experience.",
    projects: ["query-language"],
    descriptions: [
      "Designed a query interface that reduced new user time-to-value from 21 days to 1 day.",
      "Drove creation and adoption of a new design system across enterprise security platform.",
      "Informed product roadmap through cross-functional collaboration and design leadership.",
    ],
  },
  {
    company: "Signal Sciences / Fastly",
    url: "https://www.fastly.com",
    logo: "/images/logos/career-sigsci.svg",
    role: "Senior Product Designer",
    dateRange: "2019–2021",
    summary: "Designed security features across firewall rules, rate limiting, and bot defense. I also ran customer advisory workshops that turned scattered feedback into a shared product vision — work that shaped the roadmap well past my time there.",
    projects: ["expansion", "vision"],
    descriptions: [
      "Designed features for enterprise firewall rules management, rate limiting, and bot defense.",
      "Facilitated strong design, dev, and PM collaboration via workshops, systems diagramming, storyboarding, prototyping, and presentations.",
    ],
  },
  {
    company: "Tenable",
    url: "https://www.tenable.com",
    logo: "/images/logos/career-tenable.svg",
    role: "Product Designer",
    dateRange: "2017–2018",
    summary: "Designed dashboards, data visualization templates, and credential management features for Tenable's enterprise cyber risk platform.",
    descriptions: [
      "Designed enterprise SaaS features to improve Tenable's cyber risk platform: dashboard creation & management, data visualization templates, & team credential management.",
    ],
  },
  {
    company: "American Express",
    url: "https://www.americanexpress.com",
    logo: "/images/logos/career-amex.svg",
    role: "Design Engineer",
    dateRange: "2013–2016",
    summary: "Built UI for a multi-brand platform used by Amex, Walmart, and Target. This is where I learned to prototype in code — building things that were flexible enough to work across very different brand contexts.",
    descriptions: [
      "Built UI for a multi-brand platform used by Amex, Walmart, and Target.",
      "Led prototyping in code to design flexible and robust responsive web UX.",
    ],
  },
  {
    company: "Leo Burnett",
    url: "https://leoburnett.com",
    logo: "/images/logos/career-leoburnett.svg",
    role: "Brand Strategist",
    dateRange: "2012–2013",
    summary: "Developed brand strategies for Allstate, MillerCoors, and Sprint using consumer research and cultural insight. My first job — where I learned that good design starts with understanding people, not products.",
    descriptions: [
      "Developed brand strategies using consumer research and cultural insights, creating high impact communications for clients like Allstate, MillerCoors, and Sprint.",
    ],
  },
];
