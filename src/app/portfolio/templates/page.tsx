"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { templates, TemplateEntry } from "@/lib/templates";
import { usePortfolioStore } from "@/store/usePortfolioStore";

export default function TemplatesPage() {
  const router = useRouter();
  const { data, setTemplate } = usePortfolioStore();
  const [preview, setPreview] = useState<TemplateEntry | null>(null);
    useEffect(() => {
    usePortfolioStore.persist.rehydrate();
  }, []);

  const choose = (id: string) => {
    setTemplate(id);
    router.push("/portfolio/builder");
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold">Choose a template</h1>
        <p className="text-slate-400 mt-2 mb-10">
          {templates.length} templates. Open a live preview, then pick the one you like.
        </p>

        <div className="grid gap-8 [grid-template-columns:repeat(auto-fill,360px)] justify-center">
          {templates.map((t) => {
            const Template = t.component;
            return (
              <div key={t.id} className="w-[360px] rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
                {/* Thumbnail: 1200px wide page scaled to 360px (0.3) */}
                <div className="relative h-[240px] overflow-hidden bg-white pointer-events-none">
                  <div className="origin-top-left w-[1200px] h-[800px] overflow-hidden" style={{ transform: "scale(0.3)" }}>
                    <Template data={data} />
                  </div>
                </div>

                <div className="p-4">
                  <h2 className="font-semibold">{t.name}</h2>
                  <p className="text-sm text-slate-400 mt-1">{t.description}</p>
                  <div className="flex gap-2 mt-3">
                    {t.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => setPreview(t)}
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-700 text-sm hover:border-slate-500"
                    >
                      Live Preview
                    </button>
                    <button
                      onClick={() => choose(t.id)}
                      className="flex-1 px-3 py-2 rounded-lg bg-indigo-600 text-sm font-medium hover:bg-indigo-500"
                    >
                      Use this
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {preview && (
        <div className="fixed inset-0 z-50 bg-black/80 flex flex-col">
          <div className="flex items-center justify-between px-5 py-3 bg-slate-900 border-b border-slate-700">
            <div>
              <p className="font-semibold">{preview.name}</p>
              <p className="text-xs text-slate-400">{preview.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPreview(null)}
                className="px-4 py-2 rounded-lg border border-slate-700 text-sm hover:border-slate-500"
              >
                Close
              </button>
              <button
                onClick={() => choose(preview.id)}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-sm font-medium hover:bg-indigo-500"
              >
                Use this template
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <preview.component data={data} />
          </div>
        </div>
      )}
    </main>
  );
}