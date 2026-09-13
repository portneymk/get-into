import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PackHome } from "@/components/PackHome";
import { PackShell } from "@/components/PackShell";
import { getAllPacks, getPack } from "@/lib/content";

type Params = { pack: string };

export function generateStaticParams() {
  return getAllPacks().map((pack) => ({ pack: pack.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { pack: slug } = await params;
  const pack = getPack(slug);
  if (!pack) return { title: "missing pack" };
  return {
    title: pack.displayName,
    description: pack.tagline,
  };
}

export default async function PackPage({ params }: { params: Promise<Params> }) {
  const { pack: slug } = await params;
  const pack = getPack(slug);
  if (!pack) notFound();

  return (
    <PackShell pack={pack} packs={getAllPacks()} theme={pack.theme}>
      <PackHome pack={pack} />
    </PackShell>
  );
}
