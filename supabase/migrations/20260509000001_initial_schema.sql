-- Roastpilot schema

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  title text not null,
  body text not null,
  ai_verdict text check (ai_verdict in ('NTA','YTA','ESH','NAH','INFO')),
  ai_response text,
  is_pinned boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  author_name text not null,
  verdict text not null check (verdict in ('NTA','YTA','ESH','NAH','INFO')),
  body text not null,
  ignitions int not null default 0,
  created_at timestamptz not null default now()
);

create index on posts (created_at desc);
create index on posts (is_pinned) where is_pinned = true;
create index on comments (post_id);
create index on comments (ignitions desc);

-- Seed the pinned meta-post
insert into posts (author_name, title, body, ai_verdict, ai_response, is_pinned) values (
  'roastpilot_devs',
  'AITA for continuing to build Roastpilot after another guy got mad we had the same idea?',
  E'So we are a small team building this app — Roastpilot. It is an AITA-style platform where AI delivers a verdict on your dilemma and humans pile on after. Trustpilot for being told you suck.\n\nWe were halfway through building it when a stranger reached out and said he was building literally the same thing. He got pissed off. Wanted us to stop. We initially agreed and pulled back.\n\nThen we sat with it. We didn''t know about him when we started. We''ve put real hours in. Two ideas can exist. So we kept building.\n\nNow we are about to demo it on stage in front of a room of people. The very first thing we want to do — meta as hell — is have our own app judge whether we are the asshole for not stopping.\n\nSo... AITA?',
  'NTA',
  E'Not the asshole. Not even close.\n\nYou built something before you knew he existed. Ideas are not property — execution is. The fact that two people independently arrived at the same concept is not theft, it''s market validation. Every major product has a parallel story: two teams, same insight, different outcomes.\n\nYou paused when confronted. That''s not weakness, that''s integrity. Then you thought it through and made a rational call. That''s also not being an asshole — that''s being a founder.\n\nHis anger is understandable. His demand is not. You don''t owe anyone a monopoly on an idea they haven''t shipped.',
  true
);

-- Seed more posts
insert into posts (author_name, title, body, ai_verdict, ai_response) values (
  'lasagnagate',
  'AITA for telling my MIL her lasagna is not, in fact, the best in the family?',
  E'Every Sunday for 6 years my MIL has served lasagna and every Sunday everyone says it''s incredible. It is fine. It is solidly fine. My sister-in-law Maria''s lasagna is actually incredible.\n\nThis Sunday MIL asked me directly, in front of everyone, whose lasagna I prefer. I paused too long. Then I said, honestly, that I prefer Maria''s. It was like I shot her dog. My husband won''t speak to me. Maria texted me a single trophy emoji.\n\nAITA? She asked.',
  'ESH',
  E'ESH, but barely. Your MIL set up an ambush and you walked into it with a sniper rifle when a polite shrug would have done. She wanted ego validation at her own table; you delivered a Yelp review.\n\nYou were honest, which is fine in a vacuum. But blurting out a winner at her ritual Sunday is a choice. Pull her aside, send a follow-up, bring wine. Don''t pretend you didn''t know what she was asking.'
),
(
  'bridezilla_adjacent',
  'AITA for asking my sister to not bring her emotional support iguana to my wedding?',
  E'My sister has had Reginald (a 4ft iguana) for two years. I love Reginald. Reginald is wonderful. Reginald has also bitten three people including the postman.\n\nMy venue is a historic library. The coordinator nearly fainted when I mentioned a live reptile guest. I asked my sister, kindly, to leave Reginald home for one evening. She said it was ableist. She is now threatening to skip the wedding.\n\nMy mom is on her side because "your sister has anxiety." So do I, MOM.',
  'NTA',
  E'NTA, and your sister knows it, which is why she''s reaching for the heaviest word in her vocabulary.\n\n"Emotional support animal" has a real definition; an unprovoked-biting iguana at a historic-library wedding is not it. You''re allowed to set conditions at your own venue. Hold the line. Leave space for your sister to attend without Reginald.'
);

-- Seed comments on the meta post
insert into comments (post_id, author_name, verdict, body, ignitions)
select id, 'two_ideas_exist', 'NTA', 'Ideas aren''t first-come-first-served. Whoever ships wins. Build.', 47
from posts where is_pinned = true;

insert into comments (post_id, author_name, verdict, body, ignitions)
select id, 'patent_pending_vibes', 'NTA', 'He didn''t invent AITA. You''re not copying his product. You''re building in the same space. That''s called a market.', 31
from posts where is_pinned = true;

insert into comments (post_id, author_name, verdict, body, ignitions)
select id, 'devils_advocate', 'ESH', 'Could''ve reached out to collaborate instead. But NTA for continuing to build.', 12
from posts where is_pinned = true;
