import { PortfolioData } from "@/types/portfolio";

export default function MinimalTemplate({ data }: { data: PortfolioData }) {
  const socials = Object.entries(data.socials).filter(([, url]) => url);

  return (
    <div className="bg-white text-slate-900 min-h-full">
      <header className="max-w-3xl mx-auto px-6 pt-20 pb-10">
        <h1 className="text-5xl font-bold tracking-tight">{data.name}</h1>
        <p className="text-xl text-slate-500 mt-2">{data.title}</p>
        {data.location && <p className="text-sm text-slate-400 mt-1">{data.location}</p>}
        <p className="mt-6 text-slate-700 leading-relaxed">{data.bio}</p>

        <div className="flex flex-wrap gap-4 mt-6 text-sm">
          <a href={`mailto:${data.email}`} className="underline">
            {data.email}
          </a>
          {socials.map(([name, url]) => (
            <a key={name} href={url} className="underline capitalize" target="_blank" rel="noreferrer">
              {name}
            </a>
          ))}
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-6 py-8">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-4">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill) => (
            <span key={skill} className="px-3 py-1 rounded-full bg-slate-100 text-sm">
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-8 pb-20">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-4">Projects</h2>
        <div className="space-y-6">
          {data.projects.map((p) => (
            <article key={p.id} className="border-b border-slate-200 pb-6">
              <h3 className="text-xl font-semibold">{p.title}</h3>
              <p className="text-slate-600 mt-1">{p.description}</p>
              <p className="text-sm text-slate-400 mt-2">{p.techStack.join(" · ")}</p>
              <div className="flex gap-4 mt-2 text-sm">
                {p.liveUrl && (
                  <a href={p.liveUrl} className="underline" target="_blank" rel="noreferrer">
                    Live
                  </a>
                )}
                {p.repoUrl && (
                  <a href={p.repoUrl} className="underline" target="_blank" rel="noreferrer">
                    Code
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