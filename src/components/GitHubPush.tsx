"use client";

import { useState } from "react";
import { PortfolioData } from "@/types/portfolio";

const inputClass =
  "w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500";

export default function GitHubPush({ templateId, data }: { templateId: string; data: PortfolioData }) {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState("");
  const [repoName, setRepoName] = useState("my-portfolio");
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  const push = async () => {
    setLoading(true);
    setError(null);
    setUrl(null);
    try {
      const res = await fetch("/api/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, repoName, isPrivate, templateId, data }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Push failed.");
      setUrl(json.url);
      setToken(""); // don't keep the token around
    } catch (e) {
      setError(e instanceof Error ? e.message : "Push failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-2">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-2 rounded-lg border border-slate-700 text-sm hover:border-slate-500"
      >
        {open ? "Hide GitHub" : "Push to GitHub (optional)"}
      </button>

      {open && (
        <div className="mt-2 rounded-lg border border-slate-800 bg-slate-900 p-3">
          <label className="block mb-3">
            <span className="block text-xs text-slate-400 mb-1">Repository name</span>
            <input className={inputClass} value={repoName} onChange={(e) => setRepoName(e.target.value)} />
          </label>
          <label className="block mb-3">
            <span className="block text-xs text-slate-400 mb-1">GitHub token (classic, "repo" scope)</span>
            <input
              type="password"
              className={inputClass}
              value={token}
              placeholder="ghp_..."
              autoComplete="off"
              onChange={(e) => setToken(e.target.value)}
            />
          </label>
          <label className="flex items-center gap-2 text-xs text-slate-300 mb-3">
            <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />
            Make the repository private
          </label>

          <button
            onClick={push}
            disabled={loading || !token || !repoName}
            className="w-full px-4 py-2 rounded-lg bg-indigo-600 text-sm font-medium hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading ? "Pushing..." : "Create repo and push"}
          </button>

          {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
          {url && (
            <p className="text-xs text-emerald-400 mt-2">
              Done!{" "}
              <a href={url} target="_blank" rel="noreferrer" className="underline">
                Open your repository ↗
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}