'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Coins,
  Database,
  Gauge,
  LockKeyhole,
  MessageSquareQuote,
  Route,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from 'lucide-react';

// ── Duplo palette ──────────────────────────────────────────────────────────
const DUPLO = ['#E3000B', '#0055B8', '#FFCB00', '#00A650'] as const;
type DuploColor = (typeof DUPLO)[number];

const SLIDE_COLORS: DuploColor[] = [
  '#E3000B', // cover
  '#0055B8', // problem
  '#FFCB00', // insight
  '#00A650', // loop
  '#E3000B', // experience
  '#0055B8', // trust
  '#FFCB00', // architecture
  '#00A650', // demo
  '#E3000B', // roadmap
  '#0055B8', // close
];

function textOn(color: DuploColor) {
  return color === '#FFCB00' ? '#1A1A1A' : '#FFFFFF';
}

// ── Data ───────────────────────────────────────────────────────────────────
type SlideId =
  | 'cover' | 'problem' | 'insight' | 'loop' | 'experience'
  | 'trust' | 'architecture' | 'demo' | 'roadmap' | 'close';

type SlideMeta = { id: SlideId; kicker: string; title: string };

const slideMeta: SlideMeta[] = [
  { id: 'cover',        kicker: 'Roast',            title: 'Get roasted. Honestly.' },
  { id: 'problem',      kicker: 'The gap',           title: 'AI is bad at honest feedback.' },
  { id: 'insight',      kicker: 'Core insight',      title: 'Accountable entry changes the room.' },
  { id: 'loop',         kicker: 'Product loop',      title: 'Roast turns vulnerable questions into ranked signal.' },
  { id: 'experience',   kicker: 'Experience',        title: 'The demo already has the full ritual.' },
  { id: 'trust',        kicker: 'Trust model',       title: 'The audit page shows what crossed the boundary.' },
  { id: 'architecture', kicker: 'Build',             title: 'Simple primitives make it shippable.' },
  { id: 'demo',         kicker: 'Live demo',         title: 'A judge can understand it in 90 seconds.' },
  { id: 'roadmap',      kicker: 'Next 48 hours',     title: 'The prototype becomes a real room.' },
  { id: 'close',        kicker: 'Close',             title: 'Social honesty needs new rules.' },
];

const stats = [
  { value: '4', label: 'feedback lanes' },
  { value: '280', label: 'characters' },
  { value: '5', label: 'heat levels' },
  { value: '6', label: 'demo routes' },
];

const principles: { label: string; text: string; icon: LucideIcon }[] = [
  { label: 'Verified entry', text: 'Every member passes a presence check before joining the room.', icon: ShieldCheck },
  { label: 'Anonymous inside', text: 'Two-word handles keep feedback honest without exposing identity.', icon: LockKeyhole },
  { label: 'Paid seriousness', text: 'A small economic gate filters for people who actually want the truth.', icon: Coins },
];

const productLoop = [
  'Post a pitch, decision, product, or personal dilemma.',
  'Receive short roasts that cut through polite noise.',
  'Heat levels turn participation into visible momentum.',
  'Points and leaderboards reward useful honesty.',
];

const routes = [
  { route: '/', label: 'Landing', detail: 'Membership promise' },
  { route: '/signup', label: 'Apply', detail: 'Entry ritual' },
  { route: '/feed', label: 'Feed', detail: 'Heat-ranked posts' },
  { route: '/post/[id]', label: 'Roast', detail: 'Composer and ignite points' },
  { route: '/leaderboard', label: 'Leaders', detail: 'Ranked value' },
  { route: '/audit', label: 'Audit', detail: 'Trust boundary' },
];

const architecture = [
  { name: 'users', copy: 'Anonymous handles' },
  { name: 'posts', copy: 'Candid prompts' },
  { name: 'roasts', copy: 'Short replies and points' },
  { name: 'audit_log', copy: 'Verified attestations' },
];

const demoPath = [
  'Frame the room: paid, verified, anonymous.',
  'Open the feed and show heat-ranked participation.',
  'Roast the peak-heat Bitcoin post from the live composer.',
  'Ignite the best reply, then show leaderboard and audit.',
];

