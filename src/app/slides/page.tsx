import type { Metadata } from 'next';
import { SlidesClient } from './slides-client';

export const metadata: Metadata = {
  title: 'Roast Presentation',
  description: 'A web-based presentation for Roast.',
};

export default function SlidesPage() {
  return <SlidesClient />;
}
