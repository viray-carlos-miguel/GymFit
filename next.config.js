import { withSentryConfig } from "@sentry/nextjs";
import { hostname } from "os";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import "./src/env.js";

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
  webpack: (config, { isServer }) => {
    // Only add the plugin for client-side compilation
    if (!isServer) {
      config.plugins.push(
        new MiniCssExtractPlugin({
          filename: 'static/css/[name].[contenthash].css',
          chunkFilename: 'static/css/[id].[contenthash].css',
          ignoreOrder: true, // Enable to remove warnings about conflicting order
        })
      );
    }
    return config;
  },
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