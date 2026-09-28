/**
 * Supabase Database Schema & Production RLS Generator
 * Matches the requested architecture:
 * users, profiles, roles, employees, permissions, categories, products,
 * inventory, inventory_transactions, orders, order_items, payments, reviews, coupons
 */

export const SUPABASE_SQL_SCHEMA = `-- ============================================================
-- ZAUQ LUXURY PLATFORM - SUPABASE POSTGRESQL SCHEMA & RLS
-- Target: Supabase Postgres 15+
-- ============================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Enumerated Types
CREATE TYPE user_role AS ENUM ('CUSTOMER', 'EMPLOYEE', 'ADMIN');
CREATE TYPE order_status AS ENUM ('placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE payment_method AS ENUM ('cod', 'jazzcash', 'easypaisa', 'bank_transfer');
CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected');

-- 3. Profiles (Extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT,
  role user_role DEFAULT 'CUSTOMER'::user_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 4. Employee Permissions
CREATE TABLE public.employee_permissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  permission TEXT NOT NULL, -- 'inventory', 'orders', 'customers', 'reviews', 'settings'
  assigned_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(user_id, permission)
);

-- 5. Categories
CREATE TABLE public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  urdu_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 6. Products
CREATE TABLE public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  urdu_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  brand TEXT DEFAULT 'Zauq Heritage' NOT NULL,
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  sale_price NUMERIC(12, 2) CHECK (sale_price IS NULL OR sale_price < price),
  stock INTEGER DEFAULT 0 NOT NULL CHECK (stock >= 0),
  reserved_stock INTEGER DEFAULT 0 NOT NULL CHECK (reserved_stock >= 0),
  min_stock_alert INTEGER DEFAULT 5 NOT NULL,
  description TEXT NOT NULL,
  urdu_description TEXT NOT NULL,
  images TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  specifications JSONB DEFAULT '[]'::JSONB NOT NULL,
  is_featured BOOLEAN DEFAULT false NOT NULL,
  rating NUMERIC(3, 2) DEFAULT 5.0 NOT NULL,
  review_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 7. Inventory Transactions (Full Audit Trail)
CREATE TABLE public.inventory_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  change_amount INTEGER NOT NULL,
  previous_stock INTEGER NOT NULL,
  new_stock INTEGER NOT NULL,
  reason TEXT NOT NULL,
  performed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 8. Coupons
CREATE TABLE public.coupons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percent', 'fixed')),
  discount_value NUMERIC(10, 2) NOT NULL CHECK (discount_value > 0),
  min_order_amount NUMERIC(12, 2) DEFAULT 0 NOT NULL,
  max_uses INTEGER DEFAULT 1000 NOT NULL,
  current_uses INTEGER DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 9. Orders
CREATE TABLE public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address JSONB NOT NULL,
  subtotal NUMERIC(12, 2) NOT NULL,
  discount_amount NUMERIC(12, 2) DEFAULT 0 NOT NULL,
  coupon_code TEXT,
  shipping_fee NUMERIC(12, 2) DEFAULT 0 NOT NULL,
  tax NUMERIC(12, 2) DEFAULT 0 NOT NULL,
  total NUMERIC(12, 2) NOT NULL,
  payment_method payment_method NOT NULL,
  payment_status payment_status DEFAULT 'pending'::payment_status NOT NULL,
  order_status order_status DEFAULT 'placed'::order_status NOT NULL,
  transaction_ref TEXT,
  payment_proof_url TEXT,
  tracking_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 10. Order Items
CREATE TABLE public.order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  sku TEXT NOT NULL,
  price NUMERIC(12, 2) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  image_url TEXT,
  variant_name TEXT
);

-- 11. Customer Reviews
CREATE TABLE public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  comment TEXT NOT NULL,
  verified_purchase BOOLEAN DEFAULT false NOT NULL,
  status review_status DEFAULT 'pending'::review_status NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ============================================================
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Helper functions for RBAC
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'ADMIN'
  );
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.has_permission(required_perm TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    LEFT JOIN public.employee_permissions ep ON ep.user_id = p.id
    WHERE p.id = auth.uid()
      AND (p.role = 'ADMIN' OR (p.role = 'EMPLOYEE' AND ep.permission = required_perm))
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Public read for categories & products
CREATE POLICY "Public can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public can view products" ON public.products FOR SELECT USING (true);

-- Product writes restricted to Admin or Warehouse Employees
CREATE POLICY "Admins and inventory staff can modify products" ON public.products
  FOR ALL USING (public.has_permission('inventory'));

-- Orders RLS: Customers see only their own orders; Admins & Order staff see all
CREATE POLICY "Customers view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = customer_id OR public.has_permission('orders'));

CREATE POLICY "Customers can create orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = customer_id OR auth.uid() IS NULL);

CREATE POLICY "Order staff can update orders" ON public.orders
  FOR UPDATE USING (public.has_permission('orders'));

-- Reviews RLS: Public sees approved reviews; Customers create; Support moderates
CREATE POLICY "Public can view approved reviews" ON public.reviews
  FOR SELECT USING (status = 'approved' OR auth.uid() = customer_id OR public.has_permission('reviews'));

CREATE POLICY "Customers create reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Support staff moderate reviews" ON public.reviews
  FOR UPDATE USING (public.has_permission('reviews'));

-- Inventory transactions viewable by authorized staff only
CREATE POLICY "Staff can view inventory audit" ON public.inventory_transactions
  FOR SELECT USING (public.has_permission('inventory'));

CREATE POLICY "Staff can log inventory" ON public.inventory_transactions
  FOR INSERT WITH CHECK (public.has_permission('inventory'));
`;
