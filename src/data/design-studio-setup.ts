export const setupGuide = 'https://github.com/itspatmorgan/design-studio-starter/blob/main/SETUP.md';

// Prompts mirror the four user paths in Starter SETUP.md.
export const setupPaths = [
  {
    id: 'codex', title: 'ChatGPT Codex plugin', description: 'Start a local chat in Codex.',
    logo: '/images/logos/square-chatgpt.svg',
    instructions: 'Copy this prompt into a local Codex chat to install the Design Studio plugin.',
    prompt: 'Install the Design Studio plugin locally for Codex from https://github.com/itspatmorgan/design-studio-starter. Read SETUP.md and follow the Codex plugin installation instructions. Handle the technical steps and preserve my other plugins. Tell me if I need to restart the app or enable the plugin.',
    next: 'Restart the app if needed, then start a new local chat. Confirm Design Studio is available in the plugin controls and ask “Create my Design Studio.”',
    anchor: '1-codex-plugin',
  },
  {
    id: 'claude', title: 'Claude Code plugin', description: 'Open the Claude desktop app, choose the Code tab, then select Local.',
    logo: '/images/logos/square-claude.svg',
    instructions: 'Copy this prompt into a Claude Code chat running locally to install the plugin. You can also install it in the Claude desktop app: open Customize → Plugins → Add plugin → Add marketplace, add itspatmorgan/design-studio-starter, and install Design Studio.',
    prompt: "Install the Design Studio plugin locally for Claude Code from https://github.com/itspatmorgan/design-studio-starter. Read SETUP.md and follow the Claude Code local plugin instructions. Preserve my other plugins and show me how to continue in Claude Desktop's local Code view.",
    next: 'Start a new local Code session and confirm /design-studio:create-studio appears. Choose No folder for initial setup if available, then ask “Create my Design Studio.”',
    anchor: '2-claude-code-plugin',
  },
  {
    id: 'cursor', title: 'Cursor plugin', description: 'Start in a local Agent chat in Cursor.',
    logo: '/images/logos/cursor.svg',
    instructions: 'Copy this prompt into an Agent chat in Cursor to install the Design Studio plugin.',
    prompt: 'Install the Design Studio plugin locally for Cursor from https://github.com/itspatmorgan/design-studio-starter. Read SETUP.md and follow the Cursor local plugin instructions. Preserve my other plugins. Handle copying the package, then tell me when to reload the window and how to verify its skills.',
    next: 'Reload Cursor when your agent is ready. Open Customize and confirm Design Studio’s skills are available. In a fresh local Agent chat, ask “Create my Design Studio.” If local imports are unavailable, use the direct-source path.',
    anchor: '3-cursor-plugin',
  },
  {
    id: 'source', title: 'Direct from GitHub', description: 'Use your local coding agent without installing a plugin.',
    logo: null,
    instructions: 'Give your agent this request. It follows the same setup procedure directly from the source repository.',
    prompt: 'Help me install Design Studio from https://github.com/itspatmorgan/design-studio-starter. Read its SETUP.md and follow the linked create-studio instructions. Handle downloading, setup, and opening it for me. Save my Design Studio in my user Developer folder. Preserve anything already there. Show me the running Design Studio and help me continue working in its folder.',
    next: 'Continue in the Design Studio folder your agent shows you. This path also works when your organization restricts plugin installs.',
    anchor: '4-direct-from-the-source-repository',
  },
];
