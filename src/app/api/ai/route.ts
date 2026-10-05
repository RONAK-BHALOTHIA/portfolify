import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Change this if you want a different model.
const MODEL = "claude-haiku-4-5-20251001";

const SYSTEM = `You edit text for developer portfolio websites.
Rules:
- Keep the person's meaning and facts. Never invent skills, numbers, employers, or achievements.
- Write in plain, clear, confident language. Avoid buzzwords like "results-driven", "cutting-edge", "innovative", "passionate", "world-class".
- Focus on what the person built, the problem it solved, and what they did.
- Return ONLY the improved text. No quotes, no preamble, no explanation.`;

const INSTRUCTIONS = {
  bio: "Rewrite this portfolio bio in first person. 2 to 4 sentences. Make it specific and easy to read.",
  project:
    "Rewrite this project description in 2 to 3 sentences. Lead with the problem it solves and what was built, then the outcome if one is stated.",
} as const;

export async function POST(req: Request) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "Missing ANTHROPIC_API_KEY in .env.local" }, { status: 500 });
    }

    const { kind, text, context } = await req.json();

    if (kind !== "bio" && kind !== "project") {
      return NextResponse.json({ error: "Invalid kind" }, { status: 400 });
    }
    if (typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ error: "Write something first, then improve it." }, { status: 400 });
    }
    if (text.length > 2000) {
      return NextResponse.json({ error: "Text is too long (max 2000 characters)." }, { status: 400 });
    }

    const prompt = `${INSTRUCTIONS[kind as "bio" | "project"]}

Context about the person: ${String(context ?? "").slice(0, 500)}

Text to improve:
${text}`;

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 400,
      system: SYSTEM,
      messages: [{ role: "user", content: prompt }],
    });

    const block = response.content.find((b) => b.type === "text");
    const improved = block && block.type === "text" ? block.text.trim() : "";

    if (!improved) {
      return NextResponse.json({ error: "No response from AI." }, { status: 502 });
    }

    return NextResponse.json({ improved });
  } catch (err) {
    console.error("AI route error:", err);
    return NextResponse.json({ error: "AI request failed. Check the terminal for details." }, { status: 500 });
  }
}