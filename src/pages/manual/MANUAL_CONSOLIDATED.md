# Cashless Thailand Docs & Knowledge.

>ยินดีต้อนรับสู่ศูนย์กลางข้อมูลทางเทคนิคของ Cashless Thailand แหล่งรวมคู่มือการใช้งาน ผังโครงสร้างระบบ และการเชื่อมต่อ API ต่างๆ สำหรับผู้พัฒนาและผู้ดูแลระบบ

## Featuredmodules Items

### System Workflow
แผนผังการทำงานเชิงเทคนิค 7 ขั้นตอน ตั้งแต่ Onboarding จนถึง Completion

### Visual Logic Flows
อินโฟกราฟิกแบบเคลื่อนไหวแสดงขั้นตอนการสมัครและซื้อสินค้าอย่างละเอียด

### Membership Tiers
เจาะลึกระบบสมาชิกและการคำนวณสิทธิประโยชน์ (Gold/Bitcoin Tier)

### Home Page
โครงสร้างหน้าหลักและการเชื่อมต่อข้อมูล Ecosystem

### Shopping Cart
ระบบจัดการตะกร้าสินค้าแบบ Persistent และ Atomic Totals

### Checkout System
Gateway การชำระเงินแบบ Hybrid (PromptPay/Crypto/Lightning)

### Admin Panel
ระบบจัดการสินค้า สต็อก และคำสั่งซื้อสำหรับผู้ดูแล

## Additional Static Content

ยินดีต้อนรับสู่ศูนย์กลางข้อมูลทางเทคนิคของ Cashless Thailand แหล่งรวมคู่มือการใช้งาน ผังโครงสร้างระบบ และการเชื่อมต่อ API ต่างๆ สำหรับผู้พัฒนาและผู้ดูแลระบบ

### Quick Start Guides
### System Architecture
ภาพรวมการทำงานของ Tech Stack ทั้งหมด

### Frontend Layer
พัฒนาด้วย Astro Framework ร่วมกับ React สำหรับ Interactive Components เน้นประสิทธิภาพการโหลด (SSG/SSR) และ SEO สูงสุด

### Data Layer
ใช้ Supabase (PostgreSQL) เป็นหัวใจหลักในการจัดการข้อมูลสินค้า คำสั่งซื้อ และระบบสมาชิก พร้อม Real-time Subscription สำหรับ Stock Sync


---

# System Workflow

>แผนผังการทำงานเชิงเทคนิคที่เชื่อมต่อทุกส่วนของเนื้อหาเข้าด้วยกัน ตั้งแต่การสร้างตัวตน การเลือกซื้อสินค้า จนถึงระบบสมาชิกและการรับรายได้

## Steps Items

### Platform Onboarding
**การสร้างตัวตนและระบบความจำ (Identity Store)**

ผู้ใช้เข้าสู่ระบบผ่าน Hybrid Auth (Email หรือ Metamask) ระบบจะทำการสร้าง Profile ID และเตรียมพร้อมสำหรับการเก็บแต้มและประวัติการสั่งซื้อ

*Technical Stack: supabase.auth.signIn() / ethers.js Web3 Provider*

### Smart Discovery
**การค้นหาและวิเคราะห์สินค้า (Product Engine)**

ผู้ใช้เลือกชมสินค้าผ่านหมวดหมู่ในหน้า Shop หรืออ่านความรู้จาก Blog ระบบจะแสดงผลรีวิวจากเพื่อนสมาชิก และ Metadata ของสินค้าแบบเจาะลึก

*Technical Stack: Supabase PG Filter / Real-time Stock Check*

### Cart Orchestration
**การจัดการตะกร้าสินค้าแบบ Persistent (Local State)**

สินค้าถูกเพิ่มเข้าตะกร้าโดยใช้ Nanostores เพื่อความรวดเร็ว ระบบคำนวณราคาเบื้องต้นและจองสินค้าในสต็อกชั่วคราวผ่าน UI Drawer

*Technical Stack: persistentAtom (Nanostores) / cartStore.js*

### Tier-Aware Checkout
**การคำนวณส่วนลดตามสิทธิสมาชิก (Logic Layer)**

ในขั้นตอนนี้ ระบบจะดึงข้อมูล Tier ของผู้ใช้มาคำนวณส่วนลดทันที (เช่น Gold ลด 5%) พร้อมตรวจสอบคูปองและแต้มสะสมเพื่อลดหย่อนราคาสุทธิ

*Technical Stack: Membership Rewards Engine / Order Validation*

### Multi-Rail Payment
**การชำระเงินข้ามขีดจำกัด (Hybrid Gateway)**

ผู้ใช้เลือกจ่ายผ่าน PromptPay (Scan & Verify), Web3 (Direct Wallet transfer) หรือ Bitcoin Lightning (Qr Code) ระบบจะเก็บหลักฐานการจ่ายเงินทันที

*Technical Stack: PromptPay EMVCo / Lightning Invoice / Web3 RPC*

### Fulfillment Sync
**การกระจายคำสั่งซื้อสู่ผู้ขาย (Supply Chain)**

ระบบแจ้งเตือนร้านค้าเจ้าของผลิตภัณฑ์ผ่าน Seller Dashboard แอดมินตรวจสอบสลิปและเริ่มกระบวนการแพ็คสินค้าและส่ง Tracking Number

*Technical Stack: Order Status Automation / Seller Notifications*

### The Rewarding Loop
**การเติบโตของสมาชิกและรายได้ Passive (Growth)**

เมื่อผู้ใช้กดยืนยันได้รับสินค้า แต้มสะสมจะถูกโอนเข้าบัญชีทันทีเพื่ออัปเกรด Tier และแชร์รายได้ค่า Affiliate ให้กับผู้แนะนำ (5% Commission)

*Technical Stack: Point Distribution / Affiliate Referral Credit*

## Additional Static Content

แผนผังการทำงานเชิงเทคนิคที่เชื่อมต่อทุกส่วนของเนื้อหาเข้าด้วยกัน ตั้งแต่การสร้างตัวตน การเลือกซื้อสินค้า จนถึงระบบสมาชิกและการรับรายได้

### The Unified Ecosystem
ทุกขั้นตอนถูกออกแบบมาเพื่อสร้างความลื่นไหล (Seamless Experience) โดยมีระบบ Membership เป็นกระดูกสันหลังที่เชื่อมโยงพฤติกรรมการใช้งานเข้ากับรางวัลที่จับต้องได้จริง


---

# The Visual Ecosystem Flow.

## Additional Static Content

เจาะลึกขั้นตอนการทำงานผ่านอินโฟกราฟิกแบบเคลื่อนไหว เพื่อให้เห็นภาพรวมของระบบตั้งแต่การเริ่มต้นใช้งานจนถึงการประสบความสำเร็จบนแพลตฟอร์ม

### 01. User Registration Flow
การผสมผสาน Web2.0 และ Web3.0 ในการระบุตัวตน

### 02. Seller Onboarding Flow
จากผู้ใช้ทั่วไปสู่พาร์ทเนอร์ร้านค้าอย่างเป็นทางการ

### 03. The End-to-End Journey
วงจรชีวิตของออเดอร์และการสะสมแต้มพรีเมียม


---

# Home Page (Index)

>เอกสารฉบับสมบูรณ์ที่ระบุรายละเอียดทุกส่วนประกอบ (Components) ในหน้าแรก พร้อมช่องทางการเชื่อมโยงจุดหมายปลายทางของทุกลิงก์ (Link Mapping) เพื่อให้เห็นภาพรวมการเดินทางของผู้ใช้ (User Journey) ทั้งหมด

## Sections Items

### 1. Loader Animation & Preloader
**ระบบจัดการสถานะระหว่างโหลด (Loading State Management)**

*Source: Hardcoded JS / CSS Animations*

- **Initializing UI**: แสดงข้อความ INITIALIZING พร้อมตัวหมุน (Spinner) สีทองเพื่อคุมโทนความหรูหรา
- **Astro Page Load**: ใช้ Event 'astro:page-load' ร่วมกับ setTimeout 500ms เพื่อคุมจังหวะการ Fade-out
- **Performance Note**: ซ่อน Loader ด้วย 'display: none' หลังจากจางหายเพื่อประหยัดทรัพยากร Browser

### 2. Global Navbar & Navigation
**ส่วนนำทางหลักและระบบจัดการโปรไฟล์ผู้ใช้**

*Source: Astro + React (UserMenu) + Nanostores*

