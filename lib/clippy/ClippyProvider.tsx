import React, { FC, ReactNode, useEffect, useState, useCallback } from "react";
import clippyts, { type Agent } from "clippyts";
import clippyStyle from "./style";
import AGENTS from "./agents";
import { ClippyContext } from "./ClippyContext";
import type { AgentType } from "clippyts/dist/types";

let clippyAgent: Agent;

export const ClippyProvider: FC<{
  agentName?: AgentType;
  children?: ReactNode;
  selector?: string;
}> = ({ children, agentName = AGENTS.CLIPPY, selector }) => {
  const [clippy, setClippy] = useState<Agent>();

  function byebye(agent: Agent, cb?: () => void) {
    agent?.hide(false, () => {
      if (cb) cb();
    });
  }

  const loadClippy = useCallback(() => {
    function getAgent(
      resolve?: (value: Agent) => void,
      reject?: (reason?: unknown) => void
    ) {
      clippyts.load({
        name: agentName,
        selector,
        successCb: (agent) => {
          agent.show(true);
          setClippy(agent);
          clippyAgent = agent;
          resolve?.(agent);
        },
        failCb: (error) => {
          console.error(error);
          setClippy(undefined);
          reject?.(error);
        },
      });
    }

    if (clippy) {
      byebye(clippy, () => getAgent());

      return Promise.resolve(undefined);
    }

    return new Promise<Agent>((resolve, reject) => {
      getAgent(resolve, reject);
    });
  }, [agentName, selector]);

  useEffect(() => {
    const { head } = document;
    const link = document.createElement("style");

    link.appendChild(document.createTextNode(clippyStyle));

    head.appendChild(link);

    return () =>
      byebye(clippyAgent, () => {
        head.removeChild(link);
      });
  }, []);

  return (
    <ClippyContext.Provider
      value={{
        clippy,
        loadClippy,
      }}
    >
      {children}
    </ClippyContext.Provider>
  );
};
