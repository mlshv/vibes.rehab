"use client";
import { AGENTS, ClippyProvider } from "@react95/clippy";

export function ContextProviders({ children }: { children: React.ReactNode }) {
  return (
    <ClippyProvider agentName={AGENTS.CLIPPY}>{children}</ClippyProvider>
  );
}
