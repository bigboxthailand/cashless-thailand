/**
 * Database Backup Script
 * 
 * This script creates JSON backups of all important database tables.
 * 
 * HOW TO USE:
 * 1. Go to Supabase Dashboard → SQL Editor
 * 2. Run the queries below one by one
 * 3. Export each result as JSON
 * 4. Save to _CORE/ folder with the corresponding filename
 */

-- ============================================
-- 1. BACKUP PRODUCTS
-- ============================================
-- Run this query and export as: _CORE/products_backup.json
SELECT * FROM products ORDER BY created_at DESC;

-- ============================================
-- 2. BACKUP PROFILES
-- ============================================
-- Run this query and export as: _CORE/profiles_backup.json
SELECT * FROM profiles ORDER BY created_at DESC;

-- ============================================
-- 3. BACKUP ADDRESSES
-- ============================================
-- Run this query and export as: _CORE/addresses_backup.json
SELECT * FROM addresses ORDER BY created_at DESC;

-- ============================================
-- 4. BACKUP ORDERS
-- ============================================
-- Run this query and export as: _CORE/orders_backup.json
SELECT * FROM orders ORDER BY created_at DESC;

-- ============================================
-- 5. BACKUP ORDER ITEMS
-- ============================================
-- Run this query and export as: _CORE/order_items_backup.json
SELECT * FROM order_items ORDER BY created_at DESC;

-- ============================================
-- 6. BACKUP CARTS
-- ============================================
-- Run this query and export as: _CORE/carts_backup.json
SELECT * FROM carts ORDER BY updated_at DESC;

-- ============================================
-- 7. BACKUP STORE SETTINGS
-- ============================================
-- Run this query and export as: _CORE/store_settings_backup.json
SELECT * FROM store_settings ORDER BY created_at DESC;

-- ============================================
-- 8. FULL DATABASE STATS (for verification)
-- ============================================
-- Run this to see row counts for all tables
SELECT 
    'products' as table_name, 
    COUNT(*) as row_count 
FROM products
UNION ALL
SELECT 
    'profiles' as table_name, 
    COUNT(*) as row_count 
FROM profiles
UNION ALL
SELECT 
    'addresses' as table_name, 
    COUNT(*) as row_count 
FROM addresses
UNION ALL
SELECT 
    'orders' as table_name, 
    COUNT(*) as row_count 
FROM orders
UNION ALL
SELECT 
    'order_items' as table_name, 
    COUNT(*) as row_count 
FROM order_items
UNION ALL
SELECT 
    'carts' as table_name, 
    COUNT(*) as row_count 
FROM carts
UNION ALL
SELECT 
    'store_settings' as table_name, 
    COUNT(*) as row_count 
FROM store_settings;
