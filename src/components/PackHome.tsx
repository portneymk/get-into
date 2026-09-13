import Link from "next/link";
import { RandomLink } from "@/components/RandomLink";
import { StartDoors } from "@/components/StartDoors";
import { TasteDoor } from "@/components/TasteDoor";
import { renderMarkdown } from "@/lib/markdown";
import type { Pack } from "@/lib/types";

export function PackHome({ pack }: { pack: Pack }) {
  const albumsBySlug = new Map(pack.albums.map((album) => [album.slug, album]));
  const projects = [...new Set(pack.albums.map((album) => album.project))];

  return (
    <div>
      <p className="mono text-xs tracking-[0.28em] text-pack-accent-2 uppercase">A field guide</p>
      <h1 className="display mt-3 max-w-3xl text-5xl leading-[0.95] text-pack-fg sm:text-6xl">
        Get into {pack.displayName}
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-pack-muted">{pack.tagline}</p>
      <div className="prose-pack mt-6 max-w-2xl">{renderMarkdown(pack.intro)}</div>

      <div className="mt-10">
        <StartDoors pack={pack} albumsBySlug={albumsBySlug} />
      </div>

      <TasteDoor pack={pack} albumsBySlug={albumsBySlug} />

      {pack.lanes && pack.lanes.length > 0 ? (
        <section className="mt-12">
          <p className="mono text-xs tracking-[0.22em] text-pack-accent uppercase">Branch by taste</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {pack.lanes.map((lane) => (
              <div key={lane.id} className="rounded-[var(--radius)] border border-pack-border bg-pack-card p-4">
                <p className="mono text-[11px] tracking-[0.18em] text-pack-accent-2 uppercase">{lane.label}</p>
                <p className="mt-2 text-sm text-pack-muted">{lane.blurb}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-12 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mono text-xs tracking-[0.22em] text-pack-muted uppercase">
            {pack.albums.length} titles · {projects.length} projects
          </p>
          <h2 className="display mt-2 text-3xl">Or jump the queue</h2>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/${pack.slug}/albums`}
            className="rounded-full border border-pack-border px-4 py-2 text-sm hover:border-pack-accent"
          >
            Full catalog
          </Link>
          <RandomLink
            packSlug={pack.slug}
            slugs={pack.albums.map((album) => album.slug)}
            className="rounded-full bg-pack-accent px-4 py-2 text-sm text-pack-accent-fg"
          >
            Random album
          </RandomLink>
        </div>
      </section>
    </div>
  );
}
