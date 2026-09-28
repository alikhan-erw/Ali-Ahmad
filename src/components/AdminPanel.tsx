'use client';

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Archive,
  Star,
  Tag,
  Settings,
  Database,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowUpRight,
  RefreshCw,
  Search,
  Filter,
  Copy,
  Check,
  Eye,
  TrendingUp,
} from 'lucide-react';
import { SUPABASE_SQL_SCHEMA } from '../utils/supabaseSql';
import { OrderStatus, PaymentStatus, Product } from '../types';

export const AdminPanel: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    updatePaymentStatus,
    inventoryLogs,
    adjustStock,
    reviews,
    moderateReview,
    coupons,
    addCoupon,
    toggleCouponStatus,
    storeSettings,
    updateStoreSettings,
    supabaseConfig,
    saveSupabaseConfig,
    currentUser,
    users,
    language,
    navigate,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'products'
    | 'orders'
    | 'inventory'
    | 'reviews'
    | 'coupons'
    | 'settings'
    | 'supabase'
  >('dashboard');

  // Search & filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [inventorySearch, setInventorySearch] = useState('');

  // Modals state
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState<{
    productId: string;
    productName: string;
  } | null>(null);
  const [restockAmount, setRestockAmount] = useState<number>(10);
  const [restockReason, setRestockReason] = useState<string>('Batch Restock from Workshop');

  const [viewingProofOrder, setViewingProofOrder] = useState<any | null>(null);
  const [copiedSchema, setCopiedSchema] = useState(false);

  // New product form state
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    urduName: '',
    sku: '',
    category: 'Artisanal Apparel & Shawls',
    subcategory: 'Kurtas & Tunics',
    brand: 'Zauq Heritage',
    price: 15000,
    salePrice: 0,
    stock: 20,
    reservedStock: 0,
    minStockAlert: 4,
    description: '',
    urduDescription: '',
    imageUrl: '/images/hero_luxury_storefront_1790571626630.jpg',
  });

  // Supabase test credentials state
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(supabaseConfig.url);
  const [supabaseKeyInput, setSupabaseKeyInput] = useState(supabaseConfig.anonKey);
  const [supabaseConnectedNotice, setSupabaseConnectedNotice] = useState(false);

  // Analytics KPI calculations
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'paid' || o.orderStatus === 'delivered')
    .reduce((sum, o) => sum + o.total, 0);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (o) => o.orderStatus === 'placed' || o.orderStatus === 'confirmed'
  ).length;
  const processingOrders = orders.filter((o) => o.orderStatus === 'processing').length;
  const deliveredOrders = orders.filter((o) => o.orderStatus === 'delivered').length;

  const lowStockCount = products.filter(
    (p) => p.stock > 0 && p.stock <= p.minStockAlert
  ).length;
  const outOfStockCount = products.filter((p) => p.stock <= 0).length;

  // Handle Add Product Submit
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.name || !newProductForm.sku) return;

    const slug = newProductForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    addProduct({
      slug,
      name: newProductForm.name,
      urduName: newProductForm.urduName || newProductForm.name,
      sku: newProductForm.sku.toUpperCase(),
      category: newProductForm.category,
      subcategory: newProductForm.subcategory,
      brand: newProductForm.brand,
      price: Number(newProductForm.price),
      salePrice: newProductForm.salePrice > 0 ? Number(newProductForm.salePrice) : undefined,
      stock: Number(newProductForm.stock),
      reservedStock: 0,
      minStockAlert: Number(newProductForm.minStockAlert),
      description: newProductForm.description || 'Artisanal piece crafted by master artisans.',
      urduDescription: newProductForm.urduDescription || 'خالص روایتی شاہکار۔',
      specifications: [
        { label: 'Origin', value: 'Master Atelier Lahore' },
        { label: 'Authenticity', value: 'Certified Handcrafted' },
      ],
      images: [newProductForm.imageUrl],
      isFeatured: false,
    });

    setShowAddProductModal(false);
  };

  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showRestockModal) return;

    adjustStock(
      showRestockModal.productId,
      Number(restockAmount),
      restockReason,
      currentUser?.name || 'Administrator'
    );
    setShowRestockModal(null);
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 3000);
  };

  const handleSaveSupabase = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseConfig(supabaseUrlInput, supabaseKeyInput);
    setSupabaseConnectedNotice(true);
    setTimeout(() => setSupabaseConnectedNotice(false), 4000);
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = orderStatusFilter === 'all' || o.orderStatus === orderStatusFilter;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerPhone.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="bg-stone-100 min-h-screen pb-16">
      {/* Top Banner */}
      <div className="bg-stone-900 text-stone-100 py-6 px-4 sm:px-8 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <Database className="w-3.5 h-3.5" />
              <span>SUPABASE POSTGRESQL · ENTERPRISE RBAC CONSOLE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-semibold mt-1">
              Executive Business & Retail Management
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-400">Logged in:</span>
            <span className="text-xs font-semibold bg-stone-800 text-amber-400 px-3 py-1 rounded-full border border-stone-700">
              {currentUser?.name} (SUPER ADMIN)
            </span>
            <button
              onClick={() => navigate('home')}
              className="text-xs text-stone-300 hover:text-white underline ml-2"
            >
              View Public Storefront →
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-1.5 rounded-xl border border-stone-200 shadow-xs">
          {[
            { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
            { id: 'products', label: `Products (${products.length})`, icon: Package },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'inventory', label: 'Inventory & Audit Trail', icon: Archive },
            { id: 'reviews', label: `Reviews (${reviews.length})`, icon: Star },
            { id: 'coupons', label: `Coupons (${coupons.length})`, icon: Tag },
            { id: 'settings', label: 'Store Settings', icon: Settings },
            { id: 'supabase', label: 'Supabase Architecture', icon: Database },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === id
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* 1. DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs space-y-2">
                <div className="flex justify-between items-center text-xs text-stone-500 font-medium">
                  <span>Total Sales Revenue</span>
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-mono font-bold text-stone-950 tabular-nums">
                  PKR {totalRevenue.toLocaleString()}
                </div>
                <p className="text-[11px] text-emerald-700">
                  Across {totalOrders} placed client transactions
                </p>
              </div>

              <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs space-y-2">
                <div className="flex justify-between items-center text-xs text-stone-500 font-medium">
                  <span>Active Orders</span>
                  <ShoppingBag className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl font-mono font-bold text-stone-950 tabular-nums">
                  {pendingOrders + processingOrders}
                </div>
                <p className="text-[11px] text-stone-500">
                  {pendingOrders} Pending Verification · {processingOrders} In Assembly
                </p>
              </div>

              <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs space-y-2">
                <div className="flex justify-between items-center text-xs text-stone-500 font-medium">
                  <span>Stock Health Alerts</span>
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                </div>
                <div className="text-2xl font-mono font-bold text-stone-950 tabular-nums">
                  {lowStockCount + outOfStockCount}
                </div>
                <p className="text-[11px] text-rose-700">
                  {lowStockCount} below minimum · {outOfStockCount} exhausted
                </p>
              </div>

              <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs space-y-2">
                <div className="flex justify-between items-center text-xs text-stone-500 font-medium">
                  <span>Pending Client Reviews</span>
                  <Star className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl font-mono font-bold text-stone-950 tabular-nums">
                  {reviews.filter((r) => r.status === 'pending').length}
                </div>
                <p className="text-[11px] text-stone-500">
                  Requires support/admin moderation
                </p>
              </div>

            </div>

            {/* Quick Recent Orders & Recent Inventory Shifts */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Recent Orders */}
              <div className="lg:col-span-7 bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-stone-900 text-sm">Recent Client Orders</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-stone-600 hover:text-stone-900 underline"
                  >
                    View All Orders
                  </button>
                </div>

                <div className="divide-y divide-stone-100">
                  {orders.slice(0, 4).map((ord) => (
                    <div key={ord.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-mono font-bold text-stone-900">#{ord.orderNumber}</div>
                        <div className="text-stone-500">{ord.customerName} · {ord.shippingAddress.city}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-semibold text-stone-900">
                          PKR {ord.total.toLocaleString()}
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            ord.orderStatus === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ord.orderStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Inventory Movements */}
              <div className="lg:col-span-5 bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-stone-900 text-sm">Recent Stock Audit Shifts</h3>
                  <button
                    onClick={() => setActiveTab('inventory')}
                    className="text-xs text-stone-600 hover:text-stone-900 underline"
                  >
                    View History
                  </button>
                </div>

                <div className="space-y-3">
                  {inventoryLogs.slice(0, 4).map((log) => (
                    <div key={log.id} className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-stone-900 truncate max-w-[12rem]">
                          {log.productName}
                        </span>
                        <span
                          className={`font-mono font-bold ${
                            log.changeAmount > 0 ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {log.changeAmount > 0 ? `+${log.changeAmount}` : log.changeAmount} units
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 leading-tight">{log.reason}</p>
                      <div className="text-[10px] text-stone-400 font-mono">
                        {log.employeeName} · {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 2. PRODUCTS CATALOG & MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs space-y-4 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-stone-950">Artisanal Products Catalog</h2>
                <p className="text-xs text-stone-500">
                  Manage SKUs, master pricing, stock thresholds and visual assets.
                </p>
              </div>

              <button
                onClick={() => setShowAddProductModal(true)}
                className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Artifact</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto border border-stone-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                  <tr>
                    <th className="p-3.5">Piece & SKU</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Base Price</th>
                    <th className="p-3.5">Stock Level</th>
                    <th className="p-3.5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products.map((p) => {
                    const isLow = p.stock > 0 && p.stock <= p.minStockAlert;
                    const isOut = p.stock <= 0;

                    return (
                      <tr key={p.id} className="hover:bg-stone-50/70">
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                (Array.isArray(p.images) && p.images[0]) ||
                                (p as any).image ||
                                '/images/product_silk_apparel_1790571652578.jpg'
                              }
                              alt={p.name}
                              className="w-10 h-10 object-cover rounded-lg border border-stone-200"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = '/images/product_silk_apparel_1790571652578.jpg';
                              }}
                            />
                            <div>
                              <div className="font-semibold text-stone-900 text-sm">{p.name}</div>
                              <div className="text-stone-400 font-mono text-[11px]">
                                {p.sku} · {p.brand}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5 text-stone-600">{p.category}</td>

                        <td className="p-3.5 font-mono font-semibold text-stone-900 tabular-nums">
                          PKR {(p.salePrice || p.price).toLocaleString()}
                        </td>

                        <td className="p-3.5">
                          <div className="space-y-1">
                            <span
                              className={`font-mono font-bold text-sm ${
                                isOut
                                  ? 'text-rose-700'
                                  : isLow
                                  ? 'text-amber-700'
                                  : 'text-stone-900'
                              }`}
                            >
                              {p.stock} units
                            </span>
                            {isLow && (
                              <div className="text-[10px] text-amber-700 font-semibold">
                                Low Stock Alert
                              </div>
                            )}
                            {isOut && (
                              <div className="text-[10px] text-rose-700 font-semibold">
                                Out of Stock
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                setShowRestockModal({ productId: p.id, productName: p.name })
                              }
                              className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded font-medium text-[11px]"
                            >
                              Restock
                            </button>
                            <button
                              onClick={() => deleteProduct(p.id)}
                              className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-stone-950">Client Orders & Logistics</h2>
                <p className="text-xs text-stone-500">
                  Verify payments, update shipping air waybills and transition states.
                </p>
              </div>

              {/* Status Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                {['all', 'placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => setOrderStatusFilter(status)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                        orderStatusFilter === status
                          ? 'bg-stone-900 text-white shadow-xs'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {status}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto border border-stone-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                  <tr>
                    <th className="p-3.5">Order #</th>
                    <th className="p-3.5">Customer & City</th>
                    <th className="p-3.5">Total & Method</th>
                    <th className="p-3.5">Payment State</th>
                    <th className="p-3.5">Order Status</th>
                    <th className="p-3.5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-stone-50/70">
                      <td className="p-3.5 font-mono font-bold text-stone-900">
                        #{ord.orderNumber}
                      </td>

                      <td className="p-3.5">
                        <div className="font-semibold text-stone-900">{ord.customerName}</div>
                        <div className="text-stone-500 text-[11px]">
                          {ord.shippingAddress.city} · {ord.customerPhone}
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="font-mono font-bold text-stone-900 tabular-nums">
                          PKR {ord.total.toLocaleString()}
                        </div>
                        <div className="text-[11px] text-stone-500 uppercase font-mono">
                          {ord.paymentMethod.replace('_', ' ')}
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              ord.paymentStatus === 'paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.paymentStatus === 'failed'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {ord.paymentStatus}
                          </span>
                          {ord.paymentStatus === 'pending' && (
                            <button
                              onClick={() => updatePaymentStatus(ord.id, 'paid')}
                              className="text-[10px] bg-stone-900 text-white px-2 py-0.5 rounded hover:bg-stone-800"
                              title="Mark verified & paid"
                            >
                              Approve
                            </button>
                          )}
                          {ord.paymentProofUrl && (
                            <button
                              onClick={() => setViewingProofOrder(ord)}
                              className="p-1 text-stone-500 hover:text-stone-900"
                              title="View uploaded transfer receipt slip"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>

                      <td className="p-3.5">
                        <select
                          value={ord.orderStatus}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                          className="bg-white border border-stone-300 rounded px-2 py-1 text-xs font-semibold capitalize focus:ring-1 focus:ring-stone-900"
                        >
                          <option value="placed">Placed</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled (Restore Stock)</option>
                        </select>
                      </td>

                      <td className="p-3.5">
                        <button
                          onClick={() => {
                            const tracking = prompt(
                              'Enter TCS / Leopards Airway Bill Tracking #:',
                              ord.trackingNumber || 'TCS-904812'
                            );
                            if (tracking) {
                              updateOrderStatus(ord.id, 'shipped', tracking);
                            }
                          }}
                          className="text-[11px] underline text-stone-700 hover:text-stone-950 font-medium"
                        >
                          {ord.trackingNumber ? `Track: ${ord.trackingNumber}` : 'Assign Tracking'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. INVENTORY MANAGEMENT & AUDIT LOGS */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-stone-950">
                    Real-Time Stock Inventory & Reservation Balance
                  </h2>
                  <p className="text-xs text-stone-500">
                    Calculates available stock, reserved items in unfulfilled carts, and low stock thresholds.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((prod) => {
                  const available = Math.max(0, prod.stock - prod.reservedStock);
                  return (
                    <div
                      key={prod.id}
                      className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <div className="font-semibold text-stone-900 text-sm">{prod.name}</div>
                        <div className="text-xs text-stone-500 font-mono">SKU: {prod.sku}</div>
                        <div className="text-xs text-stone-600 font-mono">
                          Physical Stock: <strong>{prod.stock}</strong> · Reserved: {prod.reservedStock} · Available:{' '}
                          <strong className="text-emerald-700">{available}</strong>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          setShowRestockModal({ productId: prod.id, productName: prod.name })
                        }
                        className="bg-stone-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-stone-800"
                      >
                        Adjust / Restock
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Immutable Inventory Audit Log Trail */}
            <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-stone-900 text-sm">
                    Immutable Inventory Movement Audit Trail (Database Transaction Logs)
                  </h3>
                  <p className="text-xs text-stone-500">
                    Every fulfillment deduction, cancellation return, or manual warehouse intake is recorded permanently.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto border border-stone-200 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                    <tr>
                      <th className="p-3">Product Name & SKU</th>
                      <th className="p-3">Previous</th>
                      <th className="p-3">Change (Delta)</th>
                      <th className="p-3">New Level</th>
                      <th className="p-3">Operational Reason</th>
                      <th className="p-3">Employee / Actor</th>
                      <th className="p-3">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-mono">
                    {inventoryLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-stone-50/70">
                        <td className="p-3 font-sans font-semibold text-stone-900">
                          {log.productName} <span className="text-stone-400">({log.sku})</span>
                        </td>
                        <td className="p-3 text-stone-600">{log.previousStock}</td>
                        <td
                          className={`p-3 font-bold ${
                            log.changeAmount > 0 ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {log.changeAmount > 0 ? `+${log.changeAmount}` : log.changeAmount}
                        </td>
                        <td className="p-3 font-bold text-stone-900">{log.newStock}</td>
                        <td className="p-3 font-sans text-stone-700">{log.reason}</td>
                        <td className="p-3 font-sans text-stone-600">{log.employeeName}</td>
                        <td className="p-3 text-stone-400 text-[11px]">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 5. REVIEWS MODERATION */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
            <h2 className="text-lg font-semibold text-stone-950">Client Reviews Moderation Queue</h2>
            <p className="text-xs text-stone-500">
              Approve, reject or hide customer testimonials before they are published live on product detail pages.
            </p>

            <div className="divide-y divide-stone-200">
              {reviews.map((r) => {
                const prod = products.find((p) => p.id === r.productId);
                return (
                  <div key={r.id} className="py-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-stone-900 text-sm">
                          {r.customerName}
                        </span>
                        <span className="text-xs text-stone-500">
                          on <strong>{prod?.name || 'Artifact'}</strong>
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            r.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : r.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {r.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {r.status !== 'approved' && (
                          <button
                            onClick={() => moderateReview(r.id, 'approved')}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs px-3 py-1 rounded"
                          >
                            Approve
                          </button>
                        )}
                        {r.status !== 'rejected' && (
                          <button
                            onClick={() => moderateReview(r.id, 'rejected')}
                            className="bg-rose-700 hover:bg-rose-800 text-white text-xs px-3 py-1 rounded"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="font-semibold text-stone-900 text-xs">{r.title}</div>
                    <p className="text-xs text-stone-600">{r.comment}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 6. COUPONS & PROMOTIONS */}
        {activeTab === 'coupons' && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-stone-950">Promotional Vouchers & Coupons</h2>
                <p className="text-xs text-stone-500">Configure percentage or fixed PKR discounts.</p>
              </div>

              <button
                onClick={() => {
                  const code = prompt('Enter Coupon Code (e.g. VIP20):');
                  if (code) {
                    addCoupon({
                      code: code.toUpperCase(),
                      type: 'percent',
                      value: 15,
                      minOrder: 10000,
                      maxUses: 200,
                      expiryDate: '2027-12-31',
                      isActive: true,
                    });
                  }
                }}
                className="bg-stone-900 text-white text-xs font-semibold px-4 py-2 rounded-lg"
              >
                + Create Coupon
              </button>
            </div>

            <div className="overflow-x-auto border border-stone-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                  <tr>
                    <th className="p-3">Code</th>
                    <th className="p-3">Discount Type</th>
                    <th className="p-3">Value</th>
                    <th className="p-3">Min Order</th>
                    <th className="p-3">Redemptions</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-mono">
                  {coupons.map((c) => (
                    <tr key={c.id}>
                      <td className="p-3 font-bold text-stone-950">{c.code}</td>
                      <td className="p-3 uppercase">{c.type}</td>
                      <td className="p-3 font-bold text-emerald-700">
                        {c.type === 'percent' ? `${c.value}% Off` : `PKR ${c.value} Off`}
                      </td>
                      <td className="p-3">PKR {c.minOrder.toLocaleString()}</td>
                      <td className="p-3">
                        {c.currentUses} / {c.maxUses}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => toggleCouponStatus(c.id)}
                          className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold uppercase ${
                            c.isActive
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-200 text-stone-600'
                          }`}
                        >
                          {c.isActive ? 'Active' : 'Disabled'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 7. STORE SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-5">
            <h2 className="text-lg font-semibold text-stone-950">Store & Payment Gateway Settings</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-stone-600 mb-1">Meezan Bank Title</label>
                <input
                  type="text"
                  value={storeSettings.bankTitle}
                  onChange={(e) => updateStoreSettings({ bankTitle: e.target.value })}
                  className="w-full border border-stone-300 rounded p-2"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-600 mb-1">Meezan IBAN</label>
                <input
                  type="text"
                  value={storeSettings.bankIban}
                  onChange={(e) => updateStoreSettings({ bankIban: e.target.value })}
                  className="w-full border border-stone-300 rounded p-2 font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-600 mb-1">JazzCash Account</label>
                <input
                  type="text"
                  value={storeSettings.jazzCashAccount}
                  onChange={(e) => updateStoreSettings({ jazzCashAccount: e.target.value })}
                  className="w-full border border-stone-300 rounded p-2 font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-600 mb-1">Easypaisa Account</label>
                <input
                  type="text"
                  value={storeSettings.easypaisaAccount}
                  onChange={(e) => updateStoreSettings({ easypaisaAccount: e.target.value })}
                  className="w-full border border-stone-300 rounded p-2 font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-600 mb-1">
                  Complimentary Shipping Threshold (PKR)
                </label>
                <input
                  type="number"
                  value={storeSettings.freeShippingThreshold}
                  onChange={(e) =>
                    updateStoreSettings({ freeShippingThreshold: Number(e.target.value) })
                  }
                  className="w-full border border-stone-300 rounded p-2 font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-600 mb-1">
                  Standard Courier Fee (PKR)
                </label>
                <input
                  type="number"
                  value={storeSettings.standardShippingFee}
                  onChange={(e) =>
                    updateStoreSettings({ standardShippingFee: Number(e.target.value) })
                  }
                  className="w-full border border-stone-300 rounded p-2 font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* 8. SUPABASE ARCHITECTURE & RLS HUB */}
        {activeTab === 'supabase' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-stone-950 flex items-center gap-2">
                    <Database className="w-5 h-5 text-emerald-600" />
                    <span>Supabase PostgreSQL Schema & Security Policies</span>
                  </h2>
                  <p className="text-xs text-stone-500">
                    Complete production-ready DDL schema with Row Level Security (RLS) rules matching the specification.
                  </p>
                </div>

                <button
                  onClick={handleCopySchema}
                  className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  {copiedSchema ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSchema ? 'SQL Copied!' : 'Copy SQL Schema'}</span>
                </button>
              </div>

              {/* Supabase Connection Form */}
              <form
                onSubmit={handleSaveSupabase}
                className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3"
              >
                <div className="text-xs font-semibold text-stone-900">
                  Supabase Project Credentials (Optional Live Connection)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-stone-600 mb-1">Project URL</label>
                    <input
                      type="text"
                      value={supabaseUrlInput}
                      onChange={(e) => setSupabaseUrlInput(e.target.value)}
                      placeholder="https://xyz.supabase.co"
                      className="w-full bg-white border border-stone-300 rounded p-2 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 mb-1">Anon / Public Key</label>
                    <input
                      type="text"
                      value={supabaseKeyInput}
                      onChange={(e) => setSupabaseKeyInput(e.target.value)}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      className="w-full bg-white border border-stone-300 rounded p-2 font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2 text-xs text-emerald-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Local High-Performance Store synced & RLS-ready</span>
                  </div>

                  <button
                    type="submit"
                    className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-4 py-1.5 rounded"
                  >
                    Save & Test Connection
                  </button>
                </div>

                {supabaseConnectedNotice && (
                  <p className="text-xs text-emerald-700 font-medium">
                    Supabase configuration updated successfully.
                  </p>
                )}
              </form>

              {/* Code viewer for SQL Schema */}
              <div className="relative">
                <pre className="bg-stone-950 text-stone-200 text-xs p-4 rounded-xl overflow-x-auto max-h-96 font-mono leading-relaxed">
                  <code>{SUPABASE_SQL_SCHEMA}</code>
                </pre>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-stone-200 pb-3">
              <h3 className="font-semibold text-stone-900 text-base">Add New Luxury Piece</h3>
              <button onClick={() => setShowAddProductModal(false)}>
                <XCircle className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-600 mb-1 font-medium">Product Name (English)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Cashmere Pashmina"
                  value={newProductForm.name}
                  onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                  className="w-full border border-stone-300 rounded p-2"
                />
              </div>

              <div>
                <label className="block text-stone-600 mb-1 font-medium">Product Name (Urdu)</label>
                <input
                  type="text"
                  placeholder="e.g. شاہی کشمیری پشمینہ شال"
                  value={newProductForm.urduName}
                  onChange={(e) => setNewProductForm({ ...newProductForm, urduName: e.target.value })}
                  className="w-full border border-stone-300 rounded p-2 font-urdu"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 mb-1 font-medium">SKU Code</label>
                  <input
                    type="text"
                    required
                    placeholder="ZLQ-APP-009"
                    value={newProductForm.sku}
                    onChange={(e) => setNewProductForm({ ...newProductForm, sku: e.target.value })}
                    className="w-full border border-stone-300 rounded p-2 font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 mb-1 font-medium">Category</label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                    className="w-full border border-stone-300 rounded p-2 bg-white"
                  >
                    <option value="Artisanal Apparel & Shawls">Artisanal Apparel & Shawls</option>
                    <option value="Niche Perfumes & Ouds">Niche Perfumes & Ouds</option>
                    <option value="Full-Grain Leather Goods">Full-Grain Leather Goods</option>
                    <option value="Living & Sculptural Decor">Living & Sculptural Decor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-600 mb-1 font-medium">Price (PKR)</label>
                  <input
                    type="number"
                    required
                    value={newProductForm.price}
                    onChange={(e) => setNewProductForm({ ...newProductForm, price: Number(e.target.value) })}
                    className="w-full border border-stone-300 rounded p-2 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 mb-1 font-medium">Sale Price (Optional)</label>
                  <input
                    type="number"
                    value={newProductForm.salePrice}
                    onChange={(e) => setNewProductForm({ ...newProductForm, salePrice: Number(e.target.value) })}
                    className="w-full border border-stone-300 rounded p-2 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 mb-1 font-medium">Initial Stock</label>
                  <input
                    type="number"
                    required
                    value={newProductForm.stock}
                    onChange={(e) => setNewProductForm({ ...newProductForm, stock: Number(e.target.value) })}
                    className="w-full border border-stone-300 rounded p-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 mb-1 font-medium">Image Asset Path / URL</label>
                <input
                  type="text"
                  value={newProductForm.imageUrl}
                  onChange={(e) => setNewProductForm({ ...newProductForm, imageUrl: e.target.value })}
                  className="w-full border border-stone-300 rounded p-2 font-mono"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 border rounded text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 text-white rounded font-semibold"
                >
                  Save & Publish Piece
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Restock Modal */}
      {showRestockModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-stone-200 pb-3">
              <h3 className="font-semibold text-stone-900 text-sm">
                Restock Inventory: {showRestockModal.productName}
              </h3>
              <button onClick={() => setShowRestockModal(null)}>
                <XCircle className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <form onSubmit={handleRestockSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-600 mb-1 font-medium">Quantity to Add</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(Number(e.target.value))}
                  className="w-full border border-stone-300 rounded p-2 font-mono"
                />
              </div>

              <div>
                <label className="block text-stone-600 mb-1 font-medium">Audit Reason</label>
                <input
                  type="text"
                  required
                  value={restockReason}
                  onChange={(e) => setRestockReason(e.target.value)}
                  className="w-full border border-stone-300 rounded p-2"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRestockModal(null)}
                  className="px-4 py-2 border rounded text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 text-white rounded font-semibold"
                >
                  Commit Restock Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Proof Order Modal */}
      {viewingProofOrder && (
        <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-stone-200 pb-2">
              <h3 className="font-semibold text-stone-900 text-sm">
                Payment Proof Slip: Order #{viewingProofOrder.orderNumber}
              </h3>
              <button onClick={() => setViewingProofOrder(null)}>
                <XCircle className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <div className="bg-stone-100 rounded-lg overflow-hidden border border-stone-300 max-h-80 flex items-center justify-center">
              <img
                src={viewingProofOrder.paymentProofUrl}
                alt="Payment Slip Proof"
                className="max-h-80 w-auto object-contain"
              />
            </div>

            <div className="text-xs text-stone-600 space-y-1">
              <div>Transaction Ref: <strong>{viewingProofOrder.transactionRef || 'N/A'}</strong></div>
              <div>Customer: {viewingProofOrder.customerName} ({viewingProofOrder.customerPhone})</div>
              <div>Amount: PKR {viewingProofOrder.total.toLocaleString()}</div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  updatePaymentStatus(viewingProofOrder.id, 'paid');
                  setViewingProofOrder(null);
                }}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded text-xs font-semibold"
              >
                Approve Payment & Advance Order
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
