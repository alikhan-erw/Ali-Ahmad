'use client';

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { INITIAL_PRODUCTS } from '../data/mockData';
import { X, Trash2, ArrowRight, ShoppingBag, ShieldCheck, Tag } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout,
}) => {
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
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  if (!isOpen) return null;

  const isUrdu = language === 'ur';

  // Free shipping calculation progress
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
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-stone-200">
          
          {/* Header */}
          <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-[#FAF9F5]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-stone-900" />
              <h2 className="text-lg font-display font-semibold text-stone-900">
                {isUrdu ? 'آپ کا شاپنگ بیگ' : 'Curated Shopping Bag'}
              </h2>
              <span className="text-xs font-mono bg-stone-200 text-stone-800 px-2 py-0.5 rounded-full">
                {cartTotals.itemCount}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-5 py-3 bg-stone-100 border-b border-stone-200 text-xs">
            {remainingForFree === 0 ? (
              <div className="text-emerald-800 font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Complimentary Express Courier Unlocked!</span>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex justify-between text-stone-600">
                  <span>
                    Add <strong className="font-mono">PKR {remainingForFree.toLocaleString()}</strong> for free insured delivery
                  </span>
                  <span className="font-mono">{progressToFreeShipping}%</span>
                </div>
                <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-stone-900 font-medium text-base">Your shopping bag is empty.</p>
                <p className="text-stone-500 text-xs max-w-xs">
                  Explore our artisanal cashmere, fine ouds, and full-grain leather artifacts.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    navigate('shop');
                  }}
                  className="mt-2 bg-stone-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-stone-800"
                >
                  Discover Collections
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const variant = item.product.variants?.find((v) => v.id === item.variantId);
                const unitPrice = item.product.salePrice || item.product.price;
                const itemTotal = unitPrice * item.quantity;

                // Resolve safe item image from product or canonical mockData
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
                  <div
                    key={`${item.productId}-${item.variantId || 'default'}`}
                    className="flex gap-4 pb-4 border-b border-stone-100 group"
                  >
                    {/* Thumbnail */}
                    <div
                      onClick={() => {
                        onClose();
                        navigate('product', item.product.slug);
                      }}
                      className="w-20 h-20 bg-stone-100 rounded-lg overflow-hidden shrink-0 cursor-pointer border border-stone-200"
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
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="space-y-0.5">
                        <div className="flex justify-between items-start gap-2">
                          <h4
                            onClick={() => {
                              onClose();
                              navigate('product', item.product.slug);
                            }}
                            className="text-xs font-semibold text-stone-900 line-clamp-1 hover:underline cursor-pointer"
                          >
                            {isUrdu ? item.product.urduName : item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.productId, item.variantId)}
                            className="text-stone-400 hover:text-rose-600 transition-colors p-0.5"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {variant && (
                          <div className="text-[11px] text-stone-500 font-mono">
                            {variant.name}
                          </div>
                        )}

                        <div className="text-xs font-mono font-bold text-stone-950 tabular-nums">
                          PKR {unitPrice.toLocaleString()}
                        </div>
                      </div>

                      {/* Quantity Stepper & Subtotal */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-stone-200 rounded-md bg-stone-50">
                          <button
                            onClick={() =>
                              updateCartQty(item.productId, item.quantity - 1, item.variantId)
                            }
                            className="px-2 py-0.5 text-xs text-stone-600 hover:text-stone-950"
                          >
                            -
                          </button>
                          <span className="px-2 py-0.5 text-xs font-mono font-semibold text-stone-900 tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartQty(item.productId, item.quantity + 1, item.variantId)
                            }
                            className="px-2 py-0.5 text-xs text-stone-600 hover:text-stone-950"
                          >
                            +
                          </button>
                        </div>

                        <span className="text-xs font-mono text-stone-600 tabular-nums">
                          Total: PKR {itemTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Calculations & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-stone-200 bg-[#FAF9F5] space-y-4">
              
              {/* Coupon Redemption Input */}
              <div className="space-y-1.5">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span>
                        Promo Applied: <strong>{appliedCoupon.code}</strong> (
                        {appliedCoupon.type === 'percent'
                          ? `${appliedCoupon.value}% Off`
                          : `PKR ${appliedCoupon.value} Off`}
                        )
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-stone-400 hover:text-stone-900 text-[11px] underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo Code (e.g. ZAUQ10)"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value);
                        setCouponError(null);
                      }}
                      className="flex-1 bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs font-mono uppercase focus:outline-hidden focus:ring-1 focus:ring-stone-900"
                    />
                    <button
                      type="submit"
                      className="bg-stone-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-stone-800 transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {couponError && <p className="text-[11px] text-rose-600">{couponError}</p>}
              </div>

              {/* Financial Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600 border-t border-stone-200 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums text-stone-900">
                    PKR {cartTotals.subtotal.toLocaleString()}
                  </span>
                </div>

                {cartTotals.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Privilege Discount</span>
                    <span className="font-mono tabular-nums">
                      - PKR {cartTotals.discount.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Insured Shipping</span>
                  <span className="font-mono tabular-nums text-stone-900">
                    {cartTotals.shippingFee === 0
                      ? 'Complimentary'
                      : `PKR ${cartTotals.shippingFee.toLocaleString()}`}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-bold text-stone-950 pt-2 border-t border-stone-200">
                  <span>Estimated Total</span>
                  <span className="font-mono tabular-nums text-base">
                    PKR {cartTotals.total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Checkout Action */}
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full bg-stone-950 hover:bg-stone-800 text-white py-3.5 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <span>{isUrdu ? 'محفوظ چیک آؤٹ پر جائیں' : 'Proceed to Secure Checkout'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
