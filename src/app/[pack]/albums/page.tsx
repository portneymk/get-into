import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AlbumIndex } from "@/components/AlbumIndex";
import { PackShell } from "@/components/PackShell";
import { getAllPacks, getPack } from "@/lib/content";

type Params = { pack: string };

export function generateStaticParams() {
  return getAllPacks().map((pack) => ({ pack: pack.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { pack: slug } = await params;
  const pack = getPack(slug);
  if (!pack) return { title: "albums" };
  return {
    title: `${pack.displayName} albums`,
    description: `Every title in the ${pack.displayName} pack.`,
  };
}

export default async function AlbumsPage({ params }: { params: Promise<Params> }) {
  const { pack: slug } = await params;
  const pack = getPack(slug);
  if (!pack) notFound();

  return (
    <PackShell pack={pack} packs={getAllPacks()} theme={pack.theme}>
      <p className="mono text-xs tracking-[0.28em] text-pack-accent-2 uppercase">Index</p>
      <h1 className="display mt-3 text-5xl">{pack.displayName} albums</h1>
      <p className="mt-4 max-w-2xl text-pack-muted">
        Placeholder marks instead of copyrighted sleeve art. Follow any listen link out to the real record.
      </p>
      <div className="mt-8">
        <AlbumIndex packSlug={pack.slug} albums={pack.albums} theme={pack.theme} />
      </div>
    </PackShell>
  );
}
