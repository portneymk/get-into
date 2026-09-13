"use client";

import { useRouter } from "next/navigation";

export function RandomLink({
  packSlug,
  slugs,
  className,
  children,
}: {
  packSlug: string;
  slugs: string[];
  className?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      className={`cursor-pointer ${className ?? ""}`}
      onClick={() => {
        const slug = slugs[Math.floor(Math.random() * slugs.length)] ?? slugs[0];
        if (slug) router.push(`/${packSlug}/${slug}`);
      }}
    >
      {children}
    </button>
  );
}
