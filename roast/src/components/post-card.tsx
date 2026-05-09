'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { HeatGlow } from './heat-glow';
import { HandleBadge } from './handle-badge';
import { formatRoastCount, formatRelativeTime, calculateHeatLevel } from '@/lib/heat';
import { Flame } from 'lucide-react';
import type { Post, User, Category } from '@/lib/supabase/types';

interface PostCardProps {
  post: Post & { user: User };
  className?: string;
  isDetail?: boolean;
}

const categoryLabels: Record<Category, string> = {
  pitches: 'Pitch',
  decisions: 'Decision',
  products: 'Product',
  life: 'Life',
};

/**
 * PostCard - displays a post with heat-based glow
 */
export function PostCard({ post, className, isDetail = false }: PostCardProps) {
  const roastCount = post.roast_count ?? 0;
  const heatLevel = calculateHeatLevel(roastCount);

  const card = (
    <HeatGlow
      roastCount={roastCount}
      className={cn(
        'bg-card p-6 noise-texture group',
        !isDetail && 'hover:translate-y-[-2px] cursor-pointer',
        className
      )}
    >
      {/* Header: Handle */}
      <div className="flex items-center gap-2 mb-4">
        <HandleBadge handle={post.user.handle} size="sm" />
        <span className="text-muted-foreground text-xs">says:</span>
      </div>

      {/* Content */}
      <p
        className={cn(
          'font-display leading-relaxed',
          isDetail ? 'text-xl md:text-2xl' : 'text-lg',
          'text-foreground'
        )}
      >
        {post.content}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
        {/* Category */}
        <span className="text-xs uppercase tracking-wider text-muted-foreground">
          {categoryLabels[post.category]}
        </span>

        {/* Roast count + heat indicator */}
        <div className="flex items-center gap-2">
          <Flame
            className={cn(
              'size-4 transition-colors duration-300',
              heatLevel === 0 && 'text-cool',
              heatLevel === 1 && 'text-ember-1',
              heatLevel === 2 && 'text-ember-2',
              heatLevel === 3 && 'text-ember-3',
              heatLevel >= 4 && 'text-ember-4'
            )}
          />
          <span
            className={cn(
              'text-sm',
              heatLevel === 0 && 'text-cool',
              heatLevel >= 1 && 'text-muted-foreground'
            )}
          >
            {formatRoastCount(roastCount)}
          </span>
        </div>
      </div>

      {/* Time - quiet */}
      <div className="mt-2 text-xs text-muted-foreground/60">
        {formatRelativeTime(post.created_at)}
      </div>
    </HeatGlow>
  );

  if (isDetail) {
    return card;
  }

  return (
    <Link href={`/post/${post.id}`}>
      {card}
    </Link>
  );
}

/**
 * PostList - renders a list of post cards
 */
export function PostList({
  posts,
  className
}: {
  posts: (Post & { user: User })[];
  className?: string;
}) {
  return (
    <div className={cn('space-y-6', className)}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
