import Link from "next/link";

export function MarketingFooter() {
  return (
    <footer className="border-t bg-brand-slate">
      <div className="mx-auto max-w-7xl space-y-space-lg px-margin py-margin-lg">
        <div className="flex flex-wrap items-center justify-between gap-space-lg">
          <p className="text-body-sm text-slate-400">© {new Date().getFullYear()} Nexus Dispatch.</p>
          <nav className="flex flex-wrap gap-x-space-lg gap-y-space-sm text-body-sm text-slate-400">
            <Link href="/pricing" className="hover:text-white">
              Pricing
            </Link>
            <Link href="/faq" className="hover:text-white">
              FAQ
            </Link>
            <Link href="/login" className="hover:text-white">
              Log in
            </Link>
            <Link href="/onboarding" className="hover:text-white">
              Start free trial
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
