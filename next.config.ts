import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bundle the seeded SQLite file with each serverless function.
  outputFileTracingIncludes: {
    "/**/*": ["./roastpilot.db"],
  },
  // better-sqlite3 ships native bindings via prebuild-install; mark it
  // external so Next doesn't try to bundle the .node file.
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
