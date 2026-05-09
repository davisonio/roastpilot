/**
 * Seed data for Roast demo
 * Use this data for local development and hackathon demo
 */

import type { User, Post, Roast, AuditEvent, LeaderboardEntry, Category } from './supabase/types';

// Generate consistent UUIDs for demo data
const uuid = (n: number) => `00000000-0000-0000-0000-${String(n).padStart(12, '0')}`;

export const SEED_USERS: User[] = [
  { id: uuid(1), handle: 'TerseSnake', created_at: '2026-05-01T10:00:00Z' },
  { id: uuid(2), handle: 'QuietFlame', created_at: '2026-05-01T11:00:00Z' },
  { id: uuid(3), handle: 'BoldEmber', created_at: '2026-05-02T09:00:00Z' },
  { id: uuid(4), handle: 'SwiftAsh', created_at: '2026-05-02T14:00:00Z' },
  { id: uuid(5), handle: 'DeepCoal', created_at: '2026-05-03T08:00:00Z' },
  { id: uuid(6), handle: 'BrightSpark', created_at: '2026-05-03T16:00:00Z' },
  { id: uuid(7), handle: 'CalmCinder', created_at: '2026-05-04T12:00:00Z' },
  { id: uuid(8), handle: 'WildFire', created_at: '2026-05-05T10:00:00Z' },
];

export const SEED_POSTS: Post[] = [
  // Cold post (0 roasts) - pitches
  {
    id: uuid(101),
    user_id: uuid(1),
    content: "I'm thinking of building a dating app where you can only message someone after solving a puzzle they created. Matches based on how you think, not just photos. Is this stupid or am I onto something?",
    category: 'pitches',
    created_at: '2026-05-08T22:00:00Z',
    roast_count: 0,
  },
  // Warm post (2 roasts) - decisions
  {
    id: uuid(102),
    user_id: uuid(2),
    content: "I just turned down a $180k offer to stay at my current job making $95k because I genuinely believe in what we're building. My friends think I've lost my mind. Did I?",
    category: 'decisions',
    created_at: '2026-05-08T18:00:00Z',
    roast_count: 2,
  },
  // Medium post (4 roasts) - products
  {
    id: uuid(103),
    user_id: uuid(3),
    content: "We've been working on this AI writing assistant for 8 months. Just got our first paying customer yesterday - $29/month. Should I feel excited or embarrassed that it took this long?",
    category: 'products',
    created_at: '2026-05-08T14:00:00Z',
    roast_count: 4,
  },
  // Medium post (5 roasts) - life
  {
    id: uuid(104),
    user_id: uuid(4),
    content: "I'm 34 and still don't know what I want to be when I grow up. I've been a teacher, a developer, a barista, and now I'm thinking about med school. Is this restlessness a bug or a feature?",
    category: 'life',
    created_at: '2026-05-07T20:00:00Z',
    roast_count: 5,
  },
  // Hot post (8 roasts) - pitches
  {
    id: uuid(105),
    user_id: uuid(5),
    content: "Hear me out: a subscription service for uncomfortable conversations. You pay us $50/month and we'll call your gym to cancel, break up with your partner, or tell your boss you quit. We handle the awkward, you move on with your life.",
    category: 'pitches',
    created_at: '2026-05-06T16:00:00Z',
    roast_count: 8,
  },
  // Peak heat post (12 roasts) - decisions
  {
    id: uuid(106),
    user_id: uuid(6),
    content: "I spent my entire emergency fund ($40k) on Bitcoin at $95,000 because a guy on Twitter with a laser eye profile picture said it's going to $500k by end of year. I haven't told my wife yet.",
    category: 'decisions',
    created_at: '2026-05-05T23:00:00Z',
    roast_count: 12,
  },
];

