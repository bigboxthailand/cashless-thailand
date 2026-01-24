# Admin Dashboard Specification for CashlessThailand

## Overview
สร้างระบบ Admin Dashboard สำหรับจัดการร้านค้า E-commerce ที่รองรับ 2 สกุลเงิน (Fiat/Crypto) โดยเน้นความเร็วและการใช้งานง่ายเหมือน Shopee

## Phase 1: Layout & Security
1. **File Structure:** สร้าง `src/layouts/AdminLayout.astro` สำหรับโครงสร้างหน้า Admin (มี Sidebar เมนู: Dashboard, Orders, Products, Settings)
2. **Authentication:** - ใน `src/pages/admin/index.astro` และทุกหน้าใน `/admin/*` ต้องตรวจสอบ `supabase.auth.getUser()`
   - ถ้าไม่ใช่ Logged-in User ให้ Redirect ไปหน้า `/login` (หรือหน้าแรก) ทันที
3. **UI Theme:** ใช้โทนสี Dark Mode (Black/Gold) ให้เข้ากับเว็บหลัก แต่ให้ดูเป็นทางการ (Dashboard style)

## Phase 2: Order Management (The Core)
สร้างไฟล์ `src/pages/admin/orders.astro`
1. **Data Fetching:**
   - ดึงข้อมูลจากตาราง `orders`
   - Join กับ `profiles` (เพื่อเอาชื่อลูกค้า) และ `order_items`
   - เรียงลำดับ `created_at` DESC (ใหม่สุดขึ้นก่อน)
2. **Order Table UI:**
   - Columns: Order ID (ย่อ), Date, Customer, Items (summary), Total (THB/Sats), Payment Method, Status, Actions
   - **Payment Status Badge:** - Pending (Yellow)
     - Paid (Green)
     - Shipped (Blue)
     - Cancelled (Red/Gray)
3. **Proof of Payment Modal:**
   - ถ้าจ่าย **PromptPay:** แสดงปุ่ม "View Slip" -> เปิด Modal แสดงรูปจาก `slip_url`
   - ถ้าจ่าย **Crypto:** แสดงปุ่ม "Check TX" -> ลิงก์ไป Block Explorer

## Phase 3: Action Logic
1. **Status Update:**
   - ปุ่ม "Mark as Paid" (เปลี่ยน status เป็น 'paid')
   - ปุ่ม "Mark as Shipped" (เปลี่ยน status เป็น 'shipped' + เปิดช่องกรอก Tracking Number)
2. **Database Update:** เขียน Supabase Client logic เพื่ออัปเดตข้อมูลจริง

## Phase 4: Dashboard Overview & Live Cart (Smart Features)
สร้างไฟล์ `src/pages/admin/index.astro`
1. **KPI Cards:**
   - Total Revenue (THB & Crypto Separated)
   - Pending Orders Count (ตัวเลขใหญ่ๆ สีแดง)
2. **Live Cart Monitor (Abandoned Cart):**
   - ดึงข้อมูลจากตาราง `carts` (ที่เราจะสร้างเพิ่ม)
   - แสดงรายการว่า "ใครกำลังหยิบอะไรใส่ตะกร้า" แบบ Real-time