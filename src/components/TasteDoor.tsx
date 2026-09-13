import Link from "next/link";
import type { AlbumData, Pack } from "@/lib/types";

export function TasteDoor({
  pack,
  albumsBySlug,
}: {
  pack: Pack;
  albumsBySlug: Map<string, AlbumData>;
}) {
  const chips = (pack.tasteDoor?.chips ?? []).filter((chip) => albumsBySlug.has(chip.slug));
  if (chips.length === 0) return null;

  return (
    <section className="mt-12">
      <p className="mono text-xs tracking-[0.22em] text-pack-accent uppercase">Taste door</p>
      <h2 className="display mt-2 text-3xl text-pack-fg">
        {pack.tasteDoor?.prompt ?? "What's the itch?"}
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-pack-muted">
        Preference chips, not a quiz. Each one drops you on a real record already in this map.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        {chips.map((chip) => {
          const album = albumsBySlug.get(chip.slug);
          if (!album) return null;
          return (
            <Link
              key={chip.id}
              href={`/${pack.slug}/${album.slug}`}
              className="group max-w-xs rounded-2xl border border-pack-border bg-pack-card px-4 py-2.5 transition hover:-translate-y-0.5 hover:border-pack-accent"
            >
              <span className="text-sm text-pack-fg group-hover:text-pack-accent">{chip.label}</span>
              {chip.blurb ? <span className="mt-0.5 block text-xs text-pack-muted">{chip.blurb}</span> : null}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
