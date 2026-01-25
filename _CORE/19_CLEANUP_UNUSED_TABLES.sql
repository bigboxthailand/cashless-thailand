-- [CORE] 19_CLEANUP_UNUSED_TABLES.sql
-- Script to clean up unused tables from the database.

-- 1. Drop 'inventory_units' first because it depends on 'product_variants'
-- (This was causing the error: "constraint inventory_units_variant_id_fkey...")
DROP TABLE IF EXISTS "inventory_units";

-- 2. Drop 'product_variants' now that the dependent table is gone.
DROP TABLE IF EXISTS "product_variants";

-- 3. Drop 'payment_transactions' (also unused)
DROP TABLE IF EXISTS "payment_transactions";

-- Note: We use IF EXISTS to avoid errors if you run this script multiple times.
