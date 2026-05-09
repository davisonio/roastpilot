import { Header } from '@/components/header';
import { FlameRankList } from '@/components/flame-rank';
import { SEED_LEADERBOARD } from '@/lib/seed-data';

/**
 * Leaderboard Page
 * Top roasters with flame visualization
 */
export default function LeaderboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-12 px-4">
        <div className="max-w-xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-2">
              The room remembers.
            </h1>
            <p className="text-muted-foreground">
              Top roasters ranked by points received
            </p>
          </div>

          {/* Leaderboard */}
          <FlameRankList
            entries={SEED_LEADERBOARD.map(entry => ({
              rank: entry.rank,
              handle: entry.handle,
              points: entry.total_points,
            }))}
          />

          {/* Footer note */}
          <p className="mt-12 text-center text-xs text-muted-foreground">
            Points are awarded by other members who find your roasts valuable.
            <br />
            Quality over quantity. Honesty over flattery.
          </p>
        </div>
      </main>
    </div>
  );
}
