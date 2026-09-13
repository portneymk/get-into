import { redirect } from "next/navigation";
import { getPack, pickRandomAlbum } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function RandomAlbumPage({
  params,
}: {
  params: Promise<{ pack: string }>;
}) {
  const { pack: slug } = await params;
  const pack = getPack(slug);
  if (!pack) redirect("/packs");
  redirect(`/${pack.slug}/${pickRandomAlbum(pack).slug}`);
}
