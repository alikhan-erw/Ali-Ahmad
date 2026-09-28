'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  INITIAL_CATEGORIES,
  INITIAL_COUPONS,
  INITIAL_INVENTORY_LOGS,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS,
  INITIAL_STORE_SETTINGS,
  INITIAL_USERS,
} from '../data/mockData';
import {
  CartItem,
  Category,
  Coupon,
  InventoryLog,
  Order,
  OrderStatus,
  PaymentStatus,
  Product,
  Review,
  Role,
  ShippingAddress,
  StoreSettings,
  User,
} from '../types';

export type ActiveView =
  | 'home'
  | 'shop'
  | 'product'
  | 'cart'
  | 'checkout'
  | 'account'
  | 'admin'
  | 'employee'
  | 'faq'
  | 'legal';

interface StoreContextType {
  language: 'en' | 'ur';
  setLanguage: (lang: 'en' | 'ur') => void;
  currentUser: User | null;
  users: User[];
  switchUser: (userId: string | null) => void;
  
  // Navigation
  activeView: ActiveView;
  selectedProductSlug: string | null;
  selectedOrderId: string | null;
  legalTopic: string | null;
  navigate: (view: ActiveView, payload?: any) => void;
  
  // Products
  products: Product[];
  categories: Category[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Cart & Wishlist
  cart: CartItem[];
  wishlist: string[];
  addToCart: (product: Product, quantity?: number, variantId?: string) => void;
  updateCartQty: (productId: string, quantity: number, variantId?: string) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  
  // Checkout & Coupons
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  coupons: Coupon[];
  addCoupon: (coupon: Omit<Coupon, 'id' | 'currentUses'>) => void;
  toggleCouponStatus: (couponId: string) => void;
  createOrder: (orderPayload: {
    shippingAddress: ShippingAddress;
    paymentMethod: 'cod' | 'jazzcash' | 'easypaisa' | 'bank_transfer';
    transactionRef?: string;
    paymentProofUrl?: string;
    notes?: string;
  }) => Promise<Order>;
  
  // Orders
  orders: Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string) => void;
  updatePaymentStatus: (orderId: string, status: PaymentStatus, transactionRef?: string) => void;
  
  // Inventory
  inventoryLogs: InventoryLog[];
  adjustStock: (productId: string, changeAmount: number, reason: string, employeeName?: string) => void;
  
  // Reviews
  reviews: Review[];
  submitReview: (productId: string, rating: number, title: string, comment: string) => void;
  moderateReview: (reviewId: string, status: 'approved' | 'rejected') => void;
  
  // Settings & Supabase
  storeSettings: StoreSettings;
  updateStoreSettings: (newSettings: Partial<StoreSettings>) => void;
  supabaseConfig: { url: string; anonKey: string; isConnected: boolean };
  saveSupabaseConfig: (url: string, anonKey: string) => void;
  
