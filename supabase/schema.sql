-- ============================================================
-- ChinaHut - Supabase Schema
-- Run this entire file in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- CATEGORIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default categories
INSERT INTO categories (name, slug, description) VALUES
  ('Electronics', 'electronics', 'Gadgets, devices, and tech accessories'),
  ('Fashion & Costume', 'fashion-costume', 'Clothing, accessories, and costumes'),
  ('Beauty Products', 'beauty-products', 'Skincare, makeup, and personal care'),
  ('Baby Goods', 'baby-goods', 'Products for infants and toddlers'),
  ('Pet Goods', 'pet-goods', 'Accessories and supplies for pets'),
  ('Miscellaneous', 'miscellaneous', 'Other imported goods and novelties')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- PRODUCTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  cost_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  selling_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  stock_count INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Computed column: profit per unit
ALTER TABLE products ADD COLUMN IF NOT EXISTS profit_per_unit NUMERIC GENERATED ALWAYS AS (selling_price - cost_price) STORED;

-- ============================================================
-- CUSTOMERS TABLE (CRM)
-- ============================================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  purchase_count INTEGER DEFAULT 0,
  total_spent NUMERIC(10, 2) DEFAULT 0,
  first_order_at TIMESTAMPTZ,
  last_order_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (phone)
);

-- ============================================================
-- ORDERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  customer_address TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_delivery', 'delivered', 'cancelled')),
  total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total_cost NUMERIC(10, 2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ORDER ITEMS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10, 2) NOT NULL,
  unit_cost NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ADMIN USERS TABLE (simple auth)
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-update updated_at on orders
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function: upsert customer and track CRM data
CREATE OR REPLACE FUNCTION upsert_customer(
  p_name TEXT,
  p_phone TEXT,
  p_email TEXT,
  p_address TEXT,
  p_order_total NUMERIC
) RETURNS UUID AS $$
DECLARE
  v_customer_id UUID;
BEGIN
  INSERT INTO customers (name, phone, email, address, purchase_count, total_spent, first_order_at, last_order_at)
  VALUES (p_name, p_phone, p_email, p_address, 1, p_order_total, NOW(), NOW())
  ON CONFLICT (phone) DO UPDATE SET
    name = EXCLUDED.name,
    email = COALESCE(EXCLUDED.email, customers.email),
    address = EXCLUDED.address,
    purchase_count = customers.purchase_count + 1,
    total_spent = customers.total_spent + EXCLUDED.total_spent,
    last_order_at = NOW()
  RETURNING id INTO v_customer_id;
  RETURN v_customer_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Public read for products and categories
CREATE POLICY "Public can read active products" ON products
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Public can read categories" ON categories
  FOR SELECT USING (TRUE);

-- Service role can do everything (used by API routes)
CREATE POLICY "Service role full access products" ON products
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access orders" ON orders
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access order_items" ON order_items
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access customers" ON customers
  USING (auth.role() = 'service_role');

-- Anyone can insert orders (checkout)
CREATE POLICY "Public can create orders" ON orders
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Public can create order_items" ON order_items
  FOR INSERT WITH CHECK (TRUE);

-- ============================================================
-- ANALYTICS VIEW: Dashboard Summary
-- ============================================================
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT
  (SELECT COUNT(*) FROM orders WHERE status = 'new') AS new_orders,
  (SELECT COUNT(*) FROM orders WHERE status = 'in_delivery') AS in_delivery_orders,
  (SELECT COUNT(*) FROM orders WHERE status = 'delivered') AS delivered_orders,
  (SELECT COUNT(*) FROM orders WHERE status = 'cancelled') AS cancelled_orders,
  (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status = 'delivered') AS total_revenue,
  (SELECT COALESCE(SUM(total_amount - total_cost), 0) FROM orders WHERE status = 'delivered') AS net_profit,
  (SELECT COUNT(*) FROM customers) AS total_customers,
  (SELECT COUNT(*) FROM customers WHERE purchase_count >= 2) AS repeat_customers,
  (SELECT COUNT(*) FROM products WHERE is_active = TRUE) AS active_products;
