"use client";
import { useEffect, useState } from "react";
import { useCompletion } from "@ai-sdk/react";

import { Alert, Button, List, Modal, TextArea, TitleBar } from "@react95/core";
import { Markdown } from "@/app/components/markdown";
import { XIcon } from "@/app/components/icons";
import {
  Tree,
  Bulb,
  FilePen,
  Timedate200,
  ReaderDisket,
  Mmsys108,
} from "@react95/icons";
import { useClippy } from "@react95/clippy";

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
  });

  const { clippy } = useClippy();

  const [showInfoModal, toggleShowInfoModal] = useState(false);

  useEffect(() => {
    if (clippy) {
      clippy.show(true);
      clippy.play("Wave");
    }
  }, [clippy]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPrompt.trim()) return;
    await complete(userPrompt);
  };

  const onShare = () => {
    const tweetText =
      "take the first step in your coding rehabilitation journey at vibes dot rehab";
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`,
      "_blank"
    );
  };

  return (
    <section className="min-h-screen w-full flex flex-col items-center px-4 py-16">
      <div className="flex flex-col items-center justify-center max-w-2xl w-full">
        <Modal
          style={{ position: "static", width: "100%" }}
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
            style={{ padding: "16px", paddingTop: "24px" }}
          >
            <div className="flex items-center justify-center gap-2 mb-8 md:mb-8">
              <Bulb variant="32x32_4" />
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
                  onKeyDown={(e) =>
                    e.key === "Enter" && e.metaKey && handleSubmit(e)
                  }
                  placeholder="I want to build..."
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    marginLeft: "auto",
                  }}
                >
                  Ok
                </Button>
              </div>
            </form>

            <h2 className="mb-1">Or start with one of these:</h2>

            <div className="flex flex-wrap gap-3 mb-8">
              {suggestedPrompts.map(({ text, url, icon }) => (
                <Button
                  key={text}
                  onClick={() => {
                    window.open(url, "_blank");
                  }}
                >
                  <div className="flex items-center gap-2">
                    {icon} {text}
                  </div>
                </Button>
              ))}
            </div>

            {completion && (
              <div className="">
                <h1 className="text-lg font-medium mb-2">Your rehab plan</h1>
                <Markdown content={completion} />

                <div className="flex flex-col justify-center items-center gap-2 mt-8">
                  <p>
                    Your journey might be the inspiration someone else needs.
                  </p>
                  <Button className="flex items-center gap-2" onClick={onShare}>
                    Share on <XIcon className="size-4" />
                  </Button>
                </div>
              </div>
            )}
          </Modal.Content>
        </Modal>

        {showInfoModal && (
          <Alert
            title="About vibes.rehab"
            type="info"
            message={
              (
                <div>
                  Created by{" "}
                  <a href="https://x.com/topcatnocap">@topcatnocap</a>, a
                  software engineer who still enjoys writing code by hand.
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
