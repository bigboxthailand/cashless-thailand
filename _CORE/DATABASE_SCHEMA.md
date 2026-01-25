# Database Schema Documentation

โครงสร้างฐานข้อมูล Cashless Thailand Admin Dashboard

---

## 📦 **1. PRODUCTS** (สินค้า)

### Schema:
```json
{
  "id": "uuid (PK)",
  "name": "text",
  "slug": "text (unique)",
  "config": "jsonb (variants, specs, features)",
  "meta": "jsonb (title, description, keywords)",
  "media": "jsonb (mainImage, gallery)",
  "pricing": "jsonb (basePrice, comparePrice, currency)",
  "inventory": "jsonb (stock, sku, trackInventory)",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### ตัวอย่างข้อมูล:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "BitNode Personal",
  "slug": "bitnode-personal",
  "config": {
    "variants": ["Standard", "Pro"],
    "category": "Hardware Wallet"
  },
  "meta": {
    "title": "BitNode Personal - Hardware Wallet",
    "description": "Secure Bitcoin hardware wallet"
  },
  "media": {
    "mainImage": "/products/bitnode-personal.jpg",
    "gallery": ["/products/bitnode-1.jpg"]
  },
  "pricing": {
    "basePrice": 25500,
    "currency": "THB"
  },
  "inventory": {
    "stock": 50,
    "sku": "BN-PERS-001"
  }
}
```

---

## 👤 **2. PROFILES** (โปรไฟล์ผู้ใช้)

### Schema:
```json
{
  "id": "uuid (PK)",
  "name": "text",
  "email": "text",
  "phone": "text",
  "sex": "text (Male/Female)",
  "age": "integer",
  "province": "text",
  "created_at": "timestamp"
}
```

