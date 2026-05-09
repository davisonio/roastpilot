// Roast — shared visual primitives.
// Flames, ember icons, particles, glow blobs, mobile/desktop frame wrappers.

// ── Mobile frame: dark phone with no nav chrome (we draw our own) ──
function RoastPhone({ children, time = '12:47', width = 390, height = 780, statusDark = false }) {
  return (
    <div style={{
      width, height, borderRadius: 44, overflow: 'hidden', position: 'relative',
      background: '#0a0706',
      boxShadow: '0 30px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(40,30,25,0.6), inset 0 0 0 6px #0a0706, inset 0 0 0 7px rgba(80,60,50,0.5)',
    }}>
      {/* dynamic island */}
      <div style={{
        position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
        width: 110, height: 33, borderRadius: 22, background: '#000', zIndex: 50,
      }} />
      {/* status bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
        height: 50, padding: '15px 28px 0', display: 'flex',
        justifyContent: 'space-between', alignItems: 'flex-start',
        fontFamily: '-apple-system, "SF Pro", system-ui', fontWeight: 600,
        fontSize: 15, color: statusDark ? '#000' : '#f4ede4',
      }}>
        <span>{time}</span>
        <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="0.5"/><rect x="4.5" y="5" width="3" height="6" rx="0.5"/><rect x="9" y="2.5" width="3" height="8.5" rx="0.5"/><rect x="13.5" y="0" width="3" height="11" rx="0.5"/></svg>
          <svg width="24" height="11" viewBox="0 0 24 11"><rect x="0.5" y="0.5" width="20" height="10" rx="3" stroke="currentColor" strokeOpacity="0.45" fill="none"/><rect x="2" y="2" width="17" height="7" rx="1.5" fill="currentColor"/></svg>
        </span>
      </div>
      {/* content */}
      <div className="roast-app roast-vignette" style={{ width: '100%', height: '100%' }}>
        {children}
      </div>
      {/* home indicator */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 60,
        height: 28, display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
        paddingBottom: 7, pointerEvents: 'none',
      }}>
        <div style={{ width: 130, height: 4.5, borderRadius: 100, background: 'rgba(244,237,228,0.55)' }} />
      </div>
    </div>
  );
}

