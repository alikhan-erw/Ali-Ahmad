import type { Metadata } from 'next';
import { CategoriesView } from '../../src/components/CategoriesView';

export const metadata: Metadata = {
  title: 'Artisanal Taxonomies & Collections | Zauq Luxury',
  description:
    'Explore curated domains of artisanal craft: Pashmina & Shahtoosh, Rare Ouds, and Hand-tooled Leather Goods.',
};

export default function CategoriesPage() {
  return <CategoriesView />;
}
