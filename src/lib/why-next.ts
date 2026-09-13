import type { AlbumData, AlbumEdge } from "@/lib/types";

export function fallbackWhy(source: AlbumData, edge: AlbumEdge, target: AlbumData): string {
  const hint = edge.hint?.replace(/\s+/g, " ").trim().replace(/\.+$/, "");
  if (hint && hint.length >= 12) {
    return `${hint}. That's the hop to ${target.title}.`;
  }

  const vibe = (edge.vibe ?? target.tags[0] ?? target.project).replace(/-/g, " ");
  return `${edge.label}. ${target.title} (${target.year}) — ${vibe}.`;
}

export function resolveWhyNext(
  source: AlbumData,
  edge: AlbumEdge,
  target: AlbumData,
  packWhys?: Record<string, Record<string, string>>,
): string {
  const fromEdge = edge.why?.replace(/\s+/g, " ").trim();
  if (fromEdge) return fromEdge;

  const fromAlbum = source.whyNext?.[edge.slug]?.replace(/\s+/g, " ").trim();
  if (fromAlbum) return fromAlbum;

  const fromPack = packWhys?.[source.slug]?.[edge.slug]?.replace(/\s+/g, " ").trim();
  if (fromPack) return fromPack;

  return fallbackWhy(source, edge, target);
}
