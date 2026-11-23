"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "./i18n";
import { cn } from "./ui/primitives";

const LINKS = [
  { href: "/", key: "nav.overview" },
  { href: "/vocabulary", key: "nav.vocabulary" },
  { href: "/conjugation", key: "nav.conjugation" },
  { href: "/grammar", key: "nav.grammar" },
  { href: "/exam", key: "nav.exam" },
  { href: "/progress", key: "nav.progress" },
  { href: "/settings", key: "nav.settings" },
] as const;

export function TopNav() {
  const pathname = usePathname();
  const { t } = useI18n();
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg" style={{ paddingTop: "env(safe-area-inset-top)" }}>
      <div className="mx-auto flex h-14 max-w-[960px] items-center gap-6 px-4 sm:px-6">
        <Link href="/" className="shrink-0 text-[17px] font-semibold tracking-[-0.02em]">
          Armat
        </Link>
        <nav className="-mx-2 flex min-w-0 flex-1 items-center gap-1 overflow-x-auto [scrollbar-width:none] sm:justify-end">
          {LINKS.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "shrink-0 rounded-md px-2.5 py-1.5 text-[14px] transition-colors",
                  active ? "text-ink font-medium" : "text-ink-2 hover:text-ink",
                )}
              >
                {t(l.key)}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
