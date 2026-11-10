import { createClient } from '@supabase/supabase-js';

// Read environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if valid credentials have been provided
export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project.supabase.co' &&
    supabaseAnonKey !== 'your-anon-key-here' &&
    supabaseUrl.startsWith('https://')
  );
};

// Initialize Supabase client if configured, otherwise provide null
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Complete PostgreSQL / Supabase Schema for production deployment
export const SUPABASE_SETUP_SQL = `-- SAVOURÉ RESTAURANT SUPABASE DATABASE SCHEMA
-- Generated for LOCKVEX ⚡ Client Deployment

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Menu Items Table
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Rice Dishes', 'Grills and BBQ', 'Seafood', 'Soups', 'Drinks', 'Desserts')),
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    image TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    tags TEXT[] DEFAULT '{}',
    prep_time TEXT DEFAULT '20-30 mins',
    spice_level TEXT DEFAULT 'Medium',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Customer Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    order_type TEXT DEFAULT 'Delivery',
    items JSONB NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    delivery_fee NUMERIC(10, 2) DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled')),
    payment_method TEXT DEFAULT 'WhatsApp Order',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Table Reservations Table
CREATE TABLE IF NOT EXISTS public.reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_code TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    guests INTEGER NOT NULL CHECK (guests > 0),
    seating_area TEXT DEFAULT 'Grand Dining Hall',
    special_requests TEXT,
    status TEXT DEFAULT 'Confirmed' CHECK (status IN ('Confirmed', 'Pending', 'Cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Restaurant Info / Settings Table
CREATE TABLE IF NOT EXISTS public.restaurant_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    name TEXT NOT NULL DEFAULT 'SAVOURÉ RESTAURANT',
    tagline TEXT DEFAULT 'Exceptional Taste. Unforgettable Moments.',
    description TEXT,
    address TEXT,
    city TEXT DEFAULT 'Victoria Island, Lagos',
    phone TEXT,
    email TEXT,
    whatsapp_number TEXT,
    opening_hours JSONB,
    announcement TEXT,
    lockvex_url TEXT,
    lockvex_whatsapp TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Row Level Security (RLS) Configuration
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_settings ENABLE ROW LEVEL SECURITY;

-- Anonymous users can read menu, insert orders, and insert reservations
CREATE POLICY "Public menu view" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Public create order" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public create reservation" ON public.reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public view settings" ON public.restaurant_settings FOR SELECT USING (true);

-- Authenticated admins can manage all records
CREATE POLICY "Admin manage menu" ON public.menu_items FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin manage orders" ON public.orders FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin manage reservations" ON public.reservations FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin manage settings" ON public.restaurant_settings FOR ALL TO authenticated USING (true);
`;
