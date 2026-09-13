import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BranchCtas } from "@/components/BranchCtas";
import { CoverMark } from "@/components/CoverMark";
import { ListenLinks } from "@/components/ListenLinks";
import { PackShell } from "@/components/PackShell";
import { RandomLink } from "@/components/RandomLink";
import { albumTypeLabel } from "@/lib/albums";
import { getAlbum, getAllPacks, getPack, resolveEdges } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";
import { RESERVED_ALBUM_SLUGS } from "@/lib/config";

type Params = { pack: string; album: string };

export function generateStaticParams() {
  return getAllPacks().flatMap((pack) =>
    pack.albums
      .filter((album) => !RESERVED_ALBUM_SLUGS.has(album.slug))
      .map((album) => ({ pack: pack.slug, album: album.slug })),
  );
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { pack: packSlug, album: albumSlug } = await params;
  const pack = getPack(packSlug);
  const album = getAlbum(packSlug, albumSlug);
  if (!pack || !album) return { title: "missing album" };
  return {
    title: `${album.title} — ${pack.displayName}`,
    description: album.body.split("\n\n")[0]?.slice(0, 160) ?? pack.tagline,
  };
}

export default async function AlbumPage({ params }: { params: Promise<Params> }) {
  const { pack: packSlug, album: albumSlug } = await params;
  if (RESERVED_ALBUM_SLUGS.has(albumSlug)) notFound();

  const pack = getPack(packSlug);
  const album = getAlbum(packSlug, albumSlug);
  if (!pack || !album) notFound();

  const branches = resolveEdges(pack, album);
  const typeLabel = albumTypeLabel(album.type);

  return (
    <PackShell pack={pack} packs={getAllPacks()} theme={pack.theme}>
      <div className="flex flex-col gap-8 md:flex-row">
        <CoverMark
          title={album.title}
          slug={album.slug}
          accent={pack.theme.accent}
          accent2={pack.theme.accent2}
          size={180}
          className="shrink-0"
        />
        <div className="min-w-0">
          <p className="mono text-xs tracking-[0.22em] text-pack-accent-2 uppercase">
            {album.project}
            {typeLabel ? ` · ${typeLabel}` : ""} · {album.year}
          </p>
          <h1 className="display mt-3 text-4xl leading-tight sm:text-5xl">{album.title}</h1>
          {album.tags.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {album.tags.map((tag) => (
                <span
                  key={tag}
                  className="mono rounded-full border border-pack-border px-2 py-1 text-[11px] text-pack-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
          <div className="mt-6">
            <ListenLinks urls={album.listenUrls} />
          </div>
        </div>
      </div>

      <article className="prose-pack mt-10 max-w-2xl">{renderMarkdown(album.body)}</article>

      <BranchCtas packSlug={pack.slug} branches={branches} />

      <div className="mt-10 flex flex-wrap gap-3 text-sm">
        <Link href={`/${pack.slug}/albums`} className="rounded-full border border-pack-border px-4 py-2 hover:border-pack-accent">
          All albums
        </Link>
        <RandomLink
          packSlug={pack.slug}
          slugs={pack.albums.map((item) => item.slug)}
          className="rounded-full bg-pack-accent px-4 py-2 text-pack-accent-fg"
        >
          Random in this pack
        </RandomLink>
      </div>
    </PackShell>
  );
}
