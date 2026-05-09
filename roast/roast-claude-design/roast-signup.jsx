// Screen 2: Sign-up / presence check (mobile)
// Three sub-screens shown side-by-side as separate panels in one phone frame
// or as separate artboards. We render them as separate components so the
// canvas can show them as 3 mobile artboards.

function SignupEmail() {
  return (
    <div style={{ height: '100%', padding: '90px 36px 40px', display: 'flex', flexDirection: 'column' }}>
      <div className="smallcaps" style={{ marginBottom: 'auto', color: '#6b6259' }}>step 1 · 3</div>
      <div style={{ marginBottom: 60 }}>
        <h2 style={{
          fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 30, lineHeight: 1.15,
          letterSpacing: '-0.01em', margin: '0 0 14px', color: '#f4ede4',
        }}>
          Knock at the door.
        </h2>
        <p style={{ fontSize: 14, color: '#a89c8c', lineHeight: 1.55, margin: 0, fontWeight: 300 }}>
          We need an address to send the key to. We never use it inside the room.
        </p>
      </div>
      <div>
        <label className="smallcaps" style={{ display: 'block', marginBottom: 10, fontSize: 10 }}>your email</label>
        <input type="text" defaultValue="" placeholder="you@somewhere.com" style={{
          width: '100%', padding: '14px 0', borderRadius: 0, border: 'none',
          borderBottom: '1px solid rgba(244,237,228,0.18)',
          background: 'transparent', color: '#f4ede4',
          fontFamily: 'var(--sans)', fontSize: 17, outline: 'none',
        }} />
        <button style={{
          marginTop: 36, width: '100%', border: 'none',
          padding: '16px 28px', borderRadius: 999,
          background: '#ff6b1a', color: '#0a0706',
          fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 600, letterSpacing: '0.02em',
          boxShadow: '0 0 28px -6px rgba(255,107,26,0.5)',
        }}>continue</button>
      </div>
      <div style={{ marginTop: 'auto', paddingTop: 50, fontSize: 11, color: '#6b6259', textAlign: 'center', fontFamily: 'var(--serif)', fontStyle: 'italic' }}>
        once inside, your handle is all anyone knows.
      </div>
    </div>
  );
}

function SignupPresence({ midBreath = false }) {
  // The visual moment: pulsing ember + "breathe with the ember"
  const scale = midBreath ? 1.18 : 1;
  return (
    <div style={{ height: '100%', padding: '70px 36px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="smallcaps" style={{ alignSelf: 'flex-start', color: '#6b6259' }}>step 2 · 3</div>
      <div style={{ marginTop: 30, textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 22, color: '#f4ede4', letterSpacing: '-0.005em', marginBottom: 6 }}>
          Breathe with the ember.
        </div>
        <div style={{ fontSize: 13, color: '#a89c8c', fontWeight: 300 }}>five seconds. that's all.</div>
      </div>

      {/* the breathing ember */}
      <div style={{
        flex: 1, width: '100%', position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginTop: 20,
      }}>
        <EmberParticles count={9} area={{ w: 320, h: 360 }} seed={5} intensity={midBreath ? 1 : 0.4} />
        <div className="ember-breath" style={{
          width: 140, height: 140, borderRadius: '50%',
          background: 'radial-gradient(circle at 50% 55%, #ffd96e 0%, #ff8c42 28%, #ff6b1a 50%, #9c2f0a 70%, transparent 85%)',
          filter: 'blur(0.5px)',
          transform: `scale(${scale})`,
        }} />
      </div>

      <div style={{
        width: '100%', height: 4, borderRadius: 2,
        background: 'rgba(244,237,228,0.06)', overflow: 'hidden', marginTop: 20,
      }}>
        <div style={{
          width: midBreath ? '62%' : '20%', height: '100%',
          background: 'linear-gradient(90deg, #ff6b1a, #ffd96e)',
          boxShadow: '0 0 12px rgba(255,140,66,0.6)',
          transition: 'width 600ms',
        }} />
      </div>
      <div style={{ marginTop: 14, fontSize: 11, color: '#6b6259', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        {midBreath ? 'inhale · 2.4s' : 'inhale · 0.8s'}
      </div>
    </div>
  );
}

function SignupHandle() {
  return (
    <div style={{ height: '100%', padding: '90px 36px 40px', display: 'flex', flexDirection: 'column' }}>
      <div className="smallcaps" style={{ marginBottom: 'auto', color: '#6b6259' }}>step 3 · 3</div>
      <div style={{ textAlign: 'center', marginBottom: 'auto' }}>
        <div className="smallcaps" style={{ marginBottom: 18, color: '#ff8c42' }}>
          ◦ verified human · welcome
        </div>
        <div style={{ fontFamily: 'var(--sans)', fontSize: 13, color: '#a89c8c', marginBottom: 32, fontWeight: 300 }}>
          you are now
        </div>
        <div style={{
          fontFamily: 'var(--serif)', fontSize: 44, lineHeight: 1, color: '#f4ede4',
          letterSpacing: '-0.02em', fontWeight: 500,
          textShadow: '0 0 40px rgba(255,140,66,0.25)',
        }}>
          Terse<span style={{ color: '#ff8c42', fontStyle: 'italic', fontWeight: 400 }}>Snake</span>
        </div>
        <div style={{ fontSize: 12, color: '#6b6259', marginTop: 16, fontFamily: 'var(--serif)', fontStyle: 'italic' }}>
          assigned at the door. yours until you leave.
        </div>
      </div>

      <button style={{
        width: '100%', border: 'none', padding: '16px 28px', borderRadius: 999,
        background: '#ff6b1a', color: '#0a0706',
        fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 600, letterSpacing: '0.02em',
        boxShadow: '0 0 32px -4px rgba(255,107,26,0.55), 0 0 80px -10px rgba(255,107,26,0.35)',
      }}>enter the room</button>
    </div>
  );
}

Object.assign(window, { SignupEmail, SignupPresence, SignupHandle });
