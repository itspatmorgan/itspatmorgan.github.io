export const setupGuide = 'https://github.com/itspatmorgan/design-studio-starter/blob/main/SETUP.md';

// Prompts adapt the four paths in Starter SETUP.md to complete local setup.
export const setupPaths = [
  {
    id: 'codex', title: 'ChatGPT Codex plugin', description: 'Start a local chat in Codex.',
    logo: '/images/logos/square-chatgpt.svg',
    instructions: "Copy this prompt into a local Codex chat to install the plugin and create your Design Studio. Your agent will guide you through any restart or new chat needed.",
    prompt: "Install the Design Studio plugin locally for Codex from https://github.com/itspatmorgan/design-studio-starter. Read SETUP.md and follow its Codex plugin installation and linked create-studio instructions. Handle the technical steps, preserve my other plugins and existing files, and create my Design Studio on this computer. Open its local preview and help me continue working in its folder. Guide me through any restart, plugin activation, or new chat needed.",
    anchor: '1-codex-plugin',
  },
  {
    id: 'claude', title: 'Claude Code plugin', description: 'Open the Claude desktop app, choose the Code tab, then select Local.',
    logo: '/images/logos/square-claude.svg',
    instructions: "Copy this prompt into a local Claude Code chat to install the plugin and create your Design Studio. Choose No folder for initial setup if available; your agent will guide you into your Design Studio folder.",
    prompt: "Install the Design Studio plugin locally for Claude Code from https://github.com/itspatmorgan/design-studio-starter. Read SETUP.md and follow its Claude Code local plugin installation and linked create-studio instructions. Handle the technical steps, preserve my other plugins and existing files, and create my Design Studio on this computer. Open its local preview and help me continue working in its folder in Claude Desktop’s local Code view. Guide me through any restart, plugin activation, or new session needed.",
    anchor: '2-claude-code-plugin',
  },
  {
    id: 'cursor', title: 'Cursor plugin', description: 'Start in a local Agent chat in Cursor.',
    logo: '/images/logos/cursor.svg',
    instructions: "Copy this prompt into a local Agent chat in Cursor to install the plugin and create your Design Studio. Your agent will guide you through any reload needed. If plugin imports are restricted, use Direct from GitHub.",
    prompt: "Install the Design Studio plugin locally for Cursor from https://github.com/itspatmorgan/design-studio-starter. Read SETUP.md and follow its Cursor local plugin installation and linked create-studio instructions. Handle the technical steps, preserve my other plugins and existing files, and create my Design Studio on this computer. Open its local preview and help me continue working in its folder. Guide me through any window reload, plugin activation, or new Agent chat needed.",
    anchor: '3-cursor-plugin',
  },
  {
    id: 'source', title: 'Direct from GitHub', description: 'Use your local coding agent without installing a plugin.',
    logo: null,
    instructions: "Copy this prompt into your local coding agent to create Design Studio directly from GitHub. No plugin is required, so this also works when plugin installs are restricted.",
    prompt: 'Help me install Design Studio from https://github.com/itspatmorgan/design-studio-starter. Read its SETUP.md and follow the linked create-studio instructions. Handle downloading, setup, and opening it for me. Save my Design Studio in my user Developer folder. Preserve anything already there. Show me the running Design Studio and help me continue working in its folder.',
    anchor: '4-direct-from-the-source-repository',
  },
];

export const sitesSetup = {
  title: "Set up and publish with ChatGPT Sites",
  prerequisite: "Only use this option if ChatGPT Sites is enabled and available in your local Codex chat.",
  prompt: "Install the Design Studio plugin locally for Codex from https://github.com/itspatmorgan/design-studio-starter. Read SETUP.md and follow its Codex plugin installation, linked create-studio, and ChatGPT Sites publishing instructions. Handle the technical steps and preserve my other plugins and existing files. Create my Design Studio on this computer, verify its local preview, and publish a public review link with ChatGPT Sites. Keep authoring local, show me the published link, and help me continue working in my Design Studio folder. Guide me through any restart, plugin activation, or new chat needed. If ChatGPT Sites is unavailable, complete local setup and tell me what is needed to publish.",
  description: "Install the plugin, create your local Design Studio, and publish a public review link. Anyone with the link can explore your work; editing stays local. Ask for a private site if you prefer.",
};
