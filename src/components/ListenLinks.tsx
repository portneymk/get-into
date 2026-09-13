import type { ListenUrls } from "@/lib/types";

const LABELS: Record<string, string> = {
  spotify: "Spotify",
  youtube: "YouTube",
  apple: "Apple Music",
  bandcamp: "Bandcamp",
  wiki: "Wikipedia",
  official: "Official",
};

function labelFor(key: string): string {
  return LABELS[key] ?? key.replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export function ListenLinks({ urls }: { urls: ListenUrls }) {
  const entries = Object.entries(urls).filter(([, url]) => Boolean(url));
  if (entries.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {entries.map(([key, url]) => (
        <a
          key={key}
          href={url}
          target="_blank"
          rel="noreferrer"
          className="mono rounded-full border border-pack-border bg-pack-raised px-3 py-1.5 text-xs tracking-wide text-pack-fg transition hover:border-pack-accent hover:text-pack-accent"
        >
          {labelFor(key)}
        </a>
      ))}
    </div>
  );
}
