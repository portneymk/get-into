import Link from "next/link";
import { PackShell } from "@/components/PackShell";
import { getAllPacks } from "@/lib/content";
import { HUB_THEME } from "@/lib/theme";

export default function NotFound() {
  return (
    <PackShell packs={getAllPacks()} theme={HUB_THEME}>
      <h1 className="display text-5xl">Lost in the swamp</h1>
      <p className="mt-4 max-w-xl text-pack-muted">That pack or album is not in this catalog.</p>
      <Link href="/" className="mt-6 inline-block rounded-full bg-pack-accent px-4 py-2 text-pack-accent-fg">
        Back to the default door
      </Link>
    </PackShell>
  );
}