### ตัวอย่างข้อมูล:
```json
{
  "id": "user-123-abc",
  "name": "สมชาย ใจดี",
  "email": "somchai@example.com",
  "phone": "0812345678",
  "sex": "Male",
  "age": 32,
  "province": "Bangkok",
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

## 📍 **3. ADDRESSES** (ที่อยู่จัดส่ง)

### Schema:
```json
{
  "id": "uuid (PK)",
  "user_id": "uuid (FK → profiles.id)",
  "full_address": "text",
  "province": "text",
  "district": "text",
  "zipcode": "text",
  "is_default": "boolean",
  "created_at": "timestamp"
}
```

### ตัวอย่างข้อมูล:
```json
{
  "id": "addr-456-def",
  "user_id": "user-123-abc",
  "full_address": "123 ถนนสุขุมวิท แขวงคลองเตย",
  "province": "Bangkok",
  "district": "Watthana",
  "zipcode": "10110",
  "is_default": true,
  "created_at": "2024-01-15T10:35:00Z"
}
```

---

## 🛒 **4. ORDERS** (คำสั่งซื้อ)

### Schema:
```json
{
  "id": "text (PK, format: ORD-YYYY-NNNN)",
  "user_id": "uuid (FK → profiles.id, nullable)",
  "customer_name": "text",
  "customer_email": "text",
  "customer_phone": "text",
  "customer_avatar": "text (URL)",
  "shipping_address": "text",
  "province": "text",
  "zipcode": "text",
  "sex": "text (Analytics)",
  "age": "integer (Analytics)",
  "buy_duration": "integer (Analytics)",
  "payment_method": "text (PromptPay/Crypto/Bitcoin Lightning)",
  "payment_status": "text (pending/paid/shipped)",
  "shipping_status": "text (pending/shipped/delivered)",
  "slip_image": "text (URL or Base64 or TX Hash)",
  "slip_name": "text",
  "total_price": "numeric",
  "total_sats": "numeric (Bitcoin Sats)",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### ตัวอย่างข้อมูล:
```json
{
  "id": "ORD-2024-0001",
  "user_id": "user-123-abc",
  "customer_name": "สมชาย ใจดี",
  "customer_email": "somchai@example.com",
  "customer_phone": "0812345678",
  "customer_avatar": "https://unavatar.io/somchai@example.com",
  "shipping_address": "123 ถนนสุขุมวิท แขวงคลองเตย",
  "province": "Bangkok",
  "zipcode": "10110",
  "sex": "Male",
  "age": 32,
  "buy_duration": 45,
  "payment_method": "PromptPay",
  "payment_status": "paid",
  "shipping_status": "pending",
  "slip_image": "/payment_slip.png",
  "total_price": 25500,
  "total_sats": 0,
  "created_at": "2024-01-20T14:30:00Z"
}
```

---

## 📋 **5. ORDER_ITEMS** (รายการสินค้าในคำสั่งซื้อ)

### Schema:
```json
{
  "id": "uuid (PK)",
  "order_id": "text (FK → orders.id)",
  "product_id": "text (FK → products.id, nullable)",
  "title": "text",
  "price": "numeric",
  "quantity": "integer",
  "image_url": "text",
  "variant_name": "text (Optional)",
  "created_at": "timestamp"
}
```

### ตัวอย่างข้อมูล:
```json
{
  "id": "item-789-ghi",
  "order_id": "ORD-2024-0001",
  "product_id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "BitNode Personal",
  "price": 25500,
  "quantity": 2,
  "image_url": "/products/bitnode-personal.jpg",
  "variant_name": "Pro Edition",
  "created_at": "2024-01-20T14:30:00Z"
}
```

---

## 📦 **6. PRODUCT_VARIANTS** (ตัวเลือกสินค้า)

### Schema:
```json
{
  "id": "uuid (PK)",
  "product_id": "text (FK → products.id)",
  "variant_name": "text (e.g. Size S, Color Red)",
  "sku": "text",
  "stock": "integer",
  "price": "numeric",
  "image_url": "text",
  "options": "jsonb (e.g. { \"color_code\": \"#fff\" })",
  "created_at": "timestamp"
}
```

### ตัวอย่างข้อมูล:
```json
{
  "id": "var-111-222",
  "product_id": "prod-abc-123",
  "variant_name": "Space Gray",
  "sku": "PROD-GRAY-001",
  "stock": 50,
  "price": 29900,
  "image_url": "https://...",
  "options": { "color": "#333" }
}
```

---

## 🛍️ **6. CARTS** (ตะกร้าสินค้า - Real-time)

### Schema:
```json
{
  "id": "uuid (PK)",
  "session_id": "text",
  "items_json": "jsonb (array of cart items)",
  "updated_at": "timestamp",
  "created_at": "timestamp"
}
```

### ตัวอย่างข้อมูล:
```json
{
  "id": "cart-abc-123",
  "session_id": "sess_xyz789",
  "items_json": [
    {
      "title": "BitNode Personal",
      "price": 25500,
      "quantity": 1,
      "image": "/products/bitnode-personal.jpg"
    }
  ],
  "updated_at": "2024-01-24T15:00:00Z",
  "created_at": "2024-01-24T14:55:00Z"
}
```

---

## ⚙️ **7. STORE_SETTINGS** (ตั้งค่าร้านค้า)

### Schema:
```json
{
  "id": "uuid (PK)",
  "key": "text (unique)",
  "value": "jsonb",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### ตัวอย่างข้อมูล:
```json
{
  "id": "setting-001",
  "key": "store_info",
  "value": {
    "name": "Cashless Thailand",
    "email": "contact@cashlessthailand.com",
    "phone": "02-123-4567"
  },
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-24T10:00:00Z"
}
```

---

## 🔗 **Relationships (ความสัมพันธ์ระหว่างตาราง)**

```
profiles (1) ───< (∞) addresses
   │
   └──< (∞) orders ───< (∞) order_items ──> (1) products
```

### คำอธิบาย:
- **1 profile** มีได้หลาย **addresses**
- **1 profile** มีได้หลาย **orders**
- **1 order** มีได้หลาย **order_items**
- **1 product** สามารถอยู่ในหลาย **order_items**

---

## 📊 **Key Features:**

### Analytics Fields (for Dashboard Charts):
- `orders.sex` → กราฟแยกตามเพศ
- `orders.age` → กราฟแยกตามช่วงอายุ (<25, 25-40, >40)
- `orders.province` → กราฟแยกตามภูมิภาค
- `orders.buy_duration` → กราฟแยกตามระยะเวลาการตัดสินใจซื้อ

### Payment Support:
- **PromptPay** → `slip_image` (QR code scan proof)
- **Bitcoin/Ethereum** → `slip_image` starts with "TX:" (transaction hash)

### Order Statuses:
- **payment_status:** `pending` → `paid` → `shipped`
- **shipping_status:** `pending` → `shipped` → `delivered`

---

## 🎯 **ใช้งานอย่างไร:**

1. **ดูโครงสร้าง** → เข้าใจว่าแต่ละ table เก็บอะไร
2. **ดูตัวอย่างข้อมูล** → เข้าใจรูปแบบข้อมูลที่ควรใส่
3. **ดู Relationships** → เข้าใจว่าตารางเชื่อมโยงกันอย่างไร
4. **Implement Features** → ใช้ข้อมูลนี้ในการพัฒนา Admin Dashboard

---

*Last Updated: 2024-01-24*
