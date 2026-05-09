'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { PostList } from '@/components/post-card';
import { getPostsWithUsers, SEED_POSTS } from '@/lib/seed-data';
import type { Category } from '@/lib/supabase/types';
import { cn } from '@/lib/utils';

const categories: { value: Category | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pitches', label: 'Pitches' },
  { value: 'decisions', label: 'Decisions' },
  { value: 'products', label: 'Products' },
  { value: 'life', label: 'Life' },
];

/**
 * Feed Page
 * Shows all posts with category filters
 */
export default function FeedPage() {
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');

  const allPosts = getPostsWithUsers();

  // Filter by category
  const filteredPosts = activeCategory === 'all'
    ? allPosts
    : allPosts.filter(post => post.category === activeCategory);

  // Sort by heat (roast count) descending
  const sortedPosts = [...filteredPosts].sort(
    (a, b) => (b.roast_count ?? 0) - (a.roast_count ?? 0)
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Category filters */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {categories.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setActiveCategory(value)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors',
                  activeCategory === value
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Posts */}
          {sortedPosts.length > 0 ? (
            <PostList posts={sortedPosts} />
          ) : (
            <div className="py-20 text-center text-muted-foreground">
              No posts in this category yet.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