  // Modal & Drawer visibility
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Utilities
  resetDemoData: () => void;
  cartTotals: {
    subtotal: number;
    discount: number;
    shippingFee: number;
    tax: number;
    total: number;
    itemCount: number;
  };
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [language, setLanguage] = useState<'en' | 'ur'>('en');
  const [users] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USERS[0]); // Defaults to Ali Ahmed (Customer)
  
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [legalTopic, setLegalTopic] = useState<string | null>('terms');

  // Modal & Drawer States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Products (Hydration Safe - step 2 will replace with Supabase query)
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(['prod-oud-al-layl']);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>(INITIAL_INVENTORY_LOGS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(INITIAL_STORE_SETTINGS);
  const [supabaseConfig, setSupabaseConfig] = useState({
    url: 'https://xyzcompany.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    isConnected: true,
  });

  // Hydrate client-side state safely after initial mount to prevent hydration mismatch
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedProducts = localStorage.getItem('zauq_products');
      if (savedProducts) {
        try {
          const parsed = JSON.parse(savedProducts);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const repaired = parsed.map((p: any) => {
              const canonical = INITIAL_PRODUCTS.find((ip) => ip.id === p.id || ip.slug === p.slug);
              const rawImages =
                (Array.isArray(p.images) && p.images.length > 0 && p.images) ||
                (canonical?.images && canonical.images.length > 0 && canonical.images) ||
                (p.image ? [p.image] : null) ||
                ['/images/product_silk_apparel_1790571652578.jpg'];
              const normalizedImages = rawImages.map((img: string) => {
                if (img.startsWith('images/')) return `/${img}`;
                if (img.startsWith('public/images/')) return img.replace('public/', '/');
                return img;
              });
              return {
                ...(canonical || {}),
                ...p,
                images: normalizedImages,
              };
            });
            setProducts(repaired);
          }
        } catch (e) {
          console.error('Error hydrating products:', e);
        }
      }

      const savedCart = localStorage.getItem('zauq_cart');
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart);
          if (Array.isArray(parsed)) {
            const repairedCart: CartItem[] = parsed.map((item: any) => {
              const canonical = INITIAL_PRODUCTS.find(
                (p) => p.id === item.productId || p.slug === item.product?.slug
              );
              const prod = item.product || canonical || INITIAL_PRODUCTS[0];
              const rawImages =
                (Array.isArray(prod.images) && prod.images.length > 0 && prod.images) ||
                (canonical?.images && canonical.images.length > 0 && canonical.images) ||
                (prod.image ? [prod.image] : null) ||
                ['/images/product_silk_apparel_1790571652578.jpg'];
              const normalizedImages = rawImages.map((img: string) => {
                if (img.startsWith('images/')) return `/${img}`;
                if (img.startsWith('public/images/')) return img.replace('public/', '/');
                return img;
              });
              return {
                productId: item.productId || canonical?.id || prod.id,
                variantId: item.variantId,
                quantity: Number(item.quantity) || 1,
                product: {
                  ...(canonical || {}),
                  ...prod,
                  images: normalizedImages,
                },
              };
            });
            setCart(repairedCart);
          }
        } catch (e) {
          console.error('Error hydrating cart:', e);
        }
      }

      const savedWishlist = localStorage.getItem('zauq_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedCoupons = localStorage.getItem('zauq_coupons');
      if (savedCoupons) setCoupons(JSON.parse(savedCoupons));

      const savedOrders = localStorage.getItem('zauq_orders');
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedLogs = localStorage.getItem('zauq_inv_logs');
      if (savedLogs) setInventoryLogs(JSON.parse(savedLogs));

      const savedReviews = localStorage.getItem('zauq_reviews');
      if (savedReviews) setReviews(JSON.parse(savedReviews));

      const savedSettings = localStorage.getItem('zauq_settings');
      if (savedSettings) setStoreSettings(JSON.parse(savedSettings));

      const savedSupabase = localStorage.getItem('zauq_supabase');
      if (savedSupabase) setSupabaseConfig(JSON.parse(savedSupabase));
    } catch (e) {
      console.error('Error hydrating localStorage state:', e);
    }
  }, []);

  // Save changes to localStorage (Guarded for SSR)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('zauq_products', JSON.stringify(products));
    }
  }, [products]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('zauq_cart', JSON.stringify(cart));
    }
  }, [cart]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('zauq_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('zauq_orders', JSON.stringify(orders));
    }
  }, [orders]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('zauq_inv_logs', JSON.stringify(inventoryLogs));
    }
  }, [inventoryLogs]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('zauq_reviews', JSON.stringify(reviews));
    }
  }, [reviews]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('zauq_coupons', JSON.stringify(coupons));
    }
  }, [coupons]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('zauq_settings', JSON.stringify(storeSettings));
    }
  }, [storeSettings]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('zauq_supabase', JSON.stringify(supabaseConfig));
    }
  }, [supabaseConfig]);


  // Navigation Helper
  const navigate = (view: ActiveView, payload?: any) => {
    setActiveView(view);
    if (view === 'product') {
      const slug = typeof payload === 'string' ? payload : payload?.slug;
      setSelectedProductSlug(slug);
    }
    if (view === 'account' && payload?.orderId) {
      setSelectedOrderId(payload.orderId);
    }
    if (view === 'legal') {
      setLegalTopic(typeof payload === 'string' ? payload : 'terms');
    }

    if (typeof window !== 'undefined') {
      const routeMap: Record<ActiveView, (p?: any) => string> = {
        home: () => '/',
        shop: (p) => (p?.category ? `/shop?category=${encodeURIComponent(p.category)}` : '/shop'),
        product: (p) => `/products/${typeof p === 'string' ? p : p?.slug || ''}`,
        account: (p) => (p?.tab ? `/account?tab=${encodeURIComponent(p.tab)}` : '/account'),
        admin: () => '/admin',
        employee: () => '/employee',
        legal: (topic) => `/legal?topic=${encodeURIComponent(typeof topic === 'string' ? topic : 'terms')}`,
        cart: () => '/cart',
        checkout: () => '/checkout',
        faq: () => '/legal?topic=faq',
      };
      const targetUrl = routeMap[view]?.(payload);
      if (targetUrl) {
        try {
          router.push(targetUrl);
        } catch {
          window.location.href = targetUrl;
        }
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const switchUser = (userId: string | null) => {
    if (!userId) {
      setCurrentUser(null);
      return;
    }
    const matched = users.find((u) => u.id === userId);
    if (matched) {
      setCurrentUser(matched);
    }
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, variantId?: string) => {
    // 1. Resolve canonical product to avoid losing image or data
    const canonical = INITIAL_PRODUCTS.find(
      (p) => p.id === product.id || p.slug === product.slug
    );
    const rawImages =
      (Array.isArray(product.images) && product.images.length > 0 && product.images) ||
      (canonical?.images && canonical.images.length > 0 && canonical.images) ||
      ((product as any).image ? [(product as any).image] : null) ||
      ['/images/product_silk_apparel_1790571652578.jpg'];

    const normalizedImages = rawImages.map((img: string) => {
      if (img.startsWith('images/')) return `/${img}`;
      if (img.startsWith('public/images/')) return img.replace('public/', '/');
      return img;
    });

    const safeProduct: Product = {
      ...(canonical || {}),
      ...product,
      images: normalizedImages,
    };

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === safeProduct.id && item.variantId === variantId
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
          product: safeProduct,
        };
        return next;
      }
      return [
        ...prev,
        {
          productId: safeProduct.id,
          variantId,
          quantity,
          product: safeProduct,
        },
      ];
    });

    // Open cart drawer immediately to show confirmation and product thumbnail
    setIsCartOpen(true);
  };

  const updateCartQty = (productId: string, quantity: number, variantId?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId && item.variantId === variantId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: string, variantId?: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.productId === productId && item.variantId === variantId))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Cart Totals calculation
  const subtotal = cart.reduce((acc, item) => {
    const unitPrice = item.product.salePrice || item.product.price;
    return acc + unitPrice * item.quantity;
  }, 0);

  let discount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minOrder) {
    if (appliedCoupon.type === 'percent') {
      discount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else {
      discount = Math.min(appliedCoupon.value, subtotal);
    }
  }

  const shippingFee =
    cart.length === 0 || subtotal >= storeSettings.freeShippingThreshold
      ? 0
      : storeSettings.standardShippingFee;

  const tax = Math.round(((subtotal - discount) * storeSettings.taxRate) / 100);
  const total = Math.max(0, subtotal - discount + shippingFee + tax);
  const itemCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  const cartTotals = { subtotal, discount, shippingFee, tax, total, itemCount };

  // Coupons
  const applyCoupon = (code: string) => {
    const found = coupons.find(
      (c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive
    );
    if (!found) {
      return { success: false, message: 'Invalid or expired promotional code.' };
    }
    if (subtotal < found.minOrder) {
      return {
        success: false,
        message: `This coupon requires a minimum purchase order of PKR ${found.minOrder.toLocaleString()}.`,
      };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Coupon ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const addCoupon = (couponData: Omit<Coupon, 'id' | 'currentUses'>) => {
    const newCoupon: Coupon = {
      ...couponData,
      id: `coup-${Date.now()}`,
      currentUses: 0,
    };
    setCoupons((prev) => [newCoupon, ...prev]);
  };

  const toggleCouponStatus = (couponId: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === couponId ? { ...c, isActive: !c.isActive } : c))
    );
  };

  // Inventory Stock Adjustment & Audit Trail
  const adjustStock = (
    productId: string,
    changeAmount: number,
    reason: string,
    employeeName?: string
  ) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        const previousStock = prod.stock;
        const newStock = Math.max(0, previousStock + changeAmount);

        // Record audit log
        const logEntry: InventoryLog = {
          id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          productId: prod.id,
          productName: prod.name,
          sku: prod.sku,
          changeAmount,
          previousStock,
          newStock,
          reason,
          employeeName: employeeName || currentUser?.name || 'Authorized Staff',
          timestamp: new Date().toISOString(),
        };

        setInventoryLogs((logs) => [logEntry, ...logs]);

        return {
          ...prod,
          stock: newStock,
        };
      })
    );
  };

  // Order Placement
  const createOrder = async (orderPayload: {
    shippingAddress: ShippingAddress;
    paymentMethod: 'cod' | 'jazzcash' | 'easypaisa' | 'bank_transfer';
    transactionRef?: string;
    paymentProofUrl?: string;
    notes?: string;
  }): Promise<Order> => {
    const orderNum = `ZLQ-${Math.floor(1000 + Math.random() * 9000)}`;

    const orderItems = cart.map((item) => {
      const variant = item.product.variants?.find((v) => v.id === item.variantId);
      return {
        productId: item.product.id,
        name: item.product.name,
        sku: variant?.sku || item.product.sku,
        price: item.product.salePrice || item.product.price,
        quantity: item.quantity,
        image: item.product.images[0] || '',
        variantName: variant?.name,
      };
    });

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      customerId: currentUser?.id || 'guest-user',
      customerName: orderPayload.shippingAddress.fullName,
      customerEmail: orderPayload.shippingAddress.email,
      customerPhone: orderPayload.shippingAddress.phone,
      shippingAddress: orderPayload.shippingAddress,
      items: orderItems,
      subtotal: cartTotals.subtotal,
      discountAmount: cartTotals.discount,
      couponCode: appliedCoupon?.code,
      shippingFee: cartTotals.shippingFee,
      tax: cartTotals.tax,
      total: cartTotals.total,
      paymentMethod: orderPayload.paymentMethod,
      paymentStatus: orderPayload.paymentMethod === 'cod' ? 'pending' : 'pending',
      orderStatus: 'placed',
      transactionRef: orderPayload.transactionRef,
      paymentProofUrl: orderPayload.paymentProofUrl,
      notes: orderPayload.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Auto Deduct Stock & Write Audit Logs for each ordered item
    cart.forEach((item) => {
      adjustStock(
        item.product.id,
        -item.quantity,
        `Order #${orderNum} placed by ${orderPayload.shippingAddress.fullName}`,
        'System Automated Fulfillment'
      );
    });

    // Update coupon usage if applicable
    if (appliedCoupon) {
      setCoupons((prev) =>
        prev.map((c) => (c.id === appliedCoupon.id ? { ...c, currentUses: c.currentUses + 1 } : c))
      );
    }

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  // Order Management (Advance status or cancellation with stock restore)
  const updateOrderStatus = (orderId: string, status: OrderStatus, trackingNumber?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;

        // If cancelled or returned, automatically restore stock to inventory!
        if (
          (status === 'cancelled' || status === 'returned') &&
          ord.orderStatus !== 'cancelled' &&
          ord.orderStatus !== 'returned'
        ) {
          ord.items.forEach((item) => {
            adjustStock(
              item.productId,
              item.quantity,
              `Order #${ord.orderNumber} ${status === 'cancelled' ? 'Cancellation' : 'Return'} (Restocked)`,
              currentUser?.name || 'Order Officer'
            );
          });
        }

        return {
          ...ord,
          orderStatus: status,
          trackingNumber: trackingNumber || ord.trackingNumber,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const updatePaymentStatus = (orderId: string, status: PaymentStatus, transactionRef?: string) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              paymentStatus: status,
              transactionRef: transactionRef || ord.transactionRef,
              orderStatus:
                status === 'paid' && ord.orderStatus === 'placed' ? 'confirmed' : ord.orderStatus,
              updatedAt: new Date().toISOString(),
            }
          : ord
      )
    );
  };

  // Product CRUD
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);

    // Initial stock inventory log
    adjustStock(
      newProduct.id,
      newProduct.stock,
      'Product Creation & Initial Stock Load',
      currentUser?.name || 'Administrator'
    );
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((prod) => (prod.id === id ? { ...prod, ...updates } : prod))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((prod) => prod.id !== id));
  };

  // Review System
  const submitReview = (productId: string, rating: number, title: string, comment: string) => {
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      productId,
      customerName: currentUser?.name || 'Verified Client',
      customerEmail: currentUser?.email || 'client@zauqluxury.com',
      rating,
      title,
      comment,
      verifiedPurchase: true,
      status: 'pending', // Requires admin/support moderation per spec
      createdAt: new Date().toISOString(),
    };
    setReviews((prev) => [newReview, ...prev]);
  };

  const moderateReview = (reviewId: string, status: 'approved' | 'rejected') => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, status } : r))
    );
  };

  // Store Settings
  const updateStoreSettings = (newSettings: Partial<StoreSettings>) => {
    setStoreSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const saveSupabaseConfig = (url: string, anonKey: string) => {
    setSupabaseConfig({
      url,
      anonKey,
      isConnected: true,
    });
  };

  const resetDemoData = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setInventoryLogs(INITIAL_INVENTORY_LOGS);
    setReviews(INITIAL_REVIEWS);
    setCoupons(INITIAL_COUPONS);
    setStoreSettings(INITIAL_STORE_SETTINGS);
    setCart([]);
    setWishlist(['prod-oud-al-layl']);
    localStorage.clear();
  };

  return (
    <StoreContext.Provider
      value={{
        language,
        setLanguage,
        currentUser,
        users,
        switchUser,
        activeView,
        selectedProductSlug,
        selectedOrderId,
        legalTopic,
        navigate,
        products,
        categories,
        addProduct,
        updateProduct,
        deleteProduct,
        cart,
        wishlist,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isInWishlist,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        coupons,
        addCoupon,
        toggleCouponStatus,
        createOrder,
        orders,
        updateOrderStatus,
        updatePaymentStatus,
        inventoryLogs,
        adjustStock,
        reviews,
        submitReview,
        moderateReview,
        storeSettings,
        updateStoreSettings,
        supabaseConfig,
        saveSupabaseConfig,
        resetDemoData,
        cartTotals,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isSearchOpen,
        setIsSearchOpen,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
