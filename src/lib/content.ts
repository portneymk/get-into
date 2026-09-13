import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";
import { CONTENT_DIR, RESERVED_ALBUM_SLUGS, getSiteConfig } from "@/lib/config";
import { resolveWhyNext } from "@/lib/why-next";
import type { AlbumData, AlbumEdge, AlbumType, Pack, PackMeta, PackTheme, TasteChip, TasteDoor } from "@/lib/types";

export { albumTypeLabel, groupAlbumsByProject } from "@/lib/albums";

const ALBUM_TYPES = new Set<AlbumType>(["album", "ep", "live", "compilation"]);

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function parseTheme(raw: PackTheme, packSlug: string): PackTheme {
  const required: (keyof PackTheme)[] = [
    "bg",
    "bgRaised",
    "fg",
    "muted",
    "accent",
    "accentFg",
    "accent2",
    "ink",
    "border",
    "card",
    "glow",
    "radius",
    "pattern",
  ];

  for (const key of required) {
    assert(raw[key], `Pack "${packSlug}" theme is missing "${key}"`);
  }

  return raw;
}

function parseEdges(value: unknown, albumSlug: string): AlbumEdge[] {
  assert(Array.isArray(value), `Album "${albumSlug}" needs nextAlbums[]`);
  return value.map((edge, index) => {
    assert(edge && typeof edge === "object", `Album "${albumSlug}" nextAlbums[${index}] is invalid`);
    const record = edge as Record<string, unknown>;
    assert(typeof record.slug === "string" && record.slug, `Album "${albumSlug}" nextAlbums[${index}] needs a slug`);
    assert(typeof record.label === "string" && record.label, `Album "${albumSlug}" nextAlbums[${index}] needs a label`);
    return {
      slug: record.slug,
      label: record.label,
      hint: typeof record.hint === "string" ? record.hint : undefined,
      vibe: typeof record.vibe === "string" ? record.vibe : undefined,
      why: typeof record.why === "string" ? record.why : undefined,
    };
  });
}

