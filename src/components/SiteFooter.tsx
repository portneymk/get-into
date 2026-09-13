import Link from "next/link";
import type { Pack } from "@/lib/types";

export function SiteFooter({ pack, packs }: { pack?: Pack; packs: Pack[] }) {
  return (
    <footer className="mt-16 border-t border-pack-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 text-sm text-pack-muted">
        {pack?.footerBlurb ? <p className="max-w-2xl">{pack.footerBlurb}</p> : null}
        <p className="max-w-2xl">
          Inspired by{" "}
          <a className="text-pack-accent underline underline-offset-3" href="https://www.getintogizz.com" target="_blank" rel="noreferrer">
            Get Into Gizz
          </a>{" "}
          /{" "}
          <a
            className="text-pack-accent underline underline-offset-3"
            href="https://github.com/gloyens/gizz-next-remake"
            target="_blank"
            rel="noreferrer"
          >
            gloyens/gizz-next-remake
          </a>
          . Not affiliated, and this project does not copy their code or assets.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/" className="hover:text-pack-fg">
            Default pack
          </Link>
          <Link href="/packs" className="hover:text-pack-fg">
            All packs
          </Link>
          {packs.map((item) => (
            <Link key={item.slug} href={`/${item.slug}`} className="hover:text-pack-fg">
              {item.displayName}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