const roadmap = [
  'Wallet-based membership and payment verification',
  'Real Supabase mutations for every core action',
  'On-chain attestation anchoring for public verification',
  'Moderation tools that protect the room without deanonymizing members',
];

// ── Duplo primitives ───────────────────────────────────────────────────────
function Kicker({ children, color }: { children: ReactNode; color: DuploColor }) {
  return (
    <span
      className="inline-block rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em]"
      style={{ background: color, color: textOn(color) }}
    >
      {children}
    </span>
  );
}

function ColorBlock({ color, children, className = '' }: {
  color: DuploColor;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl p-5 ${className}`}
      style={{ background: color, color: textOn(color) }}
    >
      {children}
    </div>
  );
}

function Card({ children, accent, className = '' }: {
  children: ReactNode;
  accent?: DuploColor;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl bg-white p-5 ${className}`}
      style={{
        border: `2.5px solid ${accent ?? '#E8E8E8'}`,
        boxShadow: accent ? `4px 4px 0 ${accent}33` : '4px 4px 0 #E8E8E8',
      }}
    >
      {children}
    </div>
  );
}

function IconCircle({ icon: Icon, color }: { icon: LucideIcon; color: DuploColor }) {
  return (
    <div
      className="flex size-12 shrink-0 items-center justify-center rounded-xl"
      style={{ background: color, color: textOn(color) }}
    >
      <Icon className="size-6" />
    </div>
  );
}

function NumBadge({ n, color }: { n: number; color: DuploColor }) {
  return (
    <div
      className="flex size-12 shrink-0 items-center justify-center rounded-xl text-2xl font-black"
      style={{ background: color, color: textOn(color) }}
    >
      {n}
    </div>
  );
}

// ── Stage ──────────────────────────────────────────────────────────────────
function Stage({ meta, children, color, align = 'split' }: {
  meta: SlideMeta;
  children: ReactNode;
  color: DuploColor;
  align?: 'split' | 'center';
}) {
  return (
    <article className="relative h-full w-full overflow-auto px-5 pb-28 pt-20 sm:px-10 lg:px-14"
      style={{ background: '#F7F7F7' }}
    >
      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, #0000001a 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      {/* Colored corner accent */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-2 w-40 rounded-bl-2xl"
        style={{ background: color }}
      />

      <div
        className={
          align === 'center'
            ? 'relative mx-auto flex max-w-5xl flex-col items-center justify-center text-center'
            : 'relative mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start pt-4'
        }
      >
        <div className={align === 'center' ? 'max-w-4xl' : ''}>
          <Kicker color={color}>{meta.kicker}</Kicker>
          <h1
            className="mt-5 font-display text-4xl font-black leading-[0.92] text-[#1A1A1A] sm:text-6xl lg:text-[5.5rem]"
          >
            {meta.title}
          </h1>
        </div>
        <div className={align === 'center' ? 'mt-10 w-full max-w-5xl' : ''}>
          {children}
        </div>
      </div>
    </article>
  );
}

// ── Slide components ───────────────────────────────────────────────────────
function CoverSlide({ meta, color }: { meta: SlideMeta; color: DuploColor }) {
  return (
    <Stage meta={meta} color={color} align="center">
      <p className="mx-auto max-w-3xl text-xl leading-8 text-[#444] sm:text-2xl sm:leading-9">
        A members-only feedback room where identity stays outside, candor stays inside, and the best truth earns heat.
      </p>
      <div className="mt-10 grid gap-3 overflow-hidden rounded-2xl sm:grid-cols-4">
        {stats.map((stat, i) => (
          <ColorBlock key={stat.label} color={DUPLO[i % 4]} className="text-left">
            <div className="text-5xl font-black">{stat.value}</div>
            <div className="mt-2 text-xs font-bold uppercase tracking-[0.18em] opacity-80">{stat.label}</div>
          </ColorBlock>
        ))}
      </div>
    </Stage>
  );
}

