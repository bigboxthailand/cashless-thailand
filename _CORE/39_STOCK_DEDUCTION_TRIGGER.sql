-- Function to decrement stock based on order_items
CREATE OR REPLACE FUNCTION decrement_stock_on_order()
RETURNS TRIGGER AS $$
DECLARE
    found_product products%ROWTYPE;
    current_config jsonb;
    new_config jsonb;
    v_variant_name text;
    v_quantity int;
BEGIN
    -- 1. Get Product
    SELECT * INTO found_product FROM products WHERE id = NEW.product_id;
    
    -- If product not found (shouldn't happen with FK), exit
    IF NOT FOUND THEN
        RETURN NEW;
    END IF;

    current_config := found_product.config;
    v_quantity := NEW.quantity;
    v_variant_name := NEW.variant_name;

    -- 2. Check if product has variants
    IF (current_config->>'hasVariants')::boolean THEN
        -- VARIANT LOGIC
        -- Iterate through variants array and update the matching one
        -- matching by 'name' (assuming variant_name matches config->variants->name)
        
        new_config := jsonb_set(
            current_config,
            '{variants}',
            (
                SELECT jsonb_agg(
                    CASE
                        -- Check if this element matches the variant name
                        WHEN (elem->>'name') = v_variant_name THEN
                            -- Update the stock for this variant
                            jsonb_set(
                                elem, 
                                '{stock}', 
                                to_jsonb(GREATEST(0, (elem->>'stock')::int - v_quantity))
                            )
                        ELSE
                            -- Keep other variants unchanged
                            elem
                    END
                )
                FROM jsonb_array_elements(current_config->'variants') AS elem
            )
        );

    ELSE
        -- SIMPLE PRODUCT LOGIC
        -- Update config->inventory->stock
        new_config := jsonb_set(
            current_config,
            '{inventory,stock}',
            to_jsonb(GREATEST(0, COALESCE((current_config->'inventory'->>'stock')::int, 0) - v_quantity))
        );
    END IF;

    -- 3. Update Product
    UPDATE products 
    SET config = new_config
    WHERE id = NEW.product_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger Definition
DROP TRIGGER IF EXISTS trigger_decrement_stock ON order_items;

CREATE TRIGGER trigger_decrement_stock
AFTER INSERT ON order_items
FOR EACH ROW
EXECUTE FUNCTION decrement_stock_on_order();
