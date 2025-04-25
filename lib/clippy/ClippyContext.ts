import type { Agent } from "clippyts";
import { createContext } from "react";

export const ClippyContext = createContext<{
  clippy: Agent | undefined;
  loadClippy: () => void;
}>({
  clippy: undefined,
  loadClippy: () => {},
});
