'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { INITIAL_PRODUCTS } from '../data/mockData';
import { Product } from '../types';
import {
  Heart,
  ShoppingBag,
  Star,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  Share2,
  AlertTriangle,
} from 'lucide-react';

interface ProductDetailViewProps {
  slug: string;
  onOpenCheckout?: () => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ slug, onOpenCheckout }) => {
  const {
    products,
    language,
    navigate,
    addToCart,
    toggleWishlist,
    isInWishlist,
    reviews,
    submitReview,
  } = useStore();

  // Robust product lookup by slug, id, or normalized string
  const cleanSlug = decodeURIComponent(slug || '').trim();
  const matchedProduct =
    products.find(
      (p) =>
        p.slug === cleanSlug ||
        p.id === cleanSlug ||
        p.slug.toLowerCase() === cleanSlug.toLowerCase() ||
        p.id.toLowerCase() === cleanSlug.toLowerCase()
    ) ||
    INITIAL_PRODUCTS.find(
      (p) =>
        p.slug === cleanSlug ||
        p.id === cleanSlug ||
        p.slug.toLowerCase() === cleanSlug.toLowerCase() ||
        p.id.toLowerCase() === cleanSlug.toLowerCase()
    ) ||
    products[0] ||
    INITIAL_PRODUCTS[0];

  const canonical = INITIAL_PRODUCTS.find(
    (p) => p.id === matchedProduct.id || p.slug === matchedProduct.slug
  );

  // Normalize images array to ensure valid non-empty paths matching public/images
  const rawImages =
    (Array.isArray(matchedProduct.images) && matchedProduct.images.length > 0 && matchedProduct.images) ||
    (canonical?.images && canonical.images.length > 0 && canonical.images) ||
    ((matchedProduct as any).image ? [(matchedProduct as any).image] : null) ||
    ['/images/product_silk_apparel_1790571652578.jpg'];

  const productImages = rawImages.map((img: string) => {
    if (img.startsWith('images/')) return `/${img}`;
    if (img.startsWith('public/images/')) return img.replace('public/', '/');
    return img;
  });

  const product: Product = {
    ...(canonical || {}),
    ...matchedProduct,
    images: productImages,
  };

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
    product?.variants?.[0]?.id
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'shipping' | 'returns'>('specs');

  // Reset active image and variant when viewing a different product
  useEffect(() => {
    setActiveImageIndex(0);
    setSelectedVariantId(product?.variants?.[0]?.id);
  }, [product.id, product.slug]);

  // Review Form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [reviewSubmittedMessage, setReviewSubmittedMessage] = useState(false);

  if (!product) {
    return (
      <div className="py-20 text-center max-w-md mx-auto">
        <p className="text-stone-600 mb-4">Product not found.</p>
        <button
          onClick={() => navigate('shop')}
          className="bg-stone-900 text-white px-4 py-2 rounded-lg text-sm"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const isUrdu = language === 'ur';
  const inWishlist = isInWishlist(product.id);
  const activeVariant = product.variants?.find((v) => v.id === selectedVariantId);
  const unitPrice = activeVariant?.price || product.salePrice || product.price;

  // Stock calculations
  const effectiveStock = activeVariant?.stock ?? product.stock;
  const isOutOfStock = effectiveStock <= 0;
  const isLowStock = effectiveStock > 0 && effectiveStock <= product.minStockAlert;

  // Reviews for this product
  const productReviews = reviews.filter(
    (r) => r.productId === product.id && r.status === 'approved'
  );

  const averageRating =
    productReviews.length > 0
      ? productReviews.reduce((acc, r) => acc + r.rating, 0) / productReviews.length
      : product.rating;

  // Star breakdown calculation
  const starCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: productReviews.filter((r) => r.rating === star).length,
    percentage:
      productReviews.length > 0
        ? Math.round(
            (productReviews.filter((r) => r.rating === star).length / productReviews.length) * 100
          )
        : star === 5
        ? 85
        : 5,
  }));

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newComment.trim()) return;

    submitReview(product.id, newRating, newTitle, newComment);
    setNewTitle('');
    setNewComment('');
    setShowReviewForm(false);
    setReviewSubmittedMessage(true);
    setTimeout(() => setReviewSubmittedMessage(false), 6000);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariantId);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariantId);
    if (onOpenCheckout) {
      onOpenCheckout();
    } else {
      navigate('checkout');
    }
  };

  const mainImageSrc =
    productImages[activeImageIndex] ||
    productImages[0] ||
    '/images/product_silk_apparel_1790571652578.jpg';

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-8 sm:py-12 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-8">
          <button onClick={() => navigate('home')} className="hover:text-stone-900">
            {isUrdu ? 'ہوم' : 'Home'}
          </button>
          <span>/</span>
          <button onClick={() => navigate('shop')} className="hover:text-stone-900">
            {isUrdu ? 'کلیکشن' : 'Shop'}
          </button>
          <span>/</span>
          <span className="text-stone-800 font-medium truncate max-w-xs">
            {isUrdu ? product.urduName : product.name}
          </span>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate('shop')}
          className="inline-flex items-center gap-2 text-xs font-medium text-stone-600 hover:text-stone-950 mb-6 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>{isUrdu ? 'واپس کیٹلاگ کی طرف' : 'Back to Collection'}</span>
        </button>

        {/* Contiguous Purchase Module: Gallery (Left) & Controls (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* LEFT: Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-4/3 sm:aspect-1/1 bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm group">
              <img
                src={mainImageSrc}
                alt={product.name}
                className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/images/product_silk_apparel_1790571652578.jpg';
                }}
              />
              
              {/* Subtle tags */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                {product.salePrice && (
                  <span className="bg-stone-900 text-stone-100 text-xs font-semibold px-2.5 py-1 rounded shadow-xs">
                    {isUrdu ? 'محدود آفر' : 'Artisanal Privilege'}
                  </span>
                )}
                {isLowStock && (
                  <span className="bg-amber-700 text-white text-xs font-medium px-2.5 py-1 rounded flex items-center gap-1 shadow-xs">
                    <AlertTriangle className="w-3 h-3" />
                    <span>{isUrdu ? `صرف ${effectiveStock} باقی` : `Low Stock: ${effectiveStock} Left`}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {productImages.length > 1 && (
              <div className="flex items-center gap-3">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-stone-900 scale-95 shadow-xs'
                        : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/images/product_silk_apparel_1790571652578.jpg';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Contiguous Purchase Information */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              {/* Category & Brand Metadata */}
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span className="uppercase tracking-widest font-semibold">{product.brand}</span>
                <span className="font-mono">SKU: {activeVariant?.sku || product.sku}</span>
              </div>

              {/* Title */}
              <h1
                className={`text-2xl sm:text-3xl font-display font-semibold text-stone-950 leading-snug ${
                  isUrdu ? 'font-urdu' : ''
                }`}
              >
                {isUrdu ? product.urduName : product.name}
              </h1>

              {/* Ratings and reviews jump */}
              <div className="flex items-center gap-2 text-sm text-stone-700">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(averageRating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-stone-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-mono font-semibold text-stone-900 tabular-nums">
                  {averageRating.toFixed(1)}
                </span>
                <span className="text-stone-400">·</span>
                <a href="#reviews-section" className="text-stone-600 hover:text-stone-950 underline">
                  {productReviews.length} {isUrdu ? 'تصدیق شدہ تبصرے' : 'Verified Reviews'}
                </a>
              </div>

              {/* Price Display */}
              <div className="p-4 bg-stone-100/70 border border-stone-200 rounded-xl flex items-baseline justify-between">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-mono font-bold text-stone-950 tabular-nums">
                    PKR {unitPrice.toLocaleString()}
                  </span>
                  {product.salePrice && (
                    <span className="text-sm font-mono text-stone-400 line-through tabular-nums">
                      PKR {product.price.toLocaleString()}
                    </span>
                  )}
                </div>

                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    isOutOfStock
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {isOutOfStock ? 'Sold Out' : 'Ready for Dispatch'}
                </span>
              </div>

              {/* Short Description */}
              <p className="text-sm text-stone-600 leading-relaxed">
                {isUrdu ? product.urduDescription : product.description}
              </p>

              {/* Variants Selector (if applicable) */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                    {isUrdu ? 'سائز / متبادل کا انتخاب کریں' : 'Select Sizing or Flacon Option'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariantId(v.id)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium border text-center transition-all ${
                          selectedVariantId === v.id
                            ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                            : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                        }`}
                      >
                        <div className="truncate font-semibold">{v.name}</div>
                        <div className="text-[10px] opacity-80 font-mono">
                          {v.stock > 0 ? `${v.stock} in stock` : 'Out of stock'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper & Add to Cart Controls */}
              <div className="space-y-3 pt-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden shadow-xs">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1 || isOutOfStock}
                      className="px-3.5 py-2.5 text-stone-600 hover:text-stone-950 hover:bg-stone-50 text-sm font-semibold transition-colors disabled:opacity-40"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 text-stone-900 font-mono text-sm font-semibold tabular-nums min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(effectiveStock, q + 1))}
                      disabled={quantity >= effectiveStock || isOutOfStock}
                      className="px-3.5 py-2.5 text-stone-600 hover:text-stone-950 hover:bg-stone-50 text-sm font-semibold transition-colors disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Bag */}
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="flex-1 bg-stone-900 hover:bg-stone-800 text-white py-3 px-5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors disabled:bg-stone-300"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{isUrdu ? 'بیگ میں شامل کریں' : 'Add to Shopping Bag'}</span>
                  </button>

                  {/* Wishlist */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-3 rounded-lg border transition-all ${
                      inWishlist
                        ? 'border-rose-300 bg-rose-50 text-rose-600'
                        : 'border-stone-300 bg-white text-stone-700 hover:border-stone-900'
                    }`}
                    title="Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Instant Buy Now */}
                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 px-4 rounded-lg text-sm font-semibold transition-colors shadow-xs disabled:opacity-40"
                >
                  {isUrdu ? 'فوری خریدیں (چیک آؤٹ)' : 'Express Direct Checkout'}
                </button>
              </div>

              {/* Value Props */}
              <div className="pt-4 border-t border-stone-200/80 space-y-2.5 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-stone-800" />
                  <span>
                    <strong>Free Insured Express Courier</strong> across Lahore, Karachi, Islamabad & nationwide over PKR 10k.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-stone-800" />
                  <span>
                    <strong>100% Genuine Provenance Guaranteed</strong> with certificate of authenticity.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-stone-800" />
                  <span>
                    <strong>7-Day Discretionary Returns</strong> with prepaid courier pickup for unworn apparel.
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Specifications & Artisanal Details Tabs */}
        <div className="mt-16 bg-white rounded-2xl border border-stone-200 p-6 sm:p-8">
          <div className="flex border-b border-stone-200 gap-6">
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3 text-sm font-semibold transition-colors relative ${
                activeTab === 'specs'
                  ? 'text-stone-950 border-b-2 border-stone-950'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              {isUrdu ? 'تفصیلات اور مٹیریل' : 'Artisanal Specifications'}
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-3 text-sm font-semibold transition-colors relative ${
                activeTab === 'shipping'
                  ? 'text-stone-950 border-b-2 border-stone-950'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              {isUrdu ? 'ترسیل و ادائیگی' : 'Shipping & Payment'}
            </button>
            <button
              onClick={() => setActiveTab('returns')}
              className={`pb-3 text-sm font-semibold transition-colors relative ${
                activeTab === 'returns'
                  ? 'text-stone-950 border-b-2 border-stone-950'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              {isUrdu ? 'واپسی و ریفنڈ پالیسی' : 'Returns & Exchange Policy'}
            </button>
          </div>

          <div className="pt-6">
            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.specifications.map((spec, i) => (
                  <div
                    key={i}
                    className="flex justify-between py-2 border-b border-stone-100 text-sm"
                  >
                    <span className="text-stone-500 font-medium">{spec.label}</span>
                    <span className="text-stone-900 font-semibold">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4 text-sm text-stone-600">
                <p>
                  <strong>Insured Transit:</strong> All packages are dispatched inside tamper-evident sealed luxury cartons via TCS / Leopard Express Air.
                </p>
                <p>
                  <strong>Payment Methods Accepted:</strong> JazzCash, Easypaisa, Meezan Direct IBAN Transfer, and Verified Cash on Delivery.
                </p>
                <p>
                  <strong>Estimated Delivery:</strong> 24–48 hours for Lahore, Islamabad, and Karachi; 3–4 business days for all other regions.
                </p>
              </div>
            )}

            {activeTab === 'returns' && (
              <div className="space-y-4 text-sm text-stone-600">
                <p>
                  We honour a 7-day complimentary return window for all standard apparel and leather pieces in original unworn condition with tags intact.
                </p>
                <p>
                  Fragrance flacons and pure oud attars cannot be returned once the inner wax seal or atomiser has been actuated, to preserve artisanal hygiene.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Customer Reviews Section */}
        <section id="reviews-section" className="mt-16 bg-white rounded-2xl border border-stone-200 p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-stone-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-semibold text-stone-950">
                {isUrdu ? 'صارفین کی آراء اور جائزے' : 'Client Reviews & Ratings'}
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                {isUrdu
                  ? 'صرف اصل خریداروں کے تصدیق شدہ جائزے'
                  : 'Authentic feedback from verified collectors and patrons'}
              </p>
            </div>

            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-stone-950 hover:bg-stone-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-xs"
            >
              {showReviewForm ? 'Cancel' : isUrdu ? 'اپنا جائزہ لکھیں' : 'Write a Review'}
            </button>
          </div>

          {/* Review submission success notice */}
          {reviewSubmittedMessage && (
            <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>
                Thank you! Your review has been submitted and is currently in moderation by our client support team.
              </span>
            </div>
          )}

          {/* Write Review Form */}
          {showReviewForm && (
            <form
              onSubmit={handleReviewSubmit}
              className="mt-6 p-6 bg-stone-50 rounded-xl border border-stone-200 space-y-4"
            >
              <h3 className="text-sm font-semibold text-stone-900">
                Share your experience with {product.name}
              </h3>

              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">
                  Overall Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= newRating ? 'fill-amber-400 text-amber-500' : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-mono font-semibold ml-2 text-stone-700">
                    {newRating} / 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">
                  Review Headline
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Exceptional drape and timeless texture"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">
                  Your Detailed Thoughts
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the fabric, olfactory notes, craftsmanship, packaging..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800"
                >
                  Submit Review for Approval
                </button>
              </div>
            </form>
          )}

          {/* Breakdown and reviews list */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
            
            {/* Rating Summary Breakdown */}
            <div className="lg:col-span-4 p-5 bg-stone-50 rounded-xl border border-stone-200/80 space-y-4">
              <div className="text-center pb-4 border-b border-stone-200">
                <div className="text-4xl font-mono font-bold text-stone-950 tabular-nums">
                  {averageRating.toFixed(1)}
                </div>
                <div className="flex justify-center my-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(averageRating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-stone-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs text-stone-500">
                  Based on {productReviews.length} verified reviews
                </div>
              </div>

              {/* Star Bars */}
              <div className="space-y-1.5 text-xs">
                {starCounts.map(({ star, count, percentage }) => (
                  <div key={star} className="flex items-center gap-2">
                    <span className="w-12 font-medium text-stone-600 flex items-center gap-1">
                      <span>{star}</span>
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                    </span>
                    <div className="flex-1 bg-stone-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-right font-mono text-stone-400 tabular-nums">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Individual Reviews */}
            <div className="lg:col-span-8 space-y-4">
              {productReviews.length === 0 ? (
                <div className="p-8 text-center bg-stone-50 rounded-xl border border-stone-200 text-stone-500 text-sm">
                  No verified customer reviews yet. Be the first to share your appraisal!
                </div>
              ) : (
                productReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 bg-stone-50/60 rounded-xl border border-stone-200/80 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-stone-900 text-sm">
                          {rev.customerName}
                        </span>
                        {rev.verifiedPurchase && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            <span>Verified Patron</span>
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-stone-400 font-mono">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-stone-300'
                          }`}
                        />
                      ))}
                    </div>

                    <h4 className="font-semibold text-stone-900 text-sm">{rev.title}</h4>
                    <p className="text-xs text-stone-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>

          </div>
        </section>

      </div>
    </div>
  );
};
