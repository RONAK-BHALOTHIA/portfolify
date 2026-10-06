import Link from "next/link";
import { Project } from "@/types/portfolio";
import { Theme } from "@/lib/themes";

export default function ProjectDetail({ project, theme }: { project: Project; theme: Theme }) {
  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/projects" className={`text-sm ${theme.accent}`}>
        ← All projects
      </Link>

      <h1 className="text-4xl font-bold mt-6">{project.title}</h1>

      <div className="flex flex-wrap gap-2 mt-4">
        {project.techStack.map((t) => (
          <span key={t} className={`px-3 py-1 rounded-full text-sm ${theme.chip}`}>
            {t}
          </span>
        ))}
      </div>

      <h2 className={`text-sm font-semibold uppercase tracking-widest mt-10 mb-3 ${theme.accent}`}>Overview</h2>
      <p className={`leading-relaxed whitespace-pre-line ${theme.muted}`}>{project.description}</p>

      {(project.liveUrl || project.repoUrl) && (
        <div className="flex flex-wrap gap-3 mt-10">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className={`px-5 py-2 rounded-lg text-sm font-medium ${theme.button}`}
            >
              Visit live site ↗
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className={`px-5 py-2 rounded-lg border text-sm ${theme.line}`}
            >
              View code ↗
            </a>
          )}
        </div>
      )}
    </article>
  );
}