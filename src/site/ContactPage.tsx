import { PortfolioData } from "@/types/portfolio";
import { Theme } from "@/lib/themes";

export default function ContactPage({ data, theme }: { data: PortfolioData; theme: Theme }) {
  const socials = Object.entries(data.socials).filter(([, url]) => url);

  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold">Contact</h1>
      <p className={`mt-2 ${theme.muted}`}>The best way to reach me is by email.</p>

      <a
        href={`mailto:${data.email}`}
        className={`inline-block mt-8 px-6 py-3 rounded-lg font-medium ${theme.button}`}
      >
        {data.email}
      </a>

      {socials.length > 0 && (
        <>
          <h2 className={`text-sm font-semibold uppercase tracking-widest mt-12 mb-4 ${theme.accent}`}>Find me online</h2>
          <div className="flex flex-wrap gap-3">
            {socials.map(([name, url]) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noreferrer"
                className={`px-5 py-2 rounded-lg border text-sm capitalize ${theme.line}`}
              >
                {name} ↗
              </a>
            ))}
          </div>
        </>
      )}
    </section>
  );
}