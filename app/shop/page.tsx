import type { Metadata } from 'next';
import { ShopCatalog } from '../../src/components/ShopCatalog';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Artisanal Collection & Catalog | Zauq Luxury',
  description:
    'Browse our complete luxury catalog of limited-batch artisanal garments, rare distillations, and hand-finished lifestyle heirlooms.',
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const resolvedParams = await searchParams;
  return (
    <Suspense fallback={<div className="p-12 text-center text-stone-500 font-mono text-sm">Loading collection...</div>}>
      <ShopCatalog initialCategory={resolvedParams.category || null} />
    </Suspense>
  );
}
