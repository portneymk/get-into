import Link from "next/link";
import { albumTypeLabel } from "@/lib/albums";
import type { AlbumData, AlbumEdge } from "@/lib/types";

export function BranchCtas({
  packSlug,
  branches,
}: {
  packSlug: string;
  branches: { edge: AlbumEdge; album: AlbumData }[];
}) {
  if (branches.length === 0) return null;

  return (
    <section className="mt-12">
      <p className="mono text-xs tracking-[0.22em] text-pack-accent-2 uppercase">
        If that scratched a particular itch
      </p>
      <h2 className="display mt-2 text-3xl text-pack-fg">Where next?</h2>
      <div className="mt-6 grid gap-4">
        {branches.map(({ edge, album }) => (
          <Link
            key={edge.slug}
            href={`/${packSlug}/${album.slug}`}
            className="group rounded-[var(--radius)] border border-pack-border bg-pack-card p-5 transition hover:-translate-y-0.5 hover:border-pack-accent"
          >
            <div className="flex flex-wrap items-center gap-2">
              {edge.vibe ? (
                <span className="mono rounded-full bg-pack-raised px-2 py-0.5 text-[10px] tracking-[0.18em] text-pack-accent uppercase">
                  {edge.vibe}
                </span>
              ) : null}
              <span className="mono text-[11px] text-pack-muted">
                {album.year}
                {albumTypeLabel(album.type) ? ` · ${albumTypeLabel(album.type)}` : ""}
                {` · ${album.project}`}
              </span>
            </div>
            <p className="display mt-3 text-2xl text-pack-fg group-hover:text-pack-accent">{edge.label}</p>
            <p className="mt-1 text-sm text-pack-muted">
              {album.title}
              {edge.hint ? ` — ${edge.hint}` : ""}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
