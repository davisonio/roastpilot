import { Header } from '@/components/header';
import {
  AuditEventList,
  AuditExplanationCard,
  AuditPrivacyCard,
} from '@/components/audit-event';
import { SEED_AUDIT_EVENTS } from '@/lib/seed-data';

/**
 * Audit Log Page
 * The architectural showcase - what the platform knows and doesn't know
 */
export default function AuditPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-2">
              What crossed the boundary.
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              These are the only things the platform learns about any action.
              No identities, no content, no behavior.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main content - Audit log */}
            <div className="lg:col-span-2">
              {/* Live audit feed */}
              <div className="bg-surface rounded-lg p-6 mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm text-muted-foreground">
                    Live attestation feed
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <AuditEventList events={SEED_AUDIT_EVENTS} />
                </div>
              </div>

              {/* Explanation card */}
              <AuditExplanationCard />
            </div>

            {/* Sidebar - Privacy panel */}
            <div className="lg:col-span-1">
              <AuditPrivacyCard />

              {/* Architecture note */}
              <div className="mt-8 p-4 bg-surface/50 rounded-lg">
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  Why this matters
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Traditional platforms know everything about you.
                  Roast uses cryptographic attestations to verify actions
                  without learning who you are or what you said.
                  <br /><br />
                  Each attestation proves a verified human took an action.
                  The content and identity stay on your device.
                </p>
              </div>

              {/* Technical spec link */}
              <div className="mt-4 p-4 bg-ember-1/5 border border-ember-1/20 rounded-lg">
                <h4 className="text-sm font-semibold text-ember-1 mb-1">
                  Built for Solana
                </h4>
                <p className="text-xs text-muted-foreground">
                  Attestations are anchored on-chain for immutable verification.
                  No central authority can modify the audit trail.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
