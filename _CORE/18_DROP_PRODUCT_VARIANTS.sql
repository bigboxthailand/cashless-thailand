-- [CORE] 18_DROP_PRODUCT_VARIANTS.sql
-- The 'product_variants' table is no longer used by the application.
-- We use CASCADE to also remove the constraint from 'inventory_units' that depends on this table.
-- WARNING: This will drop any foreign keys referencing product_variants.

DROP TABLE IF EXISTS "product_variants" CASCADE;
