// Main canvas — assembles every screen as a DCArtboard inside a DesignCanvas.

const { useState } = React;

function App() {
  return (
    <DesignCanvas>
      {/* ─── Section 1: Landing ─── */}
      <DCSection
        id="landing"
        title="01 · Landing"
        subtitle="Members-only doorway. Massive serif breathing slowly. One ember CTA."
      >
        <DCArtboard id="landing-mobile" label="mobile" width={390} height={780}>
          <RoastPhone>
            <LandingMobile />
          </RoastPhone>
        </DCArtboard>
        <DCArtboard id="landing-desktop" label="desktop" width={1280} height={800}>
          <RoastDesktop url="roast.club">
            <LandingDesktop />
          </RoastDesktop>
        </DCArtboard>
      </DCSection>

      {/* ─── Section 2: Sign-up / presence check ─── */}
      <DCSection
        id="signup"
        title="02 · Sign-up · presence check"
        subtitle="Three steps, single column. The middle screen is the visual moment — breathe with the ember."
      >
        <DCArtboard id="signup-1" label="step 1 · email" width={390} height={780}>
          <RoastPhone time="12:47">
            <SignupEmail />
          </RoastPhone>
        </DCArtboard>
        <DCArtboard id="signup-2a" label="step 2 · breathing in" width={390} height={780}>
          <RoastPhone time="12:48">
            <SignupPresence midBreath={false} />
          </RoastPhone>
        </DCArtboard>
        <DCArtboard id="signup-2b" label="step 2 · mid-breath" width={390} height={780}>
          <RoastPhone time="12:48">
            <SignupPresence midBreath={true} />
          </RoastPhone>
        </DCArtboard>
        <DCArtboard id="signup-3" label="step 3 · handle" width={390} height={780}>
          <RoastPhone time="12:48">
            <SignupHandle />
          </RoastPhone>
        </DCArtboard>
      </DCSection>

      {/* ─── Section 3: Feed ─── */}
      <DCSection
        id="feed"
        title="03 · Feed"
        subtitle="One column, generous spacing. Each card glows at its current heat — slate for cool, ember for hot."
      >
        <DCArtboard id="feed-mobile" label="mobile" width={390} height={780}>
          <RoastPhone>
            <FeedMobile />
          </RoastPhone>
        </DCArtboard>
        <DCArtboard id="feed-desktop" label="desktop" width={1280} height={900}>
          <RoastDesktop url="roast.club/feed">
            <FeedDesktop />
          </RoastDesktop>
        </DCArtboard>
      </DCSection>

      {/* ─── Section 4: Post detail / swipe deck ─── */}
      <DCSection
        id="detail"
        title="04 · Post detail · swipe deck"
        subtitle="The hero. Post being judged at top, roast deck below, composer pinned. Right swipe ignites."
      >
        <DCArtboard id="detail-default" label="mid-drag · right" width={390} height={820}>
          <RoastPhone>
            <PostDetailMobile />
          </RoastPhone>
        </DCArtboard>
        <DCArtboard id="detail-ignition" label="ignition frame" width={390} height={820}>
          <RoastPhone>
            <PostDetailMobile ignition />
          </RoastPhone>
        </DCArtboard>
        <DCArtboard id="detail-empty" label="deck empty" width={390} height={820}>
          <RoastPhone>
            <PostDetailEmpty />
          </RoastPhone>
        </DCArtboard>
      </DCSection>

      {/* ─── Section 5: Leaderboard ─── */}
      <DCSection
        id="leaderboard"
        title="05 · Leaderboard"
        subtitle="‘The room remembers.’ Top three flames crackle; ranks 8-10 are just embers."
      >
        <DCArtboard id="leaderboard-mobile" label="mobile" width={390} height={840}>
          <RoastPhone>
            <LeaderboardMobile />
          </RoastPhone>
        </DCArtboard>
        <DCArtboard id="leaderboard-desktop" label="desktop" width={1280} height={900}>
          <RoastDesktop url="roast.club/leaderboard">
            <LeaderboardDesktop />
          </RoastDesktop>
        </DCArtboard>
      </DCSection>

      {/* ─── Section 6: Audit log ─── */}
      <DCSection
        id="audit"
        title="06 · Audit log"
        subtitle="The architectural showcase. Stark contrast: a small bounded list of what crosses, against a long list of what does not."
      >
        <DCArtboard id="audit-mobile" label="mobile" width={390} height={900}>
          <RoastPhone>
            <AuditMobile />
          </RoastPhone>
        </DCArtboard>
        <DCArtboard id="audit-desktop" label="desktop" width={1280} height={1000}>
          <RoastDesktop url="roast.club/audit">
            <AuditDesktop />
          </RoastDesktop>
        </DCArtboard>
      </DCSection>

      {/* ─── Section 7: Submit a post ─── */}
      <DCSection
        id="submit"
        title="07 · Submit a post"
        subtitle="Single textarea, generous serif. Lighting the kindling on submit."
      >
        <DCArtboard id="submit-compose" label="compose" width={390} height={780}>
          <RoastPhone>
            <SubmitCompose />
          </RoastPhone>
        </DCArtboard>
        <DCArtboard id="submit-confirm" label="confirmation · kindling" width={390} height={780}>
          <RoastPhone>
            <SubmitConfirm />
          </RoastPhone>
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
