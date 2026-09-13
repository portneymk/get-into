import type { NextConfig } from "next";

function resolveBasePath(): string {
  if (process.env.NEXT_PUBLIC_BASE_PATH !== undefined) {
    return process.env.NEXT_PUBLIC_BASE_PATH.replace(/\/$/, "");
  }
  if (process.env.GITHUB_PAGES === "true") return "/get-into";
  return "";
}

const basePath = resolveBasePath();

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  ...(basePath
    ? {
        basePath,
        assetPrefix: basePath,
      }
    : {}),
  outputFileTracingIncludes: {
    "/*": ["./content/**/*"],
  },
};

export default nextConfig;
