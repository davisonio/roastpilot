import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-rule">
      <div className="mx-auto flex max-w-5xl items-baseline justify-between px-6 py-5">
        <Link href="/" className="display text-2xl text-ink">
          Roastpilot
        </Link>
        <nav className="flex items-baseline gap-6 text-sm text-mute">
          <Link href="/" className="hover:text-ink">
            feed
          </Link>
          <Link href="/submit" className="text-ink hover:text-ember">
            submit a situation
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-rule">
      <div className="mx-auto flex max-w-5xl items-baseline justify-between px-6 py-6 text-xs text-mute">
        <span>
          Roastpilot. Verdicts by a model, takes by{" "}
          <span className="italic">verified humans</span>.
        </span>
        <span className="tnum">v0.1</span>
      </div>
    </footer>
  );
}
