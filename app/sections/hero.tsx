"use client";
import { useEffect, useState } from "react";
import { useCompletion } from "@ai-sdk/react";
import { track } from "@vercel/analytics";

import { Alert } from "@react95/core/Alert";
import { Button } from "@react95/core/Button";
import { List } from "@react95/core/List";
import { Modal } from "@react95/core/Modal";
import { TextArea } from "@react95/core/TextArea";
import { TitleBar } from "@react95/core/TitleBar";

import { Markdown } from "@/app/components/markdown";
import { XIcon } from "@/app/components/icons";
import {
  Tree,
  FilePen,
  Timedate200,
  ReaderDisket,
  Mmsys108,
} from "@react95/icons";

import { useClippy } from "@/lib/clippy";
import { cn } from "@/lib/cn";

const suggestedPrompts = [
  {
    text: "Text editor",
    icon: <FilePen variant="16x16_4" />,
    url: "https://viewsourcecode.org/snaptoken/kilo/",
  },
  {
    text: "Habit tracker",
    icon: <Timedate200 variant="16x16_4" />,
    url: "https://youtu.be/15-ac463Wr4",
  },
  {
    text: "Space invaders game",
    icon: <Mmsys108 variant="16x16_4" />,
    url: "https://nicktasios.nl/posts/space-invaders-from-scratch-part-1.html",
  },
  {
    text: "Simple database",
    icon: <ReaderDisket variant="16x16_4" />,
    url: "https://cstack.github.io/db_tutorial/",
  },
] as const;

