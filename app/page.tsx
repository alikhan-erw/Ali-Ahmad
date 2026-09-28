import type { Metadata } from 'next';
import { HomeView } from '../src/components/HomeView';

export const metadata: Metadata = {
  title: 'Zauq Luxury | Artisanal Lifestyle, Apparel, Perfumes & Decor',
  description:
    'Discover Pakistan’s living heritage through handcrafted Pashmina shawls, rare botanical attars, pure oud oils, and heritage brassware.',
};

export default function HomePage() {
  return <HomeView />;
}
