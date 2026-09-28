import type { Metadata } from 'next';
import { EmployeePanel } from '../../src/components/EmployeePanel';

export const metadata: Metadata = {
  title: 'Employee Operations & RBAC Fulfillment Portal | Zauq Luxury',
  description:
    'Dedicated role-based interface for Warehouse staff (stock adjustments & fulfillment) and Customer Support staff.',
};

export default function EmployeePage() {
  return <EmployeePanel />;
}
