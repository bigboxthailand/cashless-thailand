
// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { cartStore, cartItems } from './cartStore';

// Mock LocalStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString(); },
        clear: () => { store = {}; },
        removeItem: (key) => { delete store[key]; }
    };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Cart Store Logic', () => {

    beforeEach(() => {
        cartItems.set([]); // Reset cart before each test
        localStorage.clear();
    });

    it('should add items to the cart', () => {
        const product = { id: 'p1', title: 'Test Product', price: 100 };
        cartStore.add(product);

        const items = cartStore.get();
        expect(items).toHaveLength(1);
        expect(items[0]).toMatchObject({ id: 'p1', quantity: 1 });
    });

    it('should increment quantity if item exists', () => {
        const product = { id: 'p1', title: 'Test Product', price: 100 };
        cartStore.add(product);
        cartStore.add(product);

        const items = cartStore.get();
        expect(items).toHaveLength(1);
        expect(items[0].quantity).toBe(2);
    });

    it('should calculate totals correctly', () => {
        cartStore.add({ id: 'p1', price: 100 });
        cartStore.add({ id: 'p1', price: 100 }); // qty 2, subtotal 200
        cartStore.add({ id: 'p2', price: 50 });  // qty 1, subtotal 50

        const { total, count } = cartStore.totals();

        expect(total).toBe(250);
        expect(count).toBe(3);
    });

    it('should remove items', () => {
        cartStore.add({ id: 'p1', price: 100 });
        cartStore.add({ id: 'p2', price: 50 });

        cartStore.remove('p1');

        const items = cartStore.get();
        expect(items).toHaveLength(1);
        expect(items[0].id).toBe('p2');
    });

    it('should update quantity manually', () => {
        cartStore.add({ id: 'p1', price: 100 });
        cartStore.updateQty('p1', 5); // +5

        const items = cartStore.get();
        expect(items[0].quantity).toBe(6);
    });
});