// ── Desktop frame: thin warm browser chrome over dark canvas ──
function RoastDesktop({ children, width = 1280, height = 800, url = 'roast.club' }) {
  return (
    <div style={{
      width, height, borderRadius: 12, overflow: 'hidden', position: 'relative',
      background: '#0a0706',
      boxShadow: '0 40px 100px rgba(0,0,0,0.5), 0 0 0 1px rgba(40,30,25,0.6)',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        height: 36, background: '#15110f', borderBottom: '1px solid rgba(40,30,25,0.6)',
        display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10, flexShrink: 0,
      }}>
        <div style={{ display: 'flex', gap: 7 }}>
          <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#3a2a25' }} />
          <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#3a2a25' }} />
          <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#3a2a25' }} />
        </div>
        <div style={{
          marginLeft: 18, padding: '4px 14px', borderRadius: 6,
          background: 'rgba(244,237,228,0.04)', color: '#a89c8c',
          fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.04em',
        }}>{url}</div>
      </div>
      <div className="roast-app roast-vignette" style={{ flex: 1, overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}

// ── Ember dot icon (the heat indicator) ──
function EmberDot({ size = 10, heat = 2 }) {
  // heat 0 = slate, 1..4 = ember progression
  const colors = ['#5c6878', '#ff6b1a', '#ff8c42', '#ffb347', '#ffd96e'];
  const glow = ['rgba(92,104,120,0.30)', 'rgba(255,107,26,0.45)', 'rgba(255,140,66,0.55)', 'rgba(255,179,71,0.65)', 'rgba(255,217,110,0.75)'];
  const c = colors[Math.max(0, Math.min(4, heat))];
  const g = glow[Math.max(0, Math.min(4, heat))];
  return (
    <span style={{
      display: 'inline-block', width: size, height: size, borderRadius: '50%',
      background: `radial-gradient(circle at 35% 35%, ${c}, ${c} 55%, ${heat === 0 ? c : '#9c2f0a'} 100%)`,
      boxShadow: heat === 0
        ? 'none'
        : `0 0 ${size * 0.8}px ${size * 0.15}px ${g}, inset 0 0 ${size * 0.4}px rgba(255,217,110,${0.35 + heat * 0.1})`,
      verticalAlign: 'middle',
    }} />
  );
}

// ── A single CSS/SVG flame shape ──
// Size scales with rank; shape is two stacked teardrops (outer warm, inner bright).
function Flame({ size = 56, intensity = 4, animated = true }) {
  // intensity 0..4 — determines colors and animation
  const outerHues = [
    ['#5c6878', '#3a4451'],   // 0 ember (just embers)
    ['#ff6b1a', '#9c2f0a'],
    ['#ff8c42', '#c44511'],
    ['#ffb347', '#e36016'],
    ['#ffd96e', '#ff8c42'],
  ];
  const inner = ['#a89c8c', '#ffb347', '#ffd96e', '#fff5b8', '#fffbe6'][intensity];
  const [outer, deep] = outerHues[intensity];
  const w = size, h = size * 1.35;
  const animClass = !animated ? '' : intensity >= 3 ? 'flame-anim' : 'flame-anim-slow';

  // for "ember only" rank — render coals instead of a flame
  if (intensity === 0) {
    return (
      <svg width={w} height={h} viewBox={`0 0 40 54`} style={{ display: 'block' }}>
        <ellipse cx="14" cy="44" rx="6" ry="3" fill="#3a2a25" />
        <ellipse cx="26" cy="46" rx="7" ry="3" fill="#2c211d" />
        <ellipse cx="20" cy="42" rx="5" ry="2.2" fill="#5c4034" opacity="0.8" />
        <circle cx="13" cy="43" r="1.4" fill="#ff6b1a" opacity="0.85" />
        <circle cx="24" cy="44" r="1.1" fill="#ffb347" opacity="0.7" />
      </svg>
    );
  }

  const flameId = 'fl' + Math.random().toString(36).slice(2, 8);
  return (
    <svg width={w} height={h} viewBox="0 0 40 54" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <radialGradient id={`${flameId}-outer`} cx="50%" cy="80%" r="60%">
          <stop offset="0%"  stopColor={outer} />
          <stop offset="60%" stopColor={outer} stopOpacity="0.85" />
          <stop offset="100%" stopColor={deep} stopOpacity="0.0" />
        </radialGradient>
        <radialGradient id={`${flameId}-inner`} cx="50%" cy="85%" r="55%">
          <stop offset="0%"  stopColor={inner} />
          <stop offset="60%" stopColor={inner} stopOpacity="0.8" />
          <stop offset="100%" stopColor={outer} stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* glow halo */}
      <ellipse cx="20" cy="42" rx={10 + intensity * 2} ry={14 + intensity * 3}
        fill={outer} opacity={0.18 + intensity * 0.04} style={{ filter: 'blur(6px)' }} />
      <g className={animClass}>
        {/* outer flame */}
        <path d="M20 4 C 8 18, 6 32, 11 42 C 13 48, 16 51, 20 51 C 24 51, 27 48, 29 42 C 34 32, 32 18, 20 4 Z"
          fill={`url(#${flameId}-outer)`} />
        {/* inner flame */}
        <path d="M20 16 C 14 24, 13 34, 16 42 C 17.5 47, 19 49, 20 49 C 21 49, 22.5 47, 24 42 C 27 34, 26 24, 20 16 Z"
          fill={`url(#${flameId}-inner)`} />
        {/* hot core */}
        <ellipse cx="20" cy="44" rx="2.5" ry="4" fill="#fffbe6" opacity="0.9" />
      </g>
      {/* base coal */}
      <ellipse cx="20" cy="51" rx="6" ry="1.5" fill="#1a0e08" opacity="0.7" />
    </svg>
  );
}

// ── Ember icon: a small glyph indicating heat. Used on cards and meta. ──
function EmberGlyph({ size = 14, heat = 2 }) {
  // tighter version of Flame for inline use
  const colors = ['#5c6878', '#ff6b1a', '#ff8c42', '#ffb347', '#ffd96e'];
  const c = colors[Math.max(0, Math.min(4, heat))];
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 14 18" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M7 1 C 3 7, 2 11, 4 14 C 5 16.5, 6 17, 7 17 C 8 17, 9 16.5, 10 14 C 12 11, 11 7, 7 1 Z"
        fill={c} opacity={heat === 0 ? 0.65 : 0.95} />
      {heat > 0 && <ellipse cx="7" cy="14" rx="1.4" ry="2.2" fill="#fffbe6" opacity="0.85" />}
    </svg>
  );
}

// ── Static ember particle field (used in the ignition still and signup) ──
function EmberParticles({ count = 7, area = { w: 320, h: 260 }, seed = 1, intensity = 1 }) {
  // deterministic positions so the design canvas re-renders look identical
  const rng = (n) => { const x = Math.sin(seed * 9301 + n * 49297) * 233280; return x - Math.floor(x); };
  const parts = Array.from({ length: count }).map((_, i) => {
    const x = rng(i * 2 + 1) * area.w;
    const y = area.h - rng(i * 2 + 2) * area.h * 0.85;
    const s = 2 + rng(i * 2 + 3) * 4;
    const o = 0.45 + rng(i * 2 + 4) * 0.5;
    return { x, y, s, o };
  });
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {parts.map((p, i) => (
        <div key={i} style={{
          position: 'absolute', left: p.x, top: p.y,
          width: p.s, height: p.s, borderRadius: '50%',
          background: i % 3 === 0 ? '#ffd96e' : i % 3 === 1 ? '#ff8c42' : '#ff6b1a',
          opacity: p.o * intensity,
          boxShadow: `0 0 ${p.s * 2}px ${p.s * 0.5}px rgba(255,140,66,${0.4 * intensity}), 0 0 ${p.s * 4}px rgba(255,107,26,${0.25 * intensity})`,
        }} />
      ))}
    </div>
  );
}

