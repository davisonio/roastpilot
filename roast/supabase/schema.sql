-- Roast Database Schema
-- Run this in your Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (anonymous handles)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  handle TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  category TEXT CHECK (category IN ('pitches', 'decisions', 'products', 'life')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Roasts table
CREATE TABLE roasts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) <= 280),
  points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit log table
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT CHECK (action IN ('post', 'roast', 'point')) NOT NULL,
  verified BOOLEAN DEFAULT TRUE,
  confidence FLOAT CHECK (confidence >= 0 AND confidence <= 1) NOT NULL,
  scope TEXT NOT NULL,
  attestation TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_roasts_post_id ON roasts(post_id);
CREATE INDEX idx_roasts_user_id ON roasts(user_id);
CREATE INDEX idx_roasts_points ON roasts(points DESC);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at DESC);

-- View: Posts with roast count
CREATE VIEW posts_with_roast_count AS
SELECT
  p.*,
  COUNT(r.id)::INTEGER AS roast_count
FROM posts p
LEFT JOIN roasts r ON r.post_id = p.id
GROUP BY p.id;

-- View: Leaderboard (total points per user)
CREATE VIEW leaderboard AS
SELECT
  u.id AS user_id,
  u.handle,
  COALESCE(SUM(r.points), 0)::INTEGER AS total_points,
  ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(r.points), 0) DESC)::INTEGER AS rank
FROM users u
LEFT JOIN roasts r ON r.user_id = u.id
GROUP BY u.id, u.handle
ORDER BY total_points DESC
LIMIT 10;

-- Row Level Security (RLS) Policies
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE roasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Allow public read access (anonymous app)
CREATE POLICY "Allow public read on users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow public read on posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Allow public read on roasts" ON roasts FOR SELECT USING (true);
CREATE POLICY "Allow public read on audit_log" ON audit_log FOR SELECT USING (true);

-- Allow authenticated insert (for demo, allow all inserts via anon key)
CREATE POLICY "Allow public insert on users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on posts" ON posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on roasts" ON roasts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on audit_log" ON audit_log FOR INSERT WITH CHECK (true);

-- Allow authenticated update on roasts (for points)
CREATE POLICY "Allow public update on roasts" ON roasts FOR UPDATE USING (true);

-- ============================================
-- SEED DATA
-- ============================================

-- Insert seed users
INSERT INTO users (id, handle, created_at) VALUES
  ('00000000-0000-0000-0000-000000000001', 'TerseSnake', '2026-05-01T10:00:00Z'),
  ('00000000-0000-0000-0000-000000000002', 'QuietFlame', '2026-05-01T11:00:00Z'),
  ('00000000-0000-0000-0000-000000000003', 'BoldEmber', '2026-05-02T09:00:00Z'),
  ('00000000-0000-0000-0000-000000000004', 'SwiftAsh', '2026-05-02T14:00:00Z'),
  ('00000000-0000-0000-0000-000000000005', 'DeepCoal', '2026-05-03T08:00:00Z'),
  ('00000000-0000-0000-0000-000000000006', 'BrightSpark', '2026-05-03T16:00:00Z'),
  ('00000000-0000-0000-0000-000000000007', 'CalmCinder', '2026-05-04T12:00:00Z'),
  ('00000000-0000-0000-0000-000000000008', 'WildFire', '2026-05-05T10:00:00Z');

-- Insert seed posts
INSERT INTO posts (id, user_id, content, category, created_at) VALUES
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 'I''m thinking of building a dating app where you can only message someone after solving a puzzle they created. Matches based on how you think, not just photos. Is this stupid or am I onto something?', 'pitches', '2026-05-08T22:00:00Z'),
  ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000002', 'I just turned down a $180k offer to stay at my current job making $95k because I genuinely believe in what we''re building. My friends think I''ve lost my mind. Did I?', 'decisions', '2026-05-08T18:00:00Z'),
  ('00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000003', 'We''ve been working on this AI writing assistant for 8 months. Just got our first paying customer yesterday - $29/month. Should I feel excited or embarrassed that it took this long?', 'products', '2026-05-08T14:00:00Z'),
  ('00000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000000004', 'I''m 34 and still don''t know what I want to be when I grow up. I''ve been a teacher, a developer, a barista, and now I''m thinking about med school. Is this restlessness a bug or a feature?', 'life', '2026-05-07T20:00:00Z'),
  ('00000000-0000-0000-0000-000000000105', '00000000-0000-0000-0000-000000000005', 'Hear me out: a subscription service for uncomfortable conversations. You pay us $50/month and we''ll call your gym to cancel, break up with your partner, or tell your boss you quit. We handle the awkward, you move on with your life.', 'pitches', '2026-05-06T16:00:00Z'),
  ('00000000-0000-0000-0000-000000000106', '00000000-0000-0000-0000-000000000006', 'I spent my entire emergency fund ($40k) on Bitcoin at $95,000 because a guy on Twitter with a laser eye profile picture said it''s going to $500k by end of year. I haven''t told my wife yet.', 'decisions', '2026-05-05T23:00:00Z');

-- Insert seed roasts (sample - full set in seed-data.ts)
INSERT INTO roasts (id, post_id, user_id, content, points, created_at) VALUES
  ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000003', 'You turned down almost double your salary for ''belief''? That''s not conviction, that''s Stockholm syndrome with a 401k.', 3, '2026-05-08T19:00:00Z'),
  ('00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000007', 'The people who stay for the mission are the ones who make the mission succeed. Or the ones who look back in 5 years wondering why they didn''t take the money. Flip a coin.', 1, '2026-05-08T20:00:00Z'),
  ('00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000001', '$29/month after 8 months. That''s $29 more than most people ever make from their side projects. Stop comparing yourself to outliers.', 5, '2026-05-08T15:00:00Z'),
  ('00000000-0000-0000-0000-000000000220', '00000000-0000-0000-0000-000000000106', '00000000-0000-0000-0000-000000000001', 'The laser eyes weren''t a signal to buy. They were a warning that this person has no connection to reality.', 22, '2026-05-06T00:00:00Z'),
  ('00000000-0000-0000-0000-000000000227', '00000000-0000-0000-0000-000000000106', '00000000-0000-0000-0000-000000000006', 'Plot twist: I''m the guy with the laser eyes and I can''t believe you actually did it.', 31, '2026-05-06T07:00:00Z');

-- Insert sample audit events
INSERT INTO audit_log (id, action, verified, confidence, scope, attestation, created_at) VALUES
  ('00000000-0000-0000-0000-000000000301', 'post', true, 0.94, 'post', '0x4f3a...8c21', '2026-05-08T22:00:00Z'),
  ('00000000-0000-0000-0000-000000000302', 'roast', true, 0.91, 'roast', '0x7b2d...4e55', '2026-05-08T21:00:00Z'),
  ('00000000-0000-0000-0000-000000000303', 'point', true, 0.97, 'point', '0x1c9f...6a03', '2026-05-08T20:30:00Z'),
  ('00000000-0000-0000-0000-000000000304', 'roast', true, 0.89, 'roast', '0x8e4c...2b17', '2026-05-08T20:00:00Z'),
  ('00000000-0000-0000-0000-000000000305', 'post', true, 0.96, 'post', '0x3d7a...9f82', '2026-05-08T19:00:00Z');
