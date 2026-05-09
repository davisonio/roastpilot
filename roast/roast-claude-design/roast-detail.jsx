// Screen 4: Post detail with swipe deck (mobile) — the hero screen.
// Shows the post at top, a stack of swipe-deck roast cards below, and the
// composer at the bottom. We render two variants: a normal state and the
// "mid-ignition" frame with particles + flare.

const ROASTS = [
  { handle: 'IronicMatch', text: 'You don\u2019t want a meme coin. You want permission to be irresponsible without losing the title \u201cresearcher.\u201d The coin is the costume.', points: 23 },
  { handle: 'FlintGlass',  text: 'Eighty percent there is the point at which honest people round down to zero and dishonest people round up to one. Which one are you?', points: 12 },
  { handle: 'QuietForge',  text: 'Quit. Start the coin. Lose your money. Come back. We\u2019ll still be here. The room loves a returning fool.', points: 7  },
];

// The big post being judged at the top.
function JudgedPost({ heat = 4 }) {
  return (
    <article className={`roast-card heat-${heat}`} style={{ padding: '22px 22px 20px', margin: '0 0 22px' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12,
      }}>
        <span className="smallcaps">TerseSnake <span style={{ opacity: 0.55, fontFamily: 'var(--serif)', fontStyle: 'italic', textTransform: 'lowercase', letterSpacing: '0.05em' }}>says</span></span>
        <span style={{ fontSize: 10, color: '#6b6259', letterSpacing: '0.08em', textTransform: 'uppercase' }}>a few hours ago</span>
      </div>
      <p style={{
        fontFamily: 'var(--serif)', fontSize: 19, lineHeight: 1.4,
        color: '#f4ede4', margin: 0, fontWeight: 400, letterSpacing: '-0.005em',
      }}>
        Should I quit my AI safety job to start a meme coin? I\u2019m 80% there.
      </p>
      <div style={{
        marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(244,237,228,0.06)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span className="smallcaps" style={{ fontSize: 10 }}>· decisions</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#ffb347' }}>
          <EmberGlyph size={12} heat={heat} /> 47 roasts · 12 still cooking
        </span>
      </div>
    </article>
  );
}

// One roast card in the swipe deck.
function RoastCard({ roast, transform = 'none', visible = true, dimmed = false, accent = '#a89c8c', overlay = null }) {
  return (
    <div className="roast-card" style={{
      position: 'absolute', inset: 0,
      transform, transition: 'transform 240ms ease',
      padding: '24px 22px 20px',
      background: '#1a1412',
      borderRadius: 16,
      border: '1px solid rgba(244,237,228,0.08)',
      boxShadow: dimmed
        ? '0 6px 24px rgba(0,0,0,0.4)'
        : '0 14px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(244,237,228,0.06)',
      display: 'flex', flexDirection: 'column',
      opacity: visible ? 1 : 0,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <span className="smallcaps">{roast.handle}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: accent }}>
          <EmberGlyph size={11} heat={2} /> {roast.points}
        </span>
      </div>
      <p style={{
        flex: 1, margin: 0, fontFamily: 'var(--serif)', fontSize: 17, lineHeight: 1.45,
        color: '#f4ede4', fontWeight: 400, letterSpacing: '-0.003em', textWrap: 'pretty',
      }}>
        {roast.text}
      </p>
      <div style={{
        marginTop: 18, paddingTop: 14, borderTop: '1px solid rgba(244,237,228,0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 56,
      }}>
        <button style={tapTargetStyle('pass')}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" stroke="#a89c8c" strokeWidth="1.6" strokeLinecap="round" /></svg>
        </button>
        <button style={tapTargetStyle('award')}>
          <EmberGlyph size={16} heat={3} />
        </button>
      </div>
      {overlay}
    </div>
  );
}

function tapTargetStyle() {
  return {
    width: 44, height: 44, borderRadius: '50%',
    border: '1px solid rgba(244,237,228,0.1)', background: 'transparent',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
  };
}

// The deck stack (3 cards, top mid-drag with right-hand particle gather).
function RoastDeck({ ignition = false, dragging = 'right' }) {
  const tilt = dragging === 'right' ? 'translateX(48px) rotate(8deg)' : dragging === 'left' ? 'translateX(-48px) rotate(-8deg)' : 'none';
  return (
    <div style={{ position: 'relative', height: 286, margin: '0 4px 18px' }}>
      {/* third card peek */}
      <div className="roast-card" style={{
        position: 'absolute', inset: '14px 14px 0',
        background: '#15110f', borderRadius: 16,
        border: '1px solid rgba(244,237,228,0.05)', opacity: 0.55,
      }} />
      {/* second card peek */}
      <div className="roast-card" style={{
        position: 'absolute', inset: '7px 7px 0',
        background: '#1a1412', borderRadius: 16,
        border: '1px solid rgba(244,237,228,0.07)',
        boxShadow: '0 6px 18px rgba(0,0,0,0.4)',
      }}>
        <div style={{ padding: '20px 22px' }}>
          <span className="smallcaps">{ROASTS[1].handle}</span>
        </div>
      </div>

      {/* top card */}
      <RoastCard
        roast={ROASTS[0]}
        transform={tilt}
        accent={dragging === 'right' ? '#ffb347' : dragging === 'left' ? '#5c6878' : '#a89c8c'}
        overlay={
          <>
            {dragging === 'right' && (
              <>
                <div style={{
                  position: 'absolute', top: 16, right: 16,
                  padding: '6px 10px', borderRadius: 999,
                  border: '1.5px solid #ff8c42', color: '#ffb347',
                  fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
                  fontWeight: 600, transform: 'rotate(8deg)',
                  background: 'rgba(255,107,26,0.06)',
                }}>ignite</div>
                <div style={{
                  position: 'absolute', right: -2, top: 0, bottom: 0, width: 80,
                  pointerEvents: 'none', overflow: 'hidden',
                }}>
                  <EmberParticles count={6} area={{ w: 80, h: 286 }} seed={11} intensity={1.1} />
                </div>
              </>
            )}
            {dragging === 'left' && (
              <div style={{
                position: 'absolute', top: 16, left: 16,
                padding: '6px 10px', borderRadius: 999,
                border: '1.5px solid #5c6878', color: '#a89c8c',
                fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
                fontWeight: 600, transform: 'rotate(-8deg)',
              }}>pass</div>
            )}
          </>
        }
      />

      {ignition && (
        <>
          {/* warm flare across whole deck */}
          <div style={{
            position: 'absolute', inset: -20, borderRadius: 24, pointerEvents: 'none',
            background: 'radial-gradient(ellipse at center, rgba(255,140,66,0.4), rgba(255,107,26,0.18) 40%, transparent 75%)',
            filter: 'blur(6px)',
          }} />
          <EmberParticles count={5} area={{ w: 320, h: 320 }} seed={13} intensity={1.3} />
        </>
      )}
    </div>
  );
}

// The composer pinned to the bottom.
function Composer({ chars = 142 }) {
  return (
    <div style={{
      borderTop: '1px solid rgba(244,237,228,0.08)',
      background: 'rgba(15,11,9,0.92)',
      backdropFilter: 'blur(8px)',
      padding: '14px 18px 22px', flexShrink: 0,
    }}>
      <div style={{
        background: 'rgba(244,237,228,0.04)', borderRadius: 14,
        padding: '12px 14px', border: '1px solid rgba(244,237,228,0.06)',
      }}>
        <div className="smallcaps" style={{ fontSize: 9, marginBottom: 6 }}>your roast</div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 15, color: '#f4ede4', minHeight: 38, lineHeight: 1.4, fontWeight: 400 }}>
          You\u2019re not 80% there. You\u2019re 80% scared the safety crowd was right
          <span className="log-cursor" style={{ display: 'inline-block', width: 1, height: 16, background: '#ff8c42', marginLeft: 2, verticalAlign: 'middle' }} />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, fontSize: 11, color: '#6b6259' }}>
        <span style={{ letterSpacing: '0.05em' }}>{chars} / 280</span>
        <button style={{
          border: 'none', padding: '8px 16px', borderRadius: 999,
          background: '#ff6b1a', color: '#0a0706', fontWeight: 600, fontSize: 12,
          letterSpacing: '0.04em',
          boxShadow: '0 0 16px -4px rgba(255,107,26,0.5)',
        }}>roast</button>
      </div>
    </div>
  );
}

