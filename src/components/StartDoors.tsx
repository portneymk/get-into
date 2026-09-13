import Link from "next/link";
import { CoverMark } from "@/components/CoverMark";
import type { AlbumData, Pack } from "@/lib/types";

export function StartDoors({
  pack,
  albumsBySlug,
}: {
  pack: Pack;
  albumsBySlug: Map<string, AlbumData>;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {pack.startAlbums.map((door) => {
        const album = albumsBySlug.get(door.slug);
        if (!album) return null;
        const featured = door.featured ?? pack.startAlbums[0].slug === door.slug;

        return (
          <Link
            key={door.slug}
            href={`/${pack.slug}/${album.slug}`}
            className={`group rounded-[var(--radius)] border p-5 transition hover:-translate-y-0.5 ${
              featured
                ? "border-pack-accent bg-pack-card shadow-[0_0_0_1px_color-mix(in_oklab,var(--accent)_35%,transparent)]"
                : "border-pack-border bg-pack-card"
            }`}
          >
            <div className="flex items-start gap-4">
              <CoverMark
                title={album.title}
                slug={album.slug}
                accent={pack.theme.accent}
                accent2={pack.theme.accent2}
                size={84}
              />
              <div>
                <p className="mono text-[11px] tracking-[0.2em] text-pack-accent uppercase">
                  {featured ? "Start here" : "Alt door"}
                </p>
                <h3 className="display mt-2 text-2xl text-pack-fg group-hover:text-pack-accent">
                  {door.label}
                </h3>
                <p className="mt-2 text-sm text-pack-muted">
                  {album.title} · {album.year}
                </p>
                {door.hint ? <p className="mt-2 text-sm text-pack-muted">{door.hint}</p> : null}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
