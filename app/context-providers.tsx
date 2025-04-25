"use client";
import { AGENTS, ClippyProvider } from "@/lib/clippy";

export function ContextProviders({ children }: { children: React.ReactNode }) {
  return (
    <ClippyProvider agentName={AGENTS.CLIPPY} selector="clippy-node">
      {children}
    </ClippyProvider>
  );
}