function parseWhyNextMap(value: unknown, label: string): Record<string, string> | undefined {
  if (value === undefined) return undefined;
  assert(value && typeof value === "object" && !Array.isArray(value), `${label} whyNext must be a map of slug → reason`);
  const out: Record<string, string> = {};
  for (const [slug, reason] of Object.entries(value as Record<string, unknown>)) {
    if (typeof reason === "string" && reason.trim()) out[slug] = reason.trim();
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

function parseTasteDoor(value: unknown, packSlug: string): TasteDoor | undefined {
  if (value === undefined) return undefined;
  assert(value && typeof value === "object", `Pack "${packSlug}" tasteDoor is invalid`);
  const record = value as Record<string, unknown>;
  const rawChips = Array.isArray(record.chips) ? record.chips : Array.isArray(value) ? (value as unknown[]) : null;
  assert(rawChips, `Pack "${packSlug}" tasteDoor needs chips[]`);

  const chips: TasteChip[] = rawChips.map((chip, index) => {
    assert(chip && typeof chip === "object", `Pack "${packSlug}" tasteDoor.chips[${index}] is invalid`);
    const item = chip as Record<string, unknown>;
    assert(typeof item.id === "string" && item.id, `Pack "${packSlug}" tasteDoor.chips[${index}] needs an id`);
    assert(typeof item.label === "string" && item.label, `Pack "${packSlug}" tasteDoor.chips[${index}] needs a label`);
    assert(typeof item.slug === "string" && item.slug, `Pack "${packSlug}" tasteDoor.chips[${index}] needs a slug`);
    return {
      id: item.id,
      label: item.label,
      slug: item.slug,
      blurb: typeof item.blurb === "string" ? item.blurb : undefined,
    };
  });

  return {
    prompt: typeof record.prompt === "string" ? record.prompt : undefined,
    chips,
  };
}

function parseAlbumRecord(data: Record<string, unknown>, body: string, filePath: string): AlbumData {
  const slug = String(data.slug ?? "");
  assert(slug, `Album file "${filePath}" is missing a slug`);
  assert(!RESERVED_ALBUM_SLUGS.has(slug), `Album slug "${slug}" is reserved. Rename the file.`);
  assert(typeof data.title === "string" && data.title, `Album "${slug}" needs a title`);
  assert(typeof data.year === "number", `Album "${slug}" needs a numeric year`);
  assert(typeof data.project === "string" && data.project, `Album "${slug}" needs a project/band credit`);
  assert(data.listenUrls && typeof data.listenUrls === "object", `Album "${slug}" needs listenUrls`);

  const listenUrls = data.listenUrls as Record<string, string>;
  assert(Object.keys(listenUrls).length > 0, `Album "${slug}" needs at least one listen URL`);

  const type = data.type;
  if (type !== undefined) {
    assert(typeof type === "string" && ALBUM_TYPES.has(type as AlbumType), `Album "${slug}" has an unknown type`);
  }

  const tags = Array.isArray(data.tags) ? data.tags.filter((tag): tag is string => typeof tag === "string") : [];

  return {
    title: data.title,
    slug,
    year: data.year,
    project: data.project,
    type: type as AlbumType | undefined,
    tags,
    listenUrls,
    nextAlbums: parseEdges(data.nextAlbums, slug),
    whyNext: parseWhyNextMap(data.whyNext, `Album "${slug}"`),
    body: body.trim(),
  };
}

function loadAlbumFile(filePath: string): AlbumData {
  const raw = fs.readFileSync(filePath, "utf8");
  if (filePath.endsWith(".json")) {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const body = typeof parsed.body === "string" ? parsed.body : "";
    return parseAlbumRecord(parsed, body, filePath);
  }

  const parsed = matter(raw);
  return parseAlbumRecord(parsed.data as Record<string, unknown>, parsed.content, filePath);
}

function loadPackFromDir(dirName: string): Pack {
  const packDir = path.join(CONTENT_DIR, dirName);
  const metaPath = path.join(packDir, "pack.json");
  assert(fs.existsSync(metaPath), `Pack folder "${dirName}" is missing pack.json`);

  const meta = readJson<PackMeta>(metaPath);
  assert(meta.slug === dirName, `Pack folder "${dirName}" must match pack.json slug "${meta.slug}"`);
  assert(meta.displayName, `Pack "${dirName}" needs displayName`);
  assert(meta.tagline, `Pack "${dirName}" needs a tagline`);
  assert(Array.isArray(meta.startAlbums) && meta.startAlbums.length > 0, `Pack "${dirName}" needs startAlbums`);

  const albumsDir = path.join(packDir, "albums");
  assert(fs.existsSync(albumsDir), `Pack "${dirName}" needs an albums/ folder`);

  const albumFiles = fs
    .readdirSync(albumsDir)
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx") || file.endsWith(".json"))
    .sort();

  const albums = albumFiles.map((file) => loadAlbumFile(path.join(albumsDir, file)));
  const slugs = new Set(albums.map((album) => album.slug));
  assert(slugs.size === albums.length, `Pack "${dirName}" has duplicate album slugs`);

  const whyNextPath = path.join(packDir, "why-next.json");
  const packWhys = fs.existsSync(whyNextPath)
    ? readJson<Record<string, Record<string, string>>>(whyNextPath)
    : meta.whyNext;

  const tasteDoor = parseTasteDoor(meta.tasteDoor, dirName);

  for (const door of meta.startAlbums) {
    assert(slugs.has(door.slug), `Pack "${dirName}" start album "${door.slug}" does not exist`);
  }

  if (tasteDoor) {
    for (const chip of tasteDoor.chips) {
      assert(slugs.has(chip.slug), `Pack "${dirName}" taste door "${chip.id}" points at missing album "${chip.slug}"`);
    }
  }

  for (const album of albums) {
    for (const edge of album.nextAlbums) {
      assert(
        slugs.has(edge.slug),
        `Pack "${dirName}" album "${album.slug}" points at missing album "${edge.slug}"`,
      );
    }
    if (album.whyNext) {
      for (const target of Object.keys(album.whyNext)) {
        assert(slugs.has(target), `Pack "${dirName}" album "${album.slug}" whyNext points at missing album "${target}"`);
      }
    }
  }

  return {
    ...meta,
    tasteDoor,
    whyNext: packWhys,
    theme: parseTheme(meta.theme, dirName),
    albums: albums.sort((a, b) => a.year - b.year || a.title.localeCompare(b.title)),
  };
}

export const getAllPacks = cache((): Pack[] => {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  return fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_") && !entry.name.startsWith("."))
    .map((entry) => loadPackFromDir(entry.name))
    .sort((a, b) => a.displayName.localeCompare(b.displayName));
});

export function getPack(slug: string): Pack | undefined {
  return getAllPacks().find((pack) => pack.slug === slug);
}

export function getDefaultPack(): Pack {
  const { defaultPack } = getSiteConfig();
  const pack = getPack(defaultPack) ?? getAllPacks()[0];
  assert(pack, "No content packs found. Add a folder under content/<slug>/.");
  return pack;
}

export function getAlbum(packSlug: string, albumSlug: string): AlbumData | undefined {
  return getPack(packSlug)?.albums.find((album) => album.slug === albumSlug);
}

export function resolveEdges(
  pack: Pack,
  album: AlbumData,
): { edge: AlbumEdge; album: AlbumData; why: string }[] {
  return album.nextAlbums
    .map((edge) => {
      const target = pack.albums.find((item) => item.slug === edge.slug);
      if (!target) return null;
      return {
        edge,
        album: target,
        why: resolveWhyNext(album, edge, target, pack.whyNext),
      };
    })
    .filter((item): item is { edge: AlbumEdge; album: AlbumData; why: string } => item !== null);
}

export function pickRandomAlbum(pack: Pack, exceptSlug?: string): AlbumData {
  const pool = exceptSlug ? pack.albums.filter((album) => album.slug !== exceptSlug) : pack.albums;
  const source = pool.length > 0 ? pool : pack.albums;
  return source[Math.floor(Math.random() * source.length)];
}
