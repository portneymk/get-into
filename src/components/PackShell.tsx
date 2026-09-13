import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { themeStyle } from "@/lib/theme";
import type { Pack, PackTheme } from "@/lib/types";

export function PackShell({
  pack,
  packs,
  theme,
  children,
}: {
  pack?: Pack;
  packs: Pack[];
  theme: PackTheme;
  children: React.ReactNode;
}) {
  return (
    <div className={`pack-shell pattern-${theme.pattern}`} style={themeStyle(theme)}>
      <div className="grain" />
      <SiteHeader pack={pack} packs={packs} />
      <main className="mx-auto w-full max-w-5xl px-4 py-10">{children}</main>
      <SiteFooter pack={pack} packs={packs} />
    </div>
  );
}
