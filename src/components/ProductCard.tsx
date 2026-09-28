'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { INITIAL_PRODUCTS } from '../data/mockData';
import { Heart, ShoppingBag, Star, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { language, addToCart, toggleWishlist, isInWishlist } = useStore();
  const isUrdu = language === 'ur';

  const inWishlist = isInWishlist(product.id);
  const isLowStock = product.stock > 0 && product.stock <= product.minStockAlert;
  const isOutOfStock = product.stock <= 0;

  // Resolve safe product thumbnail matching existing public/images
  const canonical = INITIAL_PRODUCTS.find((p) => p.id === product.id || p.slug === product.slug);
  const rawThumbnail =
    (Array.isArray(product.images) && product.images.length > 0 && product.images[0]) ||
    (product as any).image ||
    canonical?.images?.[0] ||
    '/images/product_silk_apparel_1790571652578.jpg';

  const productThumbnail = rawThumbnail.startsWith('images/')
    ? `/${rawThumbnail}`
    : rawThumbnail.startsWith('public/images/')
    ? rawThumbnail.replace('public/', '/')
    : rawThumbnail;

  return (
    <article className="group flex flex-col bg-white border border-stone-200/90 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
      
      {/* Product Image Slot (65-75% visual prominence) */}
      <div className="relative aspect-4/3 sm:aspect-1/1 bg-[#F9F9F8] overflow-hidden">
        <Link
          href={`/products/${product.slug}`}
          className="w-full h-full block focus:outline-hidden"
          aria-label={`View details for ${product.name}`}
        >
          <img
            src={productThumbnail}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/images/product_silk_apparel_1790571652578.jpg';
            }}
          />
        </Link>

        {/* Wishlist Button (Discrete top-right) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-xs ${
            inWishlist
              ? 'bg-rose-50 text-rose-600'
              : 'bg-white/80 text-stone-700 hover:bg-white hover:text-rose-600'
          }`}
          title={inWishlist ? 'Remove from Wishlist' : 'Save to Wishlist'}
          aria-label={inWishlist ? 'Remove from Wishlist' : 'Save to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Single subtle text tag if relevant (No badge spam) */}
        {product.salePrice && !isOutOfStock && (
          <span className="absolute bottom-3 left-3 bg-stone-900/90 text-stone-100 text-[11px] font-medium px-2 py-0.5 rounded backdrop-blur-xs">
            {isUrdu ? 'خصوصی پیشکش' : 'Curated Privilege'}
          </span>
        )}

        {isOutOfStock && (
          <span className="absolute bottom-3 left-3 bg-rose-900/90 text-white text-[11px] font-medium px-2 py-0.5 rounded backdrop-blur-xs">
            {isUrdu ? 'دستیاب نہیں' : 'Out of Stock'}
          </span>
        )}
      </div>

      {/* Product Information */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between space-y-3">
        
        <div className="space-y-1.5">
          {/* Unboxed Metadata (Category · Rating · Stock state) */}
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="uppercase tracking-wider font-medium text-[11px]">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 text-stone-700 font-medium">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span className="font-mono tabular-nums text-xs">{product.rating.toFixed(1)}</span>
              <span className="text-stone-400">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <Link href={`/products/${product.slug}`} className="block">
            <h3
              className={`font-semibold text-stone-900 hover:text-stone-700 cursor-pointer line-clamp-1 text-base ${
                isUrdu ? 'font-urdu' : ''
              }`}
              title={isUrdu ? product.urduName : product.name}
            >
              {isUrdu ? product.urduName : product.name}
            </h3>
          </Link>

          {/* Short description teaser */}
          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
            {isUrdu ? product.urduDescription : product.description}
          </p>
        </div>

        {/* Price Baseline and Purchase Action */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
          <div className="space-y-0.5">
            <div className="flex items-baseline gap-2">
              <span className="text-stone-950 font-bold font-mono text-base tabular-nums">
                PKR {(product.salePrice || product.price).toLocaleString()}
              </span>
              {product.salePrice && (
                <span className="text-xs text-stone-400 line-through font-mono tabular-nums">
                  PKR {product.price.toLocaleString()}
                </span>
              )}
            </div>

            {isLowStock && (
              <span className="text-[11px] text-amber-800 font-medium flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{isUrdu ? `صرف ${product.stock} باقی` : `Only ${product.stock} units left`}</span>
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={isOutOfStock}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isOutOfStock
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                : 'bg-stone-900 hover:bg-stone-800 text-white shadow-xs'
            }`}
            title={isOutOfStock ? 'Sold Out' : 'Quick Add to Bag'}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isUrdu ? 'شامل کریں' : 'Add'}</span>
          </button>
        </div>

      </div>
    </article>
  );
};
