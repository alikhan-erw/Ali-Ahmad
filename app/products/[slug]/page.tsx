import type { Metadata } from 'next';
import { ProductDetailView } from '../../../src/components/ProductDetailView';
import { INITIAL_PRODUCTS } from '../../../src/data/mockData';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug || '').trim().toLowerCase();
  const product =
    INITIAL_PRODUCTS.find(
      (p) =>
        p.slug.toLowerCase() === decodedSlug ||
        p.id.toLowerCase() === decodedSlug ||
        p.slug === slug ||
        p.id === slug
    ) || INITIAL_PRODUCTS[0];

  if (!product) {
    return {
      title: 'Product Not Found | Zauq Luxury',
    };
  }
  return {
    title: `${product.name} | Zauq Luxury`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} | Zauq Luxury`,
      description: product.description.slice(0, 160),
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProductDetailView slug={slug} />;
}
