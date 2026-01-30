# Cashless Thailand Platform User Manual

## 1. Visitor & Buyer Guide (คู่มือผู้ซื้อ)

### 1.1 Home Page (หน้าแรก)
*   **Navigation Bar**:
    *   **Logo**: คลิกเพื่อกลับหน้าแรก
    *   **Search Bar**: ค้นหาสินค้า (Real-time search)
    *   **Cart Icon**: เปิดลิ้นชักตะกร้าสินค้า
    *   **Login/Profile**: เข้าสู่ระบบหรือดูข้อมูลส่วนตัว
*   **Hero Section**:
    *   **Explore Store**: ปุ่มพาไปหน้า Shop
*   **Feature Grid**: แสดงจุดเด่นของระบบ (Ecosystem)

### 1.2 Shop Page (หน้าร้านค้า)
*   **Category Filter**: แถบเลือกหมวดหมู่ (Clock, Kiosk, POS, Node, etc.)
*   **Product Card**:
    *   แสดงรูปภาพ, ชื่อสินค้า, และราคาเริ่มต้น
    *   **Tag**: ป้ายกำกับพิเศษ (เช่น NEW, HOT)
    *   **คลิกที่การ์ด**: เพื่อดูรายละเอียดสินค้า

### 1.3 Product Detail (หน้ารายละเอียดสินค้า)
*   **Gallery**: รูปภาพสินค้า (คลิกเพื่อดูรูปใหญ่)
*   **Variant Selection**: เลือกตัวเลือกสินค้า (เช่น Size, Color)
*   **Price Display**: แสดงราคาตามตัวเลือกที่เลือก
*   **Quantity**: ปุ่ม +/- เพื่อเพิ่มลดจำนวน
*   **Add to Cart**: ปุ่มเพิ่มลงตะกร้า (จะมี Animation ยืนยัน)

### 1.4 Checkout Process (การชำระเงิน)
1.  **Shipping Address**:
    *   กรอก ชื่อ-นามสกุล, เบอร์โทร, ที่อยู่, จังหวัด, รหัสไปรษณีย์
    *   (Optional) ข้อมูลใบกำกับภาษี (Tax ID)
2.  **Payment Method**:
    *   **PromptPay**: ระบบจะสร้าง QR Code พร้อมยอดเงินให้อัตโนมัติ (สแกนผ่านแอปธนาคาร)
    *   **Crypto**:
        *   เลือก Network (Ethereum, BSC, Polygon, etc.)
        *   เลือก Currency (USDT, USDC, DAI)
        *   ระบบจะแสดง Address และ QR Code พร้อมคำนวณอัตราแลกเปลี่ยน
    *   **Bitcoin (Lightning)**: สำหรับจ่ายด้วย Lightning Network
3.  **Proof of Payment**:
    *   **Upload Slip**: ปุ่มอัปโหลดรูปสลิปโอนเงิน (จำเป็น)
4.  **Security Check**: แก้โจทย์เลขบวกเลขง่ายๆ เพื่อยืนยันตัวตน
5.  **Confirm Order**: กดปุ่มเพื่อยืนยันคำสั่งซื้อ

### 1.5 User Profile (ข้อมูลส่วนตัว)
*   **Dashboard**: ดูสรุปคำสั่งซื้อล่าสุด
*   **Order History**:
    *   ดูรายการสั่งซื้อย้อนหลัง
    *   **Status**: Pending (รอตรวจสอบ), Paid (ชำระแล้ว), Shipped (ส่งแล้ว)
    *   **Review**: ปุ่มกดรีวิวสินค้า (เมื่อได้รับของแล้ว)
*   **Addresses**: จัดการที่อยู่จัดส่ง (เพิ่ม/ลบ/แก้ไข)
*   **Avatar**: แต่งรูปโปรไฟล์ (สุ่ม Cartoon หรืออัปโหลดรูปเอง)

---

## 2. Seller Guide (คู่มือผู้ขาย)

### 2.1 Registration (การสมัครร้านค้า)
*   เข้าเมนู "Become a Seller"
*   **Shop Name**: ตั้งชื่อร้านค้า
*   **Description**: คำอธิบายร้านค้า
*   **KYC Info**: อัปโหลดข้อมูลยืนยันตัวตน (เลขบัตรปชช., สมุดบัญชี)

### 2.2 Seller Dashboard
*   **Stats Overview**: ดูกราฟยอดขายรายวัน, จำนวนออเดอร์, สินค้าที่ขายดี
*   **Quick Actions**: ปุ่มลัดสำหรับลงสินค้าใหม่ หรือแก้ไขร้านค้า

### 2.3 Product Management (จัดการสินค้า)
*   **Add Product**:
    *   ใส่ชื่อ, รายละเอียด (Rich Text Editor)
    *   ตั้งราคา (Base Price) และจำนวนสต็อก
    *   Upload รูปภาพสินค้า (รูปหลัก + รูปรอง)
    *   **Variants**: เพิ่มตัวเลือกสินค้า (เช่น สี, ไซส์) พร้อมราคาแยกแต่ละตัว

### 2.4 Order Fulfillment (จัดการออเดอร์)
*   **Order List**: ดูรายการออเดอร์ที่เข้ามาใหม่ (Status: Paid)
*   **Add Tracking**:
    *   คลิกที่ออเดอร์
    *   กรอกเลขพัสดุ (Tracking Number)
    *   เลือกผู้ให้บริการขนส่ง (Kerry, Flash, EMS)
    *   กดปุ่ม "Update Status" เพื่อเปลี่ยนเป็น Shipped

### 2.5 Wallet & Payout
*   **Seller Wallet**: ดูยอดเงินคงเหลือที่ถอนได้
*   **Withdraw**: ปุ่มแจ้งถอนเงิน (ระบบจะส่งเรื่องให้ Admin ตรวจสอบ)

---

## 3. Administrator Guide (คู่มือผู้ดูแลระบบ)

### 3.1 Admin Dashboard
*   **Overview**: ดูยอดขายรวมทั้งแพลตฟอร์ม (THB & Sats)
*   **Map view**: ดูแผนที่แสดงตำแหน่งที่มีการสั่งซื้อ
*   **Real-time Monitor**: แจ้งเตือนเมื่อมีออเดอร์ใหม่เข้ามา

### 3.2 Order Management
*   **Verify Slip**: ตรวจสอบสลิปที่ลูกค้าแนบมา
*   **Approve Order**: กดยืนยันเมื่อยอดเงินถูกต้อง (Status -> Paid)
*   **Dispute Handling**: ดูเคสที่มีปัญหา (ขอคืนเงิน/ของไม่ครบ) และตัดสินใจ

### 3.3 Customer & Shop Management
*   **Customer List**: ดูรายชื่อลูกค้าและยอดใช้จ่ายสะสม
*   **Shop Approval**: อนุมัติร้านค้าใหม่ที่สมัครเข้ามา (ตรวจสอบ KYC)
*   **Coupon Management**: สร้างโค้ดส่วนลด (Fixed/Percent) กำหนดวันหมดอายุ

---
