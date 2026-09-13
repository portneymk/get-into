import fs from "node:fs";
import path from "node:path";

const [, , slugArg, ...nameParts] = process.argv;
const slug = slugArg?.toLowerCase().replace(/[^a-z0-9-]/g, "");
const displayName = nameParts.join(" ") || slug;

if (!slug) {
  console.error('Usage: npm run new-pack -- <slug> "Display Name"');
  process.exit(1);
}

const root = path.join(process.cwd(), "content", slug);
if (fs.existsSync(root)) {
  console.error(`Pack "${slug}" already exists.`);
  process.exit(1);
}

const startSlug = "first-record";
const nextSlug = "second-record";

const pack = {
  slug,
  displayName,
  tagline: `A short pitch for getting into ${displayName}.`,
  intro:
    `**${displayName}** have more records than anyone needs on a first pass. This pack is a taste-first map: pick a door, then hop by vibe.`,
  startAlbums: [
    {
      slug: startSlug,
      label: "The usual door",
      hint: "The record most people should hear first.",
      featured: true,
    },
  ],
  lanes: [
    {
      id: "core",
      label: "The core sound",
      blurb: "Stay close to the thing they're famous for.",
    },
    {
      id: "left-turn",
      label: "The left turn",
      blurb: "If the first record made you curious about the weirder rooms.",
    },
  ],
  theme: {
    bg: "#141210",
    bgRaised: "#1c1916",
    fg: "#f0e6d2",
    muted: "#b0a898",
    accent: "#e0a24a",
    accentFg: "#1b1408",
    accent2: "#6e8f7a",
    ink: "#0b0908",
    border: "#322c26",
    card: "#1a1714",
    glow: "#6e8f7a",
    radius: "18px",
    pattern: "plain",
  },
  footerBlurb: `Unofficial ${displayName} listening map. Replace this blurb, then add albums and edges.`,
};

const firstAlbum = `---
title: First Record
slug: ${startSlug}
year: 1990
project: ${displayName}
type: album
tags:
  - starter
listenUrls:
  spotify: https://open.spotify.com/search/${encodeURIComponent(displayName + " First Record")}
  youtube: https://www.youtube.com/results?search_query=${encodeURIComponent(displayName + " First Record")}
  apple: https://music.apple.com/us/search?term=${encodeURIComponent(displayName + " First Record")}
nextAlbums:
  - slug: ${nextSlug}
    label: If you want the next step
    hint: Replace this placeholder edge.
    vibe: core
---

Rewrite this blurb. Tell a first-timer what this record *does*, not just what year it came out.
`;

const secondAlbum = `---
title: Second Record
slug: ${nextSlug}
year: 1992
project: ${displayName}
type: album
tags:
  - left-turn
listenUrls:
  spotify: https://open.spotify.com/search/${encodeURIComponent(displayName + " Second Record")}
  youtube: https://www.youtube.com/results?search_query=${encodeURIComponent(displayName + " Second Record")}
  apple: https://music.apple.com/us/search?term=${encodeURIComponent(displayName + " Second Record")}
nextAlbums:
  - slug: ${startSlug}
    label: Back to the door
    hint: Loop the map while you write more albums.
    vibe: core
---

A second placeholder so the flowchart already has an edge. Delete or rename both files when the real catalog lands.
`;

fs.mkdirSync(path.join(root, "albums"), { recursive: true });
fs.writeFileSync(path.join(root, "pack.json"), `${JSON.stringify(pack, null, 2)}\n`);
fs.writeFileSync(path.join(root, "albums", `${startSlug}.md`), firstAlbum);
fs.writeFileSync(path.join(root, "albums", `${nextSlug}.md`), secondAlbum);

console.log(`Created content/${slug}/`);
console.log("Next: edit pack.json, rewrite the two albums, then add edges.");
