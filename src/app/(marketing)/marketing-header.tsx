import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const NAV = [
  { href: "/#features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
];

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-topbar max-w-7xl items-center justify-between px-margin">
        <Link href="/" className="flex items-center gap-space-sm">
          <Image src="/brand/logo.svg" alt="" width={28} height={28} unoptimized />
          <span className="text-title-md text-on-surface">Nexus Dispatch</span>
        </Link>
        <nav className="hidden items-center gap-space-xl md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-body-md text-on-surface-variant hover:text-on-surface">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-space-sm">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/onboarding">Start free trial</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
