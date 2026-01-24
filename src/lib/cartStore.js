// src/lib/cartStore.js
import { persistentAtom } from '@nanostores/persistent';
import { atom } from 'nanostores';

// 1. ใช้ Local Storage แบบมาตรฐาน (จำถาวร ปิดเว็บไม่หาย)
export const cartItems = persistentAtom('cashless-cart', [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export const isCartOpen = atom(false);

export const cartStore = {
  get: () => cartItems.get(),

  add: (product) => {
    const currentItems = cartItems.get();
    const existingItem = currentItems.find((item) => item.id === product.id);

    if (existingItem) {
      cartItems.set(
        currentItems.map((item) =>
          item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        )
      );
    } else {
      cartItems.set([...currentItems, { ...product, quantity: 1 }]);
    }

    isCartOpen.set(true); // เปลี่ยนเป็น true
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cart-updated', { bubbles: true }));
      window.dispatchEvent(new CustomEvent('toggle-cart', { detail: { open: true }, bubbles: true }));
    }
  },

  remove: (id) => {
    const currentItems = cartItems.get();
    cartItems.set(currentItems.filter(item => item.id !== id));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cart-updated', { bubbles: true }));
    }
  },

  updateQty: (id, change) => {
    const currentItems = cartItems.get();
    const newItems = currentItems.map(item => {
      if (item.id === id) {
        const newQty = (item.quantity || 0) + change;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    });
    cartItems.set(newItems);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cart-updated', { bubbles: true }));
    }
  },

  totals: () => {
    const items = cartItems.get();
    const total = items.reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 1)), 0);
    const sats = Math.floor(total / 3);
    const count = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    return { total, sats, count };
  },

  open: () => {
    isCartOpen.set(true); // เปลี่ยนเป็น true
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('toggle-cart', { detail: { open: true }, bubbles: true }));
    }
  },

  close: () => {
    isCartOpen.set(false); // เปลี่ยนเป็น false
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('toggle-cart', { detail: { open: false }, bubbles: true }));
    }
  },

  clear: () => {
    cartItems.set([]);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cart-updated', { bubbles: true }));
    }
  }
};