"use client";

import { useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import { saveAs } from "file-saver";
import { usePortfolioStore } from "@/store/usePortfolioStore";
import { templates, getTemplate } from "@/lib/templates";
import { Project } from "@/types/portfolio";
import AIButton from "@/components/AIButton";
import GitHubPush from "@/components/GitHubPush";
import SitePreview from "@/components/SitePreview";
import { themes } from "@/lib/themes";

const inputClass =
  "w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block mb-3">
      <span className="block text-xs text-slate-400 mb-1">{label}</span>
      {children}
    </label>
  );
}

// Comma-separated list input (skills, tech stack)
function ListInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [text, setText] = useState(value.join(", "));

  return (
    <input
      className={inputClass}
      value={text}
      placeholder={placeholder}
      onChange={(e) => {
        setText(e.target.value);
        onChange(
          e.target.value
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        );
      }}
    />
  );
}

export default function BuilderPage() {
  const { data, templateId, setTemplate, updateField, reset } = usePortfolioStore();
  const current = getTemplate(templateId);
  const theme = themes.find((t) => t.id === current.id) ?? themes[0];

  const [ready, setReady] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  // Load saved data from the browser before drawing the page
  useEffect(() => {
    Promise.resolve(usePortfolioStore.persist.rehydrate()).then(() => setReady(true));
  }, []);

  const generate = async () => {
    setExporting(true);
    setExportError(null);
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: current.id, data }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Export failed.");
      }
      const blob = await res.blob();
      saveAs(blob, "portfolio-project.zip");
    } catch (e) {
      setExportError(e instanceof Error ? e.message : "Export failed.");
    } finally {
      setExporting(false);
    }
  };

  const updateProject = (id: string, patch: Partial<Project>) =>
    updateField(
      "projects",
      data.projects.map((p) => (p.id === id ? { ...p, ...patch } : p))
    );

  const addProject = () =>
    updateField("projects", [
      ...data.projects,
      { id: Date.now().toString(), title: "", description: "", techStack: [], liveUrl: "", repoUrl: "" },
    ]);

  const removeProject = (id: string) =>
    updateField(
      "projects",
      data.projects.filter((p) => p.id !== id)
    );

  const updateSocial = (key: "github" | "linkedin" | "instagram", value: string) =>
    updateField("socials", { ...data.socials, [key]: value });

  if (!ready) return <div className="h-screen bg-slate-950" />;

  return (
    <div className="h-screen flex bg-slate-950 text-white">
      {/* LEFT: form */}
      <aside className="w-[400px] shrink-0 border-r border-slate-800 overflow-y-auto p-5">
        <div className="flex items-center justify-between mb-5">
          <Link href="/portfolio/templates" className="text-sm text-slate-400 hover:text-white">
            ← Templates
          </Link>
          <button onClick={reset} className="text-xs text-slate-500 hover:text-white">
            Reset
          </button>
        </div>

        <Field label="Template">
          <select className={inputClass} value={current.id} onChange={(e) => setTemplate(e.target.value)}>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </Field>

        <button
          onClick={generate}
          disabled={exporting}
          className="w-full mb-2 px-4 py-2.5 rounded-lg bg-indigo-600 text-sm font-medium hover:bg-indigo-500 disabled:opacity-50"
        >
          {exporting ? "Generating..." : "⬇ Generate Project (ZIP)"}
        </button>
        {exportError && <p className="text-xs text-red-400 mb-2">{exportError}</p>}

        <div className="mb-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-100">
          <p className="font-semibold mb-1">Before you run the downloaded project</p>
          <ol className="list-decimal pl-4 space-y-1 text-amber-100/90">
            <li>
              Unzip the file and open the folder that contains{" "}
              <code className="bg-slate-900 px-1 rounded">package.json</code> in VS Code.
            </li>
            <li>
              Install the packages first: <code className="bg-slate-900 px-1 rounded">npm install</code>
            </li>
            <li>
              Then start the site: <code className="bg-slate-900 px-1 rounded">npm run dev</code>
            </li>
          </ol>
          <p className="mt-2 text-amber-100/70">
            Node.js must be installed. If you skip step 2 you will see the error &quot;&apos;next&apos; is not
            recognized&quot;.
          </p>
        </div>

        <GitHubPush templateId={current.id} data={data} />

        <h2 className="text-sm font-semibold mt-6 mb-3">About you</h2>
        <Field label="Full name">
          <input className={inputClass} value={data.name} onChange={(e) => updateField("name", e.target.value)} />
        </Field>
        <Field label="Title">
          <input className={inputClass} value={data.title} onChange={(e) => updateField("title", e.target.value)} />
        </Field>
        <Field label="Location">
          <input
            className={inputClass}
            value={data.location ?? ""}
            onChange={(e) => updateField("location", e.target.value)}
          />
        </Field>
        <Field label="Email">
          <input className={inputClass} value={data.email} onChange={(e) => updateField("email", e.target.value)} />
        </Field>
        <Field label="Bio">
          <textarea
            className={inputClass}
            rows={4}
            value={data.bio}
            onChange={(e) => updateField("bio", e.target.value)}
          />
        </Field>
        <AIButton
          kind="bio"
          text={data.bio}
          context={`${data.name}, ${data.title}. Skills: ${data.skills.join(", ")}`}
          onAccept={(t) => updateField("bio", t)}
        />
        <Field label="Skills (comma separated)">
          <ListInput
            value={data.skills}
            onChange={(v) => updateField("skills", v)}
            placeholder="React, Next.js, TypeScript"
          />
        </Field>

        <h2 className="text-sm font-semibold mt-6 mb-3">Links</h2>
        {(["github", "linkedin", "instagram"] as const).map((key) => (
          <Field key={key} label={key[0].toUpperCase() + key.slice(1) + " URL"}>
            <input
              className={inputClass}
              placeholder="https://..."
              value={data.socials[key] ?? ""}
              onChange={(e) => updateSocial(key, e.target.value)}
            />
          </Field>
        ))}

        <div className="flex items-center justify-between mt-6 mb-3">
          <h2 className="text-sm font-semibold">Projects</h2>
          <button onClick={addProject} className="text-xs px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500">
            + Add project
          </button>
        </div>

        {data.projects.map((p, i) => (
          <div key={p.id} className="rounded-lg border border-slate-800 bg-slate-900 p-3 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500">Project {i + 1}</span>
              <button onClick={() => removeProject(p.id)} className="text-xs text-red-400 hover:text-red-300">
                Remove
              </button>
            </div>
            <Field label="Title">
              <input
                className={inputClass}
                value={p.title}
                onChange={(e) => updateProject(p.id, { title: e.target.value })}
              />
            </Field>
            <Field label="Description">
              <textarea
                className={inputClass}
                rows={3}
                value={p.description}
                onChange={(e) => updateProject(p.id, { description: e.target.value })}
              />
            </Field>
            <AIButton
              kind="project"
              text={p.description}
              context={`Project: ${p.title}. Tech: ${p.techStack.join(", ")}`}
              onAccept={(t) => updateProject(p.id, { description: t })}
            />
            <Field label="Tech stack (comma separated)">
              <ListInput value={p.techStack} onChange={(v) => updateProject(p.id, { techStack: v })} />
            </Field>
            <Field label="Live URL">
              <input
                className={inputClass}
                value={p.liveUrl ?? ""}
                onChange={(e) => updateProject(p.id, { liveUrl: e.target.value })}
              />
            </Field>
            <Field label="Repo URL">
              <input
                className={inputClass}
                value={p.repoUrl ?? ""}
                onChange={(e) => updateProject(p.id, { repoUrl: e.target.value })}
              />
            </Field>
          </div>
        ))}
      </aside>

      {/* RIGHT: live preview */}
      <main className="flex-1 overflow-auto">
        <SitePreview data={data} theme={theme} />
      </main>
    </div>
  );
}