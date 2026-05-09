// Screen 5: Leaderboard — "The room remembers."

const LEADERBOARD = [
  { rank: 1,  handle: 'BurntKettle',  points: 847 },
  { rank: 2,  handle: 'IronicMatch',  points: 612 },
  { rank: 3,  handle: 'VelvetGoat',   points: 489 },
  { rank: 4,  handle: 'TerseSnake',   points: 312 },
  { rank: 5,  handle: 'CalmInferno',  points: 287 },
  { rank: 6,  handle: 'FlintGlass',   points: 211 },
  { rank: 7,  handle: 'SlowEmber',    points: 168 },
  { rank: 8,  handle: 'PaperMatch',   points: 92  },
  { rank: 9,  handle: 'QuietForge',   points: 47  },
  { rank: 10, handle: 'AshKid',       points: 23  },
];

// rank → flame intensity 0..4 + flame size
function rankToFire(rank) {
  if (rank === 1) return { intensity: 4, size: 80 };
  if (rank <= 3)  return { intensity: 3, size: 56 };
  if (rank <= 7)  return { intensity: 2, size: 38 };
  return { intensity: 0, size: 28 };
}

function LeaderRow({ entry, desktop = false }) {
  const fire = rankToFire(entry.rank);
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: desktop ? '60px 1fr 120px 110px' : '36px 1fr 80px 60px',
      alignItems: 'center', gap: desktop ? 24 : 14,
      padding: desktop ? '22px 0' : '18px 0',
      borderBottom: '1px solid rgba(244,237,228,0.05)',
    }}>
      <span style={{
        fontFamily: 'var(--serif)', fontSize: desktop ? 28 : 22, color: '#6b6259',
        fontWeight: 400, letterSpacing: '-0.01em',
        fontVariantNumeric: 'tabular-nums',
      }}>{String(entry.rank).padStart(2, '0')}</span>
      <span style={{
        fontFamily: 'var(--serif)', fontSize: desktop ? 24 : 19,
        color: entry.rank <= 3 ? '#f4ede4' : '#a89c8c',
        fontWeight: entry.rank === 1 ? 500 : 400,
        letterSpacing: '-0.005em',
      }}>
        {entry.handle}
      </span>
      <span style={{
        textAlign: 'right',
        fontFamily: 'var(--sans)', fontSize: desktop ? 16 : 14,
        color: entry.rank <= 3 ? '#ffb347' : '#a89c8c',
        fontVariantNumeric: 'tabular-nums', letterSpacing: '0.02em',
      }}>{entry.points} <span style={{ fontSize: 10, color: '#6b6259', letterSpacing: '0.1em', textTransform: 'uppercase', marginLeft: 4 }}>pts</span></span>
      <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Flame size={fire.size} intensity={fire.intensity} animated={entry.rank <= 3} />
      </span>
    </div>
  );
}

function LeaderboardMobile() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: 50, background: '#070504' }}>
      <AppHeader active="leaderboard" />
      <div style={{ flex: 1, overflow: 'auto', padding: '36px 22px 60px' }}>
        <h1 style={{
          fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 36,
          letterSpacing: '-0.02em', color: '#f4ede4', margin: '0 0 6px', lineHeight: 1.05,
        }}>
          The room remembers.
        </h1>
        <p style={{ fontSize: 12, color: '#6b6259', fontStyle: 'italic', fontFamily: 'var(--serif)', marginBottom: 32 }}>
          this season · resets at the new moon
        </p>
        {LEADERBOARD.map(e => <LeaderRow key={e.rank} entry={e} />)}
      </div>
    </div>
  );
}

function LeaderboardDesktop() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#070504' }}>
      <AppHeader active="leaderboard" desktop />
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '64px 40px 80px' }}>
          <div className="smallcaps" style={{ marginBottom: 18, color: '#ff8c42' }}>
            ◦ this season
          </div>
          <h1 style={{
            fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 72,
            letterSpacing: '-0.025em', color: '#f4ede4', margin: '0 0 8px', lineHeight: 1,
          }}>
            The room remembers.
          </h1>
          <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 16, color: '#6b6259', marginBottom: 56 }}>
            ten sharpest tongues. flames scaled to the heat they have made.
          </p>
          {LEADERBOARD.map(e => <LeaderRow key={e.rank} entry={e} desktop />)}
          <div style={{ marginTop: 40, fontSize: 12, color: '#6b6259', fontFamily: 'var(--serif)', fontStyle: 'italic', textAlign: 'center' }}>
            the top three split the membership pool at the next moon.
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { LeaderboardMobile, LeaderboardDesktop });