- **Main Navigation**: Link รายการ: Home (/), Shop (/shop), Courses (/course), Knowledge (/blog)
- **Shop Dropdown**: ทางลัดเข้าหมวดหมู่: All Products, Our Vendors (/shops), และ Jump links (#clock, #kiosk, #pos, #node)
- **Cart Global Bridge**: ปุ่มเปิด CartDrawer ที่ซิงก์จำนวนเงินและสินค้าแบบ Real-time จาก Local Storage
- **Auth Integration**: แสดงเมนูผู้ใช้ (Profile, Wallet, Logout) และ Badge ตาม Tier ของสมาชิก

### 3. Hero Cinematic Section
**ต้อนรับและนำเสนอวิสัยทัศน์ (Brand Impression)**

*Source: Hardcoded Content / SVG Animations*

- **Core Headline**: เน้นคำสำคัญ 'Bitcoin Hardware' ด้วย Gradient Animation สไลด์สีทอง
- **Vision Text**: อธิบายผลิตภัณฑ์หลัก 3 ตัว: CryptoClock, BiTTerm, และ BiTNode
- **CTA Links**: ปุ่ม 'Shop Now' ไปที่ /shop และปุ่ม 'See BiTTerm' ไปที่ /shop#kiosk

### 4. Rotating Marquee Ticker
**แถบข้อความวิ่งสร้าง Movement (Engagement Ticker)**

*Source: Hardcoded CSS Anim*

- **Ticker Message**: ข้อความตอกย้ำจุดยืน: DON'T TRUST VERIFY, FIX THE MONEY, OWN YOUR KEY
- **Visual Style**: เอียง -1 องศาเพื่อตัดกับเส้นสายแนวตั้งของเว็บไซต์ สร้างความรู้สึกไดนามิก

### 5. Features (Ecosystem Steps)
**เจาะลึก 4 ขั้นตอนนวัตกรรม (Step-by-Step Info)**

*Source: Supabase DB (Products Table)*

- **Product Fetching**: ดึงข้อมูลจาก DB ตาม ID สินค้าที่กำหนด เพื่อโชว์ Title, Desc, Image
- **Dynamic Links**: ปุ่ม 'Explore' ในแต่ละขั้นจะนำผู้ใช้ไปยังหน้า Product Detail (/products/[id])
- **Consult CTA**: ส่วนท้ายมีปุ่ม 'คุยกับทีมงานบน LINE' เพื่อขอรับคำปรึกษาสำหรับธุรกิจโดยเฉพาะ

### 6. Lifestyle Gallery
**The Lifestyle: Cashless Revolution**

*Source: React + LuxuryMotionGallery*

- **Visual Focus**: แสดภาพการใช้งานจริง (Use Cases) ในคาเฟ่ หรือโต๊ะเทรด เพื่อสร้างความอยากได้
- **Motion Gallery**: ใช้ Framer Motion ควบคุมการเลื่อนไหลของภาพแบบ Infinite สลับซ้ายขวา

### 7. Featured Grid (Shop Selection)
**พื้นที่แสดงสินค้าแนะนำและระบบสต็อก**

*Source: Supabase DB (Products/Variants)*

- **Automatic Tags**: คำนวณป้าย 'Sale %' และป้าย 'SOLD OUT' อัตโนมัติจากข้อมูลสต็อกใน DB
- **Variant Logic**: ดึงราคาเริ่มต้นของ Variant ที่ถูกที่สุดมาแสดงเป็นราคาเริ่มต้น (Starting From)
- **Product Link**: การ์ดสินค้าทุกลิงก์จะนำไปที่ /products/[id] พร้อมระบบเปลี่ยนรูปภาพเมื่อ Hover

### 8. Testimonials (Trust Section)
**ความไว้วางใจจากผู้ใช้งานจริง (Social Proof)**

*Source: Hardcoded Content*

- **Infinite Reviews**: แถบรีวิวลูกค้ายอดนิยม 4 รายการ เลื่อนวนลูปแบบไม่สิ้นสุด
- **Key Messages**: เน้นความปลอดภัย (Trezor), ความง่ายในการเรียนคอร์ส และความพรีเมียมของแบรนด์

### 9. Community & Events Hub
**ศูนย์รวมกิจกรรมและกลุ่มพูดคุย**

*Source: Events Configuration Array*

- **Upcoming Queue**: แสดงงานปัจจุบัน: Block Mountain, Satoshi Square, Road to Consensus
- **External Links**: ทุกลิงก์ในอีเวนต์จะไปที่หน้า Facebook หรือ Meetup ของงานนั้นๆ โดยตรง
- **Telegram CTA**: ปุ่มใหญ่ 'Join Telegram' เพื่อดึงผู้ใช้เข้าสู่ Official Community Group

### 10. Knowledge Base & Newsletter
**การสร้างฐานความรู้และระบบติดตามข่าวสาร**

*Source: Supabase DB (Posts Table)*

- **Blog Feed**: โชว์บทความล่าสุด 4 รายการ ลิงก์ไปยัง /blog/[slug] เพื่ออ่านรายละเอียด
- **Stay Ahead Hook**: ส่วนรับอีเมลลงตาราง 'newsletter_subscribers' เพื่อส่งบทวิเคราะห์เจาะลึก
- **Category Tags**: ป้ายกำกับหมวดหมู่บทความ (เช่น Education, Analysis) ที่ดึงจากหน้าบ้าน

### 11. Bitcoin Merchant Map
**แผนที่ร้านค้าและสถานที่รับบิตคอยน์**

*Source: BTCMap.org Embed Integration*

- **Map Interface**: ฝัง Iframe ของ BTCMap.org ที่พิกัดประเทศไทย (Lat 13.7, Lng 100.5)
- **Action Links**: ปุ่ม 'Open Full Map' ไปที่ btcmap.org/map และ 'Add Your Shop' ไปที่หน้าลงทะเบียน
- **Stats Dashboard**: โชว์ตัวเลข Merchants in TH (452) และ Verified Outlets (382) แบบกึ่งคงพิกัด

### 12. FAQ & Detailed Footer
**ส่วนสนับสนุนผู้ใช้และลิ้งก์นโยบายสำคัญ**

*Source: Global Footer Component*

- **Privacy & Support**: ลิงก์นโยบาย: Refund, Privacy, Terms, Shipping (/policies/...)
- **Support Links**: ลิงก์บริการ: Track Order (/track-order), Contact Us (/support/contact)
- **Social Presence**: ทางลัดไป Facebook, Twitter, Line, YouTube ของแบรนด์
- **Payment Trust**: ป้ายยืนยันการรับชำระผ่าน Bitcoin, Lightning Network และ Promptpay

## Additional Static Content

เอกสารฉบับสมบูรณ์ที่ระบุรายละเอียดทุกส่วนประกอบ (Components) ในหน้าแรก พร้อมช่องทางการเชื่อมโยงจุดหมายปลายทางของทุกลิงก์ (Link Mapping) เพื่อให้เห็นภาพรวมการเดินทางของผู้ใช้ (User Journey) ทั้งหมด

### Full Component Breakdown
### # Destination Link Mapping
### Internal Hubs
### Policies & Support

---

# Shop Catalog System

>นวัตกรรมการนำเสนอรายการสินค้า (Product Discovery) ของเราถูกออกแบบให้เป็นแบบ Data-Driven โดยสมบูรณ์ ทุกการจัดหมวดหมู่ ราคา และสถานะสต็อก จะซิงก์ตรงจาก Supabase เพื่อความแม่นยำสูงสุด

## Sections Items

### 1. Supabase Data Integration
**ระบบดึงข้อมูลสินค้าแบบ Dynamic (Real-time Catalog)**

*Source: Supabase (products table)*

- **Query Logic**: ใช้ supabase.from('products').select('*') โดยเรียงลำดับตามความใหม่ (created_at desc) เป็นค่าเริ่มต้น
- **Force Reordering**: มีลอจิกพิเศษ (Explicit reorder) เพื่อสลับลำดับ CryptoClock Basic ให้ขึ้นก่อน Saving เพื่อลำดับความสำคัญทางการตลาด
- **JSON Parsing**: จัดการข้อมูล JSONB ในฟิลด์ meta, pricing, config และ media เพื่อนำมาสกัดเป็นข้อมูล UI ที่พร้อมใช้งาน

### 2. Intelligent Category Mapping
**ระบบแยกหมวดหมู่สินค้าอัตโนมัติ**

*Source: Internal Logic / categoryMeta*

- **Auto Extraction**: ระบบจะสแกนหาสนค้าทั้งหมดใน DB และสกัดหมวดหมู่ (Unique Categories) ออกมาเพื่อสร้างหน้าเว็บโดยไม่ต้องระบุ Category ล่วงหน้า
- **Category Metadata**: ตาราง CategoryMeta ใช้กำหนดชื่อหัวข้อ (Title) และคำโปรย (Description) ที่สวยงามสำหรับแต่ละหมวด เช่น BiTTerm Solutions
- **Priority Sorting**: จัดลำดับหมวดหมู่ตามความสำคัญ: Clock > Kiosk > POS > Node > Others เพื่อให้สินค้า Hardware หลักอยู่ด้านบนเสมอ

### 3. Flexible Content Sections
**โครงสร้างหน้าเว็บแบบปรับเปลี่ยนตามสินค้า**

*Source: Astro Mapping Logic*

- **Section Autonomy**: ใช้การ Map ข้อมูล Categories เพื่อสร้าง Section ใหม่โดยอัตโนมัติ หากไม่มีสินค้าในหมวดนั้น Section จะไม่ถูกแสดงผล
- **Scroll Navigation**: ทุกลิงก์จาก Navbar (เช่น /shop#kiosk) จะเชื่อมตรงมายัง ID ของ Section ในหน้านี้ พร้อม Offset การเลื่อนที่แม่นยำ
- **Visual Separators**: คั่นระหว่างหมวดหมู่ด้วยเส้น Gradient และลำดับ Collection (01, 02...) เพื่อสร้างบรรยากาศห้างสรรพสินค้าดิจิทัล

### 4. Advanced Pricing Engine
**กลไกการคำนวณราคาและส่วนลด (Complex Variation)**

*Source: Pricing / Config Metadata*

- **Variant Priority**: ระบบจะเช็คราคาสินค้าจาก Variants ก่อน หากมีหลายระดับจะเลือกราคาที่ต่ำที่สุดมาโชว์เป็น 'Starts at
- **Compare Price**: ดึงราคาเปรียบเทียบ (Compare Price) ที่สูงที่สุดในกลุ่มมาใช้เพื่อคำนวณยอดส่วนลดสสูงสุดของรุ่นนั้นๆ
- **Discount Calculation**: สูตรคำนวณส่วนลด % อัตโนมัติ (Compare - Current) / Compare * 100 เพื่อแสดงป้าย Sale

### 5. Real-time Inventory Feedback
**ระบบจัดการสถานะสต็อกในหน้า Catalog**

*Source: Database Stock Status*

- **Inventory Summation**: สำหรับสินค้าที่มีหลายโมเดล ระบบจะรวบยอด Stock จากทก Variant เพื่อตรวจสอบสถานะรวม
- **Sold Out Overlay**: หากสินค้าหมด (Stock <= 0) ระบบจะซ้อนทับด้วย Layer 'SOLD OUT' และลดความชัดของรูปภาพอัตโนมัติ
- **Visual Urgency**: มี Ribbon ป้าย 'SALE' พร้อมแอนิเมชัน Shimmer (แสงวิ่ง) เพื่อดึงดูดสายตาสำหรับสินค้าที่ลดราคา

### 6. Premium Product Card UI
**การออกแบบ Card สินค้าเพื่อประสิทธิภาพการตลาด**

*Source: Tailwind CSS / CSS Animations*

- **Glassmorphism Card**: ใช้ความโปร่งใส (Alpha) และ Border ที่บางเบาเพื่อให้ดูทันสมัยและสะอาดตาแบบ Apple Style
- **Hover Interactions**: เมื่อผู้ใช้เอาเมาส์วาง ภาพจะซูมเข้า (Scale 110%) และแสดงปุ่ม 'View Details' พร้อมเงาสีทองนวลตา (Global glow)
- **Delayed Entrance**: แอนิเมชันการโผล่ขึ้นมาของสินค้า (Entrance Animation) แบบสไลด์ขึ้นทีละใบ (Staggered) เพื่อความสุนทรีย์

### 7. Media & Metadata Handling
**ระบบจัดการรูปภาพและข้อมูลจำเพาะ**

*Source: Storage / Meta Fields*

- **Lazy Loading**: ใช้ Loading='lazy' สำหรับรูปภาพทั้งหมดเพื่อทำให้หน้า Shop โหลดได้รวดเร็วแม้จะมีสินค้าเป็นร้อยรายการ
- **Fallback Images**: มีระบบ Error Handling หากรูปภาพใน DB ผิดพลาด จะโชว์ 'No Image' Placeholder ไม่ให้หน้าเว็บพัง
- **Tag System**: ดึง Tag ตัวแรกจาก Array (เช่น Trending, New) มาโชว์เป็นป้ายทองขนาดเล็กเหนือรูปสินค้า

## Additional Static Content

นวัตกรรมการนำเสนอรายการสินค้า (Product Discovery) ของเราถูกออกแบบให้เป็นแบบ Data-Driven โดยสมบูรณ์ ทุกการจัดหมวดหมู่ ราคา และสถานะสต็อก จะซิงก์ตรงจาก Supabase เพื่อความแม่นยำสูงสุด

### Catalog Engine Components
### # Shop Architecture Workflow
### Category Logic Flow
1. Fetch All Products 2. Extract Category Slugs 3. Match against Meta-titles 4. Group products for layout rendering

### Pricing Guard
ระบบจะคำนวณราคาที่ต่ำที่สุดเสนอเป็นจุดเริ่มต้น เพื่อเพิ่มอัตรา Click-through rate (CTR) พร้อมทั้งตรวจสอบว่าหากสินค้ามีหลาย Variant ต้องคำนวณราคาเฉลี่ยหรือไม่


---

# Product Detail Page

>หน้าที่รวมทุกความละเอียดอ่อนของสินค้าแต่ละรายการ จากการดึงข้อมูล SSR ที่รวดเร็ว ไปจนถึงประสบการณ์การเลือก Options ที่ลื่นไหลแบบ App-like Experience

## Sections Items

### 1. Dynamic Product SSR
**ระบบดึงข้อมูลสินค้าแบบ Server-Side Rendering**

*Source: Supabase (products table) + Params*

- **Identity Lookup**: ใช้ [id] จาก URL เพื่อดึงข้อมูลสินค้าเฉพาะตัว พร้อมทำ Join กับตาราง Shops เพื่อแสดงข้อมูลผู้ขาย
- **Data Sanitization**: มีระบบ parseIfNeeded เพื่อจัดการข้อมูล JSONB ที่อาจถูกส่งกลับมาเป็น String ให้เป็น Object ที่พร้อมใช้งาน
- **Error Handling**: หากไม่พบสินค้า (ID ผิดพลาด) ระบบจะทำ Redirect ไปหน้า 404 โดยอัตโนมัติ

### 2. Visual Media Engine
**ระบบแกลเลอรีรูปภาพและปฏิสัมพันธ์**

*Source: CSS Animations / JS Swipe Logic*

- **Interactive Gallery**: รองรับการ Swipe เปลี่ยนรูปภาพบน Mobile และการคลิก Thumbnail เพื่อเปลี่ยนรูปหลักพร้อมแอนิเมชัน Fade
- **Responsive Zoom**: รูปภาพหลักใช้เทคนิค Object-contain พร้อมเอฟเฟกต์ Scale-on-hover เพื่อความคมชัดทุกรายละเอียดสินค้า
- **Metadata Links**: ระบบดึงรูปจาก Variants อัตโนมัติเมื่อมีการเลือก Options เพื่อความแม่นยำในการนำเสนอ

### 3. Smart Pricing & Discount
**ระบบคำนวณราคาและส่วนลดอัจฉริยะ**

*Source: Pricing Metadata*

- **Variant Pricing**: คำนวณราคาเริ่มต้น (Base Price) จาก Variant ที่ถูกที่สุดเป็นค่าเริ่มต้นเมื่อโหลดหน้า
- **Discount Analysis**: แสดงยอดเงินที่ประหยัดไป (Save Amount) และเปอร์เซ็นต์ส่วนลดเทียบกับราคาตั้งต้น (Compare Price)
- **Shipping Info**: แสดงข้อมูลค่าจัดส่งคงที่ (Fixed Delivery Fee) กึ่งอัตโนมัติเพื่อประกอบการตัดสินใจ

### 4. Multi-Variant Selector
**ระบบเลือกคุณสมบัติสินค้าขั้นสูง**

*Source: Config Metadata (variants/options)*

- **Visual Color Swatches**: แสดงตัวเลือกสีเป็นวงกลมสีจริง (Hex Code) พร้อม Tooltip รายชื่อสี
- **Model Selection**: ปุ่มเลือกโมเดล (Standard, Pro, etc.) ที่ปรับเปลี่ยนราคาและสต็อกทันทีที่คลิก
- **Composite Options**: NEW: ระบบเลือก Option หลายระดับ (เช่น ความจุ + สี) พร้อมการบวกราคาส่วนเพิ่มแบบทับซ้อน

### 5. Cart & Stock Automation
**การเชื่อมต่อกับตะกร้าสินค้าและระบบสต็อก**

*Source: Nanostores (cartStore) / Local Storage*

- **Stock Validation**: ตรวจสอบสต็อกจริงก่อนกดยืนยัน หากสินค้าหมด ปุ่ม Add to Cart จะถูกปิดใช้งาน (Disabled)
- **Quantity Control**: ระบบนับจำนวนสินค้า (Qty) พร้อมการจำกัดขั้นต่ำและขั้นสูงสุดตามสต็อกที่มีอยู่จริง
- **Mini-Cart Bridge**: เมื่อกด Add to Cart ข้อมูลจะถูกส่งเข้า nanostores เพื่อเปิด CartDrawer ให้ผู้ใช้ดูสรุปทันที

### 6. Marketing & Technical Core
**ส่วนข้อมูลเชิงลึกและการโน้มน้าวใจ**

*Source: Marketing & TechSpecs Metadata*

- **Iconic Benefits**: ตารางสรุปจุดเด่นสินค้าพร้อมไอคอนและคำอธิบายเจาะลึก 3 หมวดหมู่
- **Hardware Specs**: Grid ตารางข้อมูลทางเทคนิค (Tech Specs) ที่ดึงค่า Label/Value จากฐานข้อมูลมาจัดเรียงอัตโนมัติ
- **External Manual**: ลิงก์ User Guide สำหรับดาวน์โหลดคู่มือการใช้งาน หรือดูวิดีโอสาธิตจากผู้ผลิต

### 7. User Review Ecosystem
**ระบบความคิดเห็นและความไว้วางใจ**

*Source: React (Reviews.jsx) / Supabase*

- **Global Rating**: การดึงคะแนนเฉลี่ยดาว (Stars) จากรีวิวทั้งหมดของสินค้านั้นๆ มาแสดงผลแบบ Real-time
- **Detailed Feedback**: แสดงความคิดเห็นจากผู้ซื้อจริงพร้อมวันที่และสถานะยืนยันการซื้อ (Verified Purchase)
- **Filter Logic**: ระบบคัดกรองรีวิวเพื่อให้ผู้ใช้เห็นความพึงพอใจโดยรวมก่อนการตัดสินใจซื้อ

## Additional Static Content

หน้าที่รวมทุกความละเอียดอ่อนของสินค้าแต่ละรายการ จากการดึงข้อมูล SSR ที่รวดเร็ว ไปจนถึงประสบการณ์การเลือก Options ที่ลื่นไหลแบบ App-like Experience

### Core Frontend Logic
### # Complex States Overview
### Variant Switching Logic
เมื่อเลือก Variant ใหม่ JavaScript จะอัปเดต 4 ส่วนทันที: 1. ราคาสุทธิบนหน้าจอ 2. ราคาเปรียบเทียบ (Compare Price) 3. รูปภาพสินค้าหลัก 4. สถานะความสว่างของปุ่ม Add to Cart ตามสต็อก

### Composite Price Mapping
สำหรับระบบ Composite ตัวเลือกย่อยแต่ละตัวจะมี "Price Addon" เฉพาะตน ลอจิกจะบวกสะสม (Addition) จาก Base Price เพื่อแสดงยอดรวมที่ถูกต้องที่สุดก่อนเข้าตะกร้า


---

# User Profile Features

>เจาะลึกทุกกลไกภายในหน้า Profile ของผู้ใช้งาน ตั้งแต่ระบบยืนยันตัวตนแบบไฮบริด ไปจนถึงระบบจัดการข้อพิพาทและศูนย์รายได้จากพันธมิตร (Affiliate)

## Sections Items

### 1. Hybrid Authentication Logic
**แกนหลักการระบุตัวตนแบบควบคู่ (Web2 + Web3)**

*Source: Supabase Auth / localStorage*

- **Supabase Native**: ใช้ supabase.auth.getUser() เพื่อดึงข้อมูลผู้ใช้ที่ล็อกอินด้วยอีเมล/รหัสผ่าน
- **Wallet Identity**: ตรวจสอบ 'user_wallet' จาก localStorage เพื่อระบุตัวตนผู้ใช้ระดับ Web3 (Metamask/Safe)
- **Profile Lookup**: ทำการ Cross-match ระหว่าง Auth ID หรือ Wallet Address กับตาราง 'profiles' ในฐานข้อมูล
- **Security Guard**: ระบบ Redirect อัตโนมัติ: หากไม่พบทั้ง Session และ Wallet จะถูกส่งไปหน้า /login ทันที

### 2. Visual Membership Hierarchy
**ระบบชนชั้นสมาชิกและสิทธิพิเศษเชิงภาพลักษณ์**

*Source: Profiles Table (tier column)*

- **Tier Styles**: 6 ระดับ: Bronze (Deer), Silver (Wolf), Gold (Phoenix), Platinum (Unicorn), Rare Earth (Dragon), Bitcoin (Lion)
- **Dynamic Card UI**: ใช้ฟังก์ชัน getTierStyle เพื่อเปลี่ยนสี Gradient, แอนิเมชัน และไอคอนตามระดับสมาชิกแบบ Real-time
- **Verification Status**: Badges แสดงสถานะ: 'Identity Verified (KYC)' สำหรับคนผ่านยืนยันตัวตน และ 'Email Verified' สำหรับคนยืนยันอีเมล
- **Tier Up Logic**: ระดับสมาชิกจะถูกอัปเดตอัตโนมัติจากหลังบ้านตามยอดการสั่งซื้อสะสม (Total Spent)

### 3. Avatar Customization Engine
**ระบบสร้างและจัดการตัวตนเสมือน**

*Source: DiceBear API / Supabase Storage*

- **DiceBear Integration**: เชื่อมต่อกับ api.dicebear.com เพื่อสร้าง SVG Avatar ตามสไตล์ต่างๆ (Avataaars, Bottts, etc.)
- **Seed Generation**: ระบบ Randomize Seed เพื่อให้ผู้ใช้สามารถสุ่มเลือกรูปแบบที่พอใจได้ไม่จำกัด
- **Custom Upload**: รองรับการอัปโหลดไฟล์ภาพจริง (.jpg, .png) จำกัดขนาด 2MB ต่อไฟล์ เก็บในบักเก็ต 'avatars
- **Persistence**: รูปโปรไฟล์จะถูกบันทึกลงฟิลด์ avatar_url ในโปรไฟล์ เพื่อใช้แสดงผลถาวรทั่วทั้งเว็บไซต์

### 4. Personal Info & Metadata
**การจัดการข้อมูลพื้นฐานและฐานข้อมูลส่วนบุคคล**

*Source: Profiles Table*

- **Full Name Split**: ระบะจัดการแยกชื่อ-นามสกุล และรวมเข้าด้วยกันเพื่อเก็บในฟิลด์ full_name อัตโนมัติ
- **Tax Identification**: ฟิลด์ Tax ID สำหรับใช้ในการออกใบกำกับภาษีหรือทำธุรกรรมที่เป็นทางการ
- **Gender & DOB**: เก็บข้อมูลเพศและวันเกิดเพื่อใช้ในการคัดกรองโปรโมชันหรือวิเคราะห์ข้อมูลลูกค้า (Analytic segments)
- **Bio Summary**: พื้นที่สำหรับใส่คำแนะนำตัวสั้นๆ เพื่อแสดงผลในระบบ Community หรือหน้า Profile สาธารณะในอนาคต

### 5. Smart Address Management
**ระบบจัดการที่อยู่จัดส่งอัจฉริยะ**

*Source: Addresses Table*

- **Multiple Entries**: ผู้ใช้สามารถเพิ่มที่อยู่บ้าน, ที่ทำงาน หรือที่อยู่เพื่อนได้หลายรายการ (Unlimited entries)
- **Set as Default**: ระบบป้องกันความผิดพลาด: การตั้งค่าที่อยู่หลักจะไปยกเลิก is_default ของที่อยู่อื่นให้อัตโนมัติ
- **Validation Logic**: ฟอร์มบังคับใส่ข้อมูลที่จำเป็นครบถ้วน: ชื่อผู้รับ, เบอร์โทร, รพัสไปรษณีย์ และรายละเอียดที่อยู่
- **Edit/Delete Flow**: ระบบ Modal แก้ไขที่อยู่แบบ In-place ไม่ต้องโหลดหน้าใหม่ (No-reload UI)

### 6. Order Lifecycle & Fulfillment
**ประวัติการสั่งซื้อและสถานะการจัดส่ง**

*Source: Orders / Order Items / Products*

- **Automated Sync**: รัน rpc 'check_order_automations' ทุกครั้งที่โหลดหน้าประวัติเพื่อซิงก์สถานะล่าสุดจาก Gateway
- **Rich Order Items**: ดึงรูปภาพและชื่อสินค้าจาก Metadata ของสินค้าจริงมาแสดงแม้ในประวัติย้อนหลัง
- **Shipping Linkage**: แสดง Tracking Number พร้อมระบุ Shipping Provider (Kerry, Flash, EMS) อย่างชัดเจน
- **Receipt Confirmation**: ปุ่ม 'Confirm Receipt' สำหรับผู้ใช้เพื่อยืนยันการรับของ ซึ่งจะไปกระตุ้นการคำนวณคะแนน/Tier

### 7. Customer Satisfaction Review
**ระบบให้คะแนนสินค้า (Post-Purchase Feedback)**

*Source: Reviews Table*

- **Dynamic Star Rating**: ใช้ Interactive Star UI ให้ผู้ใช้เลือก 1-5 ดาว พร้อมคำอธิบายความพึงพอใจ
- **Variant-base Link**: ระบบฉลาดพอที่จะ Clean Product ID (ตัด Variant ออก) เพื่อให้คะแนนรวมไปอยู่ที่สินค้าหลัก
- **Anti-re-review**: เช็คสถานะ hasReviewed ในแต่ละรายการสินค้าเพื่อปิดปุ่มรีวิวหากทำไปแล้ว
- **Real-time Display**: รีวิวที่บันทึกแล้วจะมีผลต่อคะแนนเฉลี่ยหน้าสินค้า (Product Page) ทันที

### 8. Dispute & Escrow Protection
**ศูนย์ช่วยเหลือและแจ้งปัญหาออเดอร์**

*Source: Disputes Table / Cloud Storage*

- **Guided Dispute**: หมวดหมู่ปัญหา: ไม่ได้รับสินค้า (Not Received), สินค้าเสียหาย (Damaged), ได้ไม่ตรงปก (Wrong Item)
- **Evidence Collection**: จุดอัปโหลดไฟล์หลักฐาน (Evidence Images) จำกัด 3 รูป เก็บในบักเก็ต 'chat-images' เพื่อความเป็นส่วนตัว
- **Resolution Status**: ออเดอร์จะถูกล็อกสถานะเป็น 'dispute' ทันที ทำให้แอดมินรู้ว่าห้ามโอนเงินให้ผู้ขาย (Escrow Logic)
- **Admin Alerts**: เมื่อเปิด Dispute ระบบจะส่งสัญญาณเตือนไปยัง Admin Dashboard เพื่อให้เข้ามาดูแลแบบเร่งด่วน

### 9. Affiliate Revenue & Payouts
**ศูนย์สร้างรายได้จากการแนะนำ (Partnership)**

*Source: Affiliate Referrals / Database Functions*

- **Real-time Stats**: Dashboard สรุป: จำนวนผู้สมัครผ่านลิงก์ (Referral Count), ยอดขายรวม และรายได้คอมมิชชันสะสม
- **payout Tiers**: แยกยอดเงินคอมมิชชันตามสถานะ: Pending (รอตรวจ), Approved (อนุมัติแล้ว), Paid (จ่ายแล้ว)
- **Request Withdrawal**: ปุ่มถอนเงินสำหรับยอดที่ 'Approved' โดยจะส่งลิงก์พร้อมข้อความอัตโนมัติไปหาแอดมินทาง Telegram
- **Withdrawal Cooldown**: ล็อคการถอนเงิน 24 ชั่วโมงต่อครั้งเพื่อความปลอดภัยและป้องกันการสแปมระบบ

### 10. Integrated Chat Center
**ระบบสื่อสารสดกับฝ่ายสนับสนุน (Concierge)**

*Source: ChatCenter.jsx / Messages*

- **Persistence Chat**: ประวัติการแชทถูกเก็บไว้ใน Database ทำให้สามารถคุยต่อเนื่องได้แม้จะย้ายเครื่อง
- **File/Image Support**: รองรับการส่งรูปหลักฐานและ Attachment ต่างๆ ผ่าน UI แชทที่ทำความสะอาดมาอย่างดี
- **Order Referencing**: สามารถเลือก 'แนบเลขที่ใบสั่งซื้อ' ไปในแชทเพื่อให้แอดมินตรวจสอบข้อมูลได้รวดเร็วขึ้น
- **Emoji & Stickers**: ระบบ Emoji Picker และ Sticker Gallery ที่ช่วยสร้างบรรยากาศที่ดีในการรับบริการ

## Additional Static Content

เจาะลึกทุกกลไกภายในหน้า Profile ของผู้ใช้งาน ตั้งแต่ระบบยืนยันตัวตนแบบไฮบริด ไปจนถึงระบบจัดการข้อพิพาทและศูนย์รายได้จากพันธมิตร (Affiliate)

### Insanely Detailed Features
### RLS Policies
ข้อมูลทุกส่วนถูกป้องกันด้วย Row Level Security (RLS) ทำให้ผู้ใช้ดึงได้เฉพาะข้อมูลของตัวเองเท่านั้น

### Asset Buckets
จัดสรร 'avatars' และ 'chat-images' แยกออกจากกันชัดเจนเพื่อจัดการนโยบายการเข้าถึงไฟล์ต่างกัน


---

# Shopping Cart

>เจาะลึกระบบจัดการตะกร้าสินค้าแบบอะตอมมิก ที่เชื่อมโยงระหว่าง Framework ต่างชนิด (Astro & React) ผ่านระบบ Global Event และการเก็บสถานะแบบ Persistent

## Sections Items

### 1. Nanostores Persistent State
**ระบบจัดการสถานะสินค้าในตะกร้าแบบถาวร**

*Source: src/lib/cartStore.js*

- **Local Persistence**: ใช้ persistentAtom จาก Nanostores เพื่อเก็บข้อมูลไว้ใน Local Storage ทำให้ข้อมูลไม่หายเมื่อรีเฟรชหรือปิดเบราว์เซอร์
- **Atomic Updates**: ใช้โครงสร้างข้อมูลแบบอะตอมมิกช่วยให้ทุกส่วนของเว็บไซต์ที่เรียกใช้ตะกร้าได้รับข้อมูลล่าสุดในทันที
- **Automatic Sync**: ระบบ Encode/Decode ข้อมูลเป็น JSON อัตโนมัติเมื่อมีการเปลี่ยนแปลงค่าใน Store

### 2. Dynamic Pricing & Totals
**ระบบคำนวณราคาสุทธิและหน่วย Bitcoin**

*Source: cartStore.totals()*

- **Multi-Currency Calculation**: คำนวณราคารวมในหน่วยบาท (THB) และแปลงเป็นหน่วยซาโตชิ (Sats) แบบเรียลไทม์
- **Quantity Logic**: ระบบรวมจำนวนสินค้าแบบแยกตาม SKU เพื่อแสดงราคารวมที่ถูกต้องในแต่ละรายการ
- **Sats Conversion**: ใช้อัลกอริทึมพื้นฐานในการประเมินมูลค่าบิตคอยน์เบื้องต้นเพื่อให้ผู้ใช้เห็นความคุ้มค่า

### 3. Global Event Bridge
**ระบบสื่อสารระหว่าง Astro และ React**

*Source: CustomEvent Ecosystem*

- **cart-updated Event**: ส่งสัญญาณ CustomEvent ไปทั่วเว็บเมื่อมีการเพิ่มหรือลบสินค้า เพื่ออัปเดต Badge บน Navbar
- **toggle-cart Signal**: ระบบรับ-ส่งคำสั่งเปิด/ปิดลิ้นชักตะกร้าข้าม Component (เช่น จากหน้า Product Detail ไปที่ CartDrawer)
- **Bubbling System**: ใช้หลักการ Event Bubbling เพื่อให้ Element ชั้นบนสามารถดักฟังและสั่งงานตะกร้าได้จากทุกจุด

### 4. Interactive Cart Drawer
**อินเทอร์เฟซลิ้นชักตะกร้าสินค้าแบบพรีเมียม**

*Source: CartDrawer.astro*

- **Sliding Panel**: ดีไซน์แผงเลื่อนด้านข้างที่ประหยัดพื้นที่และไม่รบกวนการเลือกชมสินค้าในหน้าหลัก
- **Micro-Interactions**: ปุ่มบวก-ลบจำนวนสินค้าและการลบรายการที่ทำงานได้ทันทีโดยไม่ต้องโหลดหน้าใหม่
- **Empty State UI**: การแสดงผลที่สวยงามเมื่อไม่มีสินค้าในตะกร้า พร้อมปุ่มนำทางกลับไปที่หน้า Shop

### 5. Checkout Vortex Pipeline
**ขั้นตอนการส่งต่อข้อมูลสู่ระบบชำระเงิน**

*Source: checkout.astro Integration*

- **Data Integrity**: การแพ็กข้อมูลสินค้าทั้งหมด (ID, Name, Price, Qty) เตรียมพร้อมสำหรับการคำนวณในหน้าใบกำกับภาษี
- **Zero-Data Strategy**: ระบบล้างข้อมูลในตะกร้า (cart.clear) เฉพาะเมื่อการสั่งซื้อได้รับการยืนยันหรือเข้าสู่สถานะจ่ายเงินแล้ว
- **Secure Handover**: การไหลของข้อมูลที่เน้นความสอดคล้องระหว่างหน้า Cart และหน้าชำระเงินเพื่อป้องกันราคาคลาดเคลื่อน

### 6. Real-time Stock Sync
**ระบบตรวจสอบความถูกต้องของสินค้า**

*Source: Cart Validation Logic*

- **Instant Validation**: ระบบตรวจสอบสต็อกล่าสุดจากฐานข้อมูลทันทีเมื่อเปิดตะกร้า (Trigger Verification)
- **Auto-Adjustment**: หากสินค้าในสต็อกเหลือน้อยกว่าจำนวนในตะกร้า ระบบจะปรับลดให้อัตโนมัติพร้อมแจ้งเตือนผู้ใช้
- **Expired Item Removal**: ระบบลบสินค้าที่ถูกนำออกจากร้านค้า (De-listed) ออกจากตะกร้าโดยอัตโนมัติ

## Additional Static Content

เจาะลึกระบบจัดการตะกร้าสินค้าแบบอะตอมมิก ที่เชื่อมโยงระหว่าง Framework ต่างชนิด (Astro & React) ผ่านระบบ Global Event และการเก็บสถานะแบบ Persistent

### Cart Architecture Modules
### # Cart State Philosophy
### Single Source of Truth
ทุก Component ไม่ว่าจะอยู่บนหน้าไหนก็ตาม จะต้องเรียกดูข้อมูลจาก `cartItems` เดียวกันเสมอ เพื่อป้องกันความสับสนของราคาสินค้าหรือจำนวนสต็อกที่อาจเกิดขึ้นจากการแยกตัวแปรสถานะ

### Event-Driven Architecture
การใช้ Custom Events ช่วยลดภาระของ Main Framework (Astro) ในการคุมทุกการกระทำ โดยอนุญาตให้เกาะกลุ่มการอัปเดต (Batch Updates) ทำงานในฝั่ง Client-side ได้อย่างสมบูรณ์และรวดเร็ว


---

# Checkout System

>เบื้องหลังระบบการชำระเงินแบบ Hybrid ที่เชื่อมต่อโลกของ Fiat และ Decentralized Finance เข้าด้วยกัน เจาะลึกกลไกการคำนวณส่วนลดสมาชิก ระบบแลกแต้ม และการออกใบเสร็จแบบอัตโนมัติ

## Sections Items

### 1. Shipping & Data Integrity
**ระบบจัดการข้อมูลผู้ซื้อและการป้องกันความปลอดภัย**

*Source: checkout.astro - Form Section*

- **Honeypot Protection**: ใช้ฟิลด์ลับ (Hidden Input) เพื่อดักจับบอทที่พยายามกรอกข้อมูลอัตโนมัติ ช่วยลดขยะในระบบฐานข้อมูล
- **Billing Metadata**: รองรับการเก็บข้อมูล Tax ID และ Company Name เพื่อใช้ในการออกใบกำกับภาษี (Invoice) แบบถูกระเบียบ
- **Validation Layer**: ระบบตรวจสอบความถูกต้องของเบอร์โทรศัพท์และรูปแบบอีเมลก่อนเข้าสู่กระบวนการชำระเงิน

### 2. Tier & Loyalty Engine
**ระบบคำนวณสิทธิประโยชน์สมาชิกอัตโนมัติ**

*Source: Checkout Logic - Tier Module*

- **Dynamic Discounting**: ตรวจสอบ Tier ของผู้ใช้รายคนเพื่อมอบส่วนลดพิเศษ (เช่น Bitcoin Tier ลด 21%) โดยอ้างอิงจากยอด Wallet
- **Free Shipping Logic**: คำนวณสิทธิ์การจัดส่งฟรีอัตโนมัติสำหรับสมาชิก Tier สูง หรือตามเงื่อนไขโปรโมชั่นที่แอดมินกำหนด
- **Tier Mirroring**: แสดงผลชื่อ Tier และเปอร์เซ็นต์ส่วนลดแบบเรียลไทม์บนหน้าสรุปยอดเพื่อให้ผู้ใช้รับทราบสิทธิพิเศษ

### 3. Redemption & Coupons
**ระบบแลกแต้มและโค้ดส่วนลดเชิงพาณิชย์**

*Source: PointRedemption.jsx / Coupon Logic*

- **Point Redemption**: อัลกอริทึมการแลกแต้มสะสม (เช่น 100 แต้ม = 1 บาท) เพื่อใช้ลดทอนราคาสินค้าสุทธิ
- **Voucher Validation**: ระบบตรวจสอบความถูกต้องของวอยเชอร์ (Expiration, Min Spend) จากฐานข้อมูล Supabase
- **Cumulative Stack**: ลอจิกการคำนวณส่วนลดแบบทับซ้อน (Tier + Coupon + Points) ภายใต้ลำดับความสำคัญที่ถูกต้อง

### 4. Multi-Gateway Payment
**ระบบ Gateway รองรับทั้ง Fiat และ Crypto**

*Source: PromptPay / Web3 / Lightning*

- **PromptPay QR**: การสร้าง QR Code มาตรฐาน EMVCo แบบไดนามิกตามราคาสินค้าจริง พร้อมระบบสแกนตรวจสอบสลิป
- **Web3 Integration**: รองรับการจ่ายด้วย Metamask ผ่านเครือข่าย EVM (ETH, BSC, Polygon) พร้อมระบบตรวจจับเครือข่ายอัตโนมัติ
- **Lightning Network**: การคำนวณยอด Satoshis แบบเรียลไทม์และสร้าง QR Lightning สำหรับการจ่ายที่รวดเร็วและค่าธรรมเนียมต่ำ

### 5. Order Creation & Storage
**วงจรชีวิตของออเดอร์และการเก็บหลักฐาน**

*Source: Supabase orders table*

- **Slip Attachment**: ระบบอัปโหลดหลักฐานการโอนเงินเข้าสู่ Storage Bucket พร้อมผูกลิงก์กับ Order ID ทันที
- **Atomic Invoicing**: สร้างรายการออเดอร์ในฐานข้อมูลพร้อมรันเลขใบสั่งซื้อ (Order Number) แบบไม่ซ้ำกัน
- **Captcha Verification**: ระบบคำนวณเลขคณิต (Math Captcha) ชั้นสุดท้ายเพื่อยืนยันความเป็นมนุษย์ก่อนยืนยันออเดอร์

### 6. Fulfillment Synchronization
**การส่งต่อข้อมูลเข้าสู่ระบบจัดการของผู้ขาย**

*Source: Seller Notification Logic*

- **Instant Routing**: กระจายรายการสินค้าจากหนึ่งออเดอร์ไปยังร้านค้าต่างๆ (Sellers) ที่เกี่ยวข้องผ่านระบบแยกออเดอร์ย่อย
- **Real-time Notification**: ส่งสัญญาณแจ้งเตือนไปยังแต่อะร้านค้าว่ามีรายการชำระเงินใหม่รอการตรวจสอบสลิป
- **Stock Locking**: ระบบล็อคสต็อกสินค้าในระดับตะกร้าเมื่อเริ่มการชำระเงินเพื่อป้องกันการขายซ้อน (Overselling)

## Additional Static Content

เบื้องหลังระบบการชำระเงินแบบ Hybrid ที่เชื่อมต่อโลกของ Fiat และ Decentralized Finance เข้าด้วยกัน เจาะลึกกลไกการคำนวณส่วนลดสมาชิก ระบบแลกแต้ม และการออกใบเสร็จแบบอัตโนมัติ

### Checkout Logic Modules
### # Transaction Security Logic
### Anti-Bot Protocol
นอกเหนือจาก Math Captcha ระบบยังใช้ลอจิกวิเคราะห์พฤติกรรมการกรอกและเวลาทำงาน (Time-on-Page) เพื่อระบุและสกัดการทำธุรกรรมแบบ Brute Force ในขั้นตอนสุดท้ายของการจ่ายเงิน

### Atomic Commit
การจองสินค้าจะเกิดขึ้นในรูปแบบ Transactional Lock สินค้าจะคงอยู่ในสถานะ 'Booking' จนกว่าแอดมินหรือระบบตรวจสอบสลิปจะยืนยัน เพื่อให้มั่นใจว่าสต็อกจริงจะถูกตัดเมื่อได้เงินแล้วเท่านั้น


---

# Membership & Tiers

>เจาะลึกระบบสมาชิกแบบแบ่งระดับ (Layered Rewards) ที่ใช้แต้มสะสมจากการสั่งซื้อเป็นตัวกำหนดสิทธิประโยชน์ ผสานเข้ากับระบบ Authentication ขั้นสูงที่รองรับทั้ง Email และ Web3 Wallet

## Sections Items

### 1. Hybrid Authentication System
**ระบบยืนยันตัวตนแบบควบคู่ (Web2 + Web3)**

*Source: src/components/UserProfile.jsx*

- **Supabase Auth**: ระบบ Login มาตรฐานผ่าน Email/Password สำหรับผู้ใช้ทั่วไป เน้นความง่ายและกู้คืนบัญชีได้ง่าย
- **Web3/Metamask**: การเชื่อมต่อผ่าน Wallet Address เพื่อความปลอดภัยสูงสุดและไม่เปิดเผยชื่อจริง (Anonymity) รองรับเครือข่าย EVM
- **Profile Mirroring**: ระบบเชื่อมโยงระหว่าง Wallet Address และ Profile ID ในฐานข้อมูล Supabase เพื่อให้เข้าถึงข้อมูลเดียวกันได้จากทั้งสองช่องทาง

### 2. Membership Tier Architecture
**โครงสร้างระดับสมาชิกและการสะสมแต้ม**

*Source: membership.astro / profiles table*

- **Bronze (0+ Pts)**: ระดับเริ่มต้นสำหรับทุกคนที่สมัครสมาชิก เข้าถึง Ecosystem ได้ทันที
- **Silver (10k+ Pts)**: รับ Cashback Multiplier 2% เพื่อสะสมความมั่งคั่งในระยะยาว
- **Gold (50k+ Pts)**: จุดเริ่มต้นของสิทธิพิเศษจริงจัง: ลดทันที 5%, Cashback 5% และระบบ Priority Support

### 3. High-Tier Privileges
**สิทธิประโยชน์สำหรับระดับ VIP และ Whale**

*Source: Membership Rewards Engine*

- **Platinum (210k+ Pts)**: ส่วนลด 10%, Cashback 7% และสิทธิ์เข้าถึงสินค้า Drop พิเศษก่อนใคร (Early Access)
- **Rare Earth (500k+ Pts)**: ส่วนลด 15%, Cashback 10% และสิทธิ์ส่งฟรีตลอดชีพ (Lifetime Free Shipping)
- **Bitcoin (2.1M+ Pts)**: ระดับสูงสุด: ลด 21%, Cashback 21%, เลขาส่วนตัว (Concierge) และสิทธิ์ในการร่วมโหวตทิศทางระบบ (Governance)

### 4. Internal Rewards Engine
**ระบบวิเคราะห์ยอดใช้จ่ายและแปลงเป็นระดับสมาชิก**

*Source: fetchProfile() -> sync_tier_logic*

- **Spending to Points**: ทุกยอดการสั่งซื้อที่สำเร็จ (Confirmed) จะถูกแปลงเป็นแต้มสะสมโดยอัตโนมัติ (1 THB = 1 Point)
- **Real-time Promotion**: ระบบจะตรวจสอบยอดรวม (Accumulated Proof of Spend) ทันทีที่การชำระเงินได้รับการยืนยันเพื่ออัปเกรด Tier
- **Tier Mirroring UI**: การปรับเปลี่ยน Skin หรือ Theme ของหน้า Profile ตามระดับ Tier (เช่น สีทองสำหรับ Gold, สีรุ้งสำหรับ Platinum)

### 5. Trust & Verification (KYC)
**ระบบยืนยันตัวตนเพื่อความปลอดภัยสูงสุด**

*Source: profiles.is_kyc_verified*

- **Email Verification**: ขั้นแรกของการยืนยันตัวตนเพื่อป้องกันการสมัครแบบสแปมและใช้ในการรับใบเสร็จ
- **KYC Badge**: สัญลักษณ์พิเศษสำหรับผู้ที่ยืนยันตัวตนระดับสูง เพิ่มความน่าเชื่อถือในการทำธุรกรรมใน Marketplace
- **Data Encryption**: ข้อมูลส่วนตัวทั้งหมดจะถูกเข้ารหัสและจัดเก็บตามมาตรฐานความปลอดภัยเพื่อป้องกันการรั่วไหล

### 6. Personal Concierge Integration
**ระบบบริการส่วนบุคคลสำหรับสมาชิก Bitcoin Tier**

*Source: ChatCenter.jsx Priority Routing*

- **Direct Admin Access**: ช่องทางพิเศษที่เชื่อมต่อสมาชิก Bitcoin Tier เข้ากับผู้ดูแลระบบโดยตรง (No Waiting)
- **Exclusive Gifts**: ระบบส่งของขวัญพิเศษ (Satoshi Exclusive) ให้กับสมาชิกทุกๆ สิ้นปีหรือในวาระพิเศษ
- **Manual Override**: แอดมินสามารถปรับระดับ Tier หรือแต้มให้ผู้ใช้ได้โดยตรงในกรณีที่มีแคมเปญออฟไลน์พิเศษ

## Additional Static Content

เจาะลึกระบบสมาชิกแบบแบ่งระดับ (Layered Rewards) ที่ใช้แต้มสะสมจากการสั่งซื้อเป็นตัวกำหนดสิทธิประโยชน์ ผสานเข้ากับระบบ Authentication ขั้นสูงที่รองรับทั้ง Email และ Web3 Wallet

### Membership Economy Modules
### # Retention & Gamification
### Whale Strategy
ระบบถูกออกแบบมาเพื่อให้การก้าวเข้าสู่ระดับ "Bitcoin Tier" มีความหมายเชิงสัญลักษณ์มากกว่าแค่ส่วนลด แต่เป็นการก้าวเข้าสู่กลุ่มคนที่มีอิทธิพลต่อ Ecosystem ผ่านสิทธิ Governance และบริการ Concierge

### Multi-Account Bridge
สมาชิกสามารถเลือกใช้บัญชีที่แตกต่างกันตามวาระ เช่น ใช้กระเป๋า Ledger ผ่าน Metamask เพื่อความปลอดภัย หรือใช้ Email เพื่อความสะดวก โดยทั้งหมดจะถูกรวมยอดสะสม (Points) เข้าสู่ตัวตนเดียวในที่สุด


---

# BTC/SATS Logic Model

>เจาะลึกกลไกการคำนวณราคาและแปลงค่าเงิน (Fiat-to-Crypto Bridge) หัวใจสำคัญที่ทำให้ Cashless Thailand รองรับการชำระเงินผ่าน Bitcoin ได้อย่างแม่นยำ

## Sections Items

### 1. Price Oracle (CoinGecko API)
**ระบบดึงราคาบิตคอยน์แบบ Real-time**

*Source: CoinGecko V3 Public API*

- **Fetch Mechanism**: ดึงราคา BTC/THB และ BTC/USD ทุกๆ 60 วินาที เพื่อให้ราคาอัปเดตเสมอแต่ไม่ติด Rate Limit
- **Fallback Rate**: หาก API ล่ม จะใช้ราคาล่าสุดที่ Cached ไว้ใน LocalStorage เพื่อป้องกันหน้าเว็บพัง
- **Global Store**: เก็บค่าราคาไว้ใน Nanostores ($btcPrice) เพื่อให้ทุก Component (Cart, Checkout) เรียกใช้ได้ทันที

### 2. Fiat-to-Sats Converter
**กลไกแปลงเงินบาทเป็นหน่วย SATS**

*Source: Utils Helper Function*

- **Conversion Logic**: สูตร: (ราคาบาท / ราคา BTC) * 100,000,000 = จำนวน Sats
- **Display Formatting**: จัดรูปแบบตัวเลขให้มี Commas (เช่น 25,000 sats) เพื่อให้อ่านง่าย
- **Rounding Mode**: ปัดเศษขึ้นเสมอ (Math.ceil) เพื่อให้มั่นใจว่าร้านค้าจะไม่ขาดทุนจากจุดทศนิยม

### 3. Lightning Network Invoice
**ระบบสร้าง QRCode สำหรับจ่ายเงิน**

*Source: LNURL / BTCPay Server (Mock)*

- **QR Generation**: สร้าง QR Code ที่รองรับมาตรฐาน BIP-21 (bitcoin:...?amount=...&lightning=...)
- **Payment Monitoring**: Polling สถานะการจ่ายเงินทุก 3 วินาที (WebSocket/REST) จนกว่าจะได้รับสถานะ 'Settled
- **Slippage Protection**: ล็อคอัตราแลกเปลี่ยน (Lock Rate) เป็นเวลา 15 นาที เพื่อป้องกันความผันผวนระหว่างรอจ่าย

### 4. Web3 / Wallet Bridge
**การเชื่อมต่อกับกระเป๋าเงินผู้ใช้**

*Source: Window.webln / Metamask (Future)*

- **WebLN Standard**: รองรับ Alby Browser Extension และกระเป๋าที่รองรับ WebLN เพื่อกดจ่ายในคลิกเดียว
- **Deep Linking**: บนมือถือจะใช้ Link 'lightning:...' เพื่อเปิดแอป Wallet (Wallet of Satoshi, Phoenix) โดยตรง
- **Signed Messages**: ใช้ลายเซ็นดิจิทัล (Sign Message) เพื่อยืนยันตัวตนในบางกรณีโดยไม่ต้องใช้ Password

## Additional Static Content

เจาะลึกกลไกการคำนวณราคาและแปลงค่าเงิน (Fiat-to-Crypto Bridge) หัวใจสำคัญที่ทำให้ Cashless Thailand รองรับการชำระเงินผ่าน Bitcoin ได้อย่างแม่นยำ

### Logic & Architecture
### # System Dependencies
### External APIs
### Libraries

---

# Course Hub

>เบื้องหลังระบบการเรียนรู้เพื่อสร้างธนาคารส่วนตัวและธุรกิจ Bitcoin ที่รวมเอาหลักสูตร Technical เชิงลึกและการบริหารจัดการธุรกิจตู้ ATM มาไว้ในที่เดียว

## Sections Items

### 1. Course Vision & Hybrid Logic
**การรวมศาสตร์ฝั่งเทคนิคและฝั่งธุรกิจเข้าด้วยกัน**

*Source: course.astro (Hero Section)*

- **BiTNode Focus**: เน้นการสร้างรากฐานด้านเทคนิค (Server Administration) เพื่อให้ผู้เรียนมีความสามารถในการรันระบบส่วนตัวได้จริง
- **BiTTerm Focus**: เน้นการนำเทคโนโลยีไปสร้างรายได้ (Monetization) ผ่านโมเดลธุรกิจตู้ ATM คริปโตและ POS หน้าร้าน
- **AOS Animations**: ใช้ห้องสมุด AOS (Animate On Scroll) เพื่อสร้างประสบการณ์การเลื่อนดูข้อมูลที่ลื่นไหลระดับสากล

### 2. Technical Infrastructure (Day 1-4)
**หลักสูตรปรับพื้นฐานและวิศวกรรมเครือข่าย**

*Source: Section: Curriculum - Week 1*

- **Security Hardening**: สอนการตั้งค่า UFW, SSH Keys และ Tor เพื่อให้ Node มีความปลอดภัยสูงสุดจากการโจมตีภายนอก
- **Bitcoin Node Ops**: การติดตั้งและจัดการ Bitcoin Core พร้อมการทำ RPC Bridge เพื่อให้แอปพลิเคชันอื่นเรียกใช้ข้อมูลได้
- **Lightning Liquidity**: สอนศาสตร์การบริหาร Channel Liquidity (Inbound/Outbound) ซึ่งเป็นหัวใจสำคัญของการทำงานใน Layer 2

### 3. Business Integration (Day 5-8)
**การประยุกต์ใช้เพื่อการพาณิชย์และระบบชำระเงิน**

*Source: Section: Curriculum - Week 2*

- **Hardware Integration**: สอนการ Calibrate อุปกรณ์รับแบงค์และการสื่อสารระหว่าง Microcontroller กับ Node ผ่าน API
- **PromptPay Gateway**: การเชื่อมต่อระบบธนาคารไทยเข้ากับ Lightning Network เพื่อทำระบบ Auto-Convert (Sats to Fiat)
- **Business Bio & Marketing**: โมดูลการทำตลาดแบบ Bitcoin Tourism เพื่อดึงดูดนักเดินทางคริปโตจากทั่วโลกเข้ามาใช้บริการ

### 4. Production-Grade Hardware
**ข้อกำหนดของฮาร์ดแวร์สำหรับรันระบบ 24/7**

*Source: Section: Hardware Specification*

- **X86 Architecture**: ทำไมต้องใช้ Intel/AMD แทน Raspberry Pi: เพื่อความเสถียรในการประมวลผลธุรกรรมจำนวนมาก
- **NVMe Reliability**: การเลือกใช้ SSD เกรดสูงเพื่อรองรับการเขียนทับข้อมูล Block ข้ามปีโดยไม่เกิดความเสียหาย
- **Thermal Management**: ระบบระบายความร้อนของ Mini PC ที่ออกแบบมาสำหรับการทำงานต่อเนื่องนับพันชั่วโมง

### 5. Pricing & Enrollment Funnel
**ระบบจัดการแพ็กเกจราคาและการสมัครเรียน**

*Source: Section: Pricing / Tiers*

- **Hybrid Pricing**: การตั้งราคาแยกตามอุปกรณ์ที่ได้รับ (ตู้ ATM, Node Server หรือรวมทั้งสองอย่าง)
- **Installment Logic**: รองรับการมัดจำ 50% เพื่อจองสิทธิ์ในแต่ละรอบการเรียน (Limit 10 seats per batch)
- **Tier Benefits**: การแยกสิทธิ์การรับประกันเครื่องและการเข้าถึงระบบ Cloud LNBits ตามแพ็กเกจที่เลือก

### 6. Learning Atmosphere & Visuals
**การสร้างความไว้วางใจผ่านหลักฐานเชิงภาพ**

*Source: YouTube Embed / Multi-Gallery*

- **Workshop Proof**: การใช้ภาพจริงจากบรรยากาศการเรียนรุ่นก่อนๆ เพื่อลดความกังวลของผู้เริ่มเรียนใหม่
- **Video Integration**: ระบบฝังวิดีโอจาก YouTube พร้อมโหมดตัดแต่งขอบพรีเมียมและการแสดงผลแบบ Cinematic
- **Interactive Hover**: แกลเลอรีภาพที่รองรับ Hover Zoom และ Caption Overlay เพื่อให้เห็นรายละเอียดของอุปกรณ์

## Additional Static Content

เบื้องหลังระบบการเรียนรู้เพื่อสร้างธนาคารส่วนตัวและธุรกิจ Bitcoin ที่รวมเอาหลักสูตร Technical เชิงลึกและการบริหารจัดการธุรกิจตู้ ATM มาไว้ในที่เดียว

### Course Operation Modules
### # Educational Funnel Logic
### Student Acquisition
หน้า Course ถูกออกแบบมาเพื่อเปลี่ยนผู้ที่สนใจเรื่องบิตคอยน์เบื้องต้น ให้กลายเป็นผู้เชี่ยวชาญระดับ Operator ผ่านการนำเสนอเนื้อหาที่ลดความซับซ้อน (Simplification) แต่ยังคงความถูกต้องระดับ Expert

### Ecosystem Retention
ผู้ที่ผ่านการอบรมจะกลายเป็นส่วนหนึ่งของ Cashless Thailand Ecosystem ในฐานะเจ้าของตู้ (Vendors) ซึ่งจะนำไปสู่การใช้งานระบบ Seller Dashboard และ Affiliate ต่อไป


---

# Learn Track COMING SOON

>ระบบติดตามความคืบหน้าการเรียนรู้ส่วนบุคคล (Personalized Learning Path) ที่จะช่วยนำทางผู้ใช้งานตั้งแต่มือใหม่จนถึงระดับ Expert ด้วยระบบ Gamification

## Additional Static Content

ระบบติดตามความคืบหน้าการเรียนรู้ส่วนบุคคล (Personalized Learning Path) ที่จะช่วยนำทางผู้ใช้งานตั้งแต่มือใหม่จนถึงระดับ Expert ด้วยระบบ Gamification

### Concept & Wireframe
### Current Progress
### Planned Features
### Technical Stack

---

# Insights & Blog

>ระบบฐานความรู้และการปฏิวัติข้อมูลทางการเงิน เบื้องหลังการทำงานของหน้าบทความที่รวมเอาเทคโนโลยี SEO ขั้นสูงและประสบการณ์การอ่านระดับ Premium

## Sections Items

### 1. Dynamic Content Delivery
**ระบบดึงข้อมูลบทความแบบ Real-time**

*Source: Supabase (blog_posts table)*

- **Published Only**: คัดกรองเฉพาะบทความที่ตั้งสถานะ 'is_published: true' เท่านั้นเพื่อให้มั่นใจในคุณภาพคอนเทนต์ก่อนแสดงผล
- **Sorted Hierarchy**: จัดลำดับบทความตามเวลาที่สร้าง (created_at) จากใหม่ไปเก่าโดยอัตโนมัติ
- **Category Filtering**: รองรับการแบ่งหมวดหมู่ (Bitcoin, Tech, Lifestyle) เพื่อให้ผู้ใช้ค้นหาเนื้อหาที่สนใจได้ง่ายขึ้น

### 2. Strategic SEO & Metadata
**ระบบทำ SEO อัตโนมัติรายบทความ**

*Source: Dynamic Meta Tags*

- **Dynamic OpenGraph**: สร้างภาพ OG และ Meta Title แตกต่างกันไปตามแต่ละบทความเพื่อการแชร์โซเชียลที่มีประสิทธิภาพ
- **Auto Keywords**: สกัด Tags จากฐานข้อมูลมาแปลงเป็น Meta Keywords เพื่อช่วยในการจัดลำดับการค้นหาบน Google
- **Breadcrumb Logic**: ระบบโครงสร้างลิงก์ (Breadcrumbs) ที่ช่วยทั้งผู้ใช้และ Search Engine ในการทำความเข้าใจโครงสร้างเว็บไซต์

### 3. Interactive Engagement Layer
**ระบบปฏิสัมพันธ์ระหว่างผู้อ่านและเนื้อหา**

*Source: React (BlogInteractions.jsx)*

- **Reaction System**: ปุ่ม Like/Share ที่ประมวลผลผ่าน React เพื่อความลื่นไหลโดยไม่ต้องรีเฟรชหน้าเว็บ
- **Comment Thread**: พื้นที่แสดงความคิดเห็นสำหรับผู้ใช้ที่ล็อกอินแล้ว เพื่อสร้าง Community รอบบทความ
- **Engagement Tracking**: เก็บสถิติการคลิกและ Reaction เพื่อนำไปวิเคราะห์ความนิยมของหัวข้อต่างๆ ในฝั่ง Admin

### 4. Real-time View Analytics
**ระบบนับยอดการเข้าชมผ่านฐานข้อมูล**

*Source: Supabase RPC (increment_view_count)*

- **Atomic Counting**: ใช้ฟังก์ชัน RPC เพื่อบวกเลขยอดวิวในระดับฐานข้อมูล ป้องกันข้อมูลคลาดเคลื่อนเมื่อมีคนคลิกพร้อมกัน
- **Session Throttling**: ลอจิกป้องกันการปั่นยอดวิวจากการรีเฟรชซ้ำๆ เพื่อความแม่นยำของสถิติเชิงลึก
- **Admin Insight**: ยอดวิวจะถูกส่งไปแสดงผลใน Admin Dashboard เพื่อจัดอันดับบทความยอดนิยม (Trending)

### 5. Premium Content Experience
**ประสบการณ์การอ่านระดับ High-end**

*Source: Custom CSS / JS Progress*

- **Scroll Progress**: แถบสถานะการอ่านด้านบน (Progress Bar) ที่บอกตำแหน่งการอ่านแบบ Real-time
- **Anuphan Typography**: ใช้ฟอนต์ Anuphan ที่ถูกปรับแต่งให้เหมาะกับการอ่านเนื้อหายาวๆ บนหน้าจอทุกขนาด
- **Image Zoom & Blur**: ระบบแสดงภาพหน้าปกแบบ Full-width พร้อมเอฟเฟกต์ Scale-on-scroll และ Background Blur

### 6. Rich Text Processing
**การประมวลผลเนื้อหาจาก Admin Panel**

*Source: HTML Sanitizer / set:html*

- **Rich Media Support**: รองรับการแทรกวิดีโอ, รูปภาพ, และ Code Block จากฝั่งหลังบ้านได้อย่างอิสระ
- **Blockquote Stylist**: ดีไซน์กล่องคำคม (Quote) ที่เน้นความพรีเมียมด้วยโดไล่เฉดสีทองซิกเนเจอร์
- **Smart Responsive**: รูปภาพและสื่อในเนื้อหาจะถูกปรับขนาดให้พอดีกับหน้าจอ Mobile อัตโนมัติ

## Additional Static Content

ระบบฐานความรู้และการปฏิวัติข้อมูลทางการเงิน เบื้องหลังการทำงานของหน้าบทความที่รวมเอาเทคโนโลยี SEO ขั้นสูงและประสบการณ์การอ่านระดับ Premium

### Blog Operation Modules
### # Visual Insight Logic
### Engagement Funnel
ทุกบทความถูกออกแบบมาเพื่อดึงดูดผู้ใช้เข้าสู่ระบบ Affiliate และตะกร้าสินค้า ผ่านระบบสอดแทรกสินค้าแนะนำ (Internal Linking) ที่แอดมินสามารถกำหนดได้เอง

### Incremental Building
หน้าบทความเป็นแบบ SSR เพื่อให้ดึงข้อมูลใหม่ล่าสุดเสมอ แต่ละบทความจะถูก Cache ในระดับ Edge เพื่อความเร็วสูงสุดในการเข้าถึงจากทั่วโลก


---

# Admin Portal Ops

>เบื้องหลังการควบคุมทุกมิติของ Cashless Thailand ตั้งแต่การมอนิเตอร์รายได้แบบเรียลไทม์ ไปจนถึงการตัดสินข้อพิพาทและจัดการระบบโครงสร้างพื้นฐานทั่วโลก

## Sections Items

### 1. Admin Security & Middleware
**ระบบควบคุมการเข้าถึงระดับสูงสุด (Elevated Access Control)**

*Source: Supabase Admin & Edge Functions*

- **Admin Role Check**: หน้าตาทั้งหมดใน /admin ถูกป้องกันด้วยลอจิกตรวจสอบสถานะ 'is_admin: true' ใน User Metadata เท่านั้น
- **Superuser Actions**: การแก้ไขข้อมูลที่เซนซิทีฟ (เช่น ลบร้านค้า) ใช้สิทธิ์พิเศษของ Service Role เพื่อข้าม RLS บางส่วนในกรณีฉุกเฉิน
- **Protected Layout**: ใช้ AdminLayout.astro เพื่อคุมหน้าตาและแถบเมนู (Sidebar) ให้เหมือนกันทุกหน้าเพื่อความสะดวกในการจัดการ

### 2. Strategic Dashboard & KPI
**ศูนย์บัญชาการข้อมูลภาพรวม (Master Dashboard)**

*Source: Real-time Order Data*

- **Revenue Monitoring**: แสดงยอดขายรวมทั้งสกุลเงิน THB และ SATS (Bitcoin) แบบนาทีต่อนาที พร้อมตัวเลขเฉลี่ยการเติบโต
- **Critical Alerts**: ระบบแจ้งเตือนสีแดงสำหรับออเดอร์ที่ค้างชำระ (Pending) และออเดอร์ที่มีปัญหาข้อพิพาท (Disputes)
- **Tax Calculation**: คำนวณภาษีมูลค่าเพิ่ม (VAT) อัตโนมัติตามอัตราที่ตั้งไว้ในระบบ เพื่อช่วยในการทำบัญชีส่งรัฐ

### 3. Geo-Analytics & Maps
**ระบบวิเคราะห์ที่ตั้งและทิศทางตลาด (Market Intelligence)**

*Source: Thailand Map SVG / Order Data*

- **Thailand Heatmap**: แผนที่ประเทศไทยแสดงความหน้าแน่นของการสั่งซื้อแต่ละจังหวัด เพื่อให้แอดมินวางแผนการตลาดได้ถูกจุด
- **Customer Breakdown**: กราฟวงกลม (Pie Chart) แสดงสัดส่วนกลุ่มเป้าหมายแยกตามเพศ ช่วงอายุ และพฤติกรรมการซื้อ
- **Real-time Notify**: ระบบป๊อปอัพแจ้งเตือนทันทีที่มีการสั่งซื้อใหม่บนเว็บไซต์ผ่านฟีเจอร์ Realtime Order Notify

### 4. Master Product Operations
**การจัดการสต็อกและรายการสินค้า (Full Inventory Control)**

*Source: Admin Product Manager*

- **Unified Creation**: แบบฟอร์มเพิ่มสินค้าที่รวมเอาทุก Option มาไว้ที่เดียว: ข้อมูลจำเพาะ, การตลาด และตัวเลือกเสริม (Variants)
- **Global Inventory**: หน้าจอสรุปจำนวนสต็อกคงเหลือของสินค้าทกรายการในระบบ สามารถแก้ไข (Overwrite) ได้ทันทีหากพบความผิดพลาด
- **Shop Assignment**: แอดมินสามารถดึงสินค้าไปวางขายในร้านค้า (Shops) ใดก็ได้ หรือย้ายร้านค้าย้อนหลังได้ตามต้องการ

### 5. Comprehensive Order Actions
**ระบบจัดการวงจรชีวิตออเดอร์ (Order Lifecycle Control)**

*Source: Advanced Order Manager*

- **Full Traceability**: ดูรายละเอียดการชำระเงิน เส้นทางการขนส่ง และประวัติการสนทนาระหว่างผู้ซื้อ-ผู้ขายในที่เดียว
- **Payment Overrides**: แอดมินสามารถกดยืนยันการชำระเงินได้ด้วยตนเอง (Manual Mark as Paid) หากตรวจเจอสลิปโอนที่ระบบตรวจไม่พบ
- **Refund & Void**: ลอจิกการยกเลิกออเดอร์และคืนคะแนน/เงินสะสมให้ผู้ใช้ตามนโยบายบริษัท

### 6. Dispute & Resolution Center
**ศาลตัดสินและไกล่เกลี่ยข้อพิพาท (Justice Center)**

*Source: Escrow Logic / Disputes DB*

- **Evidence Review**: พื้นที่ตรวจสอบรูปภาพหลักฐานจากฝั่งลูกค้า และข้อโต้แย้งจากฝั่งผู้ขายแบบ Case-by-Case
- **Resolution Payout**: ปุ่มตัดสิน: คืนเงินให้ลูกค้า (Refund) หรือ โอนเงินต่อให้ผู้ขาย (Release Fund) เพื่อปิดเคสทันที
- **Blacklist Power**: ส่งรายงานและแบนบัญชีผู้ซื้อหรือผู้ขายที่ทำผิดกฎซ้ำซ้อนผ่านหน้าจัดการข้อพิพาท

### 7. Affiliate & Growth Engine
**ระบบจัดการพันธมิตรและแคมเปญการตลาด**

*Source: Marketing Suite*

- **Partner Moderation**: ตรวจสอบและอนุมัติใบสมัครของ Influencer/Affiliate ที่ต้องการเข้าร่วมระดมยอดขาย
- **Commission Payouts**: ระบบอนุมัติการถอนเงินคอมมิชชันที่ผู้แนะนำทำได้ โดยมีการตรวจสอบความถูกต้องของยอดขายก่อนจ่ายจริง
- **Coupon Factory**: สร้างโค้ดส่วนลดแบบกำหนดเงื่อนไข: วันหมดอายุ, ขั้นต่ำการสั่งซื้อ และหมวดหมู่ที่ใช้ได้

### 8. Global Configuration & Taxes
**การตั้งค่าโครงสร้างระบบ (Core System Config)**

*Source: Store Settings API*

- **Platform Parameters**: ตั้งชื่อไซต์, โลโก้, ข้อมูลติดต่อ และลิงก์โซเชียลมีเดียทั่วทั้งเว็บไซต์จากศูนย์กลาง
- **Global Tax Logic**: เปิด-ปิดระบบ VAT และกำหนดอัตราภาษีที่มีผลต่อการแสดงผลราคาสินค้าและใบแจ้งหนี้
- **Gateway Maintenance**: สวิตช์ควบคุมการเปิด-ปิดระบบชำระเงินแต่ละประเภท (BTC, PrompTPay) ในกรณีที่เกิดการปรับปรุงระบบ

## Additional Static Content

เบื้องหลังการควบคุมทุกมิติของ Cashless Thailand ตั้งแต่การมอนิเตอร์รายได้แบบเรียลไทม์ ไปจนถึงการตัดสินข้อพิพาทและจัดการระบบโครงสร้างพื้นฐานทั่วโลก

### Governance Modules
### Real-time DB Sync
ทุกการแก้ไขสถานะในหน้า Admin จะซิงก์กลับไปยังแอปของผู้ใช้และแจ้งเตือนผ่านอีเมล/ป๊อปอัพทันทีอย่างไร้รอยต่อ


---

# Seller Dashboard

>คู่มือการใช้งานระบบสำหรับผู้เช่าพื้นที่และเจ้าของร้านค้า เจาะลึกทุกเครื่องมือเพื่อการสร้างยอดขายและการจัดการพัสดุในยุคเศรษฐกิจไร้เงินสด

## Sections Items

### 1. Seller Onboarding & Hub
**ประตูสู่การเป็นผู้ขายอย่างเป็นทางการ**

*Source: Register Page / Pending Logic*

- **Application Flow**: ผู้สมัครต้องกรอกชื่อร้าน, คำบรรยาย และระบบจะสร้าง URL Slug อัตโนมัติ (เช่น /shop/my-store)
- **Admin Approval**: ร้านค้าที่สมัครใหม่จะมีสถานะเป็น 'pending' ซึ่งต้องได้รับการอนุมัติจากแอดมินก่อนจึงจะเข้าหน้า Dashboard ได้
- **Hybrid Onboarding**: รองรับทั้งผู้สมัครที่ใช้ Email Auth และ Bitcoin Wallet (Metamask/Safe) โดยจะผูกกับ Profiles ID อัตโนมัติ

### 2. Seller Auth Guard & Security
**ระบบป้องกันความปลอดภัยระดับร้านค้า**

*Source: sellerAuthGuard.js / Supabase RLS*

- **Access Control**: ใช้ระบบ Middleware ตรวจสอบว่า User ID นั้นเป็นเจ้าของร้านค้า (owner_id) ที่มีสถานะ 'active' หรือไม่
- **Session Persistence**: จดจำสถานะการล็อกอินแบบข้ามเซสชัน เพื่อให้ผู้ขายไม่ต้องล็อกอินใหม่ทุกครั้งที่รีเฟรชหน้า Dashboard
- **Data Isolation**: นโยบาย RLS บังคับให้ผู้ขายเห็นและแก้ไขได้เฉพาะข้อมูลสินค้าและออเดอร์ของร้านตัวเองเท่านั้น

### 3. Business Performance Stats
**หน้าสรุปผลการดำเนินงานและยอดขาย**

*Source: SellerDashboardStats.jsx*

- **KPI Widgets**: สรุปยอดขายรวม (Total Revenue), จำนวนออเดอร์, และรายชื่อลูกค้ารายใหม่ใแบบเรียลไทม์
- **Order Discovery**: ระบบไฮไลต์ออเดอร์ที่ยังไม่ได้รับเงิน (Unpaid) หรือรอการจัดส่ง (To Ship) เพื่อให้ผู้ขายไม่พลาดทุกธุรกรรม
- **Quick Actions**: ทางลัดในการเพิ่มสินค้าใหม่ และการเข้าถึงหน้าตั้งค่าร้านค้าด้วยคลิกเดียวจากหน้าแรก

### 4. Product Inventory Control
**ระบบจัดการสินค้าและสต็อกแบบละเอียด**

*Source: Seller Products Manager*

- **Listing Master**: อินเทอร์เฟซแบบแอดมิน: จัดการได้ทั้ง Metadata, Pricing, Marketing Benefits และ Hardware Tech Specs
- **Variant Automation**: สร้างตัวเลือกสินค้า (Colors/Models) พร้อมแยกสต็อกรายชิ้น เพื่อความแม่นยำในการขาย
- **Media Bucket**: อัปโหลดภาพสินค้าตรงเข้าสู่ Storage ของระบบ พร้อมรองรับการเรียงลำดับภาพ Gallery

### 5. Active Order Fulfillment
**กระบวนการจัดการออเดอร์และใบส่งของ**

*Source: Seller Orders / Tracking*

- **Fulfillment Cycle**: ผู้ขายสามารถอัปเดตสถานะจาก 'Pending' ไปเป็น 'Processing' และ 'Shipped' ได้ด้วยตนเอง
- **Tracking Integration**: ช่องกรอกเลขพัสดุ (Tracking Number) เพื่อแจ้งเตือนให้ลูกค้ารับทราบผ่านหน้าโปรไฟล์ทันที
- **Order Details**: ดูข้อมูลที่อยู่จัดส่งของผู้ซื้อ และประวัติการชำระเงินโดยละเอียดเพื่อป้องกันการส่งของผิดพลาด

### 6. Seller Wallet & Revenue Flow
**กระเป๋าเงินผู้ขายและระบบถอนรายได้**

*Source: wallet.astro / Withdrawals*

- **Balance Ledger**: แสดงยอดเงินคงเหลือที่ถอนได้ (Available Balance) และยอดที่รอดำเนินการ (Pending Balance)
- **Payout Methods**: ผูกข้อมูล PromptPay ID หรือ Lightning Wallet (Bitcoin) เพื่อรับเงินโอนจากระบบ
- **Withdrawal Requests**: ระบบส่งคิวการถอนเงินไปยังแอดมิน เพื่อตรวจสอบความถูกต้องก่อนทำการโอนยอดเข้าบัญชีจริง

### 7. Shop Identity & Branding
**การปรับแต่งภาพลักษณ์และตัวตนร้านค้า**

*Source: Seller Settings Page*

- **Store Appearance**: อัปโหลดโลโก้ร้าน (Logo) และแบนเนอร์ (Cover) เพื่อสร้างความเชื่อมั่นให้กลุ่มเป้าหมาย
- **Business Bio**: กำหนดคำอธิบายร้านค้าและช่องทางการติดต่อเพิ่มเติม เพื่อเพิ่มอัตราการปิดการขาย
- **SEO Visibility**: ข้อมูลชื่อร้านและคำอธิบายจะถูกนำไปตั้งเป็น Meta Tags ของหน้า Shop สาธารณะเพื่อช่วยด้าน SEO

## Additional Static Content

คู่มือการใช้งานระบบสำหรับผู้เช่าพื้นที่และเจ้าของร้านค้า เจาะลึกทุกเครื่องมือเพื่อการสร้างยอดขายและการจัดการพัสดุในยุคเศรษฐกิจไร้เงินสด

### Seller Operation Modules
### # Seller Success Logic
### Hybrid Payout Logic
ระบบรองรับการตั้งเบิกรายได้ทั้งแบบเงินบาท (Fiat) และ Bitcoin (Lightning) โดยแอดมินจะเป็นผู้ตรวจสอบข้อมูลธุรกรรมก่อนการกระจายรายได้เข้าสู่กระเป๋าของผู้ขายจริง

### Inventory Sync-Chain
เมื่อสินค้าถูกขาย สต็อกในหน้า Catalog จะถูกลดทอนลงทันทีแบบ Atomic transaction เพื่อป้องกันการเกิดเหตุการณ์ Overselling (ขายสินค้าที่ไม่มีในสต็อก)


---

