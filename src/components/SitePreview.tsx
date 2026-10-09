"use client";

import { useState, MouseEvent } from "react";
import { PortfolioData } from "@/types/portfolio";
import { Theme } from "@/lib/themes";
import SiteShell from "@/site/SiteShell";
import HomePage from "@/site/HomePage";
import ProjectsPage from "@/site/ProjectsPage";
import ProjectDetail from "@/site/ProjectDetail";
import AboutPage from "@/site/AboutPage";
import ContactPage from "@/site/ContactPage";

export default function SitePreview({ data, theme }: { data: PortfolioData; theme: Theme }) {
  const [path, setPath] = useState("/");

  // Catch clicks on the site's links and switch pages inside the preview
  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    const link = (e.target as HTMLElement).closest("a");
    const href = link?.getAttribute("href");
    if (href && href.startsWith("/")) {
      e.preventDefault();
      setPath(href);
    }
  };

  let content;
  if (path === "/projects") {
    content = <ProjectsPage data={data} theme={theme} />;
  } else if (path.startsWith("/projects/")) {
    const project = data.projects.find((p) => p.id === path.split("/")[2]);
    content = project ? (
      <ProjectDetail project={project} theme={theme} />
    ) : (
      <ProjectsPage data={data} theme={theme} />
    );
  } else if (path === "/about") {
    content = <AboutPage data={data} theme={theme} />;
  } else if (path === "/contact") {
    content = <ContactPage data={data} theme={theme} />;
  } else {
    content = <HomePage data={data} theme={theme} />;
  }

  return (
    <div onClickCapture={onClick}>
      <SiteShell data={data} theme={theme}>
        {content}
      </SiteShell>
    </div>
  );
}