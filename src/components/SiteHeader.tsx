import Link from "next/link";
import { RandomLink } from "@/components/RandomLink";
import type { Pack } from "@/lib/types";

export function SiteHeader({
  pack,
  packs,
}: {
  pack?: Pack;
  packs: Pack[];
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-pack-border/80 bg-[color-mix(in_oklab,var(--bg)_88%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href={pack ? `/${pack.slug}` : "/"} className="min-w-0">
          <p className="mono text-[10px] tracking-[0.28em] text-pack-accent-2 uppercase">Get into</p>
          <p className="display truncate text-xl leading-none text-pack-fg">
            {pack?.displayName ?? "the catalog"}
          </p>
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-2 text-sm">
          {pack ? (
            <>
              <Link className="rounded-full px-3 py-1.5 text-pack-muted hover:text-pack-fg" href={`/${pack.slug}`}>
                Home
              </Link>
              <Link
                className="rounded-full px-3 py-1.5 text-pack-muted hover:text-pack-fg"
                href={`/${pack.slug}/albums`}
              >
                Albums
              </Link>
              <RandomLink
                packSlug={pack.slug}
                slugs={pack.albums.map((album) => album.slug)}
                className="rounded-full bg-pack-accent px-3 py-1.5 text-pack-accent-fg"
              >
                Random
              </RandomLink>
            </>
          ) : null}
          {packs.length > 1 ? (
            <Link className="rounded-full px-3 py-1.5 text-pack-muted hover:text-pack-fg" href="/packs">
              Packs
            </Link>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
