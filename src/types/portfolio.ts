export type Project = {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  liveUrl?: string;
  repoUrl?: string;
};

export type PortfolioData = {
  name: string;
  title: string;
  bio: string;
  email: string;
  location?: string;
  skills: string[];
  projects: Project[];
  socials: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
};

export type TemplateMeta = {
  id: string;
  name: string;
  description: string;
  tags: string[];
};