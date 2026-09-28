import type { Metadata } from 'next';
import { CustomerDashboard } from '../../src/components/CustomerDashboard';

export const metadata: Metadata = {
  title: 'My Orders & Real-time Tracking | Zauq Luxury',
  description:
    'Track dispatch, express courier logistics, and invoice receipts for your artisanal purchases.',
};

export default function OrdersPage() {
  return <CustomerDashboard initialTab="orders" />;
}
