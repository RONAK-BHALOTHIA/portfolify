import { PortfolioData } from "@/types/portfolio";

export const defaultData: PortfolioData = {
  name: "Your Name",
  title: "Frontend Developer",
  bio: "Write a short intro about yourself and what you build.",
  email: "you@example.com",
  location: "India",
  skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  projects: [
    {
      id: "1",
      title: "Sample Project",
      description: "What problem it solves and what you built.",
      techStack: ["Next.js", "TypeScript"],
      liveUrl: "",
      repoUrl: "",
    },
  ],
  socials: { github: "", linkedin: "", twitter: "" },
};