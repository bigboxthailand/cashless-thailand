import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ShoppingCart, CreditCard, Box, CheckCircle, Star, Search, ArrowDown, AlertOctagon, Gavel, Scale, FileText } from 'lucide-react';

const ShoppingFlow = () => {
    // Normal happy path steps (Pre-branching)
    const initialSteps = [
        { icon: <Search />, label: "1. ค้นหาสินค้า", desc: "เลือกสินค้าที่ถูกใจจากแคตตาล็อก" },
        { icon: <ShoppingCart />, label: "2. ตะกร้าสินค้า", desc: "ระบบคำนวณราคาและซิงค์ Real-time" },
        { icon: <CreditCard />, label: "3. ชำระเงิน", desc: "เงินถูกพักไว้ในระบบกลาง (Escrow)" },
        { icon: <Box />, label: "4. การจัดส่ง", desc: "ร้านค้าทำการแพ็คและจัดส่งสินค้า" },
    ];

    return (
        <div className="py-12 max-w-4xl mx-auto px-6">
            <div className="relative flex flex-col items-center">
                {/* Vertical Background Line (Top Half) */}
                <div className="absolute top-0 h-[65%] left-1/2 w-1 bg-white/5 -translate-x-1/2 rounded-full overflow-hidden z-0">
                    <motion.div
                        className="w-full bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent h-[200px] absolute"
                        animate={{ top: ["-20%", "120%"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    />
                </div>

                {/* 1. Main Linear Flow */}
                {initialSteps.map((step, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2, duration: 0.6 }}
                        viewport={{ once: true }}
                        className="relative z-10 flex flex-col items-center w-full"
                    >
                        <div className={`flex flex-col items-center ${index === 0 ? 'mt-0' : 'mt-16'}`}>
                            {index > 0 && (
                                <div className="absolute -top-10 text-[#D4AF37]/50 animate-bounce">
                                    <ArrowDown size={20} />
                                </div>
                            )}

                            <div className="w-24 h-24 rounded-3xl bg-[#0a0a0a] border border-white/10 shadow-2xl flex items-center justify-center relative group hover:border-[#D4AF37] transition-all duration-500">
                                <div className="absolute inset-0 bg-[#D4AF37]/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <motion.div whileHover={{ scale: 1.1 }}>{React.cloneElement(step.icon, { size: 40 })}</motion.div>
                            </div>

                            <div className="text-center mt-6 p-6 bg-white/[0.03] border border-white/5 rounded-2xl backdrop-blur-sm w-full max-w-sm">
                                <h4 className="text-xl font-bold text-white mb-2">{step.label}</h4>
                                <p className="text-white/50 text-sm font-light">{step.desc}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* Branching Point */}
                <div className="mt-20 w-full relative">
                    <div className="flex justify-center items-center mb-10 relative z-20">
                        <div className="px-6 py-3 bg-[#D4AF37] text-black font-black rounded-full shadow-[0_0_20px_#D4AF37] z-20 animate-pulse">
                            ได้รับสินค้าแล้วหรือไม่?
                        </div>
                    </div>

                    {/* Left and Right connectors */}
                    <div className="absolute top-6 left-1/4 right-1/4 h-24 border-t-4 border-l-4 border-r-4 border-white/10 rounded-t-[3rem] -z-10" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 relative">

                        {/* --- LEFT PATH: Success --- */}
                        <div className="flex flex-col items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1 }}
                                className="flex flex-col items-center"
                            >
                                <div className="text-green-500 font-bold mb-4 flex items-center gap-2">
                                    <CheckCircle size={20} />
                                    <span>ได้รับแล้ว / สินค้าถูกต้อง</span>
                                </div>

                                <div className="relative py-12 flex flex-col gap-16 border-l-2 border-green-500/20 pl-8">
                                    {/* Step 5A */}
                                    <div className="relative">
                                        <div className="absolute -left-[41px] top-4 w-6 h-6 rounded-full bg-[#0a0a0a] border-2 border-green-500 flex items-center justify-center">
                                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                                        </div>
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500/20 to-transparent border border-green-500/30 flex items-center justify-center mb-4">
                                            <CheckCircle className="text-green-500" size={32} />
                                        </div>
                                        <h4 className="text-lg font-bold text-white">5. ยืนยันการรับของ</h4>
                                        <p className="text-white/40 text-sm">เงินถูกโอนให้ร้านค้าทันที</p>
                                    </div>

                                    {/* Step 6A */}
                                    <div className="relative">
                                        <div className="absolute -left-[41px] top-4 w-6 h-6 rounded-full bg-[#0a0a0a] border-2 border-[#D4AF37] flex items-center justify-center">
                                            <div className="w-2 h-2 bg-[#D4AF37] rounded-full" />
                                        </div>
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-transparent border border-[#D4AF37]/30 flex items-center justify-center mb-4">
                                            <Star className="text-[#D4AF37]" size={32} />
                                        </div>
                                        <h4 className="text-lg font-bold text-white">6. รีวิว & รับแต้ม</h4>
                                        <p className="text-white/40 text-sm">จบการทำงานสมบูรณ์</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* --- RIGHT PATH: Dispute --- */}
                        <div className="flex flex-col items-center">
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.2 }}
                                className="flex flex-col items-center"
                            >
                                <div className="text-red-500 font-bold mb-4 flex items-center gap-2">
                                    <AlertOctagon size={20} />
                                    <span>มีปัญหา / ไม่ได้รับของ</span>
                                </div>

                                <div className="relative py-12 flex flex-col gap-16 border-l-2 border-red-500/20 pl-8">
                                    {/* Step 5B */}
                                    <div className="relative">
                                        <div className="absolute -left-[41px] top-4 w-6 h-6 rounded-full bg-[#0a0a0a] border-2 border-red-500 flex items-center justify-center">
                                            <div className="w-2 h-2 bg-red-500 rounded-full" />
                                        </div>
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500/20 to-transparent border border-red-500/30 flex items-center justify-center mb-4">
                                            <FileText className="text-red-500" size={32} />
                                        </div>
                                        <h4 className="text-lg font-bold text-white">5. เปิดข้อพิพาท (Dispute)</h4>
                                        <p className="text-white/40 text-sm">ส่งหลักฐานให้ระบบกลาง</p>
                                    </div>

                                    {/* Step 6B */}
                                    <div className="relative">
                                        <div className="absolute -left-[41px] top-4 w-6 h-6 rounded-full bg-[#0a0a0a] border-2 border-orange-500 flex items-center justify-center">
                                            <Gavel size={12} className="text-orange-500" />
                                        </div>
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500/20 to-transparent border border-orange-500/30 flex items-center justify-center mb-4">
                                            <Scale className="text-orange-500" size={32} />
                                        </div>
                                        <h4 className="text-lg font-bold text-white">6. แอดมินตัดสิน</h4>
                                        <p className="text-white/40 text-sm">ตรวจสอบ Chat Log และหลักฐาน</p>
                                    </div>

                                    {/* Step 7B */}
                                    <div className="relative">
                                        <div className="absolute -left-[41px] top-4 w-6 h-6 rounded-full bg-[#0a0a0a] border-2 border-white/20 flex items-center justify-center">
                                            <div className="w-2 h-2 bg-white rounded-full" />
                                        </div>
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                            <h4 className="text-sm font-bold text-white">ผลการตัดสิน</h4>
                                            <ul className="mt-2 space-y-2 text-xs text-white/50">
                                                <li className="flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                    คืนเงินให้ผู้ซื้อ (Refund)
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                                    ปล่อยเงินให้ร้านค้า (Release)
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                    </div>
                </div>

            </div>

            {/* Legend / Info */}
            <div className="mt-24 border-t border-white/10 pt-8 flex justify-center gap-8">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#D4AF37]" />
                    <span className="text-xs text-white/50">Happy Path</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-xs text-white/50">Dispute Path</span>
                </div>
            </div>
        </div>
    );
};

export default ShoppingFlow;
