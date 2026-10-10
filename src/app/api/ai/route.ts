import { NextResponse } from "next/server";

const MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";

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
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing GEMINI_API_KEY in .env.local" }, { status: 500 });
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

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM }] },
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 1024, temperature: 0.7 },
        }),
      }
    );

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("Gemini error:", res.status, json?.error?.message);
      if (res.status === 400 || res.status === 403) {
        return NextResponse.json(
          { error: "Gemini rejected the request. Check your API key and the model name." },
          { status: 502 }
        );
      }
      if (res.status === 404) {
        return NextResponse.json({ error: `Model "${MODEL}" was not found. Check the model name.` }, { status: 502 });
      }
      if (res.status === 429) {
        return NextResponse.json({ error: "Gemini rate limit reached. Wait a minute and try again." }, { status: 429 });
      }
      return NextResponse.json({ error: "Gemini request failed. Check the terminal for details." }, { status: 502 });
    }

    const parts: { text?: string }[] = json?.candidates?.[0]?.content?.parts ?? [];
    const improved = parts.map((p) => p.text ?? "").join("").trim();

    if (!improved) {
      return NextResponse.json({ error: "No response from AI. Try again." }, { status: 502 });
    }

    return NextResponse.json({ improved });
  } catch (err) {
    console.error("AI route error:", err instanceof Error ? err.message : "unknown");
    return NextResponse.json({ error: "AI request failed. Check the terminal for details." }, { status: 500 });
  }
}
