import type { Metadata } from "next";
import Link from "next/link";
import { PackShell } from "@/components/PackShell";
import { getAllPacks } from "@/lib/content";
import { HUB_THEME } from "@/lib/theme";

export const metadata: Metadata = {
  title: "the packs",
  description: "Every artist catalog currently loaded into Get Into.",
};

export default function PacksPage() {
  const packs = getAllPacks();

  return (
    <PackShell packs={packs} theme={HUB_THEME}>
      <p className="mono text-xs tracking-[0.28em] text-pack-accent-2 uppercase">Catalogs</p>
      <h1 className="display mt-3 text-5xl">Pick a universe</h1>
      <p className="mt-4 max-w-2xl text-pack-muted">
        Each pack is a folder of markdown and a theme. The app does not special-case any artist.
      </p>
      <div className="mt-8 grid gap-4">
        {packs.map((pack) => (
          <Link
            key={pack.slug}
            href={`/${pack.slug}`}
            className="rounded-[var(--radius)] border border-pack-border bg-pack-card p-5 hover:border-pack-accent"
          >
            <p className="mono text-[11px] tracking-[0.2em] text-pack-accent uppercase">{pack.slug}</p>
            <h2 className="display mt-2 text-3xl">{pack.displayName}</h2>
            <p className="mt-2 text-sm text-pack-muted">{pack.tagline}</p>
            <p className="mono mt-3 text-xs text-pack-muted">{pack.albums.length} titles</p>
          </Link>
        ))}
      </div>
    </PackShell>
  );
}