export const Hero = () => {
  const [userPrompt, setUserPrompt] = useState("");
  const { complete, completion, isLoading } = useCompletion({
    api: "/api/generate",
    onFinish: () => {
      if (clippy) {
        if (window.innerWidth > 640) clippy.play("GestureLeft");
        else clippy.play("GestureDown");
      }
    },
  });

  const { clippy, loadClippy } = useClippy();
  const [isClippyLoaded, setIsClippyLoaded] = useState(false);

  const [showInfoModal, toggleShowInfoModal] = useState(false);

  useEffect(() => {
    if (!clippy) {
      loadClippy().then((clippy) => {
        setTimeout(() => {
          setIsClippyLoaded(true);
          clippy?.play("Greeting");
        }, 200);
      });
    }
  }, [clippy]);

  const handleSubmit = async (e: React.FormEvent) => {
    track("generate_clicked", {
      prompt: userPrompt,
    });

    e.preventDefault();
    if (!userPrompt.trim()) return;
    clippy?.play("Print");
    await complete(userPrompt);
  };

  const onShare = () => {
    track("share_clicked");
    const tweetText =
      "take the first step in your coding rehabilitation journey at vibes dot rehab";
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`,
      "_blank"
    );
  };

  const promptInputSection = (
    <>
      <div className="flex items-center justify-center gap-2 mb-8 md:mb-8">
        <h1 className="text-xl md:text-3xl font-medium text-center">
          What do you want to build?
        </h1>
      </div>

      <h2 className="mb-1">Describe your project idea to the AI:</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex flex-col gap-2 items-end">
          <TextArea
            value={userPrompt}
            autoFocus
            width="100%"
            height="112px"
            onChange={(e) => setUserPrompt(e.target.value)}
            onFocus={(e) => {
              if (clippy) {
                clippy.play("Writing");
              }
            }}
            onBlur={(e) => {
              if (clippy) {
                clippy.play("IdleEyeBrowRaise");
              }
            }}
            onKeyDown={(e) => e.key === "Enter" && e.metaKey && handleSubmit(e)}
            placeholder="I want to build..."
          />
          <Button
            type="submit"
            disabled={isLoading}
            style={{
              marginLeft: "auto",
            }}
          >
            Generate
          </Button>
        </div>
      </form>

      <h2 className="mb-1">Or start with one of these:</h2>

      <div className="flex flex-wrap gap-3 mb-8">
        {suggestedPrompts.map(({ text, url, icon }) => (
          <Button
            key={text}
            onClick={() => {
              track("suggested_prompt_clicked", {
                prompt: text,
              });

              window.open(url, "_blank");
            }}
          >
            <div className="flex items-center gap-2">
              {icon} {text}
            </div>
          </Button>
        ))}
      </div>
    </>
  );

  return (
    <section className="min-h-screen w-full flex flex-col items-center px-4 py-16">
      <div className="flex flex-col items-center justify-center max-w-2xl w-full">
        {/* @ts-ignore */}
        <Modal
          className="!touch-auto"
          style={{ position: "static", width: "100%", touchAction: "auto" }}
          icon={<Tree variant="16x16_4" />}
          title="vibes.rehab"
          dragOptions={{
            disabled: true,
          }}
          menu={[
            {
              name: "File",
              list: (
                <List width="200px">
                  <List.Item onClick={onShare}>Share</List.Item>
                </List>
              ),
            },
            {
              name: "Info",
              list: (
                <List width="200px">
                  <List.Item
                    onClick={(e) => {
                      toggleShowInfoModal(true);
                    }}
                  >
                    About
                  </List.Item>
                </List>
              ),
            },
          ]}
        >
          <Modal.Content
            boxShadow="$in"
            style={{
              padding: "16px",
              paddingTop: "24px",
            }}
          >
            <div className="flex flex-col sm:flex-row relative w-full min-h-[93px] sm:mb-2">
              <div
                className={cn(
                  "clippy-node w-[124px] h-[93px] absolute left-[50%] -translate-x-1/2 transition-all duration-300 ease-out",
                  completion || isLoading ? "left-0 translate-x-0" : "",
                  isClippyLoaded ? "opacity-100" : "opacity-0"
                )}
              />

              <div className="sm:ml-[144px] sm:mt-0 mt-[113px]">
                {completion && (
                  <div className="bg-[#ffc] p-4 rounded-md border border-black relative">
                    <div className="hidden sm:block">
                      <div className="absolute top-[10px] left-[-14px] border-[14px_14px_14px_0] border-solid border-[transparent_black_transparent]" />
                      <div className="absolute top-[10px] left-[-13px] border-[14px_14px_14px_0] border-solid border-[transparent_#ffc_transparent]" />
                    </div>
                    <div className="block sm:hidden">
                      <div className="absolute top-[-14px] left-[46px] border-[0_14px_14px_14px] border-solid border-[transparent_transparent_black]" />
                      <div className="absolute top-[-13px] left-[46px] border-[0_14px_14px_14px] border-solid border-[transparent_transparent_#ffc]" />
                    </div>
                    <h1 className="text-lg font-medium mb-2">
                      Your rehab plan
                    </h1>
                    <Markdown content={completion} />
                  </div>
                )}
              </div>
            </div>

            {!isLoading && completion && (
              <div className="flex flex-col justify-center items-center gap-2 mt-8">
                <p>Your journey might be the inspiration someone else needs.</p>
                <Button className="flex items-center gap-1" onClick={onShare}>
                  Share on <XIcon className="size-3" />
                </Button>
              </div>
            )}

            {completion || isLoading ? null : promptInputSection}
          </Modal.Content>
        </Modal>

        {showInfoModal && (
          <Alert
            title="About vibes.rehab"
            type="info"
            message={
              (
                <div className="px-2 max-w-[260px]">
                  Created by{" "}
                  <a
                    href="https://x.com/topcatnocap"
                    onClick={() => {
                      track("about_clicked");
                    }}
                  >
                    @topcatnocap
                  </a>
                  , a software engineer who still enjoys writing code by hand.
                </div>
              ) as unknown as string
            }
            titleBarOptions={
              <TitleBar.Close
                key="close"
                onClick={() => toggleShowInfoModal(false)}
              />
            }
            dragOptions={{
              defaultPosition: {
                x: 0,
                y: 0,
              },
            }}
            buttons={[
              {
                value: "OK",
                onClick: () => toggleShowInfoModal(false),
              },
            ]}
          />
        )}
      </div>
    </section>
  );
};
