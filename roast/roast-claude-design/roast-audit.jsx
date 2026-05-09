// Screen 6: Audit log — "What crossed the boundary."
// Visually contrasting: clean, structured, monospace amber-on-dark.

const AUDIT_LINES = [
  ['14:32:07', 'roast',  'true', '0.94', 'roast',  '0x4f3a7b\u2026'],
  ['14:31:55', 'post',   'true', '0.91', 'submit', '0xa182dc\u2026'],
  ['14:31:42', 'award',  'true', '0.97', 'award',  '0x3e9f02\u2026'],
  ['14:31:18', 'roast',  'true', '0.92', 'roast',  '0x9c1844\u2026'],
  ['14:30:51', 'award',  'true', '0.95', 'award',  '0x7b22a0\u2026'],
  ['14:30:33', 'roast',  'true', '0.89', 'roast',  '0x118f3e\u2026'],
  ['14:30:08', 'signup', 'true', '0.99', 'signup', '0xc9d471\u2026'],
  ['14:29:44', 'post',   'true', '0.93', 'submit', '0x208d5a\u2026'],
  ['14:29:21', 'award',  'true', '0.96', 'award',  '0x4e6c33\u2026'],
  ['14:28:59', 'roast',  'true', '0.88', 'roast',  '0xb5e017\u2026'],
  ['14:28:32', 'roast',  'true', '0.94', 'roast',  '0x6f9442\u2026'],
  ['14:28:11', 'award',  'true', '0.97', 'award',  '0x09ab8d\u2026'],
  ['14:27:48', 'post',   'true', '0.90', 'submit', '0x52d108\u2026'],
];

function AuditLine({ row, fresh = false }) {
  const [t, action, verified, conf, scope, att] = row;
  const amber = '#ffb347';
  const dim = '#6b6259';
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '78px 78px 70px 70px 90px 1fr',
      gap: 10, padding: '4px 0',
      fontFamily: 'var(--mono)', fontSize: 11, lineHeight: 1.5,
      color: amber, opacity: fresh ? 1 : 0.85,
    }}>
      <span style={{ color: dim }}>[{t}]</span>
      <span><span style={{ color: dim }}>action:</span>{action}</span>
      <span><span style={{ color: dim }}>v:</span>{verified}</span>
      <span><span style={{ color: dim }}>c:</span>{conf}</span>
      <span><span style={{ color: dim }}>scope:</span>{scope}</span>
      <span><span style={{ color: dim }}>att:</span>{att}</span>
    </div>
  );
}

function AttestationCard() {
  const fields = [
    ['verified',       'boolean'],
    ['confidence',     '0.0 \u2014 1.0'],
    ['action_scope',   'signup | submit | roast | award'],
    ['attestation_id', 'opaque'],
    ['expiry',         'timestamp'],
    ['bound_to',       'tx ref · opaque'],
  ];
  return (
    <div style={{
      border: '1px solid rgba(255,179,71,0.2)',
      borderRadius: 6, padding: 18,
      background: 'rgba(255,179,71,0.025)',
    }}>
      <div className="smallcaps" style={{ color: '#ffb347', marginBottom: 14 }}>
        the six fields. nothing else.
      </div>
      {fields.map(([k, v], i) => (
        <div key={i} style={{
          display: 'grid', gridTemplateColumns: '130px 1fr', gap: 16,
          padding: '10px 0',
          borderTop: i ? '1px dashed rgba(255,179,71,0.12)' : 'none',
          fontFamily: 'var(--mono)', fontSize: 11,
        }}>
          <span style={{ color: '#ffb347' }}>{k}</span>
          <span style={{ color: '#a89c8c' }}>{v}</span>
        </div>
      ))}
    </div>
  );
}

