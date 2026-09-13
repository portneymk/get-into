export function hashSlug(slug: string): number {
  let hash = 2166136261;
  for (let i = 0; i < slug.length; i += 1) {
    hash ^= slug.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function albumInitials(title: string): string {
  const words = title
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !["the", "and", "with", "from"].includes(word.toLowerCase()));

  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  const compact = title.replace(/[^a-zA-Z0-9]/g, "");
  return compact.slice(0, 2).toUpperCase() || "??";
}

export function coverPalette(slug: string, accent: string, accent2: string) {
  const hash = hashSlug(slug);
  const rotate = hash % 360;
  return {
    hash,
    rotate,
    a: accent,
    b: accent2,
    rings: 3 + (hash % 3),
    offset: (hash % 17) - 8,
  };
}
