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
**Access**: เมนู `Dashboard` (เฉพาะผู้ใช้ที่มี Role: Admin)

### 3.1 Dashboard (ภาพรวมระบบ)
หน้าแรกสำหรับดูภาพรวมและสถิติสำคัญของระบบแบบ Real-time
*   **KPI Cards**:
    *   **Total Revenue**: ยอดขายรวมทั้งหมด (แสดงทั้งสกุลเงิน THB และ Sats)
    *   **Pending Orders**: จำนวนออเดอร์ที่รอการตรวจสอบ (มีไฟกระพริบแจ้งเตือนเมื่อมีออเดอร์ใหม่)
    *   **Active Disputes**: จำนวนข้อพิพาทที่เปิดอยู่และต้องการการแก้ไข
    *   **Total Orders**: จำนวนคำสั่งซื้อสะสมทั้งหมด
*   **Charts & Maps**:
    *   **Revenue Chart**: กราฟแสดงยอดขายย้อนหลัง
    *   **Thailand Orders Map**: แผนที่ Heatmap แสดงความหนาแน่นของคำสั่งซื้อในแต่ละจังหวัด
    *   **Analytics Pie Chart**: สัดส่วนยอดขายแบ่งตามหมวดหมู่สินค้า หรือ Payment Methods

### 3.2 Analytics (ระบบวิเคราะห์ข้อมูล)
เครื่องมือวิเคราะห์เชิงลึกสำหรับวางแผนการตลาด
*   **Top Products**: 5 อันดับสินค้าขายดีที่สุด (Best Sellers)
*   **Sales Over Time**: กราฟยอดขายย้อนหลัง 30 วัน
*   **Demographics**: สัดส่วนเพศ (Male/Female/Other) ของลูกค้า
*   **Coupon Usage**: ประสิทธิภาพของคูปอง (จำนวนครั้งที่ใช้ และยอดส่วนลดรวม)

### 3.3 Orders (จัดการคำสั่งซื้อ)
หน้ารายการคำสั่งซื้อทั้งหมดที่เกิดขึ้นในระบบ
*   **Filters**: กรองตามสถานะ (All, Pending, Paid, Shipped, Dispute) หรือช่วงเวลา
*   **Search**: ค้นหาด้วย Order ID หรือชื่อลูกค้า
*   **Order Table**: แสดง Order ID, วันที่, ลูกค้า, จำนวนสินค้า, ยอดรวม, วิธีชำระเงิน, และสถานะ
*   **Order Detail Modal** (คลิกที่ View):
    *   **Customer Info**: ข้อมูลติดต่อ, ที่อยู่จัดส่ง, Avatar
    *   **Payment Proof**: ดูรูปสลิปโอนเงิน (สำหรับ PromptPay)
    *   **Items**: รายการสินค้าที่สั่งซื้อ
    *   **Actions**:
        *   **Confirm Payment**: กดยืนยันเมื่อตรวจสอบสลิปแล้ว (สถานะเปลี่ยนเป็น Paid)
        *   **Ship**: ใส่เลขพัสดุ (Tracking No.) และเลือกขนส่ง (Kerry, Flash, EMS) เพื่อปิดจบออเดอร์ (สถานะ Shipped)
        *   **Open Invoice**: เปิดดูใบเสร็จรับเงิน

### 3.4 Products (จัดการคลังสินค้า)
หน้าสำหรับจัดการสินค้าในระบบ (Global Inventory)
*   **Product List**: ดูสินค้าทั้งหมด พร้อมรูปภาพ, ราคา, และจำนวนสต็อกคงเหลือ
*   **Management**: แก้ไขข้อมูลสินค้า, เปลี่ยนราคา, หรือลบสินค้า (Functionality handled via ProductManager)

### 3.5 Shops (จัดการร้านค้า)
ระบบ Seller Moderation สำหรับควบคุมคุณภาพผู้ขาย
*   **Pending Approval**: รายการร้านค้าใหม่ที่รออนุมัติ
    *   **Approve**: อนุมัติให้เปิดร้าน (Shop Active)
    *   **Reject**: ปฏิเสธคำขอ
*   **Active Shops**: รายชื่อร้านค้าที่เปิดอยู่
    *   **Suspend**: ระงับร้านค้าชั่วคราว (ร้านจะไม่แสดงผลบนหน้าเว็บ)
    *   **Delete**: ลบร้านค้าออกจากระบบ
