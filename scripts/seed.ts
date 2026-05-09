import { nanoid } from "nanoid";
import { db } from "../src/db";
import {
  submissions,
  votes,
  users,
  pointsLedger,
  reactions,
  followUps,
} from "../src/db/schema";
import type { Category, Severity, Verdict, TakeTag } from "../src/db/schema";

// ---- sample users ----------------------------------------------------------
const sampleUsers: Array<{
  handleSol: string;
  walletAddress: string;
  pohVerified: boolean;
  roastPoints: number;
}> = [
  { handleSol: "roastmaster.sol", walletAddress: fakeAddr("rm"),  pohVerified: true,  roastPoints: 2840 },
  { handleSol: "chaoticneutral.sol", walletAddress: fakeAddr("cn"), pohVerified: true,  roastPoints: 1620 },
  { handleSol: "meanbutfair.sol", walletAddress: fakeAddr("mbf"), pohVerified: true,  roastPoints: 980  },
  { handleSol: "anonowl42.sol",    walletAddress: fakeAddr("ao"),  pohVerified: true,  roastPoints: 410  },
  { handleSol: "pettyfox19.sol",   walletAddress: fakeAddr("pf"),  pohVerified: true,  roastPoints: 220  },
  { handleSol: "softswan88.sol",   walletAddress: fakeAddr("ss"),  pohVerified: false, roastPoints: 60   },
];

function fakeAddr(seed: string) {
  // 32-char fake addresses keyed off a seed so they're stable.
  const base = "abcdefghijklmnopqrstuvwxyz123456789";
  let out = "";
  let s = 0;
  for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) | 0;
  for (let i = 0; i < 36; i++) {
    s = (s * 1103515245 + 12345) | 0;
    out += base[Math.abs(s) % base.length];
  }
  return out;
}

// ---- sample submissions ----------------------------------------------------
type Sub = {
  body: string;
  category: Category;
  severity: Severity;
  aiVerdict: Verdict;
  aiRoast: string;
  aiReasoning: string[];
  aiConfidence: number;
  caseNumber: number;
  takes: Array<{
    handleSol: string;
    verdict: Verdict;
    take: string;
    takeTag: TakeTag;
    embers: number;
  }>;
};

