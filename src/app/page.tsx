import { PackHome } from "@/components/PackHome";
import { PackShell } from "@/components/PackShell";
import { getAllPacks, getDefaultPack } from "@/lib/content";

export default function HomePage() {
  const pack = getDefaultPack();
  const packs = getAllPacks();

  return (
    <PackShell pack={pack} packs={packs} theme={pack.theme}>
      <PackHome pack={pack} />
    </PackShell>
  );
}
