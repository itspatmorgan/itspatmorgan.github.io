import type { APIRoute } from "astro";
import guide from "@/data/design-studio-agent.txt?raw";

export const GET: APIRoute = () => new Response(guide, {
  headers: { "Content-Type": "text/plain; charset=utf-8" },
});
