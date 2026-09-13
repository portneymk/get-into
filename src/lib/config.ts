import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { SiteConfig } from "@/lib/types";

export const CONTENT_DIR = path.join(process.cwd(), "content");
export const RESERVED_ALBUM_SLUGS = new Set(["albums", "random"]);

export function getSiteConfig(): SiteConfig {
  const configPath = path.join(CONTENT_DIR, "_config.json");
  let fileDefault = "claypool";

  if (fs.existsSync(configPath)) {
    const parsed = JSON.parse(fs.readFileSync(configPath, "utf8")) as Partial<SiteConfig>;
    if (parsed.defaultPack) fileDefault = parsed.defaultPack;
  }

  return {
    defaultPack: process.env.NEXT_PUBLIC_DEFAULT_PACK || fileDefault,
  };
}
