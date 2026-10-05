import type { NextConfig } from "next";

const include = [
  "./src/components/templates/**/*",
  "./src/lib/themes.ts",
  "./src/types/portfolio.ts",
  "./tsconfig.json",
  "./package.json",
];

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/export": include,
    "/api/github": include,
  },
};

export default nextConfig;