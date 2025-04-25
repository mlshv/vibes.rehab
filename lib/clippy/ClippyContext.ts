import type { Agent } from "clippyts";
import { createContext } from "react";

export const ClippyContext = createContext<{
  clippy: Agent | undefined;
  loadClippy: () => Promise<Agent | undefined>;
}>({
  clippy: undefined,
  loadClippy: () => Promise.resolve(undefined),
});
