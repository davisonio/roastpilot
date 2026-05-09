import type { Verdict } from "@/lib/verdicts";

export type SeedComment = {
  authorName: string;
  verdict: Verdict;
  body: string;
};

export type SeedPost = {
  authorName: string;
  title: string;
  body: string;
  isPinned?: boolean;
  aiVerdict?: Verdict;
  aiResponse?: string;
  comments: SeedComment[];
};

export const SEED_POSTS: SeedPost[] = [
  {
    authorName: "roastpilot_devs",
    isPinned: true,
    title:
      "AITA for continuing to build Roastpilot after another guy got mad we had the same idea?",
    body: `So we are a small team building this app — Roastpilot. It is an AITA-style platform where Claude Opus delivers a verdict on your dilemma and humans pile on after. Trustpilot for being told you suck.

We were halfway through building it when a stranger reached out and said he was building literally the same thing. He got pissed off. Wanted us to stop. We initially agreed and pulled back.

Then we sat with it. We didn't know about him when we started. We've put real hours in. Two ideas can exist. So we kept building.

Now we are about to demo it on stage in front of a room of people. The very first thing we want to do — meta as hell — is have our own app judge whether we are the asshole for not stopping.

So... AITA?`,
    comments: [],
  },
  {
    authorName: "lasagnagate",
    title: "AITA for telling my MIL her lasagna is not, in fact, the best in the family?",
    body: `Every Sunday for 6 years my MIL has served lasagna and every Sunday everyone says it's incredible. It is fine. It is solidly fine. My sister-in-law Maria's lasagna is actually incredible — there is a reason the kids fight over the corner pieces at HER house.

This Sunday MIL asked me directly, in front of everyone, whose lasagna I prefer. I paused too long. Then I said, honestly, that I prefer Maria's. It was like I shot her dog. She left the table. My husband won't speak to me. Maria texted me a single trophy emoji.

AITA? She asked.`,
    aiVerdict: "ESH",
    aiResponse: `ESH, but barely. Your MIL set up an ambush and you walked into it with a sniper rifle when a polite shrug would have done. She wanted ego validation in front of her family; you delivered a Yelp review.

You were honest, which is fine in a vacuum. But blurting out a winner at HER table on HER ritual Sunday is a choice. Pull her aside, send a follow-up, bring a bottle of wine. Don't pretend you didn't know what she was asking.`,
    comments: [
      {
        authorName: "ravioli_referee",
        verdict: "NTA",
        body: "She asked. You answered. The whole 'you can't be honest when asked directly' thing is exhausting. Maria deserves that trophy emoji.",
      },
      {
        authorName: "carb_court",
        verdict: "ESH",
        body: "She set the trap. You took the bait with extra cheese. Both of you knew exactly what was happening.",
      },
      {
        authorName: "noodle_neutral",
        verdict: "YTA",
        body: "There is a kind, vague answer for situations like this and you know what it is. 'They're so different, I love both.' Done.",
      },
    ],
  },
  {
    authorName: "bridezilla_adjacent",
    title: "AITA for asking my sister to not bring her emotional support iguana to my wedding?",
    body: `My sister has had Reginald (a 4ft iguana) for two years. I love Reginald. Reginald is wonderful. Reginald has also bitten three people including the postman.

My venue is a historic library. The coordinator nearly fainted when I mentioned a live reptile guest. I asked my sister, kindly, to leave Reginald home for one evening. She said it was ableist. She has provided no documentation that Reginald is anything beyond a beloved pet.

She is now threatening to skip the wedding. My mom is on her side because "your sister has anxiety." So do I, MOM.`,
    aiVerdict: "NTA",
    aiResponse: `NTA, and your sister knows it, which is why she's reaching for the heaviest word in her vocabulary.

"Emotional support animal" has a real definition; an unprovoked-biting iguana at a historic-library wedding is not it. You're allowed to set conditions in your own venue. Your mom is doing what moms do — picking the kid making the most noise. Hold the line, leave space for your sister to attend without Reginald, and stop arguing about the label.`,
    comments: [
      {
        authorName: "iguana_truther",
        verdict: "NTA",
        body: "Reginald has bitten THREE people. This is not a service animal, this is a felony with scales.",
      },
      {
        authorName: "venue_vibes",
        verdict: "NTA",
        body: "I work in events. Historic libraries do not allow lizards. This is not personal, this is insurance.",
      },
      {
        authorName: "chaos_uncle",
        verdict: "NAH",
        body: "Honestly? Let Reginald come. The story will be incredible at every family event for the next 40 years.",
      },
    ],
  },
  {
    authorName: "rent_drama_throwaway",
    title:
      "AITA for charging my deadbeat roommate market rate after he said he 'forgot' rent for 4 months?",
    body: `My roommate Dan has paid rent on time exactly twice in the last 6 months. I've covered him every time, telling myself it's fine, he's a friend. Last month I found out he's been buying NFTs.

I told him I was raising his portion of rent by $200/month — exactly the amount of late-fee pain I've absorbed. He flipped out and said I was exploiting him. I'm not the landlord. We split rent. I just stopped subsidizing his JPEG habit.

He's threatening to move out. I would help him pack.`,
    aiVerdict: "NTA",
    aiResponse: `NTA. You are not a bank, you are not a charity, and you are absolutely not the involuntary co-investor in his JPEG portfolio.

Covering rent for a friend once or twice is generous. Six months of it while he buys speculative pixel art is just being mugged in slow motion. The "raise" isn't really a raise; it's the receipt for what he already owes. The fact that "I would help him pack" made me laugh out loud is, legally, irrelevant.`,
    comments: [
      {
        authorName: "lease_pirate",
        verdict: "NTA",
        body: "He's not your tenant, he's a charity case. And the charity is now closed.",
      },
      {
        authorName: "split_the_check",
        verdict: "NTA",
        body: "NFTs. NFTs. The man bought NFTs with money you fronted him. There is no universe where you are the asshole.",
      },
      {
        authorName: "softhearted",
        verdict: "INFO",
        body: "Did you ever clearly tell him he owed it back? Because if it was unspoken, the surprise raise is a different conversation than you think.",
      },
    ],
  },
  {
    authorName: "office_pettiness",
    title:
      "AITA for replying-all to my coworker's 'just circling back' email at 11pm with a circle emoji?",
    body: `Brad has sent me 14 'just circling back' emails in 3 weeks. Always cc'ing my manager. Always passive-aggressive. Always at hours that make me look bad if I don't respond.

Last night, 10:47pm, another one. I snapped. I replied-all (sorry, manager) with a single 🔄 emoji. Nothing else. He has not emailed since. My manager pulled me aside and said 'I can't say I disagree but please don't do that again.'

Was it worth it? Yes. Am I the asshole? Probably?`,
    aiVerdict: "NAH",
    aiResponse: `NAH, with a footnote that says lol. This was not a moral conflict, it was a meme being delivered with surgical accuracy.

Brad was farming visibility off your inbox. You broke the loop with the smallest possible payload. Your manager's response — 'I can't disagree but don't' — is the exact correct managerial answer. Don't make this a habit, but the one-time emoji was a public service.`,
    comments: [
      {
        authorName: "slack_assassin",
        verdict: "NTA",
        body: "Iconic. Hall of fame reply. I will be telling this story at standups.",
      },
      {
        authorName: "hr_adjacent",
        verdict: "ESH",
        body: "Brad sucks. You replied-all with an emoji to your manager. You are both, in different and beautiful ways, the problem.",
      },
      {
        authorName: "punctuality",
        verdict: "NAH",
        body: "Workplace haiku. He started it; you finished it in one character.",
      },
    ],
  },
  {
    authorName: "split_the_bill",
    title: "AITA for asking the friend who only orders water and steals fries to pay an even split?",
    body: `Group of 6. We go out roughly once a month. Same friend, every single time, orders just water, claiming she ate before. Then proceeds to eat 30% of everyone's fries. Then participates fully in the let's-just-split-it-evenly moment.

Last night I said, gently, that we could itemize this time. She got hot. Said I was making her feel bad for being broke. She is not broke. She just took a vacation to Lisbon.

I love her. But also? Stop touching my fries.`,
    aiVerdict: "NTA",
    aiResponse: `NTA. The 'just water' to fry-pillager pipeline is a known phenomenon and you have correctly identified the load-bearing scam.

Itemizing is not punishment, it's accuracy. The Lisbon detail is also not nothing — 'I'm broke' has to mean something, or it stops meaning anything. Have a private 1:1 next time, frame it as 'we want to keep going out with you,' and protect your fries.`,
    comments: [
      {
        authorName: "fry_steward",
        verdict: "NTA",
        body: "Lisbon. LISBON. She's not broke, she's just mooching. Itemize forever.",
      },
      {
        authorName: "kindness_first",
        verdict: "ESH",
        body: "Itemizing in front of the whole group is the asshole part. Privately, this is fine.",
      },
      {
        authorName: "math_was_math",
        verdict: "NTA",
        body: "Everyone with a calculator and a memory is on your side.",
      },
    ],
  },
  {
    authorName: "cat_dad_sorry",
    title: "AITA for telling my GF her cat has a face like a dropped pie?",
    body: `Look. I love Mango. Mango is a sweet cat with the most distinctive face I have ever seen on a living animal. He looks like he was assembled in the dark from spare cat parts.

My girlfriend asked, while holding Mango up to my face, if he wasn't handsome. I said, smiling, that he had a face like a dropped pie, and that I loved him. She did not laugh. She has not laughed for three days. Mango, however, looked very proud.

AITA?`,
    aiVerdict: "YTA",
    aiResponse: `YTA, but in the way where you also kind of know it, which is honestly the most common AITA condition.

She didn't ask for a comedy bit, she asked for affirmation. 'Isn't he handsome?' is rhetorical. The line is funny — it is, objectively, very funny — but you saved it instead of releasing it, and the moment was wrong. Apologize, mean it, and never use the dropped-pie line again. Even though it'll haunt you forever.`,
    comments: [
      {
        authorName: "feline_forensics",
        verdict: "YTA",
        body: "I'm sorry the joke was incredible but the timing was war crimes.",
      },
      {
        authorName: "ride_or_die",
        verdict: "NTA",
        body: "If she can't laugh at her own pie-faced cat, that's a her problem. Mango knows what he is.",
      },
      {
        authorName: "mango_stan",
        verdict: "ESH",
        body: "You for the line. Her for asking the question while LOOKING AT HIM. Mango wins.",
      },
    ],
  },
  {
    authorName: "groomswomen",
    title:
      "AITA for putting my best man (a woman) in a tux instead of forcing her into a bridesmaid dress?",
    body: `My best friend since age 7 is a woman. She's my best person. She's wearing what the rest of my groomsmen are wearing — a tux. She looks great in it.

My fiancée's mother is now mounting a campaign that the line should be all dresses on her side, all suits on his side. She has called me three times. Three.

My best person doesn't want to wear a dress. I don't want her to wear a dress. My fiancée has stayed politely out of it. Am I being inflexible or is FMIL the asshole?`,
    aiVerdict: "NTA",
    aiResponse: `NTA, comfortably. The wedding party is wearing what they want to wear; the visual symmetry of a 1955 wedding photo is not a moral imperative.

FMIL is having an aesthetic crisis and trying to make it everyone else's problem. Your fiancée is staying out of it, which is a quiet thumbs-up. Don't relitigate this with FMIL — just stop relitigating. Your best friend is your best friend; she gets a tux.`,
    comments: [
      {
        authorName: "tailored",
        verdict: "NTA",
        body: "Tuxes look incredible on women. FMIL needs a hobby.",
      },
      {
        authorName: "etiquette_old_school",
        verdict: "NAH",
        body: "Your call, your wedding. But this is a generational thing for FMIL, not a malice thing. Be kind even as you ignore her.",
      },
      {
        authorName: "best_woman",
        verdict: "NTA",
        body: "I was a best woman in a tux. Best photos of my life. Hold the line.",
      },
    ],
  },
  {
    authorName: "bookclub_burnout",
    title: "AITA for quitting the book club because nobody actually reads the book?",
    body: `Two years. Once a month. We are SUPPOSED to discuss a novel. For the last six meetings, I am the only one who has finished, started, or in some cases acquired the book.

We instead talk about: Carol's divorce (ongoing), the HOA, what Whole Foods is doing wrong, and someone's nephew. I gently asked last time if we could do 20 minutes on the actual book. The room went silent. Then Carol said, 'we can if you really want to.'

I quit the group chat. They are now calling me dramatic.`,
    aiVerdict: "NTA",
    aiResponse: `NTA. You did not 'quit a book club.' You exited a poorly-disguised gossip subscription that had been mislabeled.

'We can if you really want to' is the nicest, most passive-aggressive thing one human can say to another. You asked for the stated purpose of the group; they told you, gently, that the stated purpose was a fiction. Leaving was correct. You don't owe them drama-status because you noticed the bait-and-switch.`,
    comments: [
      {
        authorName: "page_turner",
        verdict: "NTA",
        body: "Book clubs that don't read are just clubs. Which is fine! But call it that.",
      },
      {
        authorName: "carol_apologist",
        verdict: "ESH",
        body: "You quit via group chat, which is the modern flounce. Could have just stopped showing up.",
      },
      {
        authorName: "ex_member",
        verdict: "NTA",
        body: "I was in this exact club. The book was always 'on my Kindle.' I am free now.",
      },
    ],
  },
  {
    authorName: "minimalist_mom",
    title: "AITA for donating my teen's collection of empty energy drink cans while he was at camp?",
    body: `Forty-three cans. Forty-three. On a wire shelf. He calls it 'the wall.' He has been curating it for two years. He says it's art. It smells faintly of regret.

He went to camp for two weeks. I donated/recycled all of them. Cleaned the shelf. Surprise! Fresh start. He came home, walked into his room, and made a sound I have never heard a human make.

He says I destroyed his archive. My husband is laughing too hard to take a side.`,
    aiVerdict: "YTA",
    aiResponse: `YTA. Yes, the cans were ugly. Yes, the shelf was probably load-bearing on regret. None of that gives you the right to throw away a teenager's stuff while he's at camp.

This isn't about cans, it's about the fact that 'his room' has to mean something or it means nothing. He took something seriously, you didn't, and you used his absence to act on your taste at the expense of his autonomy. Apologize for real, not 'I'm sorry you feel that way.' And if you can rescue any from recycling, do it.`,
    comments: [
      {
        authorName: "teen_translator",
        verdict: "YTA",
        body: "You disappeared his stuff while he was gone. That is a foundational trust break, not a cleaning project.",
      },
      {
        authorName: "neat_freak",
        verdict: "NTA",
        body: "It was 43 EMPTY CANS. He'll be fine. He'll laugh about it at 25.",
      },
      {
        authorName: "boundary_bot",
        verdict: "YTA",
        body: "It doesn't matter that the collection was bad. It matters that it was his.",
      },
    ],
  },
  {
    authorName: "gym_etiquette",
    title: "AITA for telling the guy who 'works in' on my squat rack to do something else?",
    body: `I superset with the rack. Bar always loaded, I leave for 60 seconds at most. Same guy, three sessions in a row, asks to 'work in.' He doesn't squat. He uses the rack to do bicep curls. With the bar. On the rack.

Today I said, kindly, that there was an open dumbbell rack 10 feet that way and he didn't need a squat rack to curl. He called me a gatekeeper. The desk staff laughed.

AITA?`,
    aiVerdict: "NTA",
    aiResponse: `NTA. 'Working in' implies you are doing the same exercise. Curling on a squat rack is not 'working in,' it's parking in a handicapped spot to charge your phone.

You were polite, you offered him a real alternative ten feet away, and he reached for the laziest comeback in the gym vocabulary. The desk staff agreed, which is the gym equivalent of a higher court ruling. Carry on.`,
    comments: [
      {
        authorName: "iron_paralegal",
        verdict: "NTA",
        body: "Curls in the squat rack is the canonical sin. You are doing the work of saints.",
      },
      {
        authorName: "fair_witness",
        verdict: "NAH",
        body: "He's wrong but he's not a villain. He just doesn't know any better. Now he does.",
      },
      {
        authorName: "rack_steward",
        verdict: "NTA",
        body: "Forward this to every gym on earth.",
      },
    ],
  },
  {
    authorName: "dad_of_picky",
    title:
      "AITA for ordering my 8yo a kids' menu meal after she promised, AGAIN, she'd eat the adult dish?",
    body: `My daughter is 8 and has done this approximately 40 times. She wants the salmon. Salmon arrives. She doesn't like it. I eat the salmon. She eats my fries. We pay for two meals.

Tonight, she begged for the steak. I asked her, if I order it, will you eat it? She gave me her most solemn nod. I ordered her the kids' chicken tenders anyway. She melted down. My wife thinks I undermined her in public.

I have eaten 40 dollars of unwanted salmon this year.`,
    aiVerdict: "ESH",
    aiResponse: `ESH. You're right about the pattern, wrong about the play.

Teaching kids about food and consequences is great. The move is: order the steak, and when she doesn't eat it, the lesson is the cold steak in the to-go box, not the bait-and-switch in front of her. By overriding her after asking, you taught her that her input doesn't matter even when she gives the right answer. Your wife is right that this needed to be a conversation at home, not a gotcha at the table. And your daughter is 8 — she doesn't owe you a perfect track record.`,
    comments: [
      {
        authorName: "tired_parent",
        verdict: "NTA",
        body: "Forty dollars of salmon. FORTY. This is just math.",
      },
      {
        authorName: "feeding_therapist",
        verdict: "ESH",
        body: "She's 8. The deception was the asshole part. The lesson should have been the cold uneaten steak.",
      },
      {
        authorName: "salmon_truther",
        verdict: "YTA",
        body: "You set her up. You asked, she answered, you ignored her. That's a worse lesson than salmon.",
      },
    ],
  },
];
