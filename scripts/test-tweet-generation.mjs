import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  throw new Error("Set GOOGLE_GENERATIVE_AI_API_KEY first");
}

const google = createGoogleGenerativeAI();

for (let i = 0; i < 5; i++) {
  const result = await generateText({
    model: google("gemini-2.5-flash", {}),
    providerOptions: {
      google: {
        thinkingConfig: {
          thinkingBudget: 0,
        },
      },
    },
    system: `
Write one complete X post under 240 characters. Output only the post text.
Include: loving AI coding but having a problem, vibe coding rehab, Dr. Clippy or Programming Doctor, one concrete step from the rehab plan, one short question, and the literal text vibes.rehab. Do not use hashtags.

Below is a rehab plan to reference for your tweet:`,
    messages: [
      {
        role: "user",
        content:
          "Build a small todo app. Learn state, forms, persistence, and deployment. Start with local state, then save to localStorage, then deploy.",
      },
    ],
    maxTokens: 200,
  });

  console.log(result.text);
  console.log(`chars=${result.text.length}`);

  if (result.text.length > 280) {
    throw new Error("Tweet is too long");
  }

  if (!result.text.includes("vibes.rehab")) {
    throw new Error("Tweet is missing vibes.rehab");
  }
}
