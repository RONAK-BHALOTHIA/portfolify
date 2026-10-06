import Link from "next/link";
import { PortfolioData } from "@/types/portfolio";
import { Theme } from "@/lib/themes";

export default function HomePage({ data, theme }: { data: PortfolioData; theme: Theme }) {
  const center = theme.align === "center";
  const featured = data.projects.slice(0, 3);

  return (
    <>
      <section
        className={`max-w-5xl mx-auto px-6 pt-24 pb-16 flex flex-col ${center ? "text-center items-center" : ""}`}
      >
        <h1 className={`text-5xl sm:text-6xl font-bold tracking-tight ${theme.nameClass ?? ""}`}>{data.name}</h1>
        <p className={`text-2xl mt-3 ${theme.accent}`}>{data.title}</p>
        {data.location && <p className={`text-sm mt-1 ${theme.muted}`}>{data.location}</p>}
        <p className={`mt-6 max-w-2xl leading-relaxed ${theme.muted}`}>{data.bio}</p>
        <div className="flex flex-wrap gap-3 mt-8">
          <Link href="/projects" className={`px-5 py-2 rounded-lg text-sm font-medium ${theme.button}`}>
            View projects
          </Link>
          <Link href="/contact" className={`px-5 py-2 rounded-lg border text-sm ${theme.line}`}>
            Contact me
          </Link>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex items-end justify-between mb-6">
            <h2 className={`text-sm font-semibold uppercase tracking-widest ${theme.accent}`}>Featured projects</h2>
            <Link href="/projects" className={`text-sm ${theme.accent}`}>
              All projects →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className={`block rounded-xl p-5 transition hover:-translate-y-1 ${theme.card}`}
              >
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className={`text-sm mt-2 line-clamp-3 ${theme.muted}`}>{p.description}</p>
                <p className={`text-xs mt-3 ${theme.muted}`}>{p.techStack.join(" · ")}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {data.skills.length > 0 && (
        <section className={`max-w-5xl mx-auto px-6 py-12 ${center ? "text-center" : ""}`}>
          <h2 className={`text-sm font-semibold uppercase tracking-widest mb-4 ${theme.accent}`}>Skills</h2>
          <div className={`flex flex-wrap gap-2 ${center ? "justify-center" : ""}`}>
            {data.skills.map((skill) => (
              <span key={skill} className={`px-3 py-1 rounded-full text-sm ${theme.chip}`}>
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold">Let&apos;s work together</h2>
        <p className={`mt-3 ${theme.muted}`}>Have a role or project in mind? I&apos;d like to hear about it.</p>
        <a
          href={`mailto:${data.email}`}
          className={`inline-block mt-6 px-6 py-3 rounded-lg font-medium ${theme.button}`}
        >
          Get in touch
        </a>
      </section>
    </>
  );
}