'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../context/StoreContext';
import { INITIAL_PRODUCTS } from '../data/mockData';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck, Tag, ArrowLeft } from 'lucide-react';

export const CartPageView: React.FC = () => {
  const {
    cart,
    cartTotals,
    updateCartQty,
    removeFromCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    storeSettings,
    language,
    navigate,
    setIsCheckoutOpen,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  const isUrdu = language === 'ur';

  const freeThreshold = storeSettings.freeShippingThreshold;
  const progressToFreeShipping = Math.min(
    100,
    Math.round((cartTotals.subtotal / freeThreshold) * 100)
  );
  const remainingForFree = Math.max(0, freeThreshold - cartTotals.subtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    const result = applyCoupon(couponInput);
    if (!result.success) {
      setCouponError(result.message);
    } else {
      setCouponError(null);
      setCouponInput('');
    }
  };

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 ${isUrdu ? 'rtl font-urdu' : 'ltr'}`}>
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <ShoppingBag className="w-6 h-6 text-stone-900" />
          <h1 className="text-2xl sm:text-3xl font-display font-semibold text-stone-950">
            {isUrdu ? 'آپ کا شاپنگ بیگ' : 'Shopping Bag'}
          </h1>
          <span className="text-xs font-mono bg-stone-200 text-stone-800 px-2.5 py-0.5 rounded-full font-bold">
            {cartTotals.itemCount} {cartTotals.itemCount === 1 ? 'Item' : 'Items'}
          </span>
        </div>

        <button
          onClick={() => navigate('shop')}
          className="text-xs font-medium text-stone-600 hover:text-stone-950 inline-flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isUrdu ? 'شاپنگ جاری رکھیں' : 'Continue Shopping'}</span>
        </button>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-stone-200/80 p-8 max-w-lg mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4 text-stone-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-display font-semibold text-stone-900 mb-2">
            {isUrdu ? 'آپ کا بیگ خالی ہے' : 'Your bag is empty'}
          </h2>
          <p className="text-xs text-stone-500 mb-6">
            {isUrdu
              ? 'ہماری نایاب اور دستکار کلیکشنز میں سے کچھ منتخب کریں'
              : 'Explore our master craft collections to find timeless artisanal signatures.'}
          </p>
          <button
            onClick={() => navigate('shop')}
            className="bg-stone-900 hover:bg-stone-800 text-white px-6 py-3 rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            {isUrdu ? 'کیٹلاگ دیکھیں' : 'Discover Collections'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free Shipping Progress */}
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-4 text-xs">
              <div className="flex justify-between items-center mb-1.5 font-medium text-amber-950">
                <span>
                  {progressToFreeShipping >= 100
                    ? isUrdu
                      ? 'مفت ایکسپریس ڈیلیوری حاصل ہو گئی!'
                      : '🎉 You have unlocked Free Insured Express Delivery!'
                    : isUrdu
                    ? `مفت ڈیلیوری کے لیے مزید PKR ${remainingForFree.toLocaleString()} کا اضافہ کریں`
                    : `Add PKR ${remainingForFree.toLocaleString()} more for Free Express Delivery`}
                </span>
                <span className="font-mono">{progressToFreeShipping}%</span>
              </div>
              <div className="w-full bg-amber-200/50 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-amber-600 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200/80 divide-y divide-stone-100 overflow-hidden shadow-xs">
              {cart.map((item) => {
                const currentPrice = item.product.salePrice || item.product.price;
                const lineTotal = currentPrice * item.quantity;
                const variant = item.product.variants?.find((v) => v.id === item.variantId);

                // Resolve safe item image
                const canonical = INITIAL_PRODUCTS.find((p) => p.id === item.productId || p.slug === item.product?.slug);
                const rawImg =
                  (Array.isArray(item.product?.images) && item.product.images.length > 0 && item.product.images[0]) ||
                  (item.product as any)?.image ||
                  (item as any)?.image ||
                  canonical?.images?.[0] ||
                  '/images/product_silk_apparel_1790571652578.jpg';

                const itemImage = rawImg.startsWith('images/')
                  ? `/${rawImg}`
                  : rawImg.startsWith('public/images/')
                  ? rawImg.replace('public/', '/')
                  : rawImg;

                return (
                  <div key={`${item.productId}-${item.variantId || 'std'}`} className="p-4 sm:p-5 flex gap-4">
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="w-20 h-24 rounded-lg border border-stone-200 bg-stone-100 flex-shrink-0 overflow-hidden block group"
                    >
                      <img
                        src={itemImage}
                        alt={item.product?.name || 'Product'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/images/product_silk_apparel_1790571652578.jpg';
                        }}
                      />
                    </Link>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold">
                              {item.product.brand}
                            </span>
                            <Link href={`/products/${item.product.slug}`}>
                              <h3 className="font-display font-semibold text-stone-900 text-sm sm:text-base leading-snug hover:text-stone-700">
                                {isUrdu ? item.product.urduName : item.product.name}
                              </h3>
                            </Link>
                            {variant && (
                              <p className="text-xs text-stone-500 font-mono mt-0.5">
                                Variant: {variant.name}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeFromCart(item.productId, item.variantId)}
                            className="text-stone-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-stone-50">
                        {/* Stepper */}
                        <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-[#FAF9F5]">
                          <button
                            onClick={() => updateCartQty(item.productId, item.quantity - 1, item.variantId)}
                            className="px-2.5 py-1 text-stone-600 hover:text-stone-950 hover:bg-stone-200 text-xs font-semibold cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-xs font-mono font-medium text-stone-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQty(item.productId, item.quantity + 1, item.variantId)}
                            disabled={item.quantity >= (variant?.stock ?? item.product.stock)}
                            className="px-2.5 py-1 text-stone-600 hover:text-stone-950 hover:bg-stone-200 text-xs font-semibold disabled:opacity-30 cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="text-sm font-mono font-bold text-stone-900">
                            PKR {lineTotal.toLocaleString()}
                          </span>
                          {item.quantity > 1 && (
                            <span className="block text-[10px] text-stone-500 font-mono">
                              PKR {currentPrice.toLocaleString()} each
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary & Checkout */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-900 pb-3 border-b border-stone-100">
                {isUrdu ? 'آرڈر کا خلاصہ' : 'Order Summary'}
              </h2>

              {/* Coupon Form */}
              <div>
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder={isUrdu ? 'کوپن کوڈ درج کریں' : 'Promo / Coupon Code'}
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="w-full bg-[#FAF9F5] border border-stone-300 rounded-lg px-3 py-2 text-xs font-mono uppercase focus:outline-hidden focus:border-stone-900"
                    />
                    <Tag className="w-3.5 h-3.5 absolute right-3 top-2.5 text-stone-400 pointer-events-none" />
                  </div>
                  <button
                    type="submit"
                    className="bg-stone-900 hover:bg-stone-800 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                  >
                    {isUrdu ? 'لاگو کریں' : 'Apply'}
                  </button>
                </form>

                {couponError && (
                  <p className="text-[11px] text-rose-600 mt-1.5">{couponError}</p>
                )}

                {appliedCoupon && (
                  <div className="mt-2 bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 flex items-center justify-between text-xs text-emerald-900">
                    <div>
                      <span className="font-mono font-bold">{appliedCoupon.code}</span> applied ({appliedCoupon.type === 'percent' ? `${appliedCoupon.value}%` : `PKR ${appliedCoupon.value.toLocaleString()}`} off)
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-stone-400 hover:text-stone-700 text-xs font-bold cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* Breakdown */}
              <div className="space-y-2 text-xs pt-3 border-t border-stone-100">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-mono text-stone-900">PKR {cartTotals.subtotal.toLocaleString()}</span>
                </div>

                {cartTotals.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount</span>
                    <span className="font-mono">- PKR {cartTotals.discount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-stone-600">
                  <span>Insured Express Courier</span>
                  <span className="font-mono text-stone-900">
                    {cartTotals.shippingFee === 0 ? 'FREE' : `PKR ${cartTotals.shippingFee.toLocaleString()}`}
                  </span>
                </div>

                {cartTotals.tax > 0 && (
                  <div className="flex justify-between text-stone-600">
                    <span>Tax (FBR / Provincial)</span>
                    <span className="font-mono text-stone-900">PKR {cartTotals.tax.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between items-baseline pt-3 border-t border-stone-200 text-stone-950 font-bold">
                  <span className="text-sm">Grand Total</span>
                  <span className="text-lg font-mono">PKR {cartTotals.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Trigger */}
              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full bg-stone-950 hover:bg-stone-800 text-white py-3.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer group"
              >
                <span>{isUrdu ? 'محفوظ چیک آؤٹ کی طرف بڑھیں' : 'Proceed to Secure Checkout'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>SSL Encrypted · Cash on Delivery or JazzCash/Bank</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
