'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { PostCard } from '@/components/post-card';
import { RoastList } from '@/components/roast-card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getPostById, getRoastsForPost, SEED_ROASTS, SEED_USERS } from '@/lib/seed-data';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const MAX_ROAST_LENGTH = 280;

/**
 * Post Detail Page
 * Shows a single post with all its roasts
 */
export default function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [roastContent, setRoastContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roasts, setRoasts] = useState(() => getRoastsForPost(id));

  const post = getPostById(id);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Post not found
            </h1>
            <p className="text-muted-foreground mb-4">
              This post may have been removed.
            </p>
            <Link
              href="/feed"
              className="inline-flex items-center justify-center h-9 px-4 text-sm font-medium rounded-lg border border-border bg-transparent hover:bg-muted hover:text-foreground transition-colors"
            >
              Back to feed
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const handleSubmitRoast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roastContent.trim() || isSubmitting) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Add new roast to local state (in real app, this would be from API)
    const newRoast = {
      id: `temp-${Date.now()}`,
      post_id: id,
      user_id: SEED_USERS[0].id,
      content: roastContent.trim(),
      points: 0,
      created_at: new Date().toISOString(),
      user: SEED_USERS[0],
    };

    setRoasts(prev => [newRoast, ...prev]);
    setRoastContent('');
    setIsSubmitting(false);
  };

  const handleIgnite = (roastId: string) => {
    // Increment points (in real app, this would be an API call)
    setRoasts(prev =>
      prev.map(r =>
        r.id === roastId ? { ...r, points: r.points + 1 } : r
      )
    );
  };

  const charsRemaining = MAX_ROAST_LENGTH - roastContent.length;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Back link */}
          <Link
            href="/feed"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="size-4" />
            Back to feed
          </Link>

          {/* Post */}
          <PostCard post={post} isDetail />

          {/* Roast composer */}
          <div className="mt-8 bg-surface rounded-lg p-4">
            <form onSubmit={handleSubmitRoast}>
              <Textarea
                value={roastContent}
                onChange={(e) => setRoastContent(e.target.value)}
                placeholder="Share your honest take..."
                maxLength={MAX_ROAST_LENGTH}
                className="min-h-[100px] bg-background resize-none"
              />
              <div className="flex items-center justify-between mt-3">
                <span
                  className={`text-xs ${
                    charsRemaining < 20
                      ? 'text-destructive'
                      : 'text-muted-foreground'
                  }`}
                >
                  {charsRemaining} characters remaining
                </span>
                <Button
                  type="submit"
                  variant="ember"
                  size="sm"
                  disabled={!roastContent.trim() || isSubmitting}
                >
                  {isSubmitting ? 'Posting...' : 'Roast'}
                </Button>
              </div>
            </form>
          </div>

          {/* Roasts */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Roasts ({roasts.length})
            </h2>
            <RoastList roasts={roasts} onIgnite={handleIgnite} />
          </div>
        </div>
      </main>
    </div>
  );
}
