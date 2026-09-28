import type { Metadata } from 'next';
import { CartPageView } from '../../src/components/CartPageView';

export const metadata: Metadata = {
  title: 'Shopping Bag | Zauq Luxury',
  description: 'Review your selected artisanal items, apply coupon codes, and proceed to secure checkout.',
};

export default function CartPage() {
  return <CartPageView />;
}
