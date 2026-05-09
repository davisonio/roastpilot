import { SiteHeader, SiteFooter } from "@/components/site-header";
import { LoomDemo } from "./loom-demo";

export const metadata = {
  title: "Roastpilot — Demo",
  description: "Watch a 60-second tour of the Roast as a Service marketplace.",
};

export default function VideoPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-6 pb-24 pt-10">
        <div className="mb-8 flex flex-col gap-2">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-ember">
            Product tour
          </p>
          <h1 className="display text-4xl text-ink md:text-5xl">
            Sixty seconds inside Roastpilot.
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-mute">
            Post a scenario, attach a bounty, watch verified humans race to roast
            you. Pick the top three. They split your money as Roastpoints.
          </p>
        </div>
        <LoomDemo />
      </main>
      <SiteFooter />
    </>
  );
}
