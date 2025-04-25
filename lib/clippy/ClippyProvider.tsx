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
    function getAgent() {
      clippyts.load({
        name: agentName,
        selector,
        successCb: (agent) => {
          agent.show(true);
          agent.play("Greeting");
          setClippy(agent);
          clippyAgent = agent;
        },
        failCb: (error) => {
          console.error(error);
          setClippy(undefined);
        },
      });
    }

    if (clippy) {
      byebye(clippy, () => getAgent());
    } else {
      getAgent();
    }
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
