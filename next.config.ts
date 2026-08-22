import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Docker deploy: produces a self-contained .next/standalone build (its own
  // minimal server.js + only the node_modules it actually needs) so the
  // production image doesn't need a full npm install.
  output: 'standalone',
};

export default nextConfig;
