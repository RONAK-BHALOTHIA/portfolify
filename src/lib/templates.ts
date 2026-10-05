import { ComponentType } from "react";
import { PortfolioData, TemplateMeta } from "@/types/portfolio";
import MinimalTemplate from "@/components/templates/MinimalTemplate";
import DarkTemplate from "@/components/templates/DarkTemplate";
import { makeThemed } from "@/components/templates/ThemedTemplate";
import { themes } from "@/lib/themes";

export type TemplateEntry = TemplateMeta & {
  component: ComponentType<{ data: PortfolioData }>;
};

export const templates: TemplateEntry[] = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean, light, text-first layout.",
    tags: ["light", "simple"],
    component: MinimalTemplate,
  },
  {
    id: "dark-gradient",
    name: "Dark Gradient",
    description: "Dark theme with a gradient headline and project cards.",
    tags: ["dark", "modern"],
    component: DarkTemplate,
  },
  ...themes.map((t) => ({
    id: t.id,
    name: t.name,
    description: t.description,
    tags: t.tags,
    component: makeThemed(t),
  })),
];

export const getTemplate = (id: string | null) =>
  templates.find((t) => t.id === id) ?? templates[0];