export const SEED_ROASTS: Roast[] = [
  // Roasts for post 102 (2 roasts)
  {
    id: uuid(201),
    post_id: uuid(102),
    user_id: uuid(3),
    content: "You turned down almost double your salary for 'belief'? That's not conviction, that's Stockholm syndrome with a 401k.",
    points: 3,
    created_at: '2026-05-08T19:00:00Z',
  },
  {
    id: uuid(202),
    post_id: uuid(102),
    user_id: uuid(7),
    content: "The people who stay for the mission are the ones who make the mission succeed. Or the ones who look back in 5 years wondering why they didn't take the money. Flip a coin.",
    points: 1,
    created_at: '2026-05-08T20:00:00Z',
  },

  // Roasts for post 103 (4 roasts)
  {
    id: uuid(203),
    post_id: uuid(103),
    user_id: uuid(1),
    content: "$29/month after 8 months. That's $29 more than most people ever make from their side projects. Stop comparing yourself to outliers.",
    points: 5,
    created_at: '2026-05-08T15:00:00Z',
  },
  {
    id: uuid(204),
    post_id: uuid(103),
    user_id: uuid(4),
    content: "The embarrassment is that you're asking strangers on the internet to validate feelings you already know the answer to. Enjoy your customer.",
    points: 2,
    created_at: '2026-05-08T15:30:00Z',
  },
  {
    id: uuid(205),
    post_id: uuid(103),
    user_id: uuid(5),
    content: "8 months to PMF in AI writing? You're speedrunning compared to most B2B SaaS. The second customer is where it gets interesting.",
    points: 4,
    created_at: '2026-05-08T16:00:00Z',
  },
  {
    id: uuid(206),
    post_id: uuid(103),
    user_id: uuid(8),
    content: "First rule of building in public: never show uncertainty about timelines. Second rule: nobody actually follows the first rule.",
    points: 1,
    created_at: '2026-05-08T17:00:00Z',
  },

  // Roasts for post 104 (5 roasts)
  {
    id: uuid(207),
    post_id: uuid(104),
    user_id: uuid(2),
    content: "Med school at 34 isn't restlessness, it's mid-life crisis cosplaying as ambition. But hey, some of the best doctors started late.",
    points: 6,
    created_at: '2026-05-07T21:00:00Z',
  },
  {
    id: uuid(208),
    post_id: uuid(104),
    user_id: uuid(6),
    content: "The people who 'know what they want' are usually just afraid to admit they don't. At least you're honest about being lost.",
    points: 8,
    created_at: '2026-05-07T22:00:00Z',
  },
  {
    id: uuid(209),
    post_id: uuid(104),
    user_id: uuid(1),
    content: "Teacher to dev to barista to doctor is just collecting character classes. Eventually you'll have to pick a main.",
    points: 3,
    created_at: '2026-05-07T23:00:00Z',
  },
  {
    id: uuid(210),
    post_id: uuid(104),
    user_id: uuid(7),
    content: "You've been a teacher, developer, and barista. You already know what you want: to help people and make things. Med school is just another flavor of that.",
    points: 2,
    created_at: '2026-05-08T08:00:00Z',
  },
  {
    id: uuid(211),
    post_id: uuid(104),
    user_id: uuid(3),
    content: "Feature. The bug is thinking there's supposed to be an answer.",
    points: 11,
    created_at: '2026-05-08T10:00:00Z',
  },

  // Roasts for post 105 (8 roasts)
  {
    id: uuid(212),
    post_id: uuid(105),
    user_id: uuid(4),
    content: "You're describing a hitman for social situations. I'm in.",
    points: 15,
    created_at: '2026-05-06T17:00:00Z',
  },
  {
    id: uuid(213),
    post_id: uuid(105),
    user_id: uuid(2),
    content: "The gym cancellation alone is worth $50. Have you tried calling Planet Fitness? It's easier to escape Alcatraz.",
    points: 9,
    created_at: '2026-05-06T18:00:00Z',
  },
  {
    id: uuid(214),
    post_id: uuid(105),
    user_id: uuid(7),
    content: "This is just therapy with fewer boundaries and more liability. I respect it.",
    points: 7,
    created_at: '2026-05-06T19:00:00Z',
  },
  {
    id: uuid(215),
    post_id: uuid(105),
    user_id: uuid(1),
    content: "Breaking up with someone's partner for them is wild. But also... some people genuinely need that. There's a market for cowardice.",
    points: 4,
    created_at: '2026-05-06T20:00:00Z',
  },
  {
    id: uuid(216),
    post_id: uuid(105),
    user_id: uuid(6),
    content: "What's the SLA on quitting someone's job? Can you guarantee they won't just rehire themselves out of habit?",
    points: 3,
    created_at: '2026-05-06T21:00:00Z',
  },
  {
    id: uuid(217),
    post_id: uuid(105),
    user_id: uuid(8),
    content: "Honestly this exists. It's called having a friend who's too blunt. But I guess not everyone has one of those.",
    points: 2,
    created_at: '2026-05-06T22:00:00Z',
  },
  {
    id: uuid(218),
    post_id: uuid(105),
    user_id: uuid(3),
    content: "Do you do family dinners? I have some things I need said at Thanksgiving that I can't say myself.",
    points: 6,
    created_at: '2026-05-07T09:00:00Z',
  },
  {
    id: uuid(219),
    post_id: uuid(105),
    user_id: uuid(5),
    content: "The moat here is trust and discretion. Which means you'll need some serious vetting. Actually... that might be the premium tier.",
    points: 1,
    created_at: '2026-05-07T14:00:00Z',
  },

  // Roasts for post 106 (12 roasts)
  {
    id: uuid(220),
    post_id: uuid(106),
    user_id: uuid(1),
    content: "The laser eyes weren't a signal to buy. They were a warning that this person has no connection to reality.",
    points: 22,
    created_at: '2026-05-06T00:00:00Z',
  },
  {
    id: uuid(221),
    post_id: uuid(106),
    user_id: uuid(3),
    content: "Your emergency fund is for emergencies. The emergency is now. It's the conversation you need to have with your wife.",
    points: 18,
    created_at: '2026-05-06T01:00:00Z',
  },
  {
    id: uuid(222),
    post_id: uuid(106),
    user_id: uuid(4),
    content: "The fact that you haven't told your wife is the real story here. The Bitcoin is just the symptom.",
    points: 14,
    created_at: '2026-05-06T02:00:00Z',
  },
  {
    id: uuid(223),
    post_id: uuid(106),
    user_id: uuid(7),
    content: "Taking financial advice from Twitter is bad. Taking it from someone whose identity is literally a cryptocurrency cult symbol is catastrophic.",
    points: 11,
    created_at: '2026-05-06T03:00:00Z',
  },
  {
    id: uuid(224),
    post_id: uuid(106),
    user_id: uuid(2),
    content: "Sir this isn't a roast request, this is a cry for help. Please talk to a financial advisor and also your spouse.",
    points: 9,
    created_at: '2026-05-06T04:00:00Z',
  },
  {
    id: uuid(225),
    post_id: uuid(106),
    user_id: uuid(8),
    content: "The good news: Bitcoin might go to $500k. The bad news: your marriage might not survive long enough to find out.",
    points: 8,
    created_at: '2026-05-06T05:00:00Z',
  },
  {
    id: uuid(226),
    post_id: uuid(106),
    user_id: uuid(5),
    content: "Emergency funds exist because life is unpredictable. You just made it a lot more unpredictable.",
    points: 5,
    created_at: '2026-05-06T06:00:00Z',
  },
  {
    id: uuid(227),
    post_id: uuid(106),
    user_id: uuid(6),
    content: "Plot twist: I'm the guy with the laser eyes and I can't believe you actually did it.",
    points: 31,
    created_at: '2026-05-06T07:00:00Z',
  },
  {
    id: uuid(228),
    post_id: uuid(106),
    user_id: uuid(1),
    content: "Tell. Your. Wife. Today. The betrayal of trust is worse than any financial loss.",
    points: 7,
    created_at: '2026-05-06T08:00:00Z',
  },
  {
    id: uuid(229),
    post_id: uuid(106),
    user_id: uuid(4),
    content: "On the bright side, $40k in Bitcoin at $95k means you own about 0.42 BTC. At $500k that's $210k. At $30k that's $12.6k. Good luck.",
    points: 4,
    created_at: '2026-05-06T09:00:00Z',
  },
  {
    id: uuid(230),
    post_id: uuid(106),
    user_id: uuid(3),
    content: "The laser eyes work by staring at the sun until your risk assessment permanently burns out. Seems like it worked on you.",
    points: 6,
    created_at: '2026-05-06T10:00:00Z',
  },
  {
    id: uuid(231),
    post_id: uuid(106),
    user_id: uuid(7),
    content: "This post is going to age really well in one direction or another. Bookmarking for December.",
    points: 3,
    created_at: '2026-05-06T11:00:00Z',
  },
];

