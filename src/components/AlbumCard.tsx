import Link from "next/link";
import { CoverMark } from "@/components/CoverMark";
import { albumTypeLabel } from "@/lib/albums";
import type { AlbumData, PackTheme } from "@/lib/types";

export function AlbumCard({
  packSlug,
  album,
  theme,
}: {
  packSlug: string;
  album: AlbumData;
  theme: PackTheme;
}) {
  return (
    <Link
      href={`/${packSlug}/${album.slug}`}
      className="group flex gap-4 rounded-[var(--radius)] border border-pack-border bg-pack-card p-4 transition hover:-translate-y-0.5 hover:border-pack-accent"
    >
      <CoverMark
        title={album.title}
        slug={album.slug}
        accent={theme.accent}
        accent2={theme.accent2}
        size={72}
        className="shrink-0"
      />
      <div className="min-w-0">
        <p className="mono text-[11px] tracking-wide text-pack-muted">
          {album.year}
          {albumTypeLabel(album.type) ? ` · ${albumTypeLabel(album.type)}` : ""}
        </p>
        <h3 className="display mt-1 text-xl leading-tight text-pack-fg group-hover:text-pack-accent">
          {album.title}
        </h3>
        <p className="mt-1 text-sm text-pack-muted">{album.project}</p>
        {album.tags.length > 0 ? (
          <p className="mt-2 truncate text-xs text-pack-muted">{album.tags.join(" · ")}</p>
        ) : null}
      </div>
    </Link>
  );
}