// ── Filter pills used in the feed header ──
function FilterPill({ label, active = false }) {
  return (
    <span style={{
      display: 'inline-block', padding: '6px 12px', borderRadius: 999,
      fontSize: 12, letterSpacing: '0.02em',
      color: active ? '#f4ede4' : '#a89c8c',
      background: active ? 'rgba(244,237,228,0.08)' : 'transparent',
      border: `1px solid ${active ? 'rgba(244,237,228,0.14)' : 'rgba(244,237,228,0.06)'}`,
      fontFamily: 'var(--sans)', fontWeight: 400,
    }}>{label}</span>
  );
}

// ── Roast wordmark (the "R" gets a small flame spark inside the counter) ──
function Wordmark({ size = 24, color = '#f4ede4' }) {
  return (
    <span style={{
      fontFamily: 'var(--serif)', fontSize: size, fontWeight: 600, color,
      letterSpacing: '-0.01em', display: 'inline-flex', alignItems: 'center', gap: 4,
    }}>
      roast<span style={{ color: '#ff6b1a', display: 'inline-block', transform: 'translateY(-2px)' }}>.</span>
    </span>
  );
}

// ── Header bar shared across feed/leaderboard/audit ──
function AppHeader({ active = 'feed', desktop = false }) {
  const links = [
    { id: 'feed',  label: 'feed' },
    { id: 'leaderboard', label: 'leaderboard' },
    { id: 'audit', label: 'audit' },
    { id: 'profile', label: 'profile' },
  ];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: desktop ? '20px 56px' : '14px 20px',
      borderBottom: '1px solid rgba(244,237,228,0.06)',
      background: 'rgba(15,11,9,0.85)',
      backdropFilter: 'blur(12px)',
      flexShrink: 0,
    }}>
      <Wordmark size={desktop ? 22 : 19} />
      <nav style={{ display: 'flex', gap: desktop ? 28 : 16, fontSize: desktop ? 13 : 11 }}>
        {links.map(l => (
          <span key={l.id} style={{
            color: active === l.id ? '#f4ede4' : '#a89c8c',
            fontWeight: active === l.id ? 500 : 400,
            letterSpacing: '0.02em',
            position: 'relative',
            paddingBottom: 2,
            borderBottom: active === l.id ? '1px solid #ff6b1a' : '1px solid transparent',
          }}>{l.label}</span>
        ))}
      </nav>
    </div>
  );
}

Object.assign(window, {
  RoastPhone, RoastDesktop, EmberDot, Flame, EmberGlyph, EmberParticles, FilterPill, Wordmark, AppHeader,
});
