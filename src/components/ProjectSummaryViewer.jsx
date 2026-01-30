
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDown,
    ShoppingCart,
    CreditCard,
    User,
    Store,
    Package,
    BarChart,
    ShieldAlert,
    MousePointer,
    LayoutGrid,
    Users,
    MessageSquare,
    Tags,
    Settings,
    FileText,
    Share2
} from 'lucide-react';

const ManualSection = ({ title, icon: Icon, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border border-white/10 rounded-xl overflow-hidden bg-[#111] mb-4 transition-all duration-300 hover:border-[#D4AF37]/30">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-white/5"
            >
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${isOpen ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-white/5 text-gray-400'} transition-colors`}>
                        <Icon size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white uppercase tracking-wide">{title}</h3>
                    </div>
                </div>
                <ChevronDown
                    className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#D4AF37]' : ''}`}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <div className="p-5 pt-0 border-t border-white/5 text-gray-300 space-y-4">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const SubSection = ({ title, children }) => (
    <div className="ml-2 border-l-2 border-white/10 pl-4 py-1">
        <h4 className="text-[#D4AF37] font-bold text-sm uppercase tracking-wider mb-2">{title}</h4>
        <ul className="space-y-2 text-sm text-gray-400">
            {children}
        </ul>
    </div>
);

const ActionItem = ({ label, desc }) => (
    <li className="flex items-start gap-2">
        <MousePointer className="w-4 h-4 text-white/30 mt-0.5 flex-shrink-0" />
        <span>
            <strong className="text-white">{label}</strong>: {desc}
        </span>
    </li>
);


const ImageBox = ({ src, caption }) => (
    <div className="mt-4 mb-6">
        <div className="rounded-lg overflow-hidden border border-white/10 shadow-lg">
            <img src={src} alt={caption} className="w-full h-auto object-cover" />
        </div>
        <p className="text-sm text-gray-500 mt-2 text-center italic">{caption}</p>
    </div>
);

export default function ProjectSummaryViewer() {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
                    Platform <span className="text-[#D4AF37]">Manual</span>
                </h1>
                <p className="text-xl text-gray-400">คู่มือการใช้งานระบบฉบับสมบูรณ์ (User Manual)</p>
            </div>

            <div className="space-y-6">

                {/* VISITOR & BUYER */}
                <div className="relative">
                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-transparent rounded-full opacity-50"></div>
                    <h2 className="text-2xl font-black text-blue-400 mb-4 pl-4 uppercase tracking-widest">1. Buyer Guide (ผู้ซื้อ)</h2>

                    <ManualSection title="Browsing & Shopping" icon={LayoutGrid} defaultOpen={true}>
                        <SubSection title="Home Page (หน้าแรก)">
                            <ImageBox src="/manual_images/manual_home_1769792735027.png" caption="หน้าแรกของเว็บไซต์ แสดงกล่องค้นหา, ตะกร้าสินค้า, และแบนเนอร์หลัก" />
                            <ActionItem label="Search Bar" desc="ช่องค้นหาสินค้าด้านบน พิมพ์ชื่อสินค้าเพื่อค้นหาได้ทันที" />
                            <ActionItem label="Cart Icon" desc="ไอคอนตะกร้าสินค้า มุมขวาบน คลิกเพื่อดูรายการสินค้าที่เลือกไว้" />
                        </SubSection>
                        <SubSection title="Shop Page (หน้าร้านค้า)">
                            <ImageBox src="/manual_images/visual_manual_shop_page_1769792762342.webp" caption="หน้ารวมสินค้าทั้งหมด พร้อมตัวกรองหมวดหมู่ด้านบน" />
                            <ActionItem label="Category Filter" desc="แถบหมวดหมู่ด้านบน (Clock, Kiosk, POS...) ใช้กรองประเภทสินค้า" />
                            <ActionItem label="Product Card" desc="คลิกที่รูปหรือชื่อสินค้า เพื่อเข้าไปดูรายละเอียดและสั่งซื้อ" />
                        </SubSection>
                        <SubSection title="Product Detail (รายละเอียดสินค้า)">
                            <ActionItem label="Variant Selector" desc="ปุ่มเลือกตัวเลือกสินค้า (เช่น สี, ขนาด) ราคาจะเปลี่ยนตามตัวเลือก" />
                            <ActionItem label="Add to Cart" desc="ปุ่มเพิ่มลงตะกร้า จะมีสินค้าเด้งเข้าลิ้นชักตะกร้าขวามือ" />
                        </SubSection>
                    </ManualSection>

                    <ManualSection title="Checkout & Payment" icon={CreditCard}>
                        <SubSection title="Step 1: Shipping Info">
                            <ImageBox src="/manual_images/visual_manual_checkout_page_1769793044397.webp" caption="หน้า Checkout กรอกที่อยู่และเลือกวิธีการชำระเงิน" />
                            <ActionItem label="Form Inputs" desc="กรอกชื่อ, ที่อยู่, เบอร์โทรศัพท์ และอีเมลให้ครบถ้วน" />
                        </SubSection>
                        <SubSection title="Step 2: Payment Methods">
                            <ActionItem label="PromptPay" desc="ระบบจะสร้าง QR Code พร้อมยอดเงิน สแกนจ่ายผ่านแอปธนาคารได้เลย" />
                            <ActionItem label="Crypto" desc="เลือกเครือข่าย (Chain) และเหรียญ (Currency) ระบบจะแสดง Address สำหรับโอน" />
                            <ActionItem label="Upload Slip" desc="**สำคัญ** ต้องอัปโหลดรูปสลิปโอนเงินเพื่อยืนยัน" />
                        </SubSection>
                    </ManualSection>

                    <ManualSection title="User Profile" icon={User}>
                        <SubSection title="Dashboard">
                            <ActionItem label="Order History" desc="ดูรายการสั่งซื้อย้อนหลัง และสถานะพัสดุ (Tracking)" />
                        </SubSection>
                    </ManualSection>
                </div>

                {/* SELLER */}
                <div className="relative mt-12">
                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-[#D4AF37] to-transparent rounded-full opacity-50"></div>
                    <h2 className="text-2xl font-black text-[#D4AF37] mb-4 pl-4 uppercase tracking-widest">2. Seller Guide (ผู้ขาย)</h2>

                    <ManualSection title="Shop Management" icon={Store}>
                        <SubSection title="Dashboard">
                            <ImageBox src="/manual_images/seller_dashboard_top_1769799895555.png" caption="Seller Dashboard: ภาพรวมยอดขายและออเดอร์ของร้านค้า" />
                            <ActionItem label="Stats" desc="กราฟแสดงยอดขายและจำนวนออเดอร์รายวัน" />
                            <ActionItem label="Product Tools" desc="เมนูจัดการสินค้า เพิ่ม/ลบ/แก้ไข รายการสินค้าในร้าน" />
                        </SubSection>
                    </ManualSection>

                    <ManualSection title="Order Fulfillment" icon={Package}>
                        <SubSection title="Processing Orders">
                            <ActionItem label="Order List" desc="ดูรายการที่ลูกค้าชำระเงินแล้ว (Paid Status)" />
                            <ActionItem label="Add Tracking" desc="กรอกเลขพัสดุและเลือกขนส่ง เพื่อเปลี่ยนสถานะเป็น Shipped" />
                        </SubSection>
                    </ManualSection>
                </div>

                {/* ADMIN (COMPREHENSIVE) */}
                <div className="relative mt-12">
                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 to-transparent rounded-full opacity-50"></div>
                    <h2 className="text-2xl font-black text-red-500 mb-4 pl-4 uppercase tracking-widest">3. Admin Guide (ผู้ดูแล)</h2>

                    <ManualSection title="Core Operations (หลัก)" icon={BarChart} defaultOpen={true}>
                        <SubSection title="3.1 Dashboard">
                            <ImageBox src="/manual_images/admin_dashboard_top_1769799740196.png" caption="Admin Dashboard (ส่วนบน): KPI Card แสดงยอดขายรวม, Pending Orders, และ Disputes" />
                            <ImageBox src="/manual_images/admin_dashboard_bottom_1769799742245.png" caption="Admin Dashboard (ส่วนล่าง): แผนที่ยอดขายรายจังหวัด และกราฟวงกลม Analytics" />
                            <ActionItem label="KPI Cards" desc="ยอดขายรวม (THB/Sats), ออเดอร์รอตรวจสอบ, และข้อพิพาท (Disputes)" />
                            <ActionItem label="Real-time Map" desc="แผนที่ Heatmap แสดงจุดที่สินค้าถูกสั่งซื้อในประเทศไทย" />
                        </SubSection>
                        <SubSection title="3.2 Analytics">
                            <ActionItem label="Top Products" desc="5 อันดับสินค้าขายดีที่สุด" />
                            <ActionItem label="Sales Graph" desc="กราฟยอดขายย้อนหลัง 30 วัน" />
                        </SubSection>
                    </ManualSection>

                    <ManualSection title="Order & Inventory (สินค้า/ออเดอร์)" icon={Package}>
                        <SubSection title="3.3 Orders">
                            <ImageBox src="/manual_images/admin_orders_top_1769799775735.png" caption="หน้าจัดการออเดอร์: รายการคำสั่งซื้อทั้งหมด พร้อมสถานะ (Pending, Paid, Shipped)" />
                            <ActionItem label="Verification" desc="ตรวจสอบสลิปโอนเงิน (PromptPay) และกดยืนยัน (Confirm Payment)" />
                        </SubSection>
                        <SubSection title="3.4 Products">
                            <ImageBox src="/manual_images/admin_products_top_1769799816489.png" caption="หน้าจัดการสินค้า: รายการสินค้าทั้งหมดในระบบ (Inventory)" />
                            <ActionItem label="Global Inventory" desc="ดูสินค้าทั้งหมดในระบบ และจำนวนสต็อกคงเหลือ" />
                        </SubSection>
                    </ManualSection>

                    <ManualSection title="User Management (บุคคล)" icon={Users}>
                        <SubSection title="3.5 Shops">
                            <ActionItem label="Approve/Reject" desc="อนุมัติร้านค้าใหม่ที่สมัครเข้ามา" />
                            <ActionItem label="Suspend" desc="ระงับร้านค้าชั่วคราว หรือลบร้านค้าที่ทำผิดกฎ" />
                        </SubSection>
                        <SubSection title="3.6 Customers">
                            <ActionItem label="CRM" desc="ดูประวัติการสั่งซื้อ, ยอด Spending สะสม (LTV), และ Tier ลูกค้า" />
                        </SubSection>
                        <SubSection title="3.10 Affiliates">
                            <ActionItem label="Commission" desc="ตรวจสอบและอนุมัติค่าคอมมิชชั่นให้นายหน้า" />
                        </SubSection>
                    </ManualSection>

                    <ManualSection title="System & Marketing (ระบบ)" icon={Settings}>
                        <SubSection title="3.7 Support Chat">
                            <ActionItem label="Tickets" desc="ตอบแชทลูกค้าและร้านค้าที่ติดต่อเข้ามา (Admin View)" />
                        </SubSection>
                        <SubSection title="3.9 Coupons">
                            <ActionItem label="Create" desc="สร้างคูปองส่วนลดแบบ % หรือ Fixed Amount" />
                        </SubSection>
                        <SubSection title="3.12 Settings">
                            <ActionItem label="Config" desc="ตั้งค่าร้าน, VAT, และค่าธรรมเนียม Platform (%)" />
                        </SubSection>
                    </ManualSection>

                </div>

            </div>
            <div className="mt-12 text-center border-t border-white/10 pt-8">
                <p className="text-white/30 text-xs">
                    Documentation Version 2.2 (Visuals Included) | Cashless Thailand
                </p>
            </div>
        </div>
    );
}

