# get-into

Reusable **Get Into [Artist]** flowchart guides. Pick a door, hop by taste.

Live: [https://portneymk.github.io/get-into/](https://portneymk.github.io/get-into/) (GitHub Pages, static export).

Inspired by [Get Into Gizz](https://www.getintogizz.com) / [gloyens/gizz-next-remake](https://github.com/gloyens/gizz-next-remake). Not affiliated, and this repo does not copy their code, assets, or blurbs.

## Packs

| Slug | Artist | What you get |
| --- | --- | --- |
| `claypool` | Les Claypool universe | Default pack. Primus + side quests. |
| `gizz` | King Gizzard | Curated studio spine (psych / microtonal / thrash / jazz / folk). |
| `ween` | Ween | Starter catalog (brown → C&C → Mollusk → Quebec). |
| `311` | 311 | Core studio set (reggae-rock / rap-rock / later). |
| `floyd` | Pink Floyd | Studio essentials (Piper → classic four → later Gilmour). |
| `doors` | The Doors | All six Morrison studio albums. |
| `stones` | Rolling Stones | Curated studio spine, not the live/comp junk drawer. |

Default homepage pack is `claypool` (`content/_config.json` or `NEXT_PUBLIC_DEFAULT_PACK`).

Backlog (not in this repo yet): Sublime, and whatever else wants a folder.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # static export → out/  (must pass)
GITHUB_PAGES=true npm run build   # same export with basePath /get-into
npm run new-pack -- slugs-band "Slugs Band"
```

Local `npm run dev` is `/`. The Pages build is `/get-into/` so it matches `https://portneymk.github.io/get-into/`.

### GitHub Pages (one-time switch)

The site is `output: "export"`. A workflow (`.github/workflows/pages.yml`) builds with `GITHUB_PAGES=true` and deploys `out/` via `actions/deploy-pages`.

Repo Pages is still a **legacy branch build** until someone flips it:

1. Repo **Settings → Pages**
2. **Build and deployment → Source: GitHub Actions**
3. Merge to `main` (or run the **GitHub Pages** workflow)

`public/.nojekyll` keeps Pages from hiding `/_next`. For a custom domain later, set `NEXT_PUBLIC_BASE_PATH=` (empty) in the workflow so `basePath` drops.

## Routes

| Path | What you get |
| --- | --- |
| `/` | Default pack home |
| `/packs` | Pack picker |
| `/[pack]` | That artist's home (start doors + taste door) |
| `/[pack]/albums` | Full index |
| `/[pack]/[album]` | Album page + why-this-next branches |
| `/[pack]/random` | Random album inside that pack |

The app never special-cases an artist in UI code. Packs supply names, copy, theme, start doors, taste chips, and edges.

## Taste door

On pack home: 3–5 preference chips from `pack.json` that route to **real album slugs already in the pack**. No invented records.

```json
"tasteDoor": {
  "prompt": "What's the itch?",
  "chips": [
    { "id": "heavier", "label": "Heavier", "slug": "pork-soda", "blurb": "Thicker riffs, meaner jokes." }
  ]
}
```

Every `chips[].slug` must exist in that pack or the build fails. If you omit `tasteDoor`, the home page just hides the chips — start doors still work.

## Why this next

Every `nextAlbums` hop can carry a 1–2 sentence clerk-tone reason (witty, short, not fanblog). Resolution order, all static:

1. `nextAlbums[].why` on the edge
2. Album frontmatter `whyNext` map (`slug: reason`)
3. Checked-in `content/<pack>/why-next.json` (`{ "source-slug": { "target-slug": "…" } }`)
4. Deterministic fallback from `hint` / `label` / year — **no API key required**

Claypool ships a full `why-next.json`. Wave 1 packs put `why` on the edges. Production does not call a model.

Optional gated stub (does nothing without a key, does not generate in CI):

```bash
# OPENAI_API_KEY=... npm run generate-why-next -- claypool
npm run generate-why-next -- claypool
```

Author new lines in the JSON / frontmatter / `why` field. Clerk desk, not liner notes.

## How to add a new band

1. Copy a pack or scaffold one:

   ```bash
   npm run new-pack -- your-band "Your Band"
   ```

2. Edit `content/your-band/pack.json`
   - `slug` must match the folder name
   - `startAlbums`, optional `tasteDoor` (chip → real slug), optional `lanes`
   - `theme` — colors plus `pattern`: `swamp` | `carnival` | `plain`

3. Replace the album files in `content/your-band/albums/`
   - `.md` / `.mdx` (frontmatter + body) or `.json`
   - Required: `title`, `slug`, `year`, `project`, `tags`, `listenUrls`, `nextAlbums`
   - `nextAlbums[]`: `slug`, `label`, optional `hint`, `vibe`, `why`
   - Optional album `whyNext` map, or pack-level `why-next.json`
   - Every edge slug, start-door slug, and taste-chip slug must exist in the same pack

4. Point the homepage at it if you want: `{ "defaultPack": "your-band" }` or `NEXT_PUBLIC_DEFAULT_PACK`.

5. `npm run build`. Broken edges fail the build on purpose.

Do not add artist-specific components. New visual = theme token or `pattern`, not a `WeenHeader`.

Reserved album slugs: `albums`, `random`.

## Pack layout

```
content/
  _config.json
  claypool/   pack.json  why-next.json  albums/*.md
  gizz/       pack.json  albums/*.md
  ween/       pack.json  albums/*.md
  311/        pack.json  albums/*.md
  floyd/      pack.json  albums/*.md
  doors/      pack.json  albums/*.md
  stones/     pack.json  albums/*.md
```

Cover art is not hosted. Listen links send people to Spotify / YouTube / Apple / Wikipedia search pages.

## Stack

Next.js App Router, TypeScript, Tailwind v4. Content is read from disk at build time via `gray-matter`. `output: "export"` ships a static `out/` for GitHub Pages.
