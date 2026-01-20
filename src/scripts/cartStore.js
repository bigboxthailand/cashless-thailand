// src/scripts/cartStore.js

// กุญแจสำหรับไข LocalStorage
const CART_KEY = 'cashless_cart_v1';

export const cartStore = {
  // ดึงข้อมูลตะกร้า
  get() {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  // เพิ่มสินค้า
  add(product) {
    const cart = this.get();
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    this.save(cart);
    this.notify('เพิ่มสินค้าเรียบร้อย');
  },

  // ลบสินค้า
  remove(id) {
    const cart = this.get().filter(item => item.id !== id);
    this.save(cart);
  },

  // ปรับจำนวน (+/-)
  updateQty(id, change) {
    const cart = this.get();
    const item = cart.find(i => i.id === id);
    
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        this.remove(id);
        return;
      }
    }
    this.save(cart);
  },

  // บันทึกและแจ้งเตือนระบบ
  save(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    // ส่งสัญญาณบอกทุกส่วนของเว็บว่าตะกร้าเปลี่ยนแล้ว
    window.dispatchEvent(new CustomEvent('cart-updated', { detail: cart }));
  },

  // คำนวณยอดรวม
  totals() {
    const cart = this.get();
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const sats = Math.floor(total / 3); // สมมติเรท 1 THB = 0.33 SATS (แก้ได้ตามจริง)
    return { total, sats, count: cart.reduce((c, i) => c + i.quantity, 0) };
  },

  // แจ้งเตือนเล็กๆ (Toast)
  notify(message) {
    // (Optional) คุณสามารถเพิ่ม Toast Library ตรงนี้ได้
    console.log(message); 
    // เปิดตะกร้าอัตโนมัติ
    document.dispatchEvent(new CustomEvent('toggle-cart', { detail: { open: true } }));
  }
};