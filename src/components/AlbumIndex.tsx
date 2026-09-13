"use client";

import { useMemo, useState } from "react";
import { AlbumCard } from "@/components/AlbumCard";
import { groupAlbumsByProject } from "@/lib/albums";
import type { AlbumData, PackTheme } from "@/lib/types";

export function AlbumIndex({
  packSlug,
  albums,
  theme,
}: {
  packSlug: string;
  albums: AlbumData[];
  theme: PackTheme;
}) {
  const [project, setProject] = useState("all");
  const [tag, setTag] = useState("all");

  const projects = useMemo(
    () => ["all", ...[...new Set(albums.map((album) => album.project))]],
    [albums],
  );
  const tags = useMemo(
    () => ["all", ...[...new Set(albums.flatMap((album) => album.tags))].sort()],
    [albums],
  );

  const filtered = albums.filter((album) => {
    const projectOk = project === "all" || album.project === project;
    const tagOk = tag === "all" || album.tags.includes(tag);
    return projectOk && tagOk;
  });

  const groups = groupAlbumsByProject(filtered);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <label className="flex min-w-48 flex-1 flex-col gap-1 text-xs text-pack-muted">
          Project
          <select
            value={project}
            onChange={(event) => setProject(event.target.value)}
            className="rounded-full border border-pack-border bg-pack-card px-3 py-2 text-sm text-pack-fg"
          >
            {projects.map((item) => (
              <option key={item} value={item}>
                {item === "all" ? "All projects" : item}
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-w-48 flex-1 flex-col gap-1 text-xs text-pack-muted">
          Tag
          <select
            value={tag}
            onChange={(event) => setTag(event.target.value)}
            className="rounded-full border border-pack-border bg-pack-card px-3 py-2 text-sm text-pack-fg"
          >
            {tags.map((item) => (
              <option key={item} value={item}>
                {item === "all" ? "All tags" : item}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mono mt-4 text-xs tracking-wide text-pack-muted">
        {filtered.length} of {albums.length}
      </p>

      <div className="mt-8 space-y-10">
        {groups.map((group) => (
          <section key={group.project}>
            <h2 className="display text-3xl text-pack-fg">{group.project}</h2>
            <div className="mt-4 grid gap-3">
              {group.albums.map((album) => (
                <AlbumCard key={album.slug} packSlug={packSlug} album={album} theme={theme} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