const data: Sub[] = [
  {
    caseNumber: 71849,
    category: "relationships",
    severity: "house",
    body:
      "I (29F) made a shared spreadsheet for my partner with weekly chore KPIs, deadlines, and a colour-coded effort score. He says he feels like an employee. I said it just helps with consistency. AITA?",
    aiVerdict: "YTA",
    aiConfidence: 78,
    aiRoast:
      "You wanted a partner, not a project manager. You audited their life, set KPI's for their free time, and wondered why they needed a break from you. YTA and a little delusional.",
    aiReasoning: [
      "Domestic life is not a product roadmap.",
      "Weekly review meetings are a relationship smell.",
      "Consistency does not require colour coding.",
    ],
    takes: [
      { handleSol: "roastmaster.sol", verdict: "YTA", takeTag: "funny",   embers: 312, take: "You don't want equality, you want a therapist who does chores." },
      { handleSol: "chaoticneutral.sol", verdict: "YTA", takeTag: "funny", embers: 241, take: "Bro created a Gantt chart for romance." },
      { handleSol: "meanbutfair.sol", verdict: "YTA", takeTag: "savage",   embers: 189, take: "You're not the villain, you're just… extra." },
      { handleSol: "anonowl42.sol",   verdict: "ESH", takeTag: "helpful",  embers: 96,  take: "Couples therapy will fix this in two sessions; the spreadsheet won't." },
      { handleSol: "pettyfox19.sol",  verdict: "NTA", takeTag: "helpful",  embers: 64,  take: "Document everything in case you ever need to leave. The score isn't crazy." },
      { handleSol: "softswan88.sol",  verdict: "YTA", takeTag: "savage",   embers: 41,  take: "Imagine getting performance reviewed by the person who cried about IKEA." },
    ],
  },
  {
    caseNumber: 71850,
    category: "work",
    severity: "house",
    body:
      "My sister keeps eating my labelled lunches at our shared office. She earns more than I do. I started putting hot sauce in mine and now she's complaining to HR about a 'hostile food environment.' AITA?",
    aiVerdict: "NTA",
    aiConfidence: 82,
    aiRoast:
      "She's the one ignoring the label and now seeking corporate intervention because the lunch she steals is no longer to her taste. The hot sauce was inelegant but not punitive. The party in the wrong is the one filing complaints about a meal that was never theirs.",
    aiReasoning: [
      "Labels were clear and ignored.",
      "She continued eating after the first bite.",
      "Income disparity does not establish food rights.",
    ],
    takes: [
      { handleSol: "roastmaster.sol", verdict: "NTA", takeTag: "funny",   embers: 220, take: "HR meeting agenda item one: thou shalt not steal carbonara." },
      { handleSol: "meanbutfair.sol", verdict: "NTA", takeTag: "savage",  embers: 168, take: "The audacity required to file an HR complaint about food you stole is genuinely impressive." },
      { handleSol: "chaoticneutral.sol", verdict: "ESH", takeTag: "helpful", embers: 71, take: "Talk to HR first next time. You'll win the case but you risk looking petty otherwise." },
      { handleSol: "anonowl42.sol",   verdict: "NTA", takeTag: "funny",   embers: 53,  take: "Hostile food environment is going to be on a sitcom by 2027." },
    ],
  },
  {
    caseNumber: 71851,
    category: "family",
    severity: "nuclear",
    body:
      "I (32M) refused to attend my brother's third wedding because I gave the toast at the first two and both ended in messy divorces. He says I'm being superstitious and unsupportive. AITA?",
    aiVerdict: "YTA",
    aiConfidence: 71,
    aiRoast:
      "The toast did not cause the divorces. Two failed marriages did. To skip a brother's wedding because your speech is a curse is to flatter yourself with mythological powers you do not possess. Decline the toast. Attend the wedding.",
    aiReasoning: [
      "Causation is being assigned where there is only coincidence.",
      "The brother's request is for presence, not performance.",
      "Refusing on superstition centers the wrong person.",
    ],
    takes: [
      { handleSol: "meanbutfair.sol",   verdict: "YTA", takeTag: "savage", embers: 198, take: "You think you're a wedding warlock. You are not." },
      { handleSol: "roastmaster.sol",   verdict: "YTA", takeTag: "funny",  embers: 144, take: "The vibes were not killed by your toast, they were killed by Greg." },
      { handleSol: "chaoticneutral.sol", verdict: "ESH", takeTag: "helpful", embers: 92, take: "Go. Don't toast. Bring a card. Done." },
      { handleSol: "pettyfox19.sol",    verdict: "NTA", takeTag: "savage", embers: 38,  take: "Three weddings is a personality flaw. Skip with confidence." },
    ],
  },
];

function seed() {
  console.log("[seed] resetting tables...");
  db.delete(reactions).run();
  db.delete(followUps).run();
  db.delete(votes).run();
  db.delete(submissions).run();
  db.delete(pointsLedger).run();
  db.delete(users).run();

  console.log("[seed] users...");
  const userIds = new Map<string, string>();
  for (const u of sampleUsers) {
    const id = nanoid(12);
    userIds.set(u.handleSol, id);
    db.insert(users)
      .values({
        id,
        walletAddress: u.walletAddress,
        handleSol: u.handleSol,
        pohVerified: u.pohVerified,
        paidSignup: false,
        roastPoints: u.roastPoints,
        emberReputation: 0,
      })
      .run();
    db.insert(pointsLedger)
      .values({
        id: nanoid(12),
        userId: id,
        delta: u.roastPoints,
        reason: "manual",
      })
      .run();
  }

  console.log("[seed] submissions and takes...");
  for (const s of data) {
    const id = nanoid(10);
    db.insert(submissions)
      .values({
        id,
        caseNumber: s.caseNumber,
        body: s.body,
        category: s.category,
        severity: s.severity,
        moderationStatus: "approved",
        aiVerdict: s.aiVerdict,
        aiRoast: s.aiRoast,
        aiReasoning: JSON.stringify(s.aiReasoning),
        aiConfidence: s.aiConfidence,
      })
      .run();

    for (const t of s.takes) {
      const userId = userIds.get(t.handleSol);
      if (!userId) continue;
      db.insert(votes)
        .values({
          id: nanoid(12),
          submissionId: id,
          userId,
          verdict: t.verdict,
          take: t.take,
          takeTag: t.takeTag,
          embers: t.embers,
        })
        .run();
    }
  }

  console.log("[seed] done.");
}

seed();
