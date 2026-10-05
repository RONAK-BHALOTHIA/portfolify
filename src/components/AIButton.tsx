"use client";

import { useState } from "react";

type Props = {
  kind: "bio" | "project";
  text: string;
  context?: string;
  onAccept: (improved: string) => void;
};

export default function AIButton({ kind, text, context, onAccept }: Props) {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const improve = async () => {
    setLoading(true);
    setError(null);
    setSuggestion(null);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, text, context }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      setSuggestion(json.improved);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-3 -mt-1">
      <button
        type="button"
        onClick={improve}
        disabled={loading || !text.trim()}
        className="text-xs px-3 py-1 rounded bg-slate-800 border border-slate-700 text-indigo-300 hover:border-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? "Improving..." : "✨ Improve with AI"}
      </button>

      {error && <p className="text-xs text-red-400 mt-2">{error}</p>}

      {suggestion && (
        <div className="mt-2 rounded-md border border-indigo-700 bg-slate-900 p-3">
          <p className="text-xs text-slate-400 mb-1">Suggestion</p>
          <p className="text-sm text-slate-100 whitespace-pre-wrap">{suggestion}</p>
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={() => {
                onAccept(suggestion);
                setSuggestion(null);
              }}
              className="text-xs px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500"
            >
              Accept
            </button>
            <button
              type="button"
              onClick={() => setSuggestion(null)}
              className="text-xs px-3 py-1 rounded border border-slate-700 hover:border-slate-500"
            >
              Discard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}