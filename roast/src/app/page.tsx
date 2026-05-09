import Link from 'next/link';
import { Shield, Users, Eye } from 'lucide-react';

/**
 * Landing Page
 * Full-bleed dark background, breathing headline, ember CTA
 */
export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        {/* Breathing headline */}
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-semibold text-foreground text-center animate-breathe">
          Get roasted. Honestly.
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg md:text-xl text-muted-foreground text-center max-w-2xl">
          A members-only society for honest peer feedback.{' '}
          <span className="text-foreground">Verified humans only.</span>{' '}
          Anonymous within the walls.{' '}
          <span className="text-foreground">Pay to enter.</span>
        </p>

        {/* CTA */}
        <div className="mt-10">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center h-14 gap-3 px-8 text-lg font-semibold rounded-lg bg-ember-1 text-background shadow-[0_0_20px_rgba(255,107,26,0.3)] hover:shadow-[0_0_30px_rgba(255,107,26,0.5)] hover:bg-ember-2 active:bg-ember-3 transition-all duration-300"
          >
            Apply for membership
          </Link>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="border-t border-border py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Verified */}
            <div className="bg-surface rounded-xl p-8 noise-texture">
              <div className="w-12 h-12 rounded-lg bg-ember-1/10 flex items-center justify-center mb-4">
                <Shield className="size-6 text-ember-1" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                Verified
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Every member passes a presence check. No bots, no alts. Just humans who paid to be here.
              </p>
            </div>

            {/* Anonymous */}
            <div className="bg-surface rounded-xl p-8 noise-texture">
              <div className="w-12 h-12 rounded-lg bg-ember-1/10 flex items-center justify-center mb-4">
                <Eye className="size-6 text-ember-1" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                Anonymous
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Two-word handles. No profiles, no history. Your identity stays outside these walls.
              </p>
            </div>

            {/* Paid */}
            <div className="bg-surface rounded-xl p-8 noise-texture">
              <div className="w-12 h-12 rounded-lg bg-ember-1/10 flex items-center justify-center mb-4">
                <Users className="size-6 text-ember-1" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                Paid
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Money filters for seriousness. When everyone has skin in the game, the feedback gets real.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            A late-night fire pit conversation between strangers who've all paid to be there.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/audit" className="hover:text-foreground transition-colors">
              Audit
            </Link>
            <span>·</span>
            <span>Built for Solana</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
