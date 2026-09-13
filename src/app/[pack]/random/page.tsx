import { notFound } from "next/navigation";
import { RandomRedirect } from "@/components/RandomRedirect";
import { getAllPacks, getPack } from "@/lib/content";

type Params = { pack: string };

export function generateStaticParams() {
  return getAllPacks().map((pack) => ({ pack: pack.slug }));
}

export default async function RandomAlbumPage({ params }: { params: Promise<Params> }) {
  const { pack: slug } = await params;
  const pack = getPack(slug);
  if (!pack) notFound();

  return <RandomRedirect packSlug={pack.slug} slugs={pack.albums.map((album) => album.slug)} />;
}
