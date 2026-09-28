import type { Metadata } from 'next';
import { AdminPanel } from '../../src/components/AdminPanel';

export const metadata: Metadata = {
  title: 'Admin Console & Retail Operations | Zauq Luxury',
  description:
    'Executive enterprise dashboard for inventory ledger, order reconciliation, customer directory, coupons, and Supabase database controls.',
};

export default function AdminPage() {
  return <AdminPanel />;
}
