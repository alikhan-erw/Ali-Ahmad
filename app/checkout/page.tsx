import type { Metadata } from 'next';
import { CheckoutModal } from '../../src/components/CheckoutModal';

export const metadata: Metadata = {
  title: 'Secure Checkout | Zauq Luxury',
  description:
    'Encrypted checkout with Cash on Delivery (COD), JazzCash, Easypaisa, or direct Bank Transfer.',
};

export default function CheckoutPage() {
  return <CheckoutModal isPage={true} isOpen={true} />;
}
