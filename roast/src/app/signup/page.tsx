'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { EmberDot } from '@/components/ember-dot';
import { HandleDisplay } from '@/components/handle-badge';
import { ArrowRight, Mail } from 'lucide-react';

// Random two-word handles for demo
const HANDLES = [
  'TerseSnake', 'QuietFlame', 'BoldEmber', 'SwiftAsh',
  'DeepCoal', 'BrightSpark', 'CalmCinder', 'WildFire',
  'SilentStorm', 'GentleBlaze', 'SharpSmoke', 'WarmGlow'
];

type Step = 'email' | 'presence' | 'handle';

/**
 * Signup Page
 * Three-step flow: Email → Presence check → Handle assignment
 */
export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [handle, setHandle] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setStep('presence');
    }
  };

  const handlePresenceComplete = () => {
    // Assign random handle
    const randomHandle = HANDLES[Math.floor(Math.random() * HANDLES.length)];
    setHandle(randomHandle);
    setStep('handle');
  };

  const handleEnterRoom = () => {
    // Store handle in session for demo
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('roast_handle', handle);
    }
    router.push('/feed');
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md">
        {/* Step 1: Email */}
        {step === 'email' && (
          <div className="animate-fade-in-up">
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground text-center mb-2">
              Join the room
            </h1>
            <p className="text-muted-foreground text-center mb-8">
              Enter your email to begin the verification process.
            </p>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full h-12 pl-11 pr-4 bg-surface border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ember-1/50 focus:border-ember-1"
                />
              </div>

              <Button type="submit" variant="ember" size="lg" className="w-full">
                Continue
                <ArrowRight className="size-4 ml-2" />
              </Button>
            </form>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              Your email is used only for membership verification.
              <br />
              We don't store it after you're verified.
            </p>
          </div>
        )}

        {/* Step 2: Presence Check */}
        {step === 'presence' && (
          <div className="animate-fade-in-up text-center">
            <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-2">
              Presence check
            </h1>
            <p className="text-muted-foreground mb-12">
              Breathe with the ember for 5 seconds to prove you're human.
            </p>

            <EmberDot
              duration={5}
              onComplete={handlePresenceComplete}
              size={100}
            />
          </div>
        )}

        {/* Step 3: Handle Assignment */}
        {step === 'handle' && (
          <div className="animate-fade-in-up text-center">
            <div className="mb-8">
              <div className="w-16 h-16 mx-auto rounded-full bg-ember-1/20 flex items-center justify-center mb-4">
                <span className="text-2xl">🔥</span>
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
                Welcome to the room
              </h1>
            </div>

            <HandleDisplay handle={handle} className="mb-10" />

            <p className="text-muted-foreground text-sm mb-8">
              This is your anonymous identity. No one, including us, knows who you really are.
            </p>

            <Button
              variant="ember"
              size="lg"
              onClick={handleEnterRoom}
              className="w-full"
            >
              Enter the room
              <ArrowRight className="size-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
