import { PortfolioData } from "@/types/portfolio";

export default function DarkTemplate({ data }: { data: PortfolioData }) {
  const socials = Object.entries(data.socials).filter(([, url]) => url);

  return (
    <div className="bg-slate-950 text-slate-100 min-h-full">
      <header className="max-w-4xl mx-auto px-6 pt-24 pb-12">
        <p className="text-indigo-400 text-sm mb-2">Hi, I&apos;m</p>
        <h1 className="text-6xl font-extrabold bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
          {data.name}
        </h1>
        <p className="text-2xl text-slate-300 mt-3">{data.title}</p>
        <p className="mt-6 text-slate-400 max-w-2xl leading-relaxed">{data.bio}</p>

        <div className="flex flex-wrap gap-3 mt-8">
          <a href={`mailto:${data.email}`} className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium">
            Contact me
          </a>
          {socials.map(([name, url]) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2 rounded-lg border border-slate-700 hover:border-slate-500 text-sm capitalize"
            >
              {name}
            </a>
          ))}
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-4">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill) => (
            <span key={skill} className="px-3 py-1 rounded-md bg-slate-800 text-indigo-300 text-sm">
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-8 pb-24">
        <h2 className="text-2xl font-bold mb-4">Projects</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {data.projects.map((p) => (
            <article key={p.id} className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <h3 className="text-lg font-semibold">{p.title}</h3>
              <p className="text-slate-400 text-sm mt-2">{p.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {p.techStack.map((t) => (
                  <span key={t} className="text-xs text-slate-500">
                    #{t}
                  </span>
                ))}
              </div>
              <div className="flex gap-4 mt-3 text-sm text-indigo-400">
                {p.liveUrl && (
                  <a href={p.liveUrl} target="_blank" rel="noreferrer">
                    Live ↗
                  </a>
                )}
                {p.repoUrl && (
                  <a href={p.repoUrl} target="_blank" rel="noreferrer">
                    Code ↗
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}