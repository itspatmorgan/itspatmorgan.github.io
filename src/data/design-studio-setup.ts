export const setupGuide = 'https://github.com/itspatmorgan/design-studio-starter/blob/main/SETUP.md';

// Prompts adapt the four paths in Starter SETUP.md to complete local setup.
export const setupPaths = [
  {
    id: 'codex', title: 'ChatGPT Codex plugin', description: 'Create and build with Design Studio in the Codex app.',
    logo: '/images/logos/square-chatgpt.svg',
    instructions: "Copy this prompt into a local Codex chat to install the plugin and create your Design Studio. Your agent will guide you through any restart or new chat needed.",
    prompt: "Install the Design Studio plugin locally for Codex from https://github.com/itspatmorgan/design-studio-starter. Read SETUP.md and follow its Codex plugin installation and linked create-studio instructions. Handle the technical steps, preserve my other plugins and existing files, and create my Design Studio on this computer. Open its local preview and help me continue working in its folder. Guide me through any restart, plugin activation, or new chat needed.",
    anchor: '1-codex-plugin',
  },
  {
    id: 'claude', title: 'Claude Code plugin', description: 'Create and build with Design Studio in Claude Code.',
    logo: '/images/logos/square-claude.svg',
    instructions: "In Claude Desktop, choose Code, then Local. Copy this prompt into a local Claude Code chat to install the plugin and create your Design Studio. Choose No folder for initial setup if available; your agent will guide you into your Design Studio folder.",
    prompt: "Install the Design Studio plugin locally for Claude Code from https://github.com/itspatmorgan/design-studio-starter. Read SETUP.md and follow its Claude Code local plugin installation and linked create-studio instructions. Handle the technical steps, preserve my other plugins and existing files, and create my Design Studio on this computer. Open its local preview and help me continue working in its folder in Claude Desktop’s local Code view. Guide me through any restart, plugin activation, or new session needed.",
    anchor: '2-claude-code-plugin',
  },
  {
    id: 'cursor', title: 'Cursor plugin', description: 'Create and build with Design Studio in Cursor.',
    logo: '/images/logos/cursor.svg',
    instructions: "Copy this prompt into a local Agent chat in Cursor to install the plugin and create your Design Studio. Your agent will guide you through any reload needed. If plugin imports are restricted, use Direct from GitHub.",
    prompt: "Install the Design Studio plugin locally for Cursor from https://github.com/itspatmorgan/design-studio-starter. Read SETUP.md and follow its Cursor local plugin installation and linked create-studio instructions. Handle the technical steps, preserve my other plugins and existing files, and create my Design Studio on this computer. Open its local preview and help me continue working in its folder. Guide me through any window reload, plugin activation, or new Agent chat needed.",
    anchor: '3-cursor-plugin',
  },
  {
    id: 'source', title: 'Direct from GitHub', description: 'Use your local coding agent without installing a plugin.',
    logo: null,
    instructions: "Copy this prompt into your local coding agent to create Design Studio directly from GitHub. No plugin is required, so this also works when plugin installs are restricted.",
    prompt: 'Help me install Design Studio from https://github.com/itspatmorgan/design-studio-starter. Read its SETUP.md and follow the linked create-studio instructions. Handle downloading, setup, and opening it for me. Verify that setup will save files on my computer and help me choose the local folder. Preserve anything already there. Show me the running Design Studio and help me continue working in its folder.',
    anchor: '4-direct-from-the-source-repository',
  },
];

// Publishing begins in an existing local Design Studio. Use current source guidance
// rather than depending on DEPLOY.md while that guide is still being tested.
const publishingRequest = "Read this Design Studio’s AGENTS.md and current publishing guidance. If DEPLOY.md is available, read it too. Preserve my work and existing deployment settings. Help me choose the audience, handle configuration and the static build, and guide me through account sign-in or authorization. Verify the hosted site and a direct prototype link, then give me the viewing URL and instructions for publishing updates.";

export const publishingPaths = [
  {
    title: "ChatGPT Sites",
    logo: "/images/logos/square-chatgpt.svg",
    description: "Publish conversationally when Sites is available to your agent.",
    instructions: "Use a local Codex chat with ChatGPT Sites available. Installing Design Studio does not enable Sites; your agent can check its available capabilities.",
    prompt: `Publish my existing Design Studio with ChatGPT Sites. Keep authoring local and reuse any existing Site. Use the Design Studio publish-studio procedure and native Sites tools. ${publishingRequest} If Sites is unavailable, explain what is needed and help me choose another host.`,
  },
  {
    title: "GitHub Pages",
    logo: null,
    description: "Keep your source in GitHub and configure publication on push.",
    instructions: "You’ll need a GitHub account and access to configure the repository’s Pages deployment. Your agent can guide you through choosing the repository and authenticating.",
    prompt: `Help me publish my existing Design Studio with GitHub Pages. Help me choose the destination repository and its visibility, preserve existing remotes, and configure publication on push. ${publishingRequest}`,
  },
  {
    title: "Netlify",
    logo: "/images/logos/netlify.svg",
    description: "Publish a local static build to a Netlify project.",
    instructions: "Use an existing Netlify project or let your agent help set one up. Your agent will guide you through account authorization and check the available access controls for your audience.",
    prompt: `Help me publish my existing Design Studio with Netlify. Build locally and upload the static output, reusing any existing project. ${publishingRequest}`,
  },
  {
    title: "Vercel",
    logo: "/images/logos/vercel.svg",
    description: "Publish to your chosen Vercel account or team.",
    instructions: "Use an existing Vercel project or let your agent help set one up. Ask it to check the appropriate plan and access controls for your intended use.",
    prompt: `Help me publish my existing Design Studio with Vercel. Prepare and deploy the static output, reusing any existing project. ${publishingRequest}`,
  },
  {
    title: "Help me choose",
    logo: null,
    description: "Start with your team’s host, or ask your agent to assess the options.",
    instructions: "Use this prompt in your existing Design Studio folder. Tell your agent who needs to see the work and whether you already have a hosting account.",
    prompt: `Help me publish my existing Design Studio. Assess ChatGPT Sites, GitHub Pages, Netlify, Vercel, or my team’s existing static-site host based on the tools and accounts available. ${publishingRequest}`,
  },
];
