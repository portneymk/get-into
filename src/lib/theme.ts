import type { CSSProperties } from "react";
import type { PackTheme } from "@/lib/types";

export function themeStyle(theme: PackTheme): CSSProperties {
  return {
    "--bg": theme.bg,
    "--bg-raised": theme.bgRaised,
    "--fg": theme.fg,
    "--muted": theme.muted,
    "--accent": theme.accent,
    "--accent-fg": theme.accentFg,
    "--accent-2": theme.accent2,
    "--ink": theme.ink,
    "--border": theme.border,
    "--card": theme.card,
    "--glow": theme.glow,
    "--radius": theme.radius,
  } as CSSProperties;
}

export const HUB_THEME: PackTheme = {
  bg: "#101210",
  bgRaised: "#181b18",
  fg: "#ece6d6",
  muted: "#a3a89b",
  accent: "#d4a017",
  accentFg: "#1b1608",
  accent2: "#4c8f73",
  ink: "#080a08",
  border: "#2c332c",
  card: "#151815",
  glow: "#2f6b4f",
  radius: "18px",
  pattern: "plain",
};
