# Seller Location & Shipping Estimation Feature

## 📋 Overview

ระบบแสดงที่อยู่ผู้ส่ง (Seller) และประเมินระยะเวลาการจัดส่งตามระยะทาง

---

## ✨ Features

### 1. **Seller Location (ที่อยู่ผู้ส่ง)**
- เพิ่มฟิลด์ `district` (อำเภอ) และ `province` (จังหวัด) ใน `shops` table
- Seller กรอกที่อยู่ในหน้า Settings
- แสดงในหน้าสินค้า: "ส่งจาก: อำเภอ, จังหวัด"

### 2. **Shipping Estimation (ประเมินระยะเวลาส่ง)**
- คำนวณจากที่อยู่ผู้ส่ง + ที่อยู่ลูกค้า
- แบ่งตามภูมิภาค: กลาง, เหนือ, ตะวันออกเฉียงเหนือ, ใต้, ตะวันตก
- แสดงในหน้า Checkout

---

## 🗄️ Database Schema

### Migration: `_CORE/52_ADD_SELLER_LOCATION.sql`

```sql
ALTER TABLE shops 
ADD COLUMN IF NOT EXISTS district VARCHAR(100),
ADD COLUMN IF NOT EXISTS province VARCHAR(100);
```

**รัน Migration:**
```bash
# ใน Supabase SQL Editor
_CORE/52_ADD_SELLER_LOCATION.sql
```

---

## 📦 Files Created/Modified

### ✅ New Files:
1. `_CORE/52_ADD_SELLER_LOCATION.sql` - Database migration
2. `src/lib/shippingEstimation.js` - Shipping calculation logic

### ✅ Modified Files:
1. `src/components/ProductCard.astro` - แสดง "ส่งจาก"
2. `src/components/seller/SellerSettings.jsx` - เพิ่มฟอร์มกรอกที่อยู่ (TODO)
3. `src/pages/checkout.astro` - แสดงประมาณการส่ง (TODO)

---

## 🧮 Shipping Estimation Logic

### กฎการคำนวณ:

| สถานการณ์ | ระยะเวลา | คำอธิบาย |
|-----------|----------|----------|
| **อำเภอเดียวกัน** | 1-2 วัน | พื้นที่ใกล้เคียง |
| **จังหวัดเดียวกัน** | 1-3 วัน | จังหวัดเดียวกัน |
| **ภูมิภาคเดียวกัน** | 2-4 วัน | ภูมิภาคเดียวกัน |
| **กรุงเทพฯ ↔ ต่างจังหวัด** | 2-4 วัน | ส่งจาก/ถึง กทม. |
| **เหนือ ↔ ใต้** | 3-6 วัน | ระยะไกล |
| **ต่างภูมิภาค** | 2-5 วัน | ทั่วไป |

### ตัวอย่างการใช้งาน:

```javascript
import { estimateShipping, formatLocation } from '../lib/shippingEstimation.js';

// ประเมินระยะเวลาส่ง
const estimate = estimateShipping(
    'เมือง', 'เชียงใหม่',  // Seller
    'บางกะปิ', 'กรุงเทพมหานคร'  // Customer
);

console.log(estimate);
// {
//   minDays: 2,
//   maxDays: 4,
//   description: 'ประมาณ 2-4 วันทำการ'
// }

// Format location
const location = formatLocation('เมือง', 'เชียงใหม่');
// "เมือง, เชียงใหม่"
```

---

## 🎨 UI Components

### 1. ProductCard - แสดง "ส่งจาก"

```astro
<ProductCard
  id="123"
  title="CryptoClock Basic"
  price={2990}
  image="/images/product.jpg"
  category="clock"
  sellerDistrict="เมือง"
  sellerProvince="เชียงใหม่"
/>
```

**แสดงผล:**
```
📍 ส่งจาก: เมือง, เชียงใหม่
```

### 2. Checkout - แสดงประมาณการส่ง (TODO)

```jsx
<div class="shipping-estimate">
  <h3>ประมาณการจัดส่ง</h3>
  <p>🚚 2-4 วันทำการ</p>
  <p class="text-sm">ส่งจาก: เมือง, เชียงใหม่</p>
  <p class="text-sm">ส่งถึง: บางกะปิ, กรุงเทพมหานคร</p>
</div>
```

---

## 📝 TODO List

### Phase 1: ✅ Database & Logic (Done)
- [x] Create SQL migration
- [x] Create shipping estimation helper
- [x] Update ProductCard to show seller location

### Phase 2: 🔄 Seller Settings (In Progress)
- [ ] Add district/province fields to SellerSettings.jsx
- [ ] Add Thailand province/district dropdown
- [ ] Save to shops table

### Phase 3: 🔄 Checkout Integration (In Progress)
- [ ] Get customer address from checkout form
- [ ] Calculate shipping estimation
- [ ] Display estimated delivery date
- [ ] Show shipping time badge

### Phase 4: 📊 Advanced Features (Future)
- [ ] Real shipping API integration (Thailand Post, Kerry, Flash)
- [ ] Shipping cost calculation
- [ ] Multiple shipping options
- [ ] Tracking integration

---

## 🧪 Testing

### Test Scenarios:

1. **Same District:**
   - Seller: เมือง, เชียงใหม่
   - Customer: เมือง, เชียงใหม่
   - Expected: 1-2 วัน

2. **Same Province:**
   - Seller: เมือง, เชียงใหม่
   - Customer: สันทราย, เชียงใหม่
   - Expected: 1-3 วัน

3. **Same Region:**
   - Seller: เมือง, เชียงใหม่
   - Customer: เมือง, ลำปาง
   - Expected: 2-4 วัน

4. **Bangkok to Province:**
   - Seller: บางกะปิ, กรุงเทพมหานคร
   - Customer: เมือง, เชียงใหม่
   - Expected: 2-4 วัน

5. **Far Distance:**
   - Seller: เมือง, เชียงใหม่
   - Customer: หาดใหญ่, สงขลา
   - Expected: 3-6 วัน

---

## 🚀 Deployment

### 1. Run SQL Migration:
```sql
-- In Supabase SQL Editor
_CORE/52_ADD_SELLER_LOCATION.sql
```

### 2. Update Existing Shops (Optional):
```sql
-- Set default location for existing shops
UPDATE shops 
SET district = 'เมือง', province = 'กรุงเทพมหานคร'
WHERE district IS NULL;
```

### 3. Deploy Code:
```bash
git add .
git commit -m "feat: Add seller location and shipping estimation"
git push
```

---

## 📚 References

- Thailand Provinces: 77 จังหวัด
- Regions: 5 ภูมิภาค (กลาง, เหนือ, ตะวันออกเฉียงเหนือ, ใต้, ตะวันตก)
- Shipping Standards: 1-6 วันทำการ (ตามระยะทาง)

---

**Created:** 2026-02-01  
**Status:** Phase 1 Complete ✅
