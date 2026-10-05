import JSZip from "jszip";
import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { templates } from "@/lib/templates";
import { themes } from "@/lib/themes";

export const runtime = "nodejs";

const root = process.cwd();
const read = (rel: string) => fs.readFile(path.join(root, rel), "utf8");

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "portfolio";

export async function POST(req: Request) {
  try {
    const { templateId, data } = await req.json();

    const template = templates.find((t) => t.id === templateId);
    if (!template) {
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

    // ---- Template files ----
    if (templateId === "minimal") {
      add("src/components/Template.tsx", await read("src/components/templates/MinimalTemplate.tsx"));
    } else if (templateId === "dark-gradient") {
      add("src/components/Template.tsx", await read("src/components/templates/DarkTemplate.tsx"));
    } else {
      const theme = themes.find((t) => t.id === templateId);
      if (!theme) {
        return NextResponse.json({ error: "Unknown theme." }, { status: 400 });
      }
      add("src/components/ThemedTemplate.tsx", await read("src/components/templates/ThemedTemplate.tsx"));
      add("src/lib/themes.ts", await read("src/lib/themes.ts"));
      add(
        "src/components/Template.tsx",
        [
          'import { makeThemed } from "@/components/ThemedTemplate";',
          'import { themes } from "@/lib/themes";',
          "",
          `export default makeThemed(themes.find((t) => t.id === ${JSON.stringify(templateId)})!);`,
          "",
        ].join("\n")
      );
    }

    // ---- Shared project files ----
    add("src/types/portfolio.ts", await read("src/types/portfolio.ts"));

    add(
      "src/data/portfolio.ts",
      `import { PortfolioData } from "@/types/portfolio";\n\nexport const data: PortfolioData = ${dataJson};\n`
    );

    add(
      "src/app/page.tsx",
      [
        'import Template from "@/components/Template";',
        'import { data } from "@/data/portfolio";',
        "",
        "export default function Page() {",
        "  return <Template data={data} />;",
        "}",
        "",
      ].join("\n")
    );

    add(
      "src/app/layout.tsx",
      [
        'import type { Metadata } from "next";',
        'import "./globals.css";',
        "",
        "export const metadata: Metadata = {",
        `  title: ${JSON.stringify(`${data.name} | Portfolio`)},`,
        `  description: ${JSON.stringify(String(data.title ?? ""))},`,
        "};",
        "",
        "export default function RootLayout({ children }: { children: React.ReactNode }) {",
        "  return (",
        '    <html lang="en">',
        "      <body>{children}</body>",
        "    </html>",
        "  );",
        "}",
        "",
      ].join("\n")
    );

    add("src/app/globals.css", '@import "tailwindcss";\n');

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
        "All your content is in `src/data/portfolio.ts`.",
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