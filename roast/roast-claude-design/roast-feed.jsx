// Screen 3: Feed (mobile + desktop)
// Single column with generous spacing. Cards glow at their current heat level.

const FEED_POSTS = [
  { handle: 'TerseSnake',    text: 'Should I quit my AI safety job to start a meme coin? I\u2019m 80% there.', cat: 'decisions', heat: 4, roasts: 47, time: 'a few hours ago' },
  { handle: 'VelvetGoat',    text: 'I optimised my sleep, diet, and morning routine for 18 months and I\u2019m more miserable than ever.', cat: 'life',      heat: 3, roasts: 28, time: 'today' },
  { handle: 'BurntKettle',   text: 'Pitch deck for my agentic SaaS \u2014 first slide attached. Tell me what\u2019s missing.', cat: 'pitches',  heat: 2, roasts: 14, time: 'today' },
  { handle: 'CalmInferno',   text: 'I want to extend my Network School stay another 3 months but my partner is back home.', cat: 'decisions', heat: 2, roasts: 11, time: 'today' },
  { handle: 'PaperMatch',    text: 'Built a new productivity app. The hook is timer-based focus blocks. Roast it.', cat: 'products', heat: 1, roasts: 4,  time: 'this evening' },
  { handle: 'AshKid',        text: 'Is moving to Forest City a good decision if I have a kid?', cat: 'decisions', heat: 0, roasts: 0,  time: 'just now' },
];

function PostCard({ post, compact = false, mid = false }) {
  return (
    <article className={`roast-card heat-${post.heat}`} style={{
      padding: compact ? '20px 22px' : '26px 26px',
      marginBottom: compact ? 18 : 22,
    }}>
      {/* attachment placeholder for the pitch deck card */}
      {post.cat === 'pitches' && post.handle === 'BurntKettle' && (
        <PitchSlideThumb />
      )}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 14,
      }}>
        <span className="smallcaps" style={{ color: '#a89c8c' }}>
          {post.handle} <span style={{ opacity: 0.55, letterSpacing: '0.05em', textTransform: 'lowercase', fontFamily: 'var(--serif)', fontStyle: 'italic', fontWeight: 400 }}>says</span>
        </span>
        <span style={{ fontSize: 10, color: '#6b6259', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--sans)' }}>
          {post.time}
        </span>
      </div>
      <p style={{
        fontFamily: 'var(--serif)', margin: 0,
        fontSize: compact ? 18 : 20, lineHeight: 1.4,
        color: '#f4ede4', fontWeight: 400, letterSpacing: '-0.005em',
        textWrap: 'pretty',
      }}>
        {post.text}
      </p>
      <div style={{
        marginTop: 18, paddingTop: 16,
        borderTop: '1px solid rgba(244,237,228,0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{
          fontSize: 10, color: '#6b6259', letterSpacing: '0.18em',
          textTransform: 'uppercase', fontFamily: 'var(--sans)',
        }}>· {post.cat}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, color: post.heat === 0 ? '#5c6878' : '#ffb347', fontFamily: 'var(--sans)' }}>
          <EmberGlyph size={12} heat={post.heat} />
          <span>{post.roasts === 0 ? 'no roasts yet' : `${post.roasts} roasts`}</span>
        </span>
      </div>
    </article>
  );
}

function PitchSlideThumb() {
  return (
    <div style={{
      marginBottom: 18, height: 120, borderRadius: 8,
      background: 'repeating-linear-gradient(135deg, rgba(244,237,228,0.04) 0 12px, rgba(244,237,228,0.02) 12px 24px)',
      border: '1px solid rgba(244,237,228,0.08)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--mono)', fontSize: 10, color: '#6b6259',
      letterSpacing: '0.1em', textTransform: 'uppercase',
    }}>
      [ first slide · 1.6:1 ]
    </div>
  );
}

function FeedFilters({ desktop = false }) {
  const items = ['all', 'pitches', 'decisions', 'products', 'life'];
  return (
    <div style={{
      display: 'flex', gap: 8, padding: desktop ? '18px 56px' : '12px 20px',
      overflowX: 'auto', flexShrink: 0,
      borderBottom: '1px solid rgba(244,237,228,0.04)',
    }}>
      {items.map((t, i) => <FilterPill key={t} label={t} active={i === 0} />)}
    </div>
  );
}

function FeedMobile() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: 50 }}>
      <AppHeader active="feed" />
      <FeedFilters />
      <div style={{ flex: 1, overflow: 'auto', padding: '20px 18px 80px' }}>
        {FEED_POSTS.map((p, i) => <PostCard key={i} post={p} compact />)}
        <div style={{ textAlign: 'center', fontFamily: 'var(--serif)', fontStyle: 'italic', color: '#6b6259', fontSize: 13, padding: '20px 0' }}>
          end of the room.
        </div>
      </div>
      {/* float "post" button */}
      <button style={{
        position: 'absolute', bottom: 40, right: 22,
        width: 56, height: 56, borderRadius: '50%',
        border: 'none', background: '#ff6b1a',
        color: '#0a0706', fontSize: 24, fontWeight: 500,
        boxShadow: '0 0 24px -4px rgba(255,107,26,0.6), 0 0 60px -10px rgba(255,107,26,0.4)',
      }}>+</button>
    </div>
  );
}

function FeedDesktop() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AppHeader active="feed" desktop />
      <FeedFilters desktop />
      <div style={{ flex: 1, overflow: 'auto', padding: '32px 0' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 20px' }}>
          {FEED_POSTS.map((p, i) => <PostCard key={i} post={p} />)}
          <div style={{ textAlign: 'center', fontFamily: 'var(--serif)', fontStyle: 'italic', color: '#6b6259', fontSize: 14, padding: '30px 0' }}>
            end of the room.
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { FeedMobile, FeedDesktop, PostCard, FEED_POSTS });
