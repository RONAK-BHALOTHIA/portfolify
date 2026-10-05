import { PortfolioData } from "@/types/portfolio";
import { Theme } from "@/lib/themes";

export function makeThemed(theme: Theme) {
  return function ThemedTemplate({ data }: { data: PortfolioData }) {
    const socials = Object.entries(data.socials).filter(([, url]) => url);
    const center = theme.align === "center";
    const align = center ? "text-center items-center justify-center" : "";

    return (
      <div className={`${theme.page} ${theme.font} min-h-full`}>
        <header className={`max-w-4xl mx-auto px-6 pt-24 pb-10 flex flex-col ${align}`}>
          <h1 className="text-5xl font-bold tracking-tight">{data.name}</h1>
          <p className={`text-2xl mt-2 ${theme.accent}`}>{data.title}</p>
          {data.location && <p className={`text-sm mt-1 ${theme.muted}`}>{data.location}</p>}
          <p className={`mt-6 max-w-2xl leading-relaxed ${theme.muted}`}>{data.bio}</p>

          <div className={`flex flex-wrap gap-3 mt-8 ${center ? "justify-center" : ""}`}>
            <a href={`mailto:${data.email}`} className={`px-5 py-2 rounded-lg text-sm font-medium ${theme.button}`}>
              Contact me
            </a>
            {socials.map(([name, url]) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noreferrer"
                className={`px-5 py-2 rounded-lg border text-sm capitalize ${theme.line}`}
              >
                {name}
              </a>
            ))}
          </div>
        </header>

        <section className={`max-w-4xl mx-auto px-6 py-8 ${center ? "text-center" : ""}`}>
          <h2 className={`text-sm font-semibold uppercase tracking-widest mb-4 ${theme.accent}`}>Skills</h2>
          <div className={`flex flex-wrap gap-2 ${center ? "justify-center" : ""}`}>
            {data.skills.map((skill) => (
              <span key={skill} className={`px-3 py-1 rounded-full text-sm ${theme.chip}`}>
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 py-8 pb-24">
          <h2 className={`text-sm font-semibold uppercase tracking-widest mb-4 ${theme.accent} ${center ? "text-center" : ""}`}>
            Projects
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {data.projects.map((p) => (
              <article key={p.id} className={`rounded-xl p-5 ${theme.card}`}>
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className={`text-sm mt-2 ${theme.muted}`}>{p.description}</p>
                <p className={`text-xs mt-3 ${theme.muted}`}>{p.techStack.join(" · ")}</p>
                <div className={`flex gap-4 mt-3 text-sm ${theme.accent}`}>
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
  };
}