function NotKnownPanel({ desktop = false }) {
  const items = [
    'who you are',
    'what you posted',
    'who roasted you',
    'what device you used',
    'where you are',
    'how you verified',
  ];
  return (
    <div style={{
      borderRadius: 6, padding: desktop ? '36px 32px' : '24px 22px',
      background: '#040302',
      border: '1px solid rgba(244,237,228,0.04)',
    }}>
      <div className="smallcaps" style={{ color: '#a89c8c', marginBottom: 18 }}>
        what we do not know
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {items.map((it, i) => (
          <li key={i} style={{
            fontFamily: 'var(--serif)', fontSize: desktop ? 28 : 20, lineHeight: 1.3,
            color: '#f4ede4', fontWeight: 400, padding: desktop ? '14px 0' : '10px 0',
            borderTop: i ? '1px solid rgba(244,237,228,0.04)' : 'none',
            letterSpacing: '-0.005em',
          }}>{it}</li>
        ))}
      </ul>
      <div style={{ marginTop: 24, fontSize: 11, color: '#6b6259', fontFamily: 'var(--serif)', fontStyle: 'italic', lineHeight: 1.5 }}>
        the verifier signs that you are a verified human acting in scope. that signature is the only thing that crosses the boundary. it cannot be inverted.
      </div>
    </div>
  );
}

function AuditMobile() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: 50, background: '#070504' }}>
      <AppHeader active="audit" />
      <div style={{ flex: 1, overflow: 'auto', padding: '32px 22px 60px' }}>
        <h1 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 28, letterSpacing: '-0.015em', margin: '0 0 8px', color: '#f4ede4', lineHeight: 1.1 }}>
          What crossed the boundary.
        </h1>
        <p style={{ fontSize: 13, color: '#a89c8c', lineHeight: 1.55, margin: '0 0 28px', fontWeight: 300 }}>
          The only things the platform learns about any action. No identities, no content, no behaviour.
        </p>

        <div className="smallcaps" style={{ color: '#ffb347', marginBottom: 10 }}>
          ◦ live · attestations
        </div>
        <div style={{
          background: '#040302', borderRadius: 6, padding: 14, marginBottom: 24,
          border: '1px solid rgba(255,179,71,0.12)', overflow: 'hidden',
        }}>
          {AUDIT_LINES.slice(0, 8).map((r, i) => (
            <AuditLine key={i} row={r} fresh={i === 0} />
          ))}
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#ffb347', marginTop: 4 }}>
            <span className="log-cursor" style={{ display: 'inline-block', width: 7, height: 12, background: '#ffb347', verticalAlign: 'middle' }} />
          </div>
        </div>

        <AttestationCard />
        <div style={{ height: 22 }} />
        <NotKnownPanel />
      </div>
    </div>
  );
}

function AuditDesktop() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#070504' }}>
      <AppHeader active="audit" desktop />
      <div style={{ flex: 1, overflow: 'auto', padding: '56px 64px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="smallcaps" style={{ marginBottom: 16, color: '#ffb347' }}>
            ◦ the boundary
          </div>
          <h1 style={{
            fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 56,
            letterSpacing: '-0.02em', color: '#f4ede4', margin: '0 0 14px', lineHeight: 1.05,
            maxWidth: 760,
          }}>
            What crossed the boundary.
          </h1>
          <p style={{ fontSize: 16, color: '#a89c8c', lineHeight: 1.55, margin: '0 0 48px', maxWidth: 600, fontWeight: 300 }}>
            These are the only things the platform learns about any action. No identities, no content, no behaviour.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 28, marginBottom: 28 }}>
            {/* feed */}
            <div>
              <div className="smallcaps" style={{ color: '#ffb347', marginBottom: 12 }}>
                ◦ live · attestations
              </div>
              <div style={{
                background: '#040302', borderRadius: 6, padding: 22, height: 360,
                border: '1px solid rgba(255,179,71,0.12)', overflow: 'hidden',
              }}>
                {AUDIT_LINES.map((r, i) => (
                  <AuditLine key={i} row={r} fresh={i === 0} />
                ))}
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#ffb347', marginTop: 6 }}>
                  <span className="log-cursor" style={{ display: 'inline-block', width: 7, height: 12, background: '#ffb347', verticalAlign: 'middle' }} />
                </div>
              </div>
            </div>
            {/* fields */}
            <AttestationCard />
          </div>

          {/* contrast panel */}
          <NotKnownPanel desktop />

          <div style={{
            marginTop: 48, fontFamily: 'var(--serif)', fontStyle: 'italic',
            fontSize: 14, color: '#6b6259', textAlign: 'center',
          }}>
            small, structured, bounded · vs · everything we never asked for
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AuditMobile, AuditDesktop });
