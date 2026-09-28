import type { Metadata } from 'next';
import { CustomerDashboard } from '../../src/components/CustomerDashboard';

export const metadata: Metadata = {
  title: 'My Wishlist | Zauq Luxury',
  description:
    'View your saved artisanal shawls, fragrances, and heritage luxury decor items.',
};

export default function WishlistPage() {
  return <CustomerDashboard initialTab="wishlist" />;
}
