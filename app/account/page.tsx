import type { Metadata } from 'next';
import { CustomerDashboard } from '../../src/components/CustomerDashboard';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Customer Dashboard | Zauq Luxury',
  description:
    'Manage your artisanal orders, tracked shipments, delivery addresses, and personal wishlist.',
};

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: 'orders' | 'wishlist' | 'addresses' | 'reviews' }>;
}) {
  const resolved = await searchParams;
  return (
    <Suspense fallback={<div className="p-12 text-center text-stone-500 font-mono text-sm">Loading account...</div>}>
      <CustomerDashboard initialTab={resolved.tab || 'orders'} />
    </Suspense>
  );
}
