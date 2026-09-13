export type ListenUrls = Record<string, string>;

export type AlbumType = "album" | "ep" | "live" | "compilation";

export type AlbumEdge = {
  slug: string;
  label: string;
  hint?: string;
  vibe?: string;
};

export type AlbumData = {
  title: string;
  slug: string;
  year: number;
  project: string;
  type?: AlbumType;
  tags: string[];
  listenUrls: ListenUrls;
  nextAlbums: AlbumEdge[];
  body: string;
};

export type StartDoor = {
  slug: string;
  label: string;
  hint?: string;
  featured?: boolean;
};

export type TasteLane = {
  id: string;
  label: string;
  blurb: string;
};

export type PackPattern = "swamp" | "carnival" | "plain";

export type PackTheme = {
  bg: string;
  bgRaised: string;
  fg: string;
  muted: string;
  accent: string;
  accentFg: string;
  accent2: string;
  ink: string;
  border: string;
  card: string;
  glow: string;
  radius: string;
  pattern: PackPattern;
};

export type PackMeta = {
  slug: string;
  displayName: string;
  tagline: string;
  intro: string;
  startAlbums: StartDoor[];
  lanes?: TasteLane[];
  theme: PackTheme;
  footerBlurb: string;
};

export type Pack = PackMeta & {
  albums: AlbumData[];
};

export type SiteConfig = {
  defaultPack: string;
};
