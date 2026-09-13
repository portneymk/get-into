import type { AlbumData, AlbumType } from "@/lib/types";

export function albumTypeLabel(type?: AlbumType): string | undefined {
  if (!type || type === "album") return undefined;
  if (type === "ep") return "EP";
  if (type === "live") return "Live";
  return "Compilation";
}

export function groupAlbumsByProject(albums: AlbumData[]): { project: string; albums: AlbumData[] }[] {
  const groups = new Map<string, AlbumData[]>();
  for (const album of albums) {
    const list = groups.get(album.project) ?? [];
    list.push(album);
    groups.set(album.project, list);
  }

  return [...groups.entries()]
    .map(([project, items]) => ({
      project,
      albums: items.sort((a, b) => a.year - b.year || a.title.localeCompare(b.title)),
    }))
    .sort((a, b) => a.albums[0].year - b.albums[0].year);
}
