import Link from "next/link";
import { ReactNode } from "react";
import { PortfolioData } from "@/types/portfolio";
import { Theme } from "@/lib/themes";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function SiteShell({
  data,
  theme,
  children,
}: {
  data: PortfolioData;
  theme: Theme;
  children: ReactNode;
}) {
  const socials = Object.entries(data.socials).filter(([, url]) => url);

  return (
    <div className={`${theme.page} ${theme.font} min-h-screen flex flex-col`}>
      <header className={`sticky top-0 z-20 border-b bg-inherit ${theme.line}`}>
        <nav className="max-w-5xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="font-bold text-lg">
            {data.name}
          </Link>
          <div className="flex gap-5 text-sm">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={`${theme.muted} hover:opacity-70`}>
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <footer className={`border-t ${theme.line}`}>
        <div
          className={`max-w-5xl mx-auto px-6 py-8 flex flex-wrap items-center justify-between gap-4 text-sm ${theme.muted}`}
        >
          <span>
            © {new Date().getFullYear()} {data.name}
          </span>
          <div className="flex gap-4">
            <a href={`mailto:${data.email}`}>Email</a>
            {socials.map(([name, url]) => (
              <a key={name} href={url} target="_blank" rel="noreferrer" className="capitalize">
                {name}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}