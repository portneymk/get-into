# get-into

Reusable **Get Into [Artist]** flowchart guides. Pick a door, then hop by taste.

The first catalog is the **Claypool** universe (Primus plus the side quests). A tiny **Ween** stub pack exists so adding a second band is a folder, not a rewrite.

Inspired by [Get Into Gizz](https://www.getintogizz.com) / [gloyens/gizz-next-remake](https://github.com/gloyens/gizz-next-remake). Not affiliated, and this repo does not copy their code or assets.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The default pack is `claypool` (see `content/_config.json` or `NEXT_PUBLIC_DEFAULT_PACK`).

```bash
npm run build   # must pass
npm run new-pack -- slugs-band "Slugs Band"
```

## Routes

| Path | What you get |
| --- | --- |
| `/` | Default pack home |
| `/packs` | Pack picker (proves multi-catalog) |
| `/[pack]` | That artist's home |
| `/[pack]/albums` | Full index, filterable by project and tag |
| `/[pack]/[album]` | Album page + branch CTAs |
| `/[pack]/random` | Random album inside that pack |

The app never special-cases Claypool (or Ween) in UI code. Packs supply names, copy, theme tokens, start doors, and edges.

## How to add a new band in 15 minutes

1. **Copy a pack** (or scaffold one):

   ```bash
   cp -R content/ween content/your-band
   # or
   npm run new-pack -- your-band "Your Band"
   ```

2. **Edit `content/your-band/pack.json`**
   - `slug` must match the folder name
   - `displayName`, `tagline`, `intro`, `footerBlurb`
   - `startAlbums` — one or more doors (`featured: true` on the usual door)
   - `lanes` — optional taste chips on the home page
   - `theme` — colors plus `pattern`: `swamp` | `carnival` | `plain`

3. **Replace the album files** in `content/your-band/albums/`
   - One file per title: `.md` / `.mdx` (frontmatter + body) or `.json` (same fields plus `body`)
   - Required frontmatter: `title`, `slug`, `year`, `project`, `tags`, `listenUrls`, `nextAlbums`
   - Optional: `type` (`album` | `ep` | `live` | `compilation`)
   - `listenUrls` needs at least one key (`spotify`, `youtube`, `apple`, `bandcamp`, `wiki`, …)
   - `nextAlbums[]` is the flowchart: `slug`, `label`, optional `hint` and `vibe`
   - Every `nextAlbums.slug` and every `startAlbums.slug` must exist in the same pack

4. **Set the default pack** if this should be the homepage:

   ```json
   // content/_config.json
   { "defaultPack": "your-band" }
   ```

   Or `NEXT_PUBLIC_DEFAULT_PACK=your-band`.

5. **Run `npm run build`**. Broken edges fail the build on purpose.

Do not add artist-specific components. If the new band needs a new visual, add a theme token or a `pattern` — not a `WeenHeader`.

Reserved album slugs: `albums`, `random`.

## Pack layout

```
content/
  _config.json
  claypool/
    pack.json
    albums/*.md
  ween/
    pack.json
    albums/*.md
    albums/*.json
```

Cover art is not hosted. Each album gets a generated placeholder mark; listen links send people to Spotify / YouTube / Apple / Wikipedia.

## Claypool map (first pack)

Start at **Sailing the Seas of Cheese**, or use **Frizzle Fry** as the rawer door. Edges fan out by taste:

- funk-metal → later / earlier Primus
- swamp-psych → Holy Mackerel, solo whales/fungi
- frogs → Frog Brigade
- delirium-prog → Claypool Lennon Delirium (+ Oysterhead)
- experimental → C2B3, guest-heavy Primus
- twang → Duo de Twang

A playable three-hop that leaves Primus, for example:

`Seas of Cheese` → `Pork Soda` → `Highball with the Devil` → `Purple Onion`

## Stack

Next.js App Router, TypeScript, Tailwind v4. Content is read from disk at build time via `gray-matter`.
