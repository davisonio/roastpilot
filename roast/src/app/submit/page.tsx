'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Flame, Loader2 } from 'lucide-react';
import type { Category } from '@/lib/supabase/types';

const categories: { value: Category; label: string; description: string }[] = [
  { value: 'pitches', label: 'Pitch', description: 'Business ideas, product concepts' },
  { value: 'decisions', label: 'Decision', description: 'Life choices, career moves' },
  { value: 'products', label: 'Product', description: 'Something you built' },
  { value: 'life', label: 'Life', description: 'Personal questions, dilemmas' },
];

type SubmitState = 'composing' | 'lighting' | 'done';

/**
 * Submit Post Page
 * Compose and submit a new post
 */
export default function SubmitPage() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const [state, setState] = useState<SubmitState>('composing');

  const canSubmit = content.trim().length > 10 && category !== null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    // Start "lighting the kindling" animation
    setState('lighting');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setState('done');

    // Redirect after brief delay
    setTimeout(() => {
      router.push('/feed');
    }, 1000);
  };

  if (state === 'done') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center animate-fade-in-up">
            <div className="w-16 h-16 mx-auto rounded-full bg-ember-1/20 flex items-center justify-center mb-4">
              <Flame className="size-8 text-ember-1" />
            </div>
            <h1 className="font-display text-2xl font-semibold text-foreground mb-2">
              Your post is in the room.
            </h1>
            <p className="text-muted-foreground">
              Redirecting to feed...
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (state === 'lighting') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-ember-1/20 flex items-center justify-center mb-4 animate-ember-breathe">
              <Flame className="size-8 text-ember-1" />
            </div>
            <h1 className="font-display text-2xl font-semibold text-foreground mb-2">
              Lighting the kindling...
            </h1>
            <Loader2 className="size-5 text-ember-1 mx-auto animate-spin mt-4" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-2">
            What do you want honest feedback on?
          </h1>
          <p className="text-muted-foreground mb-8">
            Be specific. The more context you give, the better the roasts.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Content */}
            <div>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="I'm thinking about quitting my job to start a company that..."
                className="min-h-[200px] text-lg font-display resize-none bg-surface"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                {content.length} characters
                {content.length < 10 && ' (minimum 10)'}
              </p>
            </div>

            {/* Category selector */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Category
              </label>
              <div className="grid grid-cols-2 gap-3">
                {categories.map(({ value, label, description }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setCategory(value)}
                    className={cn(
                      'p-4 rounded-lg text-left transition-all duration-200',
                      'border',
                      category === value
                        ? 'bg-ember-1/10 border-ember-1 text-foreground'
                        : 'bg-surface border-border hover:border-muted-foreground text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <div className="font-medium">{label}</div>
                    <div className="text-xs opacity-70 mt-0.5">{description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="ember"
                size="lg"
                disabled={!canSubmit}
              >
                <Flame className="size-4 mr-2" />
                Light the fire
              </Button>
            </div>
          </form>

          {/* Guidelines */}
          <div className="mt-12 p-4 bg-surface/50 rounded-lg">
            <h3 className="text-sm font-medium text-foreground mb-2">
              Before you post
            </h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Be specific about what you want feedback on</li>
              <li>• Include relevant context (numbers, timeline, constraints)</li>
              <li>• Ask a clear question or present a clear dilemma</li>
              <li>• Be ready to hear honest opinions, not validation</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
