/**
 * Database types for Roast
 */

export type Category = 'pitches' | 'decisions' | 'products' | 'life';

export type AuditAction = 'post' | 'roast' | 'point';

export interface User {
  id: string;
  handle: string;
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  category: Category;
  created_at: string;
  // Computed
  user?: User;
  roast_count?: number;
  roasts?: Roast[];
}

export interface Roast {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  points: number;
  created_at: string;
  // Computed
  user?: User;
}

export interface AuditEvent {
  id: string;
  action: AuditAction;
  verified: boolean;
  confidence: number;
  scope: string;
  attestation: string;
  created_at: string;
}

export interface LeaderboardEntry {
  user_id: string;
  handle: string;
  total_points: number;
  rank: number;
}

// Database schema for Supabase
export type Database = {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<User>;
      };
      posts: {
        Row: Post;
        Insert: Omit<Post, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Post>;
      };
      roasts: {
        Row: Roast;
        Insert: Omit<Roast, 'id' | 'created_at' | 'points'> & { id?: string; created_at?: string; points?: number };
        Update: Partial<Roast>;
      };
      audit_log: {
        Row: AuditEvent;
        Insert: Omit<AuditEvent, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<AuditEvent>;
      };
    };
    Views: {
      leaderboard: {
        Row: LeaderboardEntry;
      };
    };
  };
};
