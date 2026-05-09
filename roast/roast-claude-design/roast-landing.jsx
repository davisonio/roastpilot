// Screen 1: Landing — mobile + desktop
// "Get cooked. Honestly." — full-bleed dark, breathing serif, ember CTA, three feature blocks.

function LandingMobile() {
  return (
    <div style={{ height: '100%', overflow: 'auto', position: 'relative', paddingTop: 50 }}>
      {/* hero */}
      <div style={{
        minHeight: 720, display: 'flex', flexDirection: 'column',
        padding: '60px 28px 40px', position: 'relative',
      }}>
        <div style={{ marginTop: 80, marginBottom: 'auto' }}>
          <Wordmark size={20} />
        </div>
        <h1 className="headline-breathe" style={{
          fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 60, lineHeight: 0.96,
          letterSpacing: '-0.02em', margin: '0 0 22px', color: '#f4ede4',
        }}>
          Get<br/>cooked.<br/>
          <span style={{ color: '#ff8c42', fontStyle: 'italic', fontWeight: 400 }}>Honestly.</span>
        </h1>
        <p style={{
          fontFamily: 'var(--sans)', fontSize: 15, lineHeight: 1.55, color: '#a89c8c',
          margin: '0 0 36px', maxWidth: 320, fontWeight: 300,
        }}>
          A members-only society for honest peer feedback. Verified humans only. Anonymous within the walls.
        </p>
        <button style={{
          alignSelf: 'flex-start', border: 'none',
          padding: '16px 28px', borderRadius: 999,
          background: '#ff6b1a', color: '#0a0706',
          fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 600,
          letterSpacing: '0.02em',
          boxShadow: '0 0 32px -4px rgba(255,107,26,0.55), 0 0 80px -10px rgba(255,107,26,0.35), inset 0 -2px 6px rgba(120,40,0,0.3)',
        }}>
          apply for membership
        </button>
        {/* faint ember at bottom */}
        <div style={{
          position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          fontSize: 10, letterSpacing: '0.3em', color: '#6b6259', textTransform: 'uppercase',
        }}>scroll for more</div>
      </div>

      {/* features */}
      <div style={{ padding: '40px 28px 60px', borderTop: '1px solid rgba(244,237,228,0.05)' }}>
        {[
          { glyph: 'verified', t: 'Verified humans only', d: 'Each membership requires a one-time presence check. No bots, no farms.' },
          { glyph: 'anon', t: 'Anonymous within the walls', d: 'You arrive as a handle. What you said stays here. What you are stays yours.' },
          { glyph: 'paid', t: 'Skin in the fire', d: 'A small one-time fee. The best roasts share the membership reward pool.' },
        ].map((f, i) => (
          <div key={i} style={{
            padding: '28px 0',
            borderBottom: i < 2 ? '1px solid rgba(244,237,228,0.06)' : 'none',
            display: 'flex', gap: 16, alignItems: 'flex-start',
          }}>
            <div style={{ flexShrink: 0, paddingTop: 2 }}>
              <FeatureGlyph kind={f.glyph} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 19, fontWeight: 500, color: '#f4ede4', marginBottom: 6, letterSpacing: '-0.005em' }}>{f.t}</div>
              <div style={{ fontSize: 13, lineHeight: 1.55, color: '#a89c8c', fontWeight: 300 }}>{f.d}</div>
            </div>
          </div>
        ))}
        <div style={{ marginTop: 50, fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 14, color: '#6b6259', textAlign: 'center' }}>
          a late-night fire pit, between strangers who paid to be there.
        </div>
      </div>
    </div>
  );
}