*   **Suspended Shops**: รายชื่อร้านค้าที่ถูกแบน (สามารถกด Restore เพื่อคืนยศได้)

### 3.6 Customers (ข้อมูลลูกค้า)
ระบบ CRM (Customer Relationship Management) พื้นฐาน
*   **Customer Table**:
    *   **Profile**: รูป Avatar, ชื่อ, Email, Phone
    *   **Tier**: ระดับลูกค้า (Whale > 100k, Pro > 30k, User)
    *   **Region**: จังหวัดที่อยู่
    *   **Stats**: จำนวนออเดอร์ที่เคยสั่ง (Orders), ยอดใช้จ่ายรวม (LTV - Lifetime Value), วันเใช้งานล่าสุด
*   **Export**: ปุ่ม Export CRM data (CSV)

### 3.7 Chat (ระบบซัพพอร์ต)
หน้าจอ Support Tickets สำหรับตอบข้อความ
*   **Conversation List**: รายการแชทจากลูกค้าหรือร้านค้า
*   **Chat Window**: หน้าจอแชทสำหรับตอบคำถามและแก้ปัญหา (Admin View)

### 3.8 Blog (จัดการบทความ)
ระบบ CMS (Content Management System) สำหรับเขียนข่าวสาร
*   **Post List**: รายการบทความที่เผยแพร่แล้ว
*   **Editor**: เครื่องมือเขียนบทความ (Rich Text) พร้อมอัปโหลดรูปภาพปก

### 3.9 Coupons (คูปองส่วนลด)
สร้างแคมเปญส่งเสริมการขาย
*   **Active Coupons**: รายการคูปองที่ใช้งานได้
*   **Create Coupon**:
    *   **Code**: รหัสคูปอง (เช่น WELCOME100)
    *   **Type**: ลดเป็น % (Percentage) หรือ ลดเป็นบาท (Fixed Amount)
    *   **Limit**: จำกัดจำนวนสิทธิ์การใช้

### 3.10 Affiliates (ระบบนายหน้า)
จัดการค่าคอมมิชชั่นสำหรับพันธมิตร
*   **KPIs**: ยอดค้างจ่าย (Pending Payouts), ยอดอนุมัติแล้ว, ยอดจ่ายแล้วทั้งหมด
*   **Referrals Table**:
    *   **Affiliate**: ข้อมูลคนแนะนำ (Tier, Name)
    *   **Order**: ออเดอร์ที่ถูกแนะนำมา
    *   **Commission**: ส่วนแบ่งที่ได้รับ (บาท)
    *   **Status**: Pending (รอตรวจสอบ), Approved (อนุมัติแล้ว), Paid (โอนเงินแล้ว)
*   **Actions**:
    *   **Approve**: อนุมัติค่าคอมมิชชั่น (เมื่อออเดอร์สมบูรณ์)
    *   **Mark as Paid**: บันทึกว่าโอนเงินให้ Partner แล้ว

### 3.11 Disputes (ข้อพิพาท)
จัดการปัญหาการสั่งซื้อ (คืนเงิน/เคลมสินค้า)
*   **Dispute Card**:
    *   **Status**: OPEN (รอดำเนินการ), RESOLVED (จบเคส)
    *   **Reason**: เหตุผลการเคลม (เช่น ของไม่ครบ, สินค้าเสียหาย)
    *   **Evidence**: รูปภาพหลักฐานที่ลูกค้าแนบมา
    *   **Order Details**: รายละเอียดสินค้าในออเดอร์นั้นๆ
*   **Resolution Actions**:
    *   **Full Refund**: คืนเงินเต็มจำนวน (ระบบเปลี่ยนสถานะเป็น Refunded / Dispute Resolved)
    *   **Reject & Settle**: ปฏิเสธคำร้องและปิดงาน (ระบบเปลี่ยนสถานะเป็น Shipped / Delivered ปกติ)

### 3.12 Settings (ตั้งค่าระบบ)
ศูนย์ควบคุมการทำงานหลักของ Store
*   **Store Configuration**: ตั้งชื่อร้าน, สกุลเงิน (Currency)
*   **Tax & Fees**:
    *   **Billing Info**: ที่อยู่, เลขแวต, เบอร์โทร
    *   **VAT**: เปิด/ปิด ระบบ VAT 7%
    *   **Platform Commission**: ตั้งค่า % หักหัวคิวจากร้านค้า (GP)
*   **Maintenance Mode**: ปุ่มเปิด/ปิด โหมดปิดปรับปรุงเว็บไซต์ชั่วคราว
