export type ListenUrls = Record<string, string>;

export type AlbumType = "album" | "ep" | "live" | "compilation";

export type AlbumEdge = {
  slug: string;
  label: string;
  hint?: string;
  vibe?: string;
  why?: string;
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
  whyNext?: Record<string, string>;
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

export type TasteChip = {
  id: string;
  label: string;
  slug: string;
  blurb?: string;
};

export type TasteDoor = {
  prompt?: string;
  chips: TasteChip[];
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
  tasteDoor?: TasteDoor;
  whyNext?: Record<string, Record<string, string>>;
  theme: PackTheme;
  footerBlurb: string;
};

export type Pack = PackMeta & {
  albums: AlbumData[];
};

export type SiteConfig = {
  defaultPack: string;
};
