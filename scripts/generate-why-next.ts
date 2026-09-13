/**
 * Optional LLM pass for why-next lines.
 * Production does not call this. Checked-in why-next.json / frontmatter / edge.why
 * already ship without keys. Deterministic fallbacks cover the rest.
 *
 *   OPENAI_API_KEY=... npm run generate-why-next -- claypool
 */
import fs from "node:fs";
import path from "node:path";

const packSlug = process.argv[2] ?? "claypool";
const apiKey = process.env.OPENAI_API_KEY ?? process.env.WHY_NEXT_API_KEY;
const packDir = path.join(process.cwd(), "content", packSlug);
const outPath = path.join(packDir, "why-next.json");

if (!fs.existsSync(path.join(packDir, "pack.json"))) {
  console.error(`No pack at content/${packSlug}`);
  process.exit(1);
}

if (!apiKey) {
  console.log("No OPENAI_API_KEY / WHY_NEXT_API_KEY. Skipping generation.");
  console.log("Author why-next in content/<pack>/why-next.json, album whyNext maps, or nextAlbums[].why");
  console.log("The app already falls back to hint/label text when a line is missing.");
  process.exit(0);
}

console.log(`Key present, but this script is a gated stub.`);
console.log(`Edit ${path.relative(process.cwd(), outPath)} by hand (clerk tone, 1–2 sentences).`);
console.log("Refusing to call a model unless you replace this stub — keep production keyless.");
process.exit(0);