function LandingDesktop() {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'auto', position: 'relative' }}>
      {/* nav */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '24px 64px', position: 'relative', zIndex: 2,
      }}>
        <Wordmark size={22} />
        <div style={{ display: 'flex', gap: 28, fontSize: 13, color: '#a89c8c' }}>
          <span>about</span><span>code of fire</span><span>sign in</span>
        </div>
      </div>

      {/* hero */}
      <div style={{
        padding: '60px 64px 80px', display: 'grid',
        gridTemplateColumns: '1.4fr 1fr', gap: 80, alignItems: 'center', minHeight: 540,
        position: 'relative',
      }}>
        <div>
          <div className="smallcaps" style={{ marginBottom: 24, color: '#ff6b1a', opacity: 0.85 }}>
            ◦ members-only · est. 2026
          </div>
          <h1 className="headline-breathe" style={{
            fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 112, lineHeight: 0.94,
            letterSpacing: '-0.025em', margin: '0 0 32px', color: '#f4ede4',
          }}>
            Get cooked.{' '}
            <span style={{ color: '#ff8c42', fontStyle: 'italic', fontWeight: 400 }}>Honestly.</span>
          </h1>
          <p style={{
            fontFamily: 'var(--sans)', fontSize: 17, lineHeight: 1.6, color: '#a89c8c',
            maxWidth: 520, margin: '0 0 44px', fontWeight: 300,
          }}>
            A members-only society for honest peer feedback. Verified humans only. Anonymous within the walls.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <button style={{
              border: 'none', padding: '18px 32px', borderRadius: 999,
              background: '#ff6b1a', color: '#0a0706',
              fontFamily: 'var(--sans)', fontSize: 15, fontWeight: 600, letterSpacing: '0.02em',
              boxShadow: '0 0 36px -4px rgba(255,107,26,0.55), 0 0 100px -10px rgba(255,107,26,0.35), inset 0 -2px 6px rgba(120,40,0,0.3)',
            }}>
              apply for membership
            </button>
            <span style={{ fontSize: 13, color: '#6b6259' }}>one-time fee · ~$28</span>
          </div>
        </div>
        {/* visual: a single low ember in the dark */}
        <div style={{ position: 'relative', height: 480, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            width: 240, height: 240, borderRadius: '50%',
            background: 'radial-gradient(circle at 50% 60%, #ffd96e 0%, #ff8c42 25%, #ff6b1a 45%, #9c2f0a 65%, transparent 80%)',
            filter: 'blur(2px)',
            boxShadow: '0 0 80px 20px rgba(255,107,26,0.4), 0 0 240px 60px rgba(255,107,26,0.18)',
          }} className="ember-breath" />
          <EmberParticles count={9} area={{ w: 380, h: 480 }} seed={3} />
        </div>
      </div>

      {/* features */}
      <div style={{
        padding: '60px 64px 80px',
        borderTop: '1px solid rgba(244,237,228,0.06)',
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 56,
      }}>
        {[
          { glyph: 'verified', t: 'Verified humans only', d: 'A one-time presence check at the door. No bots, no farms, no doubles.' },
          { glyph: 'anon', t: 'Anonymous within the walls', d: 'You arrive as a handle. What you said stays here. What you are stays yours.' },
          { glyph: 'paid', t: 'Skin in the fire', d: 'A small one-time fee. The sharpest roasts share the membership reward pool.' },
        ].map((f, i) => (
          <div key={i}>
            <FeatureGlyph kind={f.glyph} size={36} />
            <div style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 500, color: '#f4ede4', margin: '20px 0 10px' }}>{f.t}</div>
            <div style={{ fontSize: 14, lineHeight: 1.6, color: '#a89c8c', fontWeight: 300, maxWidth: 320 }}>{f.d}</div>
          </div>
        ))}
      </div>

      {/* footer */}
      <div style={{
        padding: '32px 64px', borderTop: '1px solid rgba(244,237,228,0.05)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontSize: 12, color: '#6b6259',
      }}>
        <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic' }}>a late-night fire pit. strangers who paid to be there.</span>
        <span>© the room, 2026</span>
      </div>
    </div>
  );
}

// Tiny custom ember-only icons (no emoji, no stock).
function FeatureGlyph({ kind, size = 24 }) {
  const c = '#ff8c42';
  if (kind === 'verified') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke={c} strokeWidth="1.2" />
        <circle cx="12" cy="12" r="3" fill={c} opacity="0.9" />
      </svg>
    );
  }
  if (kind === 'anon') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M4 14 Q12 8 20 14" stroke={c} strokeWidth="1.2" fill="none" />
        <circle cx="12" cy="14" r="1.6" fill={c} />
      </svg>
    );
  }
  // "paid" / fire pit: a coin made of ember
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={c} strokeWidth="1.2" />
      <path d="M9 9 C 11 13, 13 11, 15 16 M10 7 C 13 12, 11 14, 14 18" stroke={c} strokeWidth="1.2" strokeLinecap="round" opacity="0.9" />
    </svg>
  );
}

Object.assign(window, { LandingMobile, LandingDesktop });
