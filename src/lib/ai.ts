import type { Verdict } from "./verdicts";

export type VerdictResult = { verdict: Verdict; response: string };

const FAKE: { verdict: Verdict; lines: [string, string] }[] = [
  {
    verdict: "YTA",
    lines: [
      "YTA, and not in a fun way. You knew exactly what you were doing the moment you opened your mouth, and the surprise you're performing now is a second offense.",
      "The 'I was just being honest' defense doesn't fly here. Honest people don't dress up cruelty as candor. Apologize, mean it, and don't do it again.",
    ],
  },
  {
    verdict: "NTA",
    lines: [
      "NTA, full stop. You set a perfectly normal boundary and the people around you decided to take it personally because that is, apparently, their hobby.",
      "Hold the line. The discomfort you feel is the cost of having a spine, and it's a fair price. The people calling you difficult are mad they no longer get to coast.",
    ],
  },
  {
    verdict: "ESH",
    lines: [
      "ESH. Both sides walked into this with attitude and walked out with bruises. Nobody comes out of this clean.",
      "You weren't wrong to push back, you were wrong about how. They weren't wrong to be upset, they were wrong about the volume. Reset, apologize for your part, ask for the same.",
    ],
  },
  {
    verdict: "NAH",
    lines: [
      "NAH. This is a misunderstanding wearing the costume of a fight. Two reasonable people, two reasonable positions, one bad miscommunication.",
      "Have the conversation again with less heat. Say what you want, ask what they want, and resist the urge to score points. There is no asshole here, just two tired people.",
    ],
  },
  {
    verdict: "INFO",
    lines: [
      "INFO. The story has a hole in it the size of the actual question, and I'm not going to pretend I can rule on what isn't there.",
      "Tell us what they actually said, what you actually said, and what happened in between. Right now I have a vibe, and a vibe is not a verdict.",
    ],
  },
];

function pick(title: string, body: string): VerdictResult {
  const seed = (title + body).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const choice = FAKE[seed % FAKE.length];
  return {
    verdict: choice.verdict,
    response: `${choice.lines[0]}\n\n${choice.lines[1]}`,
  };
}

export async function generateVerdict(
  title: string,
  body: string,
): Promise<VerdictResult> {
  await new Promise((r) => setTimeout(r, 600));
  return pick(title, body);
}

export async function* streamVerdict(
  title: string,
  body: string,
): AsyncGenerator<{ delta: string } | { done: VerdictResult }> {
  const result = pick(title, body);
  const chunks = result.response.match(/[\s\S]{1,6}/g) ?? [result.response];
  for (const c of chunks) {
    yield { delta: c };
    await new Promise((r) => setTimeout(r, 30));
  }
  yield { done: result };
}
