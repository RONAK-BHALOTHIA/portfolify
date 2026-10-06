import { PortfolioData } from "@/types/portfolio";
import { Theme } from "@/lib/themes";

export default function AboutPage({ data, theme }: { data: PortfolioData; theme: Theme }) {
  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold">About me</h1>
      <p className={`text-xl mt-2 ${theme.accent}`}>{data.title}</p>
      {data.location && <p className={`text-sm mt-1 ${theme.muted}`}>{data.location}</p>}

      <p className={`mt-8 leading-relaxed whitespace-pre-line ${theme.muted}`}>{data.bio}</p>

      {data.skills.length > 0 && (
        <>
          <h2 className={`text-sm font-semibold uppercase tracking-widest mt-12 mb-4 ${theme.accent}`}>Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill) => (
              <span key={skill} className={`px-3 py-1 rounded-full text-sm ${theme.chip}`}>
                {skill}
              </span>
            ))}
          </div>
        </>
      )}
    </section>
  );
}