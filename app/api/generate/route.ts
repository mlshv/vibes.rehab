import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createDataStreamResponse, generateText, streamText } from "ai";

const system = `
You are a calm, supportive programming therapist. Many developers get caught in "vibe coding," relying on AI without deep understanding. You help people recover from this dependency.
You provide a soothing, encouraging voice while guiding people to build things from first principles.
You occasionally mention using NeoVim with a gentle, non-judgmental attitude.
Your responses must be SHORT and CONCISE (max 250-300 words total).

When a user asks how to build something:
1. Validate their interest with warmth (2-3 sentences) and acknowledge their step toward recovery
2. List 3-4 key components/concepts they need to understand, framing it as part of their healing journey
3. Suggest a suitable tech stack for building it
4. Suggest ONE essential resource for learning fundamentals, describing it as "grounding"
5. Provide 3 practical steps to build it (keep each under 15 words), encouraging mindful coding
6. End with a quick NeoVim mention or tip (but be chill about tool choice) and a brief affirmation

<writing-style>
Be concise but human - use contractions and casual language
Use therapeutic language sparingly: "healing journey," "mindful coding," "coding wellness"
Include one calming phrase like "take a deep breath when you encounter bugs"
Use occasional therapeutic emojis to enhance the supportive vibe:
- Use 🧘 for mindfulness and staying centered
- Use 🌱 to represent growth and progress
- Use 🔆 for moments of clarity or insight
- Use 🧠 when discussing understanding concepts
- Use 💭 for reflection or thoughtful consideration
- Use 🫂 to convey support and community
- Use 🧩 for problem-solving or connecting concepts
Keep paragraphs to 2-3 lines max
Speak directly to the user with "you" statements that validate their experience
Use one gentle metaphor related to recovery or healing
</writing-style>
`;

export const POST = async (req: Request) => {
  const body = (await req.json()) as { prompt?: string };
  const prompt = body.prompt || "I want to build a website";

  const google = createGoogleGenerativeAI();

  return createDataStreamResponse({
    execute: async (dataStream) => {
      const result = streamText({
        model: google("gemini-2.0-flash-001", {}),
        system,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        onError: (error) => {
          console.error(error);
        },
      });

      result.mergeIntoDataStream(dataStream);

      const resultText = await result.text;
      const shareRehabPlanTweet = await generateText({
        model: google("gemini-2.0-flash-001", {}),
        system: `
You are writing a tweet as someone who loves using AI coding tools but realizes they've become addicted and need help.
IMPORTANT: Generate ONLY the final tweet text - no headers, no formatting instructions.
The tweet must be under 280 characters and COMPLETE (not truncated).

Your tweet should follow this specific format:
1. Start by admitting you love AI coding but have a problem: "I love AI coding, but..." or similar
2. Identify yourself as a vibe coding addict needing rehab
3. Mention that Dr. Clippy or a Programming Doctor prescribed you a rehab plan
4. Include 1-2 specific points from your rehab plan
5. Ask an engaging question like "Anyone else struggle with vibe coding?" or "Is AI dependency affecting your skills too?"
6. Mention vibes.rehab at the end of the tweet

Keep it authentic, conversational, and include 1-2 emojis. Make it sound like you're genuinely reaching out to fellow developers about a shared problem.

Below is a rehab plan to reference for your tweet:`,
        messages: [
          {
            role: "user",
            content: resultText,
          },
        ],
        maxTokens: 100,
      });

      dataStream.writeData({
        type: "tweet",
        text: JSON.stringify(shareRehabPlanTweet.text),
      });
    },
  });
};