function PostDetailMobile({ ignition = false }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: 50 }}>
      <div style={{
        padding: '14px 18px 0', display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0,
      }}>
        <span style={{ fontSize: 18, color: '#a89c8c', cursor: 'pointer' }}>←</span>
        <Wordmark size={16} />
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '18px 18px 0', display: 'flex', flexDirection: 'column' }}>
        <JudgedPost />
        <div className="smallcaps" style={{ fontSize: 9, marginBottom: 12 }}>· top roast · swipe to judge</div>
        <RoastDeck ignition={ignition} dragging={ignition ? 'right' : 'right'} />
      </div>
      <Composer />
    </div>
  );
}

function PostDetailEmpty() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: 50 }}>
      <div style={{ padding: '14px 18px 0', display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ fontSize: 18, color: '#a89c8c' }}>←</span>
        <Wordmark size={16} />
      </div>
      <div style={{ flex: 1, padding: '24px 18px', overflow: 'auto' }}>
        <JudgedPost heat={4} />
      </div>
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '0 36px 80px', textAlign: 'center',
      }}>
        <div style={{ marginBottom: 28 }}>
          <Flame size={56} intensity={0} animated={false} />
        </div>
        <div style={{
          fontFamily: 'var(--serif)', fontSize: 22, color: '#f4ede4',
          letterSpacing: '-0.005em', lineHeight: 1.3, marginBottom: 10, fontWeight: 500,
        }}>
          You\u2019ve judged them all.
        </div>
        <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 14, color: '#a89c8c' }}>
          The room thanks you.
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PostDetailMobile, PostDetailEmpty, RoastDeck, Composer });
