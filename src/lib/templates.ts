import { ComponentType } from "react";
import { PortfolioData, TemplateMeta } from "@/types/portfolio";
import { makeThemed } from "@/components/templates/ThemedTemplate";
import { themes } from "@/lib/themes";

export type TemplateEntry = TemplateMeta & {
  component: ComponentType<{ data: PortfolioData }>;
};

export const templates: TemplateEntry[] = themes.map((t) => ({
  id: t.id,
  name: t.name,
  description: t.description,
  tags: t.tags,
  component: makeThemed(t),
}));

export const getTemplate = (id: string | null) =>
  templates.find((t) => t.id === id) ?? templates[0];