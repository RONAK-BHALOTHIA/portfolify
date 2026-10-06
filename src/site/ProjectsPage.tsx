import Link from "next/link";
import { PortfolioData } from "@/types/portfolio";
import { Theme } from "@/lib/themes";

export default function ProjectsPage({ data, theme }: { data: PortfolioData; theme: Theme }) {
  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold">Projects</h1>
      <p className={`mt-2 ${theme.muted}`}>Things I&apos;ve built.</p>

      {data.projects.length === 0 && <p className={`mt-10 ${theme.muted}`}>No projects yet.</p>}

      <div className="grid gap-5 sm:grid-cols-2 mt-10">
        {data.projects.map((p) => (
          <Link
            key={p.id}
            href={`/projects/${p.id}`}
            className={`block rounded-xl p-6 transition hover:-translate-y-1 ${theme.card}`}
          >
            <h2 className="text-xl font-semibold">{p.title}</h2>
            <p className={`text-sm mt-2 ${theme.muted}`}>{p.description}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {p.techStack.map((t) => (
                <span key={t} className={`px-2 py-0.5 rounded text-xs ${theme.chip}`}>
                  {t}
                </span>
              ))}
            </div>
            <p className={`text-sm mt-4 ${theme.accent}`}>View details →</p>
          </Link>
        ))}
      </div>
    </section>
  );
}