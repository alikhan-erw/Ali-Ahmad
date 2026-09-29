import type { Metadata } from 'next';
import { CustomerDashboard } from '../../../src/components/CustomerDashboard';
import { INITIAL_ORDERS } from '../../../src/data/mockData';

export function generateStaticParams() {
  return INITIAL_ORDERS.map((o) => ({
    id: o.id,
  }));
}

export const metadata: Metadata = {
  title: 'Order Status & Tracking | Zauq Luxury',
  description:
    'Detailed order breakdown, fulfillment progress, and shipping consignment tracking.',
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CustomerDashboard initialTab="orders" initialOrderId={id} />;
}
