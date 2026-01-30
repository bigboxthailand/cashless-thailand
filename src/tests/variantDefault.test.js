import { describe, it, expect } from 'vitest';

// Logic from src/pages/products/[id].astro
function getInitialVariant(config) {
    let initialVariantName = "Standard";

    if (
        config &&
        config.variants &&
        config.variants.length > 0
    ) {
        initialVariantName = config.variants[0].name;
    }

    return initialVariantName;
}

const realUserData = {
    "variants": [
        { "sku": "-S", "name": "S", "image": "...", "price": "350", "stock": "20", "weight": "0.2" },
        { "sku": "-M", "name": "M", "image": "...", "price": "350", "stock": "20", "weight": "0.2" },
        { "sku": "-L", "name": "L", "image": "...", "price": "350", "stock": "20", "weight": "0.2" },
        { "sku": "-XL", "name": "XL", "image": "...", "price": "350", "stock": "20", "weight": "0.2" },
        { "sku": "-XXL", "name": "XXL", "image": "...", "price": "350", "stock": "20", "weight": "0.2" }
    ],
    "inventory": { "sku": "SKU-1769329341994", "stock": 0, "weight": 0, "dimensions": { "width": 0, "height": 0, "length": 0 } },
    "hasVariants": true,
    "subcategory": "T-Shirt",
    "variantOptions": [{ "name": "Size", "values": ["S", "M", "L", "XL", "XXL"] }]
};

describe('Variant Default Logic', () => {
    it('should default to "S" (First Variant) when variants exist', () => {
        const result = getInitialVariant(realUserData);
        expect(result).toBe('S');
    });

    it('should default to "Standard" when no variants exist', () => {
        const result = getInitialVariant({});
        expect(result).toBe('Standard');
    });
});
