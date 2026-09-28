import type { Metadata } from 'next';
import { LegalPagesModal } from '../../src/components/LegalPagesModal';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Client Policies & Legal Terms | Zauq Luxury',
  description:
    'Review terms of patronage, client data privacy protection, returns & refund policies, and shipping coverage.',
};

export default async function LegalPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const resolved = await searchParams;
  return (
    <Suspense fallback={<div className="p-12 text-center text-stone-500 font-mono text-sm">Loading policies...</div>}>
      <LegalPagesModal initialTopic={resolved.topic || 'terms'} />
    </Suspense>
  );
}
