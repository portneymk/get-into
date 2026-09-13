"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function RandomRedirect({
  packSlug,
  slugs,
}: {
  packSlug: string;
  slugs: string[];
}) {
  const router = useRouter();

  useEffect(() => {
    const slug = slugs[Math.floor(Math.random() * slugs.length)] ?? slugs[0];
    if (slug) router.replace(`/${packSlug}/${slug}`);
  }, [packSlug, router, slugs]);

  return <p className="p-8 text-center text-sm text-pack-muted">Picking a record…</p>;
}
