'use client';

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  ShieldCheck,
  Package,
  ShoppingBag,
  Star,
  Users,
  Archive,
  Lock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { OrderStatus } from '../types';

export const EmployeePanel: React.FC = () => {
  const {
    currentUser,
    orders,
    products,
    reviews,
    adjustStock,
    updateOrderStatus,
    moderateReview,
    language,
    navigate,
  } = useStore();

  const isUrdu = language === 'ur';

  // Determine authorized tabs based on user permissions
  const userPerms = currentUser?.permissions || [];
  const canInventory = userPerms.includes('inventory');
  const canOrders = userPerms.includes('orders');
  const canReviews = userPerms.includes('reviews');
  const canCustomers = userPerms.includes('customers');

  // Default active tab to first permitted
  const defaultTab = canInventory
    ? 'inventory'
    : canOrders
    ? 'orders'
    : canReviews
    ? 'reviews'
    : 'orders';

  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'reviews' | 'customers'>(
    defaultTab as any
  );

  return (
    <div className="bg-stone-100 min-h-screen pb-16">
      {/* Header */}
      <div className="bg-stone-900 text-stone-100 py-6 px-4 sm:px-8 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ROLE-BASED ACCESS CONTROL (RBAC) · STAFF PORTAL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-semibold mt-1">
              Staff Operations Workspace
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-400">Authenticated Staff:</span>
            <span className="text-xs font-semibold bg-stone-800 text-emerald-400 px-3 py-1 rounded-full border border-stone-700">
              {currentUser?.name} ({currentUser?.employeeTitle || 'Operations Associate'})
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        
        {/* Permission Badge Legend */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-stone-700">
            <Lock className="w-4 h-4 text-stone-500" />
            <span className="font-semibold">Assigned Operational Permissions:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {userPerms.map((perm) => (
                <span
                  key={perm}
                  className="bg-emerald-50 text-emerald-800 font-mono uppercase px-2 py-0.5 rounded border border-emerald-200"
                >
                  ✓ {perm}
                </span>
              ))}
            </div>
          </div>

          <p className="text-stone-500 text-[11px]">
            Restricted by Row Level Security (RLS) and operational domain boundaries.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-2">
          {canInventory && (
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'inventory'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200'
              }`}
            >
              <Archive className="w-4 h-4" />
              <span>Inventory & Fulfillment Picking</span>
            </button>
          )}

          {canOrders && (
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'orders'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Orders & Airway Bill Dispatch</span>
            </button>
          )}

          {canReviews && (
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'reviews'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200'
              }`}
            >
              <Star className="w-4 h-4" />
              <span>Customer Reviews Moderation</span>
            </button>
          )}
        </div>

        {/* 1. Inventory View for Warehouse Staff */}
        {activeTab === 'inventory' && canInventory && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4 shadow-xs">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-stone-950 text-base">
                  Warehouse Stock Audit & Intake
                </h3>
                <p className="text-xs text-stone-500">
                  Perform incoming batch intake or mark damaged pieces.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto border border-stone-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                  <tr>
                    <th className="p-3">Piece Name</th>
                    <th className="p-3">SKU</th>
                    <th className="p-3">Physical Stock</th>
                    <th className="p-3">Available</th>
                    <th className="p-3">Quick Stock Adjustment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td className="p-3 font-semibold text-stone-900">{p.name}</td>
                      <td className="p-3 font-mono text-stone-500">{p.sku}</td>
                      <td className="p-3 font-mono font-bold text-stone-900">{p.stock}</td>
                      <td className="p-3 font-mono text-emerald-700 font-bold">
                        {Math.max(0, p.stock - p.reservedStock)}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              adjustStock(
                                p.id,
                                5,
                                'Warehouse Intake (+5 units)',
                                currentUser?.name
                              );
                            }}
                            className="bg-stone-100 hover:bg-stone-200 text-stone-800 px-2.5 py-1 rounded text-[11px] font-semibold"
                          >
                            +5 Restock
                          </button>
                          <button
                            onClick={() => {
                              adjustStock(
                                p.id,
                                -1,
                                'Damaged during transit / handling (-1 unit)',
                                currentUser?.name
                              );
                            }}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-700 px-2 py-1 rounded text-[11px] font-medium"
                          >
                            -1 Damaged
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. Orders View for Logistics Staff */}
        {activeTab === 'orders' && canOrders && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4 shadow-xs">
            <h3 className="font-semibold text-stone-950 text-base">
              Order Fulfillment & Airway Dispatch List
            </h3>

            <div className="divide-y divide-stone-200">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-stone-950 text-sm">
                        #{ord.orderNumber}
                      </span>
                      <span className="font-semibold text-stone-800">{ord.customerName}</span>
                      <span className="text-stone-400">·</span>
                      <span className="text-stone-600">{ord.shippingAddress.city}</span>
                    </div>
                    <div className="text-stone-500">
                      Items: {ord.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={ord.orderStatus}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                      className="border border-stone-300 rounded px-2.5 py-1 bg-white text-xs font-semibold"
                    >
                      <option value="placed">Placed</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>

                    <button
                      onClick={() => {
                        const tracking = prompt(
                          'Scan or enter courier tracking #:',
                          ord.trackingNumber || 'LEO-778902'
                        );
                        if (tracking) {
                          updateOrderStatus(ord.id, 'shipped', tracking);
                        }
                      }}
                      className="bg-stone-900 text-white px-3 py-1 rounded font-semibold text-[11px]"
                    >
                      {ord.trackingNumber ? `Track: ${ord.trackingNumber}` : 'Assign Dispatch'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Reviews Moderation for Support Staff */}
        {activeTab === 'reviews' && canReviews && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4 shadow-xs">
            <h3 className="font-semibold text-stone-950 text-base">
              Client Relations Review Moderation Desk
            </h3>

            <div className="divide-y divide-stone-200">
              {reviews.map((r) => (
                <div key={r.id} className="py-3 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-stone-900">{r.customerName}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => moderateReview(r.id, 'approved')}
                        className="bg-emerald-700 text-white px-3 py-1 rounded font-medium text-[11px]"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => moderateReview(r.id, 'rejected')}
                        className="bg-rose-700 text-white px-3 py-1 rounded font-medium text-[11px]"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                  <p className="text-stone-600">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