function ProblemSlide({ meta, color }: { meta: SlideMeta; color: DuploColor }) {
  return (
    <Stage meta={meta} color={color}>
      <div className="space-y-5">
        <p className="text-xl leading-8 text-[#444]">
          Public identity makes people perform. Pure anonymity attracts low-effort abuse. Builders are stuck between polite lies and chaotic comment sections.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {(['Flattery', 'Fear', 'Noise'] as const).map((word, i) => (
            <Card key={word} accent={DUPLO[i % 4]}>
              <div className="text-3xl font-black text-[#1A1A1A]">{word}</div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#E8E8E8]">
                <div
                  className="h-3 rounded-full"
                  style={{ width: `${82 - i * 18}%`, background: DUPLO[i % 4] }}
                />
              </div>
            </Card>
          ))}
        </div>
        <Card accent={color}>
          <p className="text-xl font-bold text-[#1A1A1A]">
            The win: candor with accountability, without social risk.
          </p>
        </Card>
      </div>
    </Stage>
  );
}

function InsightSlide({ meta, color }: { meta: SlideMeta; color: DuploColor }) {
  return (
    <Stage meta={meta} color={color}>
      <div className="grid gap-3">
        {principles.map(({ label, text, icon }, i) => (
          <Card key={label} accent={DUPLO[i % 4]}>
            <div className="flex gap-4">
              <IconCircle icon={icon} color={DUPLO[i % 4]} />
              <div>
                <h2 className="text-2xl font-black text-[#1A1A1A]">{label}</h2>
                <p className="mt-1 text-lg leading-7 text-[#555]">{text}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Stage>
  );
}

function LoopSlide({ meta, color }: { meta: SlideMeta; color: DuploColor }) {
  return (
    <Stage meta={meta} color={color}>
      <ol className="grid gap-3">
        {productLoop.map((step, i) => (
          <li key={step} className="flex items-center gap-0 overflow-hidden rounded-2xl"
            style={{ border: `2.5px solid ${DUPLO[i % 4]}`, boxShadow: `4px 4px 0 ${DUPLO[i % 4]}33` }}
          >
            <div
              className="flex w-16 shrink-0 items-center justify-center self-stretch"
              style={{ background: DUPLO[i % 4], color: textOn(DUPLO[i % 4]) }}
            >
              <span className="text-4xl font-black">{i + 1}</span>
            </div>
            <p className="bg-white px-6 py-5 text-xl leading-8 text-[#333]">{step}</p>
          </li>
        ))}
      </ol>
    </Stage>
  );
}

function ExperienceSlide({ meta, color }: { meta: SlideMeta; color: DuploColor }) {
  return (
    <Stage meta={meta} color={color}>
      <div className="grid gap-3 sm:grid-cols-2">
        {routes.map((item, i) => (
          <Card key={item.route} accent={DUPLO[i % 4]}>
            <div className="font-mono text-sm font-bold" style={{ color: DUPLO[i % 4] }}>{item.route}</div>
            <div className="mt-3 text-3xl font-black text-[#1A1A1A]">{item.label}</div>
            <div className="mt-1 text-base text-[#555]">{item.detail}</div>
          </Card>
        ))}
      </div>
    </Stage>
  );
}

function TrustSlide({ meta, color }: { meta: SlideMeta; color: DuploColor }) {
  return (
    <Stage meta={meta} color={color}>
      <div className="grid gap-4 lg:grid-cols-[1fr_0.82fr]">
        <Card accent={color}>
          <div className="mb-5 flex items-center gap-3">
            <IconCircle icon={BadgeCheck} color={color} />
            <span className="text-xl font-black text-[#1A1A1A]">Public proof, private identity</span>
          </div>
          <div className="space-y-3 text-lg leading-7 text-[#555]">
            <p>Actions become attestations: post, roast, point.</p>
            <p>Audit records store confidence, scope, and attestation hash.</p>
            <p>Identity and message context stay separate from the public trail.</p>
          </div>
        </Card>
        <ColorBlock color={color} className="self-start">
          <div className="text-xs font-black uppercase tracking-[0.2em] opacity-80">designed for Solana</div>
          <div className="mt-5 space-y-3 font-mono text-sm" style={{ color: textOn(color) }}>
            <div className="opacity-90">0x4f3a...8c21 / post / 0.94</div>
            <div className="opacity-90">0x7b2d...4e55 / roast / 0.91</div>
            <div className="opacity-90">0x1c9f...6a03 / point / 0.97</div>
          </div>
        </ColorBlock>
      </div>
    </Stage>
  );
}

function ArchitectureSlide({ meta, color }: { meta: SlideMeta; color: DuploColor }) {
  return (
    <Stage meta={meta} color={color}>
      <div className="grid gap-4">
        <div className="grid gap-3 sm:grid-cols-4">
          {architecture.map((table, i) => (
            <Card key={table.name} accent={DUPLO[i % 4]}>
              <Database className="mb-3 size-6" style={{ color: DUPLO[i % 4] }} />
              <div className="font-mono text-sm font-bold" style={{ color: DUPLO[i % 4] }}>{table.name}</div>
              <p className="mt-2 text-base text-[#555]">{table.copy}</p>
            </Card>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { icon: Gauge, label: 'Heat engine', copy: '0, warm, ember, hot, peak' },
            { icon: Users, label: 'RLS ready', copy: 'Public reads, controlled writes' },
            { icon: Trophy, label: 'Ranking views', copy: 'Leaderboard and roast counts' },
          ].map(({ icon: Icon, label, copy }, i) => (
            <Card key={label} accent={DUPLO[(i + 1) % 4]}>
              <Icon className="mb-3 size-6" style={{ color: DUPLO[(i + 1) % 4] }} />
              <div className="text-2xl font-black text-[#1A1A1A]">{label}</div>
              <p className="mt-1 text-sm text-[#555]">{copy}</p>
            </Card>
          ))}
        </div>
      </div>
    </Stage>
  );
}

function DemoSlide({ meta, color }: { meta: SlideMeta; color: DuploColor }) {
  return (
    <Stage meta={meta} color={color}>
      <div className="space-y-3">
        {demoPath.map((item, i) => (
          <Card key={item} accent={DUPLO[i % 4]}>
            <div className="flex items-start gap-4">
              <NumBadge n={i + 1} color={DUPLO[i % 4]} />
              <div>
                <div className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#888]">step {i + 1}</div>
                <p className="mt-1 text-xl leading-7 text-[#1A1A1A]">{item}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Stage>
  );
}

function RoadmapSlide({ meta, color }: { meta: SlideMeta; color: DuploColor }) {
  return (
    <Stage meta={meta} color={color}>
      <div className="space-y-3">
        {roadmap.map((item, i) => (
          <div
            key={item}
            className="flex items-center gap-4 rounded-2xl bg-white px-6 py-5"
            style={{ border: `2.5px solid ${DUPLO[i % 4]}`, boxShadow: `4px 4px 0 ${DUPLO[i % 4]}33` }}
          >
            <Sparkles className="size-6 shrink-0" style={{ color: DUPLO[i % 4] }} />
            <p className="text-xl leading-7 text-[#333]">{item}</p>
          </div>
        ))}
      </div>
    </Stage>
  );
}

function CloseSlide({ meta, color }: { meta: SlideMeta; color: DuploColor }) {
  return (
    <Stage meta={meta} color={color} align="center">
      <MessageSquareQuote className="mx-auto mb-6 size-14" style={{ color }} />
      <p className="mx-auto max-w-3xl text-2xl leading-9 text-[#444]">
        Roast gives people a room where the truth is easier to say, harder to fake, and valuable enough to remember.
      </p>
      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-base font-black transition-opacity hover:opacity-80"
          style={{ background: color, color: textOn(color) }}
        >
          Demo the room <ArrowRight className="size-4" />
        </Link>
        <Link
          href="/video"
          className="inline-flex h-12 items-center justify-center rounded-full border-2 border-[#1A1A1A] px-7 text-base font-black text-[#1A1A1A] transition-opacity hover:opacity-70"
        >
          Watch demo
        </Link>
      </div>
    </Stage>
  );
}

// ── Shell ──────────────────────────────────────────────────────────────────
function clampSlide(index: number) {
  return Math.max(0, Math.min(slideMeta.length - 1, index));
}

export function SlidesClient() {
  const [activeIndex, setActiveIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const activeMeta = slideMeta[activeIndex];
  const color = SLIDE_COLORS[activeIndex];

  const goTo = useCallback((index: number) => setActiveIndex(clampSlide(index)), []);
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); setActiveIndex(i => clampSlide(i + 1)); }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); setActiveIndex(i => clampSlide(i - 1)); }
      if (e.key === 'Home') { e.preventDefault(); setActiveIndex(0); }
      if (e.key === 'End') { e.preventDefault(); setActiveIndex(slideMeta.length - 1); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.72;
    const play = () => audio.play().catch(() => {});
    play();
    window.addEventListener('pointerdown', play, { once: true });
    window.addEventListener('keydown', play, { once: true });
    return () => { window.removeEventListener('pointerdown', play); window.removeEventListener('keydown', play); };
  }, []);

  const activeSlide = useMemo(() => {
    const props = { meta: activeMeta, color };
    switch (activeMeta.id) {
      case 'cover':        return <CoverSlide {...props} />;
      case 'problem':      return <ProblemSlide {...props} />;
      case 'insight':      return <InsightSlide {...props} />;
      case 'loop':         return <LoopSlide {...props} />;
      case 'experience':   return <ExperienceSlide {...props} />;
      case 'trust':        return <TrustSlide {...props} />;
      case 'architecture': return <ArchitectureSlide {...props} />;
      case 'demo':         return <DemoSlide {...props} />;
      case 'roadmap':      return <RoadmapSlide {...props} />;
      case 'close':        return <CloseSlide {...props} />;
    }
  }, [activeMeta, color]);

  return (
    <main className="relative h-screen overflow-hidden" style={{ background: '#F7F7F7', color: '#1A1A1A' }}>
      {/* Nav */}
      <nav
        className="fixed left-0 right-0 top-0 z-50 bg-white"
        style={{ borderBottom: `4px solid ${color}` }}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2 text-lg font-black text-[#1A1A1A]">
            Roastpilot
          </Link>
          <div className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#888]">
            {String(activeIndex + 1).padStart(2, '0')} / {String(slideMeta.length).padStart(2, '0')}
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-black transition-opacity hover:opacity-80"
            style={{ background: color, color: textOn(color) }}
          >
            Open app <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </nav>

      {/* Slide */}
      {activeSlide}

      {/* Audio */}
      <audio
        ref={audioRef}
        src="/burnbabyburnroastpilot.mp3"
        controls
        autoPlay
        preload="auto"
        aria-label="Burn Baby Burn soundtrack"
        className="fixed bottom-6 right-5 z-50 h-9 w-56 max-w-[calc(100vw-2.5rem)] rounded-xl sm:right-8"
        style={{ border: `2px solid ${color}` }}
      />

      {/* Pagination */}
      <div
        className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-2xl bg-white px-3 py-2"
        style={{ border: `2.5px solid #E8E8E8`, boxShadow: '4px 4px 0 #E8E8E8' }}
      >
        <button
          type="button"
          onClick={goPrev}
          disabled={activeIndex === 0}
          className="flex size-8 items-center justify-center rounded-xl text-[#888] transition-colors hover:bg-[#F0F0F0] hover:text-[#1A1A1A] disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronLeft className="size-5" />
        </button>

        <div className="flex items-center gap-1.5">
          {slideMeta.map((slide, index) => {
            const c = SLIDE_COLORS[index];
            const active = index === activeIndex;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Go to ${slide.kicker}`}
                className="h-2.5 rounded-full transition-all"
                style={{
                  width: active ? 28 : 10,
                  background: active ? c : '#D4D4D4',
                }}
              />
            );
          })}
        </div>

        <button
          type="button"
          onClick={goNext}
          disabled={activeIndex === slideMeta.length - 1}
          className="flex size-8 items-center justify-center rounded-xl text-[#888] transition-colors hover:bg-[#F0F0F0] hover:text-[#1A1A1A] disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </main>
  );
}
