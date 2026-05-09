'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Coins,
  Database,
  Flame,
  Gauge,
  LockKeyhole,
  MessageSquareQuote,
  Route,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from 'lucide-react';

type SlideId =
  | 'cover'
  | 'problem'
  | 'insight'
  | 'loop'
  | 'experience'
  | 'trust'
  | 'architecture'
  | 'demo'
  | 'roadmap'
  | 'close';

type SlideMeta = {
  id: SlideId;
  kicker: string;
  title: string;
};

const slideMeta: SlideMeta[] = [
  { id: 'cover', kicker: 'Roast', title: 'Get roasted. Honestly.' },
  { id: 'problem', kicker: 'The gap', title: 'AI is bad at honest feedback.' },
  { id: 'insight', kicker: 'Core insight', title: 'Accountable entry changes the room.' },
  { id: 'loop', kicker: 'Product loop', title: 'Roast turns vulnerable questions into ranked signal.' },
  { id: 'experience', kicker: 'Experience', title: 'The demo already has the full ritual.' },
  { id: 'trust', kicker: 'Trust model', title: 'The audit page shows what crossed the boundary.' },
  { id: 'architecture', kicker: 'Build', title: 'Simple primitives make it shippable.' },
  { id: 'demo', kicker: 'Live demo', title: 'A judge can understand it in 90 seconds.' },
  { id: 'roadmap', kicker: 'Next 48 hours', title: 'The prototype becomes a real room.' },
  { id: 'close', kicker: 'Close', title: 'Social honesty needs new rules.' },
];

const stats = [
  { value: '4', label: 'feedback lanes' },
  { value: '280', label: 'characters' },
  { value: '5', label: 'heat levels' },
  { value: '6', label: 'demo routes' },
];

const principles: { label: string; text: string; icon: LucideIcon }[] = [
  {
    label: 'Verified entry',
    text: 'Every member passes a presence check before joining the room.',
    icon: ShieldCheck,
  },
  {
    label: 'Anonymous inside',
    text: 'Two-word handles keep feedback honest without exposing identity.',
    icon: LockKeyhole,
  },
  {
    label: 'Paid seriousness',
    text: 'A small economic gate filters for people who actually want the truth.',
    icon: Coins,
  },
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

function clampSlide(index: number) {
  return Math.max(0, Math.min(slideMeta.length - 1, index));
}

function Kicker({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-ember-2">
      <span className="h-px w-10 bg-ember-1" />
      <span>{children}</span>
    </div>
  );
}

function IconBadge({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div className="flex size-12 shrink-0 items-center justify-center rounded-md border border-ember-1/35 bg-ember-1/10 text-ember-2 shadow-[0_0_32px_rgba(255,107,26,0.16)]">
      <Icon className="size-6" />
    </div>
  );
}

function Stage({
  meta,
  children,
  align = 'split',
}: {
  meta: SlideMeta;
  children: ReactNode;
  align?: 'split' | 'center';
}) {
  return (
    <article
      key={meta.id}
      className="relative grid h-full w-full animate-fade-in-up overflow-hidden px-5 pb-24 pt-20 sm:px-8 lg:px-12"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,107,26,0.20),transparent_30%),linear-gradient(250deg,rgba(255,217,110,0.12),transparent_34%),repeating-linear-gradient(90deg,rgba(244,237,228,0.035)_0_1px,transparent_1px_80px)]" />
      <div className="pointer-events-none absolute -right-16 top-16 h-40 w-[38rem] rotate-[-18deg] bg-ember-1/15 [clip-path:polygon(0_0,100%_16%,92%_100%,8%_82%)]" />
      <div className="pointer-events-none absolute -bottom-24 left-0 h-44 w-[44rem] rotate-[8deg] bg-cool/20 [clip-path:polygon(6%_0,100%_22%,86%_100%,0_74%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-14 h-px bg-gradient-to-r from-transparent via-ember-1/70 to-transparent" />

      <div
        className={
          align === 'center'
            ? 'relative mx-auto flex max-w-6xl flex-col items-center justify-center text-center'
            : 'relative mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center'
        }
      >
        <div className={align === 'center' ? 'max-w-5xl' : ''}>
          <Kicker>{meta.kicker}</Kicker>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[0.92] text-foreground sm:text-6xl lg:text-8xl">
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

function CoverSlide({ meta }: { meta: SlideMeta }) {
  return (
    <Stage meta={meta} align="center">
      <p className="mx-auto max-w-3xl text-xl leading-8 text-muted-foreground sm:text-2xl sm:leading-9">
        A members-only feedback room where identity stays outside, candor stays inside, and the best truth earns heat.
      </p>
      <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface px-6 py-6 text-left">
            <div className="font-display text-5xl font-semibold text-ember-3">{stat.value}</div>
            <div className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>
    </Stage>
  );
}

function ProblemSlide({ meta }: { meta: SlideMeta }) {
  return (
    <Stage meta={meta}>
      <div className="space-y-7">
        <p className="text-xl leading-8 text-muted-foreground">
          Public identity makes people perform. Pure anonymity attracts low-effort abuse. Builders are stuck between polite lies and chaotic comment sections.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {['Flattery', 'Fear', 'Noise'].map((word, index) => (
            <div key={word} className="relative overflow-hidden rounded-lg border border-border bg-surface p-5">
              <div className="font-display text-3xl text-foreground">{word}</div>
              <div className="mt-5 h-2 rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-ember-1"
                  style={{ width: `${82 - index * 18}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-ember-1/30 pt-6 text-2xl font-semibold leading-8 text-foreground">
          The win: candor with accountability, without social risk.
        </div>
      </div>
    </Stage>
  );
}

function InsightSlide({ meta }: { meta: SlideMeta }) {
  return (
    <Stage meta={meta}>
      <div className="grid gap-4">
        {principles.map(({ label, text, icon }) => (
          <div key={label} className="flex gap-5 rounded-lg border border-border bg-surface/90 p-5">
            <IconBadge icon={icon} />
            <div>
              <h2 className="font-display text-3xl font-semibold text-foreground">{label}</h2>
              <p className="mt-2 text-lg leading-7 text-muted-foreground">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </Stage>
  );
}

function LoopSlide({ meta }: { meta: SlideMeta }) {
  return (
    <Stage meta={meta}>
      <ol className="grid gap-4">
        {productLoop.map((step, index) => (
          <li key={step} className="grid grid-cols-[4rem_1fr] items-stretch overflow-hidden rounded-lg border border-border bg-surface">
            <div className="flex items-center justify-center bg-ember-1 text-primary-foreground">
              <span className="font-display text-4xl font-semibold">{index + 1}</span>
            </div>
            <p className="px-6 py-5 text-xl leading-8 text-muted-foreground">{step}</p>
          </li>
        ))}
      </ol>
    </Stage>
  );
}

function ExperienceSlide({ meta }: { meta: SlideMeta }) {
  return (
    <Stage meta={meta}>
      <div className="grid gap-3 sm:grid-cols-2">
        {routes.map((item) => (
          <div key={item.route} className="rounded-lg border border-border bg-surface p-5">
            <div className="font-mono text-sm text-ember-2">{item.route}</div>
            <div className="mt-4 font-display text-3xl font-semibold text-foreground">{item.label}</div>
            <div className="mt-2 text-base leading-6 text-muted-foreground">{item.detail}</div>
          </div>
        ))}
      </div>
    </Stage>
  );
}

function TrustSlide({ meta }: { meta: SlideMeta }) {
  return (
    <Stage meta={meta}>
      <div className="grid gap-5 lg:grid-cols-[1fr_0.82fr]">
        <div className="rounded-lg border border-border bg-surface p-6">
          <div className="mb-6 flex items-center gap-4 text-ember-2">
            <IconBadge icon={BadgeCheck} />
            <span className="text-xl font-semibold text-foreground">Public proof, private identity</span>
          </div>
          <div className="space-y-4 text-xl leading-8 text-muted-foreground">
            <p>Actions become attestations: post, roast, point.</p>
            <p>Audit records store confidence, scope, and attestation hash.</p>
            <p>Identity and message context stay separate from the public trail.</p>
          </div>
        </div>
        <div className="rounded-lg border border-ember-1/35 bg-ember-1/10 p-6">
          <div className="font-mono text-sm uppercase tracking-[0.2em] text-ember-3">designed for Solana</div>
          <div className="mt-6 space-y-4 font-mono text-sm text-foreground">
            <div>0x4f3a...8c21 / post / 0.94</div>
            <div>0x7b2d...4e55 / roast / 0.91</div>
            <div>0x1c9f...6a03 / point / 0.97</div>
          </div>
        </div>
      </div>
    </Stage>
  );
}

function ArchitectureSlide({ meta }: { meta: SlideMeta }) {
  return (
    <Stage meta={meta}>
      <div className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-4">
          {architecture.map((table) => (
            <div key={table.name} className="rounded-lg border border-border bg-surface p-5">
              <Database className="mb-4 size-7 text-ember-2" />
              <div className="font-mono text-sm text-ember-3">{table.name}</div>
              <p className="mt-3 text-lg leading-6 text-muted-foreground">{table.copy}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-3 rounded-lg border border-border bg-background/70 p-5 sm:grid-cols-3">
          {[
            { icon: Gauge, label: 'Heat engine', copy: '0, warm, ember, hot, peak' },
            { icon: Users, label: 'RLS ready', copy: 'Public reads, controlled writes' },
            { icon: Trophy, label: 'Ranking views', copy: 'Leaderboard and roast counts' },
          ].map(({ icon: Icon, label, copy }) => (
            <div key={label}>
              <Icon className="mb-3 size-6 text-ember-2" />
              <div className="font-display text-2xl text-foreground">{label}</div>
              <p className="mt-1 text-sm text-muted-foreground">{copy}</p>
            </div>
          ))}
        </div>
      </div>
    </Stage>
  );
}

function DemoSlide({ meta }: { meta: SlideMeta }) {
  return (
    <Stage meta={meta}>
      <div className="space-y-4">
        {demoPath.map((item, index) => (
          <div key={item} className="flex items-start gap-4 rounded-lg border border-border bg-surface p-5">
            <Route className="mt-1 size-6 shrink-0 text-ember-2" />
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">step {index + 1}</div>
              <p className="mt-1 text-xl leading-8 text-foreground">{item}</p>
            </div>
          </div>
        ))}
      </div>
    </Stage>
  );
}

function RoadmapSlide({ meta }: { meta: SlideMeta }) {
  return (
    <Stage meta={meta}>
      <div className="space-y-5">
        {roadmap.map((item) => (
          <div key={item} className="flex items-center gap-4 border-b border-border pb-5 last:border-b-0">
            <Sparkles className="size-6 shrink-0 text-ember-3" />
            <p className="text-2xl leading-8 text-muted-foreground">{item}</p>
          </div>
        ))}
      </div>
    </Stage>
  );
}

function CloseSlide({ meta }: { meta: SlideMeta }) {
  return (
    <Stage meta={meta} align="center">
      <MessageSquareQuote className="mx-auto mb-8 size-14 text-ember-2" />
      <p className="mx-auto max-w-3xl text-2xl leading-9 text-muted-foreground">
        Roast gives people a room where the truth is easier to say, harder to fake, and valuable enough to remember.
      </p>
      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-ember-1 px-6 font-semibold text-primary-foreground transition-colors hover:bg-ember-2"
        >
          Demo the room
          <ArrowRight className="size-4" />
        </Link>
        <Link
          href="/video"
          className="inline-flex h-12 items-center justify-center rounded-md border border-border px-6 font-semibold text-foreground transition-colors hover:bg-surface"
        >
          Watch demo
        </Link>
      </div>
    </Stage>
  );
}

export function SlidesClient() {
  const [activeIndex, setActiveIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const activeMeta = slideMeta[activeIndex];

  const goTo = useCallback((index: number) => {
    setActiveIndex(clampSlide(index));
  }, []);

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
        event.preventDefault();
        setActiveIndex((index) => clampSlide(index + 1));
      }

      if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault();
        setActiveIndex((index) => clampSlide(index - 1));
      }

      if (event.key === 'Home') {
        event.preventDefault();
        setActiveIndex(0);
      }

      if (event.key === 'End') {
        event.preventDefault();
        setActiveIndex(slideMeta.length - 1);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.volume = 0.72;

    const playAudio = () => {
      audio.play().catch(() => {
        // Browsers can block audible autoplay until the first user gesture.
      });
    };

    playAudio();
    window.addEventListener('pointerdown', playAudio, { once: true });
    window.addEventListener('keydown', playAudio, { once: true });

    return () => {
      window.removeEventListener('pointerdown', playAudio);
      window.removeEventListener('keydown', playAudio);
    };
  }, []);

  const activeSlide = useMemo(() => {
    switch (activeMeta.id) {
      case 'cover':
        return <CoverSlide meta={activeMeta} />;
      case 'problem':
        return <ProblemSlide meta={activeMeta} />;
      case 'insight':
        return <InsightSlide meta={activeMeta} />;
      case 'loop':
        return <LoopSlide meta={activeMeta} />;
      case 'experience':
        return <ExperienceSlide meta={activeMeta} />;
      case 'trust':
        return <TrustSlide meta={activeMeta} />;
      case 'architecture':
        return <ArchitectureSlide meta={activeMeta} />;
      case 'demo':
        return <DemoSlide meta={activeMeta} />;
      case 'roadmap':
        return <RoadmapSlide meta={activeMeta} />;
      case 'close':
        return <CloseSlide meta={activeMeta} />;
    }
  }, [activeMeta]);

  return (
    <main className="relative h-screen overflow-hidden bg-background text-foreground">
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold">
            <Flame className="size-5 text-ember-1" />
            Roast
          </Link>
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {String(activeIndex + 1).padStart(2, '0')} / {String(slideMeta.length).padStart(2, '0')}
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-md bg-ember-1 px-3 py-1.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-ember-2"
            >
              Open app
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </nav>

      {activeSlide}

      <audio
        ref={audioRef}
        src="/burnbabyburnroastpilot.mp3"
        controls
        autoPlay
        preload="auto"
        aria-label="Burn Baby Burn soundtrack"
        className="fixed right-5 top-16 z-50 h-10 w-48 max-w-[calc(100vw-2.5rem)] rounded-md border border-border bg-background/85 backdrop-blur-xl sm:bottom-6 sm:right-8 sm:top-auto sm:w-[16rem]"
      />

      <div className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-lg border border-border bg-background/85 px-3 py-2 backdrop-blur-xl">
        <button
          type="button"
          onClick={goPrev}
          disabled={activeIndex === 0}
          aria-label="Previous slide"
          className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronLeft className="size-5" />
        </button>

        <div className="flex items-center gap-1.5">
          {slideMeta.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Go to ${slide.kicker}`}
              className={`h-2 rounded-full transition-all ${
                index === activeIndex
                  ? 'w-8 bg-ember-1 shadow-[0_0_16px_rgba(255,107,26,0.6)]'
                  : 'w-2 bg-muted hover:bg-muted-foreground'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={goNext}
          disabled={activeIndex === slideMeta.length - 1}
          aria-label="Next slide"
          className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      <div className="fixed bottom-6 left-6 z-40 hidden items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground md:flex">
        <ArrowLeft className="size-4" />
        <span>{activeMeta.kicker}</span>
        <ArrowRight className="size-4" />
      </div>
    </main>
  );
}
