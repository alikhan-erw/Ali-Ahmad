'use client';

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Package,
  Heart,
  MapPin,
  Clock,
  CheckCircle2,
  Truck,
  RotateCcw,
  Star,
  ExternalLink,
  Shield,
  User,
  AlertCircle,
  XCircle,
} from 'lucide-react';
import { OrderStatus } from '../types';

interface CustomerDashboardProps {
  initialTab?: 'orders' | 'wishlist' | 'addresses' | 'reviews';
  initialOrderId?: string;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  initialTab = 'orders',
  initialOrderId,
}) => {
  const {
    currentUser,
    orders,
    wishlist,
    products,
    reviews,
    language,
    navigate,
    updateOrderStatus,
    selectedOrderId,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'addresses' | 'reviews'>(initialTab);
  const [viewingOrderDetailsId, setViewingOrderDetailsId] = useState<string | null>(
    initialOrderId || selectedOrderId || null
  );

  const isUrdu = language === 'ur';

  // Filter orders for the active user (or all customer orders if viewing as demo Ali Ahmed)
  const userOrders = orders.filter(
    (o) =>
      o.customerId === currentUser?.id ||
      o.customerEmail === currentUser?.email ||
      currentUser?.role === 'CUSTOMER'
  );

  const userReviews = reviews.filter(
    (r) =>
      r.customerEmail === currentUser?.email ||
      r.customerName.toLowerCase() === currentUser?.name.toLowerCase()
  );

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  // Visual status step indices
  const getStatusStep = (status: OrderStatus) => {
    switch (status) {
      case 'placed':
        return 1;
      case 'confirmed':
        return 2;
      case 'processing':
        return 3;
      case 'shipped':
        return 4;
      case 'delivered':
        return 5;
      case 'cancelled':
      case 'returned':
        return -1;
      default:
        return 1;
    }
  };

  const selectedOrder = orders.find((o) => o.id === viewingOrderDetailsId);

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-10 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Profile Banner */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-stone-900 text-stone-100 flex items-center justify-center font-display font-semibold text-2xl shadow-xs">
              {currentUser?.name?.charAt(0) || 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-display font-semibold text-stone-950">
                  {currentUser?.name || 'Valued Patron'}
                </h1>
                <span className="text-[11px] font-semibold bg-stone-100 text-stone-800 px-2 py-0.5 rounded-full border border-stone-200">
                  Heritage Club Patron
                </span>
              </div>
              <p className="text-xs text-stone-500 font-mono mt-0.5">
                {currentUser?.email || 'patron@zauqluxury.com'} · {currentUser?.phone || '+92 300 1234567'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right text-xs">
              <div className="text-stone-500">Total Orders Placed</div>
              <div className="font-mono font-bold text-stone-900 text-base tabular-nums">
                {userOrders.length}
              </div>
            </div>
            <div className="h-8 w-px bg-stone-200" />
            <div className="text-right text-xs">
              <div className="text-stone-500">Saved Wishlist</div>
              <div className="font-mono font-bold text-stone-900 text-base tabular-nums">
                {wishlist.length}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 gap-8 mb-8 text-sm font-semibold">
          <button
            onClick={() => {
              setActiveTab('orders');
              setViewingOrderDetailsId(null);
            }}
            className={`pb-3 transition-colors relative flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'text-stone-950 border-b-2 border-stone-950'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>{isUrdu ? 'میرے آرڈرز' : 'My Orders & Deliveries'}</span>
            <span className="font-mono text-xs text-stone-400">({userOrders.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('wishlist');
              setViewingOrderDetailsId(null);
            }}
            className={`pb-3 transition-colors relative flex items-center gap-2 ${
              activeTab === 'wishlist'
                ? 'text-stone-950 border-b-2 border-stone-950'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>{isUrdu ? 'خواہشات کی فہرست' : 'Wishlist'}</span>
            <span className="font-mono text-xs text-stone-400">({wishlist.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('addresses');
              setViewingOrderDetailsId(null);
            }}
            className={`pb-3 transition-colors relative flex items-center gap-2 ${
              activeTab === 'addresses'
                ? 'text-stone-950 border-b-2 border-stone-950'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>{isUrdu ? 'پتے' : 'Shipping Addresses'}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('reviews');
              setViewingOrderDetailsId(null);
            }}
            className={`pb-3 transition-colors relative flex items-center gap-2 ${
              activeTab === 'reviews'
                ? 'text-stone-950 border-b-2 border-stone-950'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>{isUrdu ? 'تبصرے' : 'My Reviews'}</span>
            <span className="font-mono text-xs text-stone-400">({userReviews.length})</span>
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* If an individual order is selected for deep drill-down */}
            {selectedOrder ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-4">
                  <div>
                    <button
                      onClick={() => setViewingOrderDetailsId(null)}
                      className="text-xs font-semibold text-stone-500 hover:text-stone-950 underline mb-2"
                    >
                      ← Back to all orders
                    </button>
                    <h2 className="text-xl font-display font-semibold text-stone-950 flex items-center gap-3">
                      <span>Order #{selectedOrder.orderNumber}</span>
                      <span
                        className={`text-xs uppercase px-2.5 py-0.5 rounded-full font-sans font-bold ${
                          selectedOrder.orderStatus === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : selectedOrder.orderStatus === 'cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {selectedOrder.orderStatus}
                      </span>
                    </h2>
                  </div>

                  <div className="text-right text-xs">
                    <span className="text-stone-500">Placed on:</span>{' '}
                    <span className="font-mono text-stone-900 font-semibold">
                      {new Date(selectedOrder.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Progress Tracking Bar (Only if not cancelled) */}
                {selectedOrder.orderStatus !== 'cancelled' && (
                  <div className="p-6 bg-stone-50 rounded-xl border border-stone-200">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-600 mb-6">
                      Chronological Order Journey:
                    </h3>

                    <div className="grid grid-cols-5 relative text-center text-xs">
                      {/* Connecting Line */}
                      <div className="absolute top-4 left-0 right-0 h-0.5 bg-stone-200 -z-0" />
                      
                      {[
                        { title: 'Order Placed', step: 1 },
                        { title: 'Confirmed', step: 2 },
                        { title: 'Processing', step: 3 },
                        { title: 'Shipped', step: 4 },
                        { title: 'Delivered', step: 5 },
                      ].map(({ title, step }) => {
                        const currentStep = getStatusStep(selectedOrder.orderStatus);
                        const isCompleted = currentStep >= step;
                        const isCurrent = currentStep === step;

                        return (
                          <div key={step} className="flex flex-col items-center relative z-10">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-xs ${
                                isCompleted
                                  ? 'bg-stone-900 text-white'
                                  : 'bg-stone-200 text-stone-500'
                              } ${isCurrent ? 'ring-4 ring-amber-400/50' : ''}`}
                            >
                              {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : step}
                            </div>
                            <span
                              className={`mt-2 font-medium text-[11px] ${
                                isCompleted ? 'text-stone-950 font-bold' : 'text-stone-400'
                              }`}
                            >
                              {title}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {selectedOrder.trackingNumber && (
                      <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between text-xs">
                        <span className="text-stone-600">Air Waybill / Tracking ID:</span>
                        <span className="font-mono font-bold text-stone-900 bg-white px-3 py-1 rounded border border-stone-300">
                          {selectedOrder.trackingNumber}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Items in order */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-600">
                    Artisanal Items in this Parcel:
                  </h3>
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3.5 bg-stone-50 rounded-xl border border-stone-200"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg border border-stone-200"
                        />
                        <div>
                          <div className="text-sm font-semibold text-stone-900">{item.name}</div>
                          <div className="text-xs text-stone-500 font-mono">
                            SKU: {item.sku} · Qty: {item.quantity}
                          </div>
                        </div>
                      </div>
                      <div className="font-mono font-bold text-stone-950 text-sm tabular-nums">
                        PKR {(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Financial Summary */}
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-2">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal:</span>
                    <span className="font-mono">PKR {selectedOrder.subtotal.toLocaleString()}</span>
                  </div>
                  {selectedOrder.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Privilege Coupon Discount:</span>
                      <span className="font-mono">- PKR {selectedOrder.discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-stone-600">
                    <span>Courier Transit:</span>
                    <span className="font-mono">
                      {selectedOrder.shippingFee === 0
                        ? 'Free'
                        : `PKR ${selectedOrder.shippingFee.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-stone-950 font-bold text-sm pt-2 border-t border-stone-200">
                    <span>Grand Total:</span>
                    <span className="font-mono">PKR {selectedOrder.total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Cancel Order Action (Only if status is placed or confirmed) */}
                {(selectedOrder.orderStatus === 'placed' ||
                  selectedOrder.orderStatus === 'confirmed') && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            'Are you sure you wish to cancel this order? Stock will be automatically restocked into our inventory.'
                          )
                        ) {
                          updateOrderStatus(selectedOrder.id, 'cancelled');
                        }
                      }}
                      className="text-xs font-semibold text-rose-700 hover:text-rose-900 border border-rose-300 px-4 py-2 rounded-lg hover:bg-rose-50 flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Request Order Cancellation</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* All Orders Table / List */
              userOrders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
                  <Package className="w-12 h-12 text-stone-300 mx-auto" />
                  <p className="font-medium text-stone-900">No orders recorded yet.</p>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    Your collection purchases, dispatch tracking and official receipts will appear right here.
                  </p>
                  <button
                    onClick={() => navigate('shop')}
                    className="mt-2 bg-stone-900 text-white text-xs font-semibold px-4 py-2 rounded-lg"
                  >
                    Start Exploring
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
                  <div className="divide-y divide-stone-200">
                    {userOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-6 hover:bg-stone-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-bold text-stone-950 text-base">
                              #{ord.orderNumber}
                            </span>
                            <span
                              className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                ord.orderStatus === 'delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ord.orderStatus === 'cancelled'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {ord.orderStatus}
                            </span>
                          </div>

                          <div className="text-xs text-stone-500">
                            <span>Placed {new Date(ord.createdAt).toLocaleDateString()}</span>
                            <span> · </span>
                            <span>{ord.items.length} item(s)</span>
                            <span> · </span>
                            <span className="capitalize font-mono">
                              {ord.paymentMethod.replace('_', ' ')}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-xs text-stone-500">Total</div>
                            <div className="font-mono font-bold text-stone-950 text-base tabular-nums">
                              PKR {ord.total.toLocaleString()}
                            </div>
                          </div>

                          <button
                            onClick={() => setViewingOrderDetailsId(ord.id)}
                            className="bg-stone-900 text-white hover:bg-stone-800 text-xs font-semibold px-4 py-2 rounded-lg shadow-xs transition-colors"
                          >
                            View Tracking
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* Tab 2: Wishlist */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlistProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
                <Heart className="w-12 h-12 text-stone-300 mx-auto" />
                <p className="font-medium text-stone-900">Your wishlist is currently vacant.</p>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Click the heart icon on any rare textile, flacon, or leather piece to save it for your collection.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs p-4 flex flex-col justify-between space-y-3"
                  >
                    <div className="aspect-4/3 rounded-lg overflow-hidden bg-stone-100">
                      <img
                        src={
                          (Array.isArray(p.images) && p.images[0]) ||
                          (p as any).image ||
                          '/images/product_silk_apparel_1790571652578.jpg'
                        }
                        alt={p.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/images/product_silk_apparel_1790571652578.jpg';
                        }}
                      />
                    </div>
                    <div>
                      <div className="text-xs text-stone-500 uppercase">{p.brand}</div>
                      <h4 className="font-semibold text-stone-900 text-sm line-clamp-1">{p.name}</h4>
                      <div className="font-mono font-bold text-stone-950 text-sm mt-1">
                        PKR {(p.salePrice || p.price).toLocaleString()}
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('product', p.slug)}
                      className="w-full bg-stone-900 text-white text-xs font-semibold py-2 rounded-lg hover:bg-stone-800"
                    >
                      View Piece
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Shipping Addresses */}
        {activeTab === 'addresses' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3 relative shadow-xs">
              <span className="absolute top-6 right-6 text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Primary Residence
              </span>
              <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
                <MapPin className="w-4 h-4 text-stone-700" />
                <span>Islamabad Residence</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                House 42-B, Street 9, Sector F-7/2, Islamabad, 44000
                <br />
                Pakistan · Phone: +92 300 1234567
              </p>
              <div className="pt-2 text-xs flex gap-3 text-stone-600">
                <button className="underline hover:text-stone-950">Edit</button>
                <button className="underline hover:text-stone-950">Set Defaults</button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-dashed border-stone-300 p-6 flex flex-col items-center justify-center text-center space-y-2 hover:bg-stone-50/50 cursor-pointer">
              <MapPin className="w-6 h-6 text-stone-400" />
              <div className="font-semibold text-stone-900 text-sm">Add New Destination Address</div>
              <p className="text-xs text-stone-500">Add office, vacation villa, or gift recipient address</p>
            </div>
          </div>
        )}

        {/* Tab 4: Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {userReviews.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-500 text-sm">
                You have not submitted any product reviews yet.
              </div>
            ) : (
              userReviews.map((r) => (
                <div key={r.id} className="bg-white rounded-xl border border-stone-200 p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-900 text-sm">{r.title}</span>
                    <span
                      className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                        r.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : r.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      Status: {r.status}
                    </span>
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-stone-600">{r.comment}</p>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
};
