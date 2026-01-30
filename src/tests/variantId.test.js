import { describe, it, expect } from 'vitest';

// Function from src/pages/products/[id].astro (replicated for testing)
function generateItemId(productId, variantName) {
    const variantSlug = variantName.replace(/\s+/g, '-').toLowerCase();
    return `${productId}-${variantSlug}`;
}

describe('Product ID Generation', () => {
    it('should append -standard for Standard variant', () => {
        const productId = 'bitcoin-t-shirt--by-blc';
        const variantName = 'Standard';

        const result = generateItemId(productId, variantName);

        expect(result).toBe('bitcoin-t-shirt--by-blc-standard');
    });

    it('should append -xl for XL variant', () => {
        const productId = 'bitcoin-t-shirt--by-blc';
        const variantName = 'XL';

        const result = generateItemId(productId, variantName);

        expect(result).toBe('bitcoin-t-shirt--by-blc-xl');
    });

    it('should handle spaces in variant names', () => {
        const productId = 'cool-gadget';
        const variantName = 'Matte Black';

        const result = generateItemId(productId, variantName);

        expect(result).toBe('cool-gadget-matte-black');
    });
});
