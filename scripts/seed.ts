import { nanoid } from "nanoid";
import { db } from "../src/db";
import { submissions, votes, users } from "../src/db/schema";

// Empty, well-typed seed. Hand-written so the feed isn't empty on first boot
// without inventing fake AI verdicts. Real verdicts get streamed when a
// submission is made through the UI with ANTHROPIC_API_KEY set.

const sampleSubmissions: Array<{
  body: string;
  severity: "house" | "nuclear";
  aiVerdict?: "NTA" | "YTA" | "ESH" | "NAH" | "INFO";
  aiRoast?: string;
  aiReasoning?: string[];
  aiConfidence?: number;
}> = [
  {
    body: "My sister keeps eating my labelled lunches at our shared office. She earns more than I do. I started putting hot sauce in mine and now she's complaining to HR about a 'hostile food environment.' AITA?",
    severity: "house",
    aiVerdict: "NTA",
    aiConfidence: 78,
    aiRoast:
      "She is the one consistently misreading the boundary, ignoring the label, and now seeking corporate intervention because the lunch she steals is no longer to her taste. That she earns more is irrelevant; nobody is owed your sandwich. The hot sauce was inelegant but not punitive — your colleague chose to keep eating after the first bite. The party in the wrong is the one filing complaints about a meal that was never theirs.",
    aiReasoning: [
      "The labels were clear and ignored.",
      "She continued eating after the first bite, which is consent to spice.",
      "Income disparity does not establish food rights.",
    ],
  },
  {
    body: "I told my best friend her startup pitch was bad. She was about to present it to a real investor in two days. She didn't speak to me for a week. The investor passed. She blames me. AITA?",
    severity: "house",
    aiVerdict: "NAH",
    aiConfidence: 64,
    aiRoast:
      "Telling a friend the truth two days before a high-stakes pitch is not cruelty; it is the single most useful thing a friend can do, and frequently the most thankless. She heard the note, took the time to feel it, and went in anyway — credit to her. The investor passed for reasons that are almost certainly not your sentence. Both of you behaved like adults. The silence was the price of the gift.",
    aiReasoning: [
      "Two days is enough to revise; she chose not to.",
      "Investors decline for many reasons unrelated to a friend's review.",
      "Silence is a normal response to honest critique.",
    ],
  },
  {
    body: "I (32M) refused to attend my brother's third wedding because I gave the toast at the first two and both ended in messy divorces. He says I'm being superstitious and unsupportive. AITA?",
    severity: "nuclear",
    aiVerdict: "YTA",
    aiConfidence: 71,
    aiRoast:
      "The toast did not cause the divorces. Two failed marriages did. To skip a brother's wedding because you have decided your speech is a curse is to flatter yourself with mythological powers you do not possess. He is asking you to show up. You are asking him to validate a narrative in which you are the protagonist and he is the unlucky setting. Decline the toast. Attend the wedding.",
    aiReasoning: [
      "Causation is being assigned where there is only coincidence.",
      "The brother's request is for presence, not performance.",
      "Refusing on superstition centers the wrong person.",
    ],
  },
];

function seed() {
  console.log("[seed] resetting tables...");
  db.delete(votes).run();
  db.delete(submissions).run();
  db.delete(users).run();

  console.log("[seed] inserting submissions...");
  for (const s of sampleSubmissions) {
    db.insert(submissions)
      .values({
        id: nanoid(10),
        body: s.body,
        severity: s.severity,
        moderationStatus: "approved",
        aiVerdict: s.aiVerdict,
        aiRoast: s.aiRoast,
        aiReasoning: s.aiReasoning ? JSON.stringify(s.aiReasoning) : null,
        aiConfidence: s.aiConfidence,
      })
      .run();
  }

  console.log("[seed] done.");
}

seed();
