"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

const DURATION = 60; // seconds

type Chapter = {
  start: number;
  end: number;
  title: string;
  blurb: string;
};

const CHAPTERS: Chapter[] = [
  { start: 0, end: 12, title: "The pitch", blurb: "Pay for the roast you deserve." },
  { start: 12, end: 28, title: "Post a request", blurb: "Scenario in, bounty attached, AI drafts a reference roast." },
  { start: 28, end: 46, title: "Roasters compete", blurb: "Verified humans submit. You watch them stack up." },
  { start: 46, end: 60, title: "Pick the top three", blurb: "50 / 30 / 20 split. Winners climb the leaderboard." },
];

function fmt(t: number) {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function LoomDemo() {
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [speed, setSpeed] = useState(1);
  const raf = useRef<number | null>(null);
  const last = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) {
      if (raf.current) cancelAnimationFrame(raf.current);
      last.current = null;
      return;
    }
    const tick = (now: number) => {
      if (last.current == null) last.current = now;
      const dt = (now - last.current) / 1000;
      last.current = now;
      setT((prev) => {
        const next = prev + dt * speed;
        return next >= DURATION ? 0 : next;
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      last.current = null;
    };
  }, [playing, speed]);

  const seek = useCallback((time: number) => {
    setT(Math.max(0, Math.min(DURATION, time)));
  }, []);

  const onScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    seek(pct * DURATION);
  };

  const activeChapter = CHAPTERS.findIndex((c) => t >= c.start && t < c.end);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {/* Player */}
      <div className="card-lg overflow-hidden">
        <div className="relative aspect-video bg-[oklch(18%_0.01_60)]">
          {/* Faux browser chrome on the recorded "screen" */}
          <BrowserChrome t={t} />

          {/* Scenes */}
          <div className="absolute inset-x-0 bottom-0 top-9 overflow-hidden bg-paper">
            <SceneOne t={t} />
            <SceneTwo t={t} />
            <SceneThree t={t} />
            <SceneFour t={t} />
          </div>

          {/* Webcam bubble */}
          <WebcamBubble t={t} muted={muted} />

          {/* Click-to-toggle overlay */}
          <button
            type="button"
            aria-label={playing ? "Pause" : "Play"}
            onClick={() => setPlaying((p) => !p)}
            className="absolute inset-0 z-10 flex items-center justify-center"
          >
            {!playing && (
              <span className="grid h-20 w-20 place-items-center rounded-full bg-white/90 text-ink shadow-card-lg backdrop-blur transition hover:scale-105">
                <PlayIcon />
              </span>
            )}
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-2 border-t border-rule bg-card px-4 py-3">
          <div
            onClick={onScrub}
            className="group relative h-2 cursor-pointer rounded-full bg-soft"
            role="slider"
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={DURATION}
            aria-valuenow={Math.round(t)}
          >
            {/* Chapter ticks */}
            {CHAPTERS.slice(1).map((c) => (
              <span
                key={c.start}
                className="absolute top-0 h-2 w-px bg-rule"
                style={{ left: `${(c.start / DURATION) * 100}%` }}
              />
            ))}
            <span
              className="absolute inset-y-0 left-0 rounded-full bg-ember"
              style={{ width: `${(t / DURATION) * 100}%` }}
            />
            <span
              className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember shadow ring-2 ring-card"
              style={{ left: `${(t / DURATION) * 100}%` }}
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              className="grid h-9 w-9 place-items-center rounded-full bg-ember text-white hover:bg-ember-deep"
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? <PauseIcon /> : <PlayIcon small />}
            </button>
            <button
              type="button"
              onClick={() => seek(0)}
              className="text-mute hover:text-ink"
              aria-label="Restart"
              title="Restart"
            >
              <RestartIcon />
            </button>
            <span className="text-xs font-medium text-mute tnum tabular-nums">
              {fmt(t)} / {fmt(DURATION)}
            </span>
            <span className="ml-2 hidden text-xs text-mute md:inline">
              {activeChapter >= 0 ? CHAPTERS[activeChapter].title : ""}
            </span>
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setSpeed((s) => (s === 1 ? 1.5 : s === 1.5 ? 2 : s === 2 ? 0.5 : 1))
                }
                className="rounded-full border border-rule px-2.5 py-1 text-xs font-medium text-ink hover:border-ink"
              >
                {speed}×
              </button>
              <button
                type="button"
                onClick={() => setMuted((m) => !m)}
                className="grid h-8 w-8 place-items-center rounded-full text-mute hover:text-ink"
                aria-label={muted ? "Unmute" : "Mute"}
                title={muted ? "Unmute" : "Mute"}
              >
                {muted ? <MutedIcon /> : <SoundIcon />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Side panel */}
      <aside className="flex flex-col gap-4">
        <div className="card p-5">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-mute">
            Now playing
          </p>
          <p className="display mt-2 text-2xl text-ink">
            {activeChapter >= 0 ? CHAPTERS[activeChapter].title : "Roastpilot"}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-mute">
            {activeChapter >= 0
              ? CHAPTERS[activeChapter].blurb
              : "A 60-second tour."}
          </p>
        </div>

        <ol className="card divide-y divide-rule overflow-hidden">
          {CHAPTERS.map((c, i) => {
            const active = i === activeChapter;
            return (
              <li key={c.start}>
                <button
                  type="button"
                  onClick={() => seek(c.start + 0.01)}
                  className={`group flex w-full items-start gap-3 px-4 py-3 text-left transition ${
                    active ? "bg-[color:var(--color-ember-soft)]" : "hover:bg-soft"
                  }`}
                >
                  <span
                    className={`display mt-0.5 w-6 text-lg tnum tabular-nums ${
                      active ? "text-ember" : "text-mute"
                    }`}
                  >
                    {(i + 1).toString().padStart(2, "0")}
                  </span>
                  <span className="flex-1">
                    <span
                      className={`block text-sm font-medium ${
                        active ? "text-ember-deep" : "text-ink"
                      }`}
                    >
                      {c.title}
                    </span>
                    <span className="mt-0.5 block text-xs text-mute tnum tabular-nums">
                      {fmt(c.start)} – {fmt(c.end)}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="flex flex-col gap-2">
          <Link
            href="/request"
            className="rounded-full bg-ember px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-ember-deep"
          >
            Try it — request a roast
          </Link>
          <Link
            href="/browse"
            className="rounded-full border border-rule bg-card px-4 py-2.5 text-center text-sm font-medium text-ink hover:border-ink"
          >
            Browse open bounties
          </Link>
        </div>
      </aside>
    </div>
  );
}

/* ---------- player chrome ---------- */

function BrowserChrome({ t }: { t: number }) {
  const url =
    t < 12
      ? "roastpilot.app"
      : t < 28
      ? "roastpilot.app/request"
      : t < 46
      ? "roastpilot.app/r/case-1024"
      : "roastpilot.app/leaderboard";
  return (
    <div className="absolute inset-x-0 top-0 z-[5] flex h-9 items-center gap-2 border-b border-black/30 bg-[oklch(22%_0.01_60)] px-3 text-xs text-white/70">
      <span className="h-2.5 w-2.5 rounded-full bg-[oklch(70%_0.18_28)]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[oklch(82%_0.16_90)]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[oklch(72%_0.17_145)]" />
      <span className="ml-3 truncate rounded-md bg-black/30 px-2 py-0.5 font-mono text-[11px]">
        {url}
      </span>
    </div>
  );
}

function WebcamBubble({ t, muted }: { t: number; muted: boolean }) {
  // gentle bob
  const bob = Math.sin(t * 1.4) * 1.5;
  return (
    <div className="absolute bottom-4 left-4 z-20">
      <div className="relative">
        <div
          className="absolute inset-0 -m-1 rounded-full bg-ember/40 blur-md"
          style={{ animation: "rp-pulse 1.6s ease-in-out infinite" }}
        />
        <div
          className="relative grid h-20 w-20 place-items-center overflow-hidden rounded-full ring-2 ring-white shadow-card-lg"
          style={{
            transform: `translateY(${bob}px)`,
            background:
              "radial-gradient(120% 120% at 30% 30%, oklch(78% .12 38) 0%, oklch(56% .20 32) 60%, oklch(40% .15 30) 100%)",
          }}
        >
          {/* Stylized presenter avatar */}
          <svg viewBox="0 0 64 64" className="h-full w-full">
            <circle cx="32" cy="26" r="11" fill="oklch(96% 0.03 60)" />
            <path
              d="M10 60c2-12 12-18 22-18s20 6 22 18z"
              fill="oklch(96% 0.03 60)"
            />
            <circle cx="28" cy="25" r="1.6" fill="oklch(22% 0.02 60)" />
            <circle cx="36" cy="25" r="1.6" fill="oklch(22% 0.02 60)" />
            <path
              d="M27 31c1.5 1.5 3.2 2.2 5 2.2s3.5-.7 5-2.2"
              stroke="oklch(22% 0.02 60)"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>
        {/* Mic indicator */}
        <span className="absolute -right-1 -bottom-1 grid h-6 w-6 place-items-center rounded-full bg-card ring-2 ring-white shadow-card">
          {muted ? <MutedIcon small /> : <SoundIcon small />}
        </span>
      </div>
      <style>{`@keyframes rp-pulse { 0%,100% { opacity:.4; transform:scale(1);} 50% { opacity:.7; transform:scale(1.08);} }`}</style>
    </div>
  );
}

/* ---------- scenes ---------- */

function visible(t: number, start: number, end: number) {
  const fadeIn = 0.6;
  const fadeOut = 0.6;
  if (t < start - fadeIn || t > end + fadeOut) return 0;
  if (t < start) return (t - (start - fadeIn)) / fadeIn;
  if (t > end) return 1 - (t - end) / fadeOut;
  return 1;
}

function SceneWrap({
  t,
  start,
  end,
  children,
}: {
  t: number;
  start: number;
  end: number;
  children: React.ReactNode;
}) {
  const o = visible(t, start, end);
  if (o === 0) return null;
  return (
    <div
      className="absolute inset-0"
      style={{ opacity: o, transition: "opacity 120ms linear" }}
    >
      {children}
    </div>
  );
}

function SceneOne({ t }: { t: number }) {
  const local = Math.max(0, t - 0); // 0..12
  return (
    <SceneWrap t={t} start={0} end={12}>
      <div className="flex h-full flex-col items-start justify-center px-10 md:px-16">
        <p
          className="text-xs font-medium uppercase tracking-[0.16em] text-ember opacity-0"
          style={{ animation: "rp-fadeUp .6s .1s both" }}
        >
          Roast as a Service
        </p>
        <h2
          className="display mt-3 max-w-3xl text-4xl leading-[0.95] text-ink md:text-6xl opacity-0"
          style={{ animation: "rp-fadeUp .7s .35s both" }}
        >
          Pay for the roast you{" "}
          <span className="text-ember">deserve.</span>
        </h2>
        <p
          className="mt-5 max-w-xl text-sm text-mute md:text-base opacity-0"
          style={{ animation: "rp-fadeUp .7s .8s both" }}
        >
          Real scenarios. Real bounties. Verified humans only.
        </p>
        <div
          className="mt-7 flex gap-2 opacity-0"
          style={{ animation: "rp-fadeUp .6s 1.4s both" }}
        >
          <span className="rounded-full bg-ember px-4 py-2 text-xs font-medium text-white">
            Request a roast
          </span>
          <span className="rounded-full border border-rule bg-card px-4 py-2 text-xs font-medium text-ink">
            Browse open bounties →
          </span>
        </div>

        {/* Stat row, slides in late */}
        <div
          className="mt-10 grid w-full max-w-md grid-cols-3 gap-3 opacity-0"
          style={{ animation: "rp-fadeUp .6s 2.2s both" }}
        >
          {[
            { l: "Cases", v: 482 },
            { l: "Roasts", v: 2104 },
            { l: "Roasters", v: 137 },
          ].map((s, i) => (
            <div key={s.l} className="border-l-2 border-ember pl-3">
              <div className="display text-2xl text-ink tnum">
                <Counter to={s.v} delay={2400 + i * 150} active={local > 2} />
              </div>
              <div className="text-[10px] uppercase tracking-[0.14em] text-mute">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes rp-fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </SceneWrap>
  );
}

function Counter({ to, active }: { to: number; delay?: number; active: boolean }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 900);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, to]);
  return <>{v.toLocaleString()}</>;
}

function SceneTwo({ t }: { t: number }) {
  const local = t - 12; // 0..16
  const scenarioFull =
    "AITA for telling my coworker his sourdough tastes like wet cardboard during the company bake-off?";
  const typedLen = Math.min(
    scenarioFull.length,
    Math.max(0, Math.floor((local - 0.8) / 0.04))
  );
  const typed = scenarioFull.slice(0, typedLen);
  const bounty = Math.min(50, Math.max(0, Math.floor((local - 8) * 18)));
  const aiVisible = local > 11;

  return (
    <SceneWrap t={t} start={12} end={28}>
      <div className="grid h-full grid-cols-[1.2fr_1fr] gap-6 px-8 py-8 md:px-12">
        <div className="card flex flex-col gap-4 p-6">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-mute">
            New request
          </p>
          <label className="text-xs font-medium text-ink">Scenario</label>
          <div className="min-h-[120px] rounded-lg border border-rule bg-soft p-3 text-sm text-ink">
            {typed}
            <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 bg-ember align-middle" style={{ animation: "rp-blink 1s steps(1) infinite" }} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-ink">Category</label>
              <div className="mt-1 rounded-lg border border-rule bg-soft px-3 py-2 text-sm text-ink">
                Workplace
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-ink">Bounty</label>
              <div className="mt-1 flex items-center justify-between rounded-lg border border-rule bg-soft px-3 py-2 text-sm">
                <span className="text-ink tnum">${bounty}</span>
                <span className="text-xs text-mute">USD · Stripe</span>
              </div>
            </div>
          </div>
          <div className="mt-2 flex justify-end">
            <span
              className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                local > 14
                  ? "bg-ember text-white"
                  : "bg-soft text-mute"
              }`}
            >
              {local > 14 ? "Posted ✓" : "Post request"}
            </span>
          </div>
        </div>

        <div className="card flex flex-col gap-3 p-6">
          <div className="flex items-center gap-2">
            <span className="text-base">✨</span>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-mute">
              AI reference roast
            </p>
          </div>
          <div
            className="min-h-[160px] rounded-lg bg-[color:var(--color-ember-soft)] p-3 text-sm leading-relaxed text-ink"
            style={{
              opacity: aiVisible ? 1 : 0.3,
              transition: "opacity .3s",
            }}
          >
            {aiVisible ? (
              <TypedText
                text='"Bringing wet cardboard to a bake-off is a personality, not a recipe. Calling it out is a public service. NTA."'
                speed={0.025}
                local={local - 11}
              />
            ) : (
              <span className="text-mute">drafting…</span>
            )}
          </div>
          <p className="text-[11px] text-mute">
            For inspiration only. The humans do the cutting.
          </p>
        </div>
      </div>
      <style>{`@keyframes rp-blink { 50% { opacity: 0; } }`}</style>
    </SceneWrap>
  );
}

function TypedText({
  text,
  speed,
  local,
}: {
  text: string;
  speed: number;
  local: number;
}) {
  const len = Math.min(text.length, Math.max(0, Math.floor(local / speed)));
  return <>{text.slice(0, len)}</>;
}

function SceneThree({ t }: { t: number }) {
  const local = t - 28; // 0..18
  const roasts = [
    {
      who: "@ashes.sol",
      body: "Sourdough discourse is the last refuge of a man with no inner monologue. NTA.",
    },
    {
      who: "@kindling.sol",
      body: "Telling the truth at a corporate bake-off is misconduct in HR's eyes and heroism in mine.",
    },
    {
      who: "@scorch.sol",
      body: "If his bread couldn't take the heat, he shouldn't have proofed in the conference room.",
    },
    {
      who: "@cinder.sol",
      body: "The real crime here is the bake-off existing. NAH, but everyone's HR file thickens.",
    },
  ];

  return (
    <SceneWrap t={t} start={28} end={46}>
      <div className="grid h-full grid-cols-[1.4fr_1fr] gap-6 px-8 py-7 md:px-12">
        <div className="flex flex-col gap-3">
          <div className="card p-4">
            <div className="flex items-center justify-between text-xs text-mute">
              <span className="font-medium text-ink tnum">Case #1024</span>
              <span className="rounded-full bg-[color:var(--color-ember-soft)] px-2 py-0.5 text-[11px] font-medium text-ember-deep">
                $50
              </span>
            </div>
            <p className="mt-2 text-sm text-ink">
              AITA for telling my coworker his sourdough tastes like wet
              cardboard during the company bake-off?
            </p>
          </div>

          <div className="flex flex-1 flex-col gap-2 overflow-hidden">
            {roasts.map((r, i) => {
              const appear = i * 2.5 + 1.2;
              const v = local - appear;
              if (v < -0.4) return null;
              const op = Math.max(0, Math.min(1, v / 0.5));
              const ty = Math.max(0, (1 - op)) * 10;
              return (
                <div
                  key={r.who}
                  className="card p-4"
                  style={{
                    opacity: op,
                    transform: `translateY(${ty}px)`,
                  }}
                >
                  <div className="mb-1 flex items-center gap-2 text-xs">
                    <span
                      className="grid h-6 w-6 place-items-center rounded-full text-[10px] font-medium text-white"
                      style={{
                        background: `oklch(70% 0.15 ${30 + i * 50})`,
                      }}
                    >
                      {r.who[1]?.toUpperCase()}
                    </span>
                    <span className="font-medium text-ink">{r.who}</span>
                    <span className="text-mute">verified ✓</span>
                  </div>
                  <p className="text-sm leading-relaxed text-ink">{r.body}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-mute">
                    <span>🔥 {12 + i * 7}</span>
                    <span>· {Math.max(1, 8 - i)}m ago</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card flex flex-col gap-3 p-5">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-mute">
            Live activity
          </p>
          <ul className="flex flex-col gap-2 text-xs text-mute">
            {[
              "@ashes.sol submitted",
              "@kindling.sol submitted",
              "+12 viewers",
              "@scorch.sol submitted",
              "@cinder.sol submitted",
            ].map((line, i) => {
              const v = local - (i * 2.4 + 0.8);
              if (v < 0) return null;
              const op = Math.max(0, Math.min(1, v / 0.4));
              return (
                <li
                  key={line}
                  className="flex items-center gap-2"
                  style={{ opacity: op }}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-ember" />
                  <span>{line}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </SceneWrap>
  );
}

function SceneFour({ t }: { t: number }) {
  const local = t - 46; // 0..14
  const winners = [
    { rank: 1, who: "@ashes.sol", split: "50%", points: 2500, color: "oklch(68% 0.19 38)" },
    { rank: 2, who: "@scorch.sol", split: "30%", points: 1500, color: "oklch(72% 0.10 200)" },
    { rank: 3, who: "@kindling.sol", split: "20%", points: 1000, color: "oklch(60% 0.16 305)" },
  ];

  return (
    <SceneWrap t={t} start={46} end={60}>
      <div className="grid h-full grid-cols-[1fr_1.1fr] gap-6 px-8 py-7 md:px-12">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-mute">
            Top 3 selected
          </p>
          {winners.map((w, i) => {
            const v = local - i * 0.6;
            const op = Math.max(0, Math.min(1, v / 0.4));
            return (
              <div
                key={w.rank}
                className="card flex items-center gap-3 p-4"
                style={{
                  opacity: op,
                  transform: `translateY(${(1 - op) * 8}px)`,
                  borderColor: i === 0 ? w.color : undefined,
                }}
              >
                <span
                  className="display text-3xl tnum tabular-nums"
                  style={{ color: w.color }}
                >
                  {w.rank}
                </span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-ink">{w.who}</div>
                  <div className="text-xs text-mute">
                    {w.split} of bounty
                  </div>
                </div>
                <span
                  className="rounded-full px-3 py-1 text-xs font-medium text-white"
                  style={{ background: w.color }}
                >
                  🔥 +{w.points.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>

        <div className="card flex flex-col gap-2 p-5">
          <div className="flex items-baseline justify-between">
            <p className="display text-xl text-ink">Leaderboard</p>
            <span className="text-xs text-mute">All time</span>
          </div>
          <ul className="mt-2 divide-y divide-rule">
            {[
              { who: "@ashes.sol", pts: 18450, wins: 24, hl: true },
              { who: "@scorch.sol", pts: 12100, wins: 17, hl: true },
              { who: "@kindling.sol", pts: 9800, wins: 14, hl: true },
              { who: "@ember.sol", pts: 8420, wins: 11 },
              { who: "@flint.sol", pts: 7110, wins: 9 },
            ].map((row, i) => {
              const v = local - (4 + i * 0.4);
              const op = Math.max(0, Math.min(1, v / 0.4));
              return (
                <li
                  key={row.who}
                  className="flex items-center gap-3 py-2"
                  style={{ opacity: row.hl ? 1 : op }}
                >
                  <span
                    className={`display w-5 text-base tnum tabular-nums ${
                      row.hl ? "text-ember" : "text-mute"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span
                    className={`flex-1 text-sm ${
                      row.hl ? "font-medium text-ink" : "text-mute"
                    }`}
                  >
                    {row.who}
                  </span>
                  <span className="text-xs text-mute tnum">{row.wins}w</span>
                  <span
                    className={`text-sm tnum ${
                      row.hl ? "font-medium text-ember" : "text-mute"
                    }`}
                  >
                    🔥 {row.pts.toLocaleString()}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-center text-xs text-mute">
            Roastpoints climb. Bounties keep coming. Roast on.
          </p>
        </div>
      </div>
    </SceneWrap>
  );
}

/* ---------- icons ---------- */

function PlayIcon({ small }: { small?: boolean }) {
  const s = small ? 14 : 28;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  );
}
function RestartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </svg>
  );
}
function MutedIcon({ small }: { small?: boolean }) {
  const s = small ? 12 : 16;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5 6 9H2v6h4l5 4z" />
      <line x1="22" y1="9" x2="16" y2="15" />
      <line x1="16" y1="9" x2="22" y2="15" />
    </svg>
  );
}
function SoundIcon({ small }: { small?: boolean }) {
  const s = small ? 12 : 16;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5 6 9H2v6h4l5 4z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M19 5a9 9 0 0 1 0 14" />
    </svg>
  );
}
