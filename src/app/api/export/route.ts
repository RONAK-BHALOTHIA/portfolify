import JSZip from "jszip";
import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { themes } from "@/lib/themes";

export const runtime = "nodejs";

const root = process.cwd();
const read = (rel: string) => fs.readFile(path.join(root, rel), "utf8");

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "portfolio";

const SITE_FILES = ["SiteShell", "HomePage", "ProjectsPage", "ProjectDetail", "AboutPage", "ContactPage"];

export async function POST(req: Request) {
  try {
    const { templateId, data } = await req.json();

    if (!themes.some((t) => t.id === templateId)) {
      return NextResponse.json({ error: "Unknown template." }, { status: 400 });
    }
    if (!data || typeof data !== "object" || typeof data.name !== "string") {
      return NextResponse.json({ error: "Invalid portfolio data." }, { status: 400 });
    }
    const dataJson = JSON.stringify(data, null, 2);
    if (dataJson.length > 100_000) {
      return NextResponse.json({ error: "Portfolio data is too large." }, { status: 413 });
    }

    // Reuse the exact dependency versions this project already runs on
    const pkg = JSON.parse(await read("package.json"));
    const all = { ...pkg.dependencies, ...pkg.devDependencies } as Record<string, string>;
    const v = (name: string) => all[name] ?? "latest";

    const projectName = `${slugify(data.name)}-portfolio`;
    const zip = new JSZip();
    const add = (file: string, content: string) => zip.file(`${projectName}/${file}`, content);

    // ---- Site components (copied from this project) ----
    for (const f of SITE_FILES) {
      add(`src/site/${f}.tsx`, await read(`src/site/${f}.tsx`));
    }
    add("src/lib/themes.ts", await read("src/lib/themes.ts"));
    add("src/types/portfolio.ts", await read("src/types/portfolio.ts"));

    // ---- Content and chosen theme ----
    add(
      "src/data/portfolio.ts",
      `import { PortfolioData } from "@/types/portfolio";\n\nexport const data: PortfolioData = ${dataJson};\n`
    );
    add(
      "src/data/theme.ts",
      `import { themes } from "@/lib/themes";\n\nexport const theme = themes.find((t) => t.id === ${JSON.stringify(
        templateId
      )})!;\n`
    );

    // ---- Pages ----
    add(
      "src/app/layout.tsx",
      `import type { Metadata } from "next";
import "./globals.css";
import SiteShell from "@/site/SiteShell";
import { data } from "@/data/portfolio";
import { theme } from "@/data/theme";

export const metadata: Metadata = {
  title: data.name + " | Portfolio",
  description: data.title,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteShell data={data} theme={theme}>
          {children}
        </SiteShell>
      </body>
    </html>
  );
}
`
    );

    add(
      "src/app/page.tsx",
      `import HomePage from "@/site/HomePage";
import { data } from "@/data/portfolio";
import { theme } from "@/data/theme";

export default function Page() {
  return <HomePage data={data} theme={theme} />;
}
`
    );

    add(
      "src/app/projects/page.tsx",
      `import ProjectsPage from "@/site/ProjectsPage";
import { data } from "@/data/portfolio";
import { theme } from "@/data/theme";

export default function Page() {
  return <ProjectsPage data={data} theme={theme} />;
}
`
    );

    add(
      "src/app/projects/[id]/page.tsx",
      `import { notFound } from "next/navigation";
import ProjectDetail from "@/site/ProjectDetail";
import { data } from "@/data/portfolio";
import { theme } from "@/data/theme";

export function generateStaticParams() {
  return data.projects.map((p) => ({ id: p.id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = data.projects.find((p) => p.id === id);
  if (!project) notFound();
  return <ProjectDetail project={project} theme={theme} />;
}
`
    );

    add(
      "src/app/about/page.tsx",
      `import AboutPage from "@/site/AboutPage";
import { data } from "@/data/portfolio";
import { theme } from "@/data/theme";

export default function Page() {
  return <AboutPage data={data} theme={theme} />;
}
`
    );

    add(
      "src/app/contact/page.tsx",
      `import ContactPage from "@/site/ContactPage";
import { data } from "@/data/portfolio";
import { theme } from "@/data/theme";

export default function Page() {
  return <ContactPage data={data} theme={theme} />;
}
`
    );

    add("src/app/globals.css", '@import "tailwindcss";\n');

    // ---- Project config ----
    add(
      "package.json",
      JSON.stringify(
        {
          name: projectName,
          version: "0.1.0",
          private: true,
          scripts: { dev: "next dev", build: "next build", start: "next start" },
          dependencies: {
            next: v("next"),
            react: v("react"),
            "react-dom": v("react-dom"),
          },
          devDependencies: {
            typescript: v("typescript"),
            "@types/node": v("@types/node"),
            "@types/react": v("@types/react"),
            "@types/react-dom": v("@types/react-dom"),
            tailwindcss: v("tailwindcss"),
            "@tailwindcss/postcss": v("@tailwindcss/postcss"),
          },
        },
        null,
        2
      )
    );

    add("tsconfig.json", await read("tsconfig.json"));

    add(
      "next.config.ts",
      'import type { NextConfig } from "next";\n\nconst nextConfig: NextConfig = {};\n\nexport default nextConfig;\n'
    );

    add(
      "postcss.config.mjs",
      'const config = {\n  plugins: { "@tailwindcss/postcss": {} },\n};\n\nexport default config;\n'
    );

    add(".gitignore", "node_modules\n.next\n.env*\nnext-env.d.ts\n*.tsbuildinfo\n.vercel\n");

    add(
      "README.md",
      [
        `# ${data.name} | Portfolio`,
        "",
        "Generated with Portfolify.",
        "",
        "## Pages",
        "",
        "- `/` Home",
        "- `/projects` All projects",
        "- `/projects/[id]` One page per project",
        "- `/about` About",
        "- `/contact` Contact",
        "",
        "## Run locally",
        "",
        "```bash",
        "npm install",
        "npm run dev",
        "```",
        "",
        "Open http://localhost:3000.",
        "",
        "## Edit your content",
        "",
        "All your content is in `src/data/portfolio.ts`. The page layouts are in `src/site/`.",
        "",
      ].join("\n")
    );

    const body = await zip.generateAsync({ type: "arraybuffer" });

    return new Response(body, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${projectName}.zip"`,
      },
    });
  } catch (err) {
    console.error("Export error:", err);
    return NextResponse.json({ error: "Export failed. Check the terminal for details." }, { status: 500 });
  }
}