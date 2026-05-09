import { LoomDemo } from "./loom-demo";

export const metadata = {
  title: "Roastpilot — Demo",
  description: "Watch a 60-second tour of Roastpilot.",
};

export default function VideoPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 pb-24 pt-10">
      <div className="mb-8 flex flex-col gap-2">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
          Product tour
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-ink md:text-5xl">
          Sixty seconds inside Roastpilot.
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-ink-soft">
          Post a dilemma. Claude drops a verdict. The court of public opinion
          piles on after.
        </p>
      </div>
      <LoomDemo />
    </main>
  );
}