// Leaderboard derived from roast points
export const SEED_LEADERBOARD: LeaderboardEntry[] = [
  { user_id: uuid(6), handle: 'BrightSpark', total_points: 31, rank: 1 },  // The "laser eyes" comment
  { user_id: uuid(1), handle: 'TerseSnake', total_points: 29, rank: 2 },
  { user_id: uuid(3), handle: 'BoldEmber', total_points: 27, rank: 3 },
  { user_id: uuid(4), handle: 'SwiftAsh', total_points: 21, rank: 4 },
  { user_id: uuid(2), handle: 'QuietFlame', total_points: 18, rank: 5 },
  { user_id: uuid(7), handle: 'CalmCinder', total_points: 17, rank: 6 },
  { user_id: uuid(8), handle: 'WildFire', total_points: 10, rank: 7 },
  { user_id: uuid(5), handle: 'DeepCoal', total_points: 6, rank: 8 },
];

// Audit log events
export const SEED_AUDIT_EVENTS: AuditEvent[] = [
  { id: uuid(301), action: 'post', verified: true, confidence: 0.94, scope: 'post', attestation: '0x4f3a...8c21', created_at: '2026-05-08T22:00:00Z' },
  { id: uuid(302), action: 'roast', verified: true, confidence: 0.91, scope: 'roast', attestation: '0x7b2d...4e55', created_at: '2026-05-08T21:00:00Z' },
  { id: uuid(303), action: 'point', verified: true, confidence: 0.97, scope: 'point', attestation: '0x1c9f...6a03', created_at: '2026-05-08T20:30:00Z' },
  { id: uuid(304), action: 'roast', verified: true, confidence: 0.89, scope: 'roast', attestation: '0x8e4c...2b17', created_at: '2026-05-08T20:00:00Z' },
  { id: uuid(305), action: 'post', verified: true, confidence: 0.96, scope: 'post', attestation: '0x3d7a...9f82', created_at: '2026-05-08T19:00:00Z' },
  { id: uuid(306), action: 'point', verified: true, confidence: 0.93, scope: 'point', attestation: '0x6b1e...5c44', created_at: '2026-05-08T18:30:00Z' },
  { id: uuid(307), action: 'roast', verified: true, confidence: 0.92, scope: 'roast', attestation: '0x2f8d...7a19', created_at: '2026-05-08T18:00:00Z' },
  { id: uuid(308), action: 'point', verified: true, confidence: 0.95, scope: 'point', attestation: '0x9c3b...1d66', created_at: '2026-05-08T17:30:00Z' },
  { id: uuid(309), action: 'roast', verified: true, confidence: 0.88, scope: 'roast', attestation: '0x4a7f...8e32', created_at: '2026-05-08T17:00:00Z' },
  { id: uuid(310), action: 'post', verified: true, confidence: 0.94, scope: 'post', attestation: '0x5e2c...3b78', created_at: '2026-05-08T16:00:00Z' },
];

// Helper to get user by ID
export function getUserById(id: string): User | undefined {
  return SEED_USERS.find(u => u.id === id);
}

// Helper to get posts with user data
export function getPostsWithUsers(): (Post & { user: User })[] {
  return SEED_POSTS.map(post => ({
    ...post,
    user: getUserById(post.user_id)!,
  }));
}

// Helper to get roasts for a post with user data
export function getRoastsForPost(postId: string): (Roast & { user: User })[] {
  return SEED_ROASTS
    .filter(r => r.post_id === postId)
    .map(roast => ({
      ...roast,
      user: getUserById(roast.user_id)!,
    }))
    .sort((a, b) => b.points - a.points);
}

// Helper to get post by ID with all data
export function getPostById(id: string): (Post & { user: User; roasts: (Roast & { user: User })[] }) | undefined {
  const post = SEED_POSTS.find(p => p.id === id);
  if (!post) return undefined;
  return {
    ...post,
    user: getUserById(post.user_id)!,
    roasts: getRoastsForPost(post.id),
  };
}
