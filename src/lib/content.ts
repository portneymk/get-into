import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";
import { CONTENT_DIR, RESERVED_ALBUM_SLUGS, getSiteConfig } from "@/lib/config";
import type { AlbumData, AlbumEdge, AlbumType, Pack, PackMeta, PackTheme } from "@/lib/types";

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
    };
  });
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

  for (const door of meta.startAlbums) {
    assert(slugs.has(door.slug), `Pack "${dirName}" start album "${door.slug}" does not exist`);
  }

  for (const album of albums) {
    for (const edge of album.nextAlbums) {
      assert(
        slugs.has(edge.slug),
        `Pack "${dirName}" album "${album.slug}" points at missing album "${edge.slug}"`,
      );
    }
  }

  return {
    ...meta,
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

export function resolveEdges(pack: Pack, album: AlbumData): { edge: AlbumEdge; album: AlbumData }[] {
  return album.nextAlbums
    .map((edge) => {
      const target = pack.albums.find((item) => item.slug === edge.slug);
      return target ? { edge, album: target } : null;
    })
    .filter((item): item is { edge: AlbumEdge; album: AlbumData } => item !== null);
}

export function pickRandomAlbum(pack: Pack, exceptSlug?: string): AlbumData {
  const pool = exceptSlug ? pack.albums.filter((album) => album.slug !== exceptSlug) : pack.albums;
  const source = pool.length > 0 ? pool : pack.albums;
  return source[Math.floor(Math.random() * source.length)];
}
