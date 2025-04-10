import { withSentryConfig } from "@sentry/nextjs";
import { hostname } from "os";
import "./src/env.js"; // Importing your environment configuration

/** @type {import("next").NextConfig} */
const coreConfig = {
  images: {
    remotePatterns: [
      { hostname: "utfs.io" },
      { hostname: "*.ufs.sh" },
      { hostname: "ufs.sh" },
    ],
  },
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};

const sentryConfig = withSentryConfig(coreConfig, {
  org: "carlos-miguel-viray",
  project: "t4gallery",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  disableLogger: true,
  automaticVercelMonitors: true,
});

export default sentryConfig;
