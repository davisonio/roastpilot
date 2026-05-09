// Screen 7: Submit a post (mobile)
// Two states: composing, and "lighting the kindling" / confirmation.

function SubmitCompose() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: 50 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 20px', borderBottom: '1px solid rgba(244,237,228,0.06)', flexShrink: 0,
      }}>
        <span style={{ fontSize: 13, color: '#a89c8c' }}>cancel</span>
        <span className="smallcaps" style={{ fontSize: 10 }}>new post</span>
        <span style={{ fontSize: 13, color: '#6b6259' }}> </span>
      </div>

      <div style={{ flex: 1, padding: '28px 24px 20px', overflow: 'auto' }}>
        <div className="smallcaps" style={{ color: '#6b6259', marginBottom: 18 }}>
          posting as <span style={{ color: '#a89c8c' }}>TerseSnake</span>
        </div>
        <div style={{
          fontFamily: 'var(--serif)', fontSize: 22, lineHeight: 1.4, color: '#f4ede4',
          fontWeight: 400, letterSpacing: '-0.005em', minHeight: 180, textWrap: 'pretty',
        }}>
          Should I quit my AI safety job to start a meme coin? I\u2019m 80% there.
          <span className="log-cursor" style={{ display: 'inline-block', width: 2, height: 22, background: '#ff8c42', marginLeft: 3, verticalAlign: 'middle' }} />
        </div>

        <div style={{ marginTop: 36 }}>
          <div className="smallcaps" style={{ marginBottom: 12 }}>category</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {[
              ['pitches',   false],
              ['decisions', true],
              ['products',  false],
              ['life',      false],
            ].map(([t, active]) => (
              <span key={t} style={{
                padding: '8px 16px', borderRadius: 999,
                fontSize: 12, letterSpacing: '0.02em',
                color: active ? '#0a0706' : '#a89c8c',
                background: active ? '#ffb347' : 'transparent',
                border: `1px solid ${active ? '#ffb347' : 'rgba(244,237,228,0.1)'}`,
                fontWeight: active ? 600 : 400,
                boxShadow: active ? '0 0 18px -4px rgba(255,179,71,0.4)' : 'none',
              }}>{t}</span>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 28, fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 13, color: '#6b6259', lineHeight: 1.5 }}>
          one shot. no edits after submission. the room sees you only by your handle.
        </div>
      </div>

      <div style={{
        padding: '14px 20px 24px', borderTop: '1px solid rgba(244,237,228,0.06)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'rgba(15,11,9,0.85)', backdropFilter: 'blur(8px)', flexShrink: 0,
      }}>
        <span style={{ fontSize: 12, color: '#6b6259', fontVariantNumeric: 'tabular-nums', letterSpacing: '0.05em' }}>67 / 280</span>
        <button style={{
          border: 'none', padding: '12px 24px', borderRadius: 999,
          background: '#ff6b1a', color: '#0a0706',
          fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 600, letterSpacing: '0.04em',
          boxShadow: '0 0 28px -4px rgba(255,107,26,0.55), 0 0 60px -10px rgba(255,107,26,0.35)',
        }}>roast me</button>
      </div>
    </div>
  );
}

function SubmitConfirm() {
  return (
    <div style={{
      height: '100%', paddingTop: 50,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '50px 36px 0', textAlign: 'center', position: 'relative',
    }}>
      <EmberParticles count={11} area={{ w: 360, h: 480 }} seed={9} intensity={0.9} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {/* the kindling — small flame */}
        <div style={{ marginBottom: 38 }}>
          <Flame size={64} intensity={3} />
        </div>

        <div className="smallcaps" style={{ color: '#ffb347', marginBottom: 18 }}>
          ◦ lighting the kindling
        </div>
        <div style={{
          fontFamily: 'var(--serif)', fontSize: 28, color: '#f4ede4',
          letterSpacing: '-0.012em', lineHeight: 1.2, fontWeight: 500, marginBottom: 12,
          textShadow: '0 0 30px rgba(255,140,66,0.3)',
        }}>
          Your post is in the room.
        </div>
        <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 14, color: '#a89c8c', maxWidth: 280 }}>
          someone, somewhere, is already reaching for kindling.
        </div>
      </div>

      <button style={{
        marginBottom: 80, border: '1px solid rgba(244,237,228,0.12)',
        background: 'transparent', color: '#a89c8c',
        padding: '12px 22px', borderRadius: 999, fontSize: 12, letterSpacing: '0.04em',
      }}>back to the feed</button>
    </div>
  );
}

Object.assign(window, { SubmitCompose, SubmitConfirm